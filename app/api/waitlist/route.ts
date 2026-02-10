import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/* ── In-memory IP rate limiter (5 requests per IP per hour) ── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up stale entries every 10 minutes to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

/* ── Origin / Referer check (CSRF protection) ── */
function isOriginAllowed(req: NextRequest): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // If NEXT_PUBLIC_SITE_URL is set, strictly verify against it
  if (siteUrl) {
    const allowed = new URL(siteUrl).origin;
    if (origin && origin === allowed) return true;
    if (referer) {
      try {
        return new URL(referer).origin === allowed;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Fallback: reject requests from clearly different external origins.
  // Allow same-origin requests (origin absent, e.g. server-side) and
  // requests where origin matches the host header.
  if (!origin) return true; // Same-origin fetch or non-browser client
  try {
    const host = req.headers.get("host");
    if (host && new URL(origin).host === host) return true;
  } catch {
    // malformed origin
  }
  return false;
}

/* ── Stricter email regex ── */
// Requires: local part with at least one char, domain with at least one label
// before the dot, and a TLD of 2+ chars. Rejects `test@.com`, `@example.com`,
// and other degenerate patterns.
const EMAIL_RE = /^[^\s@]+@[^\s@][^\s@]*\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    // CSRF origin check
    if (!isOriginAllowed(req)) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    // Rate limiting by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Waitlist is not configured yet. Check back soon!" },
        { status: 503 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert({
      email: trimmed,
      signed_up_at: new Date().toISOString(),
    });

    if (error) {
      // Unique constraint violation = already signed up
      if (error.code === "23505") {
        return NextResponse.json({ message: "You're already on the list!" });
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
    }

    return NextResponse.json({ message: "You're on the list!" });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
