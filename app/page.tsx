"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";

/* ── Waitlist Form ────────────────────────────────────── */
function WaitlistForm({ id, buttonText }: { id: string; buttonText?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list! We'll be in touch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <>
      <form className="email-form" id={id} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining..." : (buttonText || "Join Waitlist")}
        </button>
      </form>
      {status === "success" && <p className="form-success">{message}</p>}
      {status === "error" && <p className="form-error">{message}</p>}
    </>
  );
}

/* ── Live Waitlist Counter ────────────────────────────── */
function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((r) => r.json())
      .then((d) => { if (d.count > 0) setCount(d.count); })
      .catch(() => {});
  }, []);
  return count;
}

/* ── Interactive Phone Check Item ─────────────────────── */
function CheckItem({ emoji, label, defaultChecked }: { emoji: string; label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  const toggle = () => setChecked(!checked);
  return (
    <div
      className={`check-item${checked ? " checked" : ""}`}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
      aria-pressed={checked}
    >
      <div className="checkbox" />
      <span className="item-emoji">{emoji}</span>
      <span className="item-label">{label}</span>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────── */
export default function HomePage() {
  const navRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const waitlistCount = useWaitlistCount();

  // Nav scroll effect
  useEffect(() => {
    function onScroll() {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sticky CTA bar: show after scrolling past hero, hide when final CTA is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    const heroEl = document.querySelector(".hero");
    if (heroEl) observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowSticky(false); },
      { threshold: 0.2 }
    );
    if (finalCtaRef.current) observer.observe(finalCtaRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll-reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(".reveal-on-scroll")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── NAV ──────────────────────────────────────── */}
      <nav ref={navRef}>
        <div className="nav-inner">
          <a href="#" className="logo">
            <div className="logo-icon">{"\u2713"}</div>
            <span className="logo-text">Ubett</span>
          </a>
          <a href="#waitlist" className="nav-cta">Join Waitlist</a>
        </div>
      </nav>

      {/* ── HERO: Problem-first ──────────────────────── */}
      <section className="hero">
        <div className="hero-badge anim-fade-up delay-1">
          <span className="pulse" />
          Coming soon — join the waitlist
        </div>
        <h1 className="anim-fade-up delay-2">
          You forgot your keys<br />
          again, <span className="highlight">didn&rsquo;t you.</span>
        </h1>
        <p className="hero-sub anim-fade-up delay-3">
          Not a question. A fact. Ubett auto-pops a checklist when you leave the house. 10 seconds. Done.
        </p>
        <div className="cta-group anim-fade-up delay-4">
          <WaitlistForm id="heroForm" />
          <p className="cta-note">Free forever. No spam. We pinky promise.</p>
        </div>
      </section>

      {/* ── SOCIAL PROOF (right after hero) ──────────── */}
      <section className="social-proof-strip reveal-on-scroll">
        <div className="social-proof-banner">
          <div className="social-proof-inner">
            <div className="proof-stat">
              <span className="proof-number">700+</span>
              <span className="proof-label">people on r/ADHD said &ldquo;I keep forgetting my stuff&rdquo;</span>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <span className="proof-number">10s</span>
              <span className="proof-label">is all it takes to never walk back again</span>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <span className="proof-number">0</span>
              <span className="proof-label">things you need to remember. Ubett remembers for you.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHONE MOCKUP + BENTO FEATURES ────────────── */}
      <section className="demo-section">
        <div className="demo-inner">
          <div className="phone-col anim-scale-in delay-5">
            <div className="phone-wrapper">
              <div className="phone">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="screen-header">
                    <div className="screen-location">{"\uD83D\uDCCD"} Leaving Home</div>
                    <div className="screen-title">Morning Check</div>
                    <div className="screen-subtitle"><span>{"\u25CF"}</span> Tap to confirm</div>
                  </div>
                  <div className="checklist">
                    <CheckItem emoji={"\uD83D\uDCF1"} label="Phone" defaultChecked />
                    <CheckItem emoji={"\uD83D\uDC5B"} label="Wallet" defaultChecked />
                    <CheckItem emoji={"\uD83D\uDD11"} label="Keys" defaultChecked />
                    <CheckItem emoji={"\uD83D\uDC8A"} label="Medication" />
                    <CheckItem emoji={"\uD83E\uDD57"} label="Lunch" />
                  </div>
                  <div className="streak-bar">
                    <div className="streak-left">
                      <span className="streak-flame">{"\uD83D\uDD25"}</span>
                      <span className="streak-text"><span>14 days</span> streak</span>
                    </div>
                    <span className="streak-count">14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-col">
            <div className="bento-grid">
              <div className="bento-card bento-large reveal-on-scroll" aria-label="Auto-trigger: checklist appears when you leave WiFi">
                <div className="bento-emoji" aria-hidden="true">{"\uD83D\uDCE1"}</div>
                <div className="bento-title">Auto-trigger</div>
                <p className="bento-desc">Leave your WiFi &rarr; checklist appears. No buttons, no alarms, no effort. It just knows.</p>
              </div>
              <div className="bento-card bento-tall reveal-on-scroll" aria-label="Streaks: track your daily checklist completion">
                <div className="bento-emoji" aria-hidden="true">{"\uD83D\uDD25"}</div>
                <div className="bento-title">Streaks</div>
                <p className="bento-desc">Duolingo energy but for not forgetting your keys. Watch the number go up.</p>
                <div className="bento-streak-demo">
                  <span className="bento-streak-num">14</span>
                  <span className="bento-streak-label">day streak</span>
                </div>
              </div>
              <div className="bento-card reveal-on-scroll" aria-label="Context-aware: different lists for different occasions">
                <div className="bento-emoji" aria-hidden="true">{"\uD83D\uDD50"}</div>
                <div className="bento-title">Context-aware</div>
                <p className="bento-desc">Work mornings ≠ gym nights. Different lists for different vibes.</p>
              </div>
              <div className="bento-card reveal-on-scroll" aria-label="Accountability: share your streak with others">
                <div className="bento-emoji" aria-hidden="true">{"\uD83E\uDD1D"}</div>
                <div className="bento-title">Accountability</div>
                <p className="bento-desc">Share your streak. They get pinged if you skip.</p>
              </div>
              <div className="bento-card bento-wide reveal-on-scroll" aria-label="Widgets everywhere: lock screen, home screen, and Apple Watch">
                <div className="bento-emoji" aria-hidden="true">{"\u231A"}</div>
                <div className="bento-title">Widgets everywhere</div>
                <p className="bento-desc">Lock screen. Home screen. Apple Watch. Check off without even unlocking your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN POINTS (horizontal scroll) ──────────── */}
      <section className="pain-section">
        <div className="section-inner">
          <div className="section-label">be honest</div>
          <h2 className="section-title">POV: you just left the house</h2>
        </div>
        <div className="pain-scroll">
          <div className="pain-track">
            <div className="pain-card reveal-on-scroll">
              <div className="pain-head">
                <span className="pain-emoji">{"\uD83C\uDFC3\u200D\u2642\uFE0F"}</span>
                <span className="pain-sub">r/ADHD vibes</span>
              </div>
              <div className="pain-title">The walk of shame (x3)</div>
              <p className="pain-desc">Back for wallet. Back for badge. Back for charger. You&rsquo;re now 15 min late and your roommate is judging.</p>
            </div>
            <div className="pain-card reveal-on-scroll">
              <div className="pain-head">
                <span className="pain-emoji">{"\uD83D\uDC8A"}</span>
                <span className="pain-sub">literally every morning</span>
              </div>
              <div className="pain-title">Did I take my meds or&hellip;</div>
              <p className="pain-desc">&hellip;did I just think about taking them? The ADHD paradox of forgetting to treat the thing that makes you forget.</p>
            </div>
            <div className="pain-card reveal-on-scroll">
              <div className="pain-head">
                <span className="pain-emoji">{"\uD83D\uDE30"}</span>
                <span className="pain-sub">the classic</span>
              </div>
              <div className="pain-title">The pocket pat panic</div>
              <p className="pain-desc">Lock the door. Pat every pocket. Keys? Yes. Wallet? Maybe. Phone? You&rsquo;re holding it. Still anxious tho.</p>
            </div>
            <div className="pain-card reveal-on-scroll">
              <div className="pain-head">
                <span className="pain-emoji">{"\uD83E\uDD6A"}</span>
                <span className="pain-sub">RIP meal prep</span>
              </div>
              <div className="pain-title">RIP to the lunch you prepped</div>
              <p className="pain-desc">It&rsquo;s in the fridge. Looking beautiful. You&rsquo;ll remember it exists at 12:30 when you&rsquo;re already at the office.</p>
            </div>
            <div className="pain-card pain-card-fix reveal-on-scroll">
              <div className="pain-head">
                <span className="pain-emoji">{"\u2705"}</span>
                <span className="pain-sub">the fix</span>
              </div>
              <div className="pain-title">Ubett ends this in 10 seconds flat</div>
              <p className="pain-desc">One notification. Quick taps. Everything confirmed. Walk out like you have your life together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">3 steps. Then it runs itself.</h2>
          <div className="steps-grid">
            {[
              { num: "1", title: "Add your stuff", desc: "Phone, wallet, keys, meds, laptop \u2014 whatever you always grab. Takes 30 seconds." },
              { num: "2", title: "Leave the house", desc: "WiFi disconnects \u2192 checklist pops up. That\u2019s it. No alarms, no reminders to set." },
              { num: "3", title: "Tap & walk", desc: "Check everything off in 10 sec. Streak goes up. Anxiety goes down. Main character energy." },
            ].map((step) => (
              <div className="step reveal-on-scroll" key={step.num}>
                <div className="step-num">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTES (Reddit DM style) ─────────────────── */}
      <section className="quotes-section">
        <div className="section-inner">
          <div className="section-label">from the trenches</div>
          <h2 className="section-title">You&rsquo;re not alone in this.</h2>
          <div className="quotes-grid">
            <div className="quote-card reveal-on-scroll">
              <div className="quote-source">
                <span className="quote-avatar">u/</span>
                <span className="quote-user">cowboyhugbees</span>
                <span className="quote-sub">r/ADHD</span>
              </div>
              <p className="quote-text">&ldquo;Three point check when you close the front door: Phone, wallet, keys.&rdquo;</p>
              <div className="quote-votes">{"\u2B06"} 2.4k</div>
            </div>
            <div className="quote-card reveal-on-scroll">
              <div className="quote-source">
                <span className="quote-avatar">u/</span>
                <span className="quote-user">lexid22</span>
                <span className="quote-sub">r/ADHD</span>
              </div>
              <p className="quote-text">&ldquo;If you need to remember something, place it right in front of the exit door so you HAVE to touch it before you leave.&rdquo;</p>
              <div className="quote-votes">{"\u2B06"} 1.8k</div>
            </div>
            <div className="quote-card reveal-on-scroll">
              <div className="quote-source">
                <span className="quote-avatar">u/</span>
                <span className="quote-user">Therealdickbut</span>
                <span className="quote-sub">r/ADHD</span>
              </div>
              <p className="quote-text">&ldquo;Keep forgetting your lunch? Put your keys on it. That way you can&rsquo;t leave without your lunch.&rdquo;</p>
              <div className="quote-votes">{"\u2B06"} 3.1k</div>
            </div>
            <div className="quote-card reveal-on-scroll">
              <div className="quote-source">
                <span className="quote-avatar">{"\uD83E\uDDE0"}</span>
                <span className="quote-user">ADHD Expert</span>
                <span className="quote-sub">ADDitude Magazine</span>
              </div>
              <p className="quote-text">&ldquo;I created my &lsquo;essentials&rsquo; spot &mdash; after hours of looking, I find them in the strangest places. The freezer.&rdquo;</p>
              <div className="quote-votes">{"\u2B06"} 892</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REAL TALK (empathy) ───────────────────────── */}
      <section className="empathy-section reveal-on-scroll">
        <div className="empathy-inner">
          <div className="section-label">real talk</div>
          <h3>You&rsquo;re not dumb.<br />Your brain just has too many tabs open.</h3>
          <p>ADHD means your working memory is maxed out before you even reach the door. Ubett is the external hard drive for that one moment. Your brain handles everything else &mdash; we handle the exit.</p>
          <a href="#waitlist" className="mini-cta">Join the waitlist &rarr;</a>
        </div>
      </section>

      {/* ── FINAL CTA (urgency + progress) ───────────── */}
      <section className="final-cta" id="waitlist" ref={finalCtaRef}>
        <div className="final-cta-inner">
          <div className="section-label">let&rsquo;s go</div>
          <h2 className="section-title">
            Walk out the door<br />like you own the place.
          </h2>
          <div className="progress-wrap">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: waitlistCount ? `${Math.min((waitlistCount / 2500) * 100, 100)}%` : "0%" }}
              />
            </div>
            <p className="progress-label" style={{ minWidth: 260 }}>
              {waitlistCount ? `${waitlistCount.toLocaleString()} joined` : "Spots filling up"} &mdash; opening beta to the first 2,500
            </p>
          </div>
          <WaitlistForm id="bottomForm" buttonText="Claim my spot" />
          <p className="cta-note">Early access + free PRO for life for first signups.</p>
        </div>
      </section>

      {/* ── STICKY CTA BAR ───────────────────────────── */}
      <div className={`sticky-cta-bar${showSticky ? " visible" : ""}`}>
        <div className="sticky-cta-inner">
          <span className="sticky-cta-text" style={{ minWidth: 200 }}>
            {"\uD83D\uDD25"} {waitlistCount ? `${waitlistCount.toLocaleString()} people waiting` : "Join the waitlist"}
          </span>
          <a href="#waitlist" className="sticky-cta-btn">Join Waitlist</a>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-left">
            <div className="logo-icon" style={{ width: 28, height: 28, borderRadius: 8, fontSize: 14 }}>{"\u2713"}</div>
            <span>Ubett &copy; 2026</span>
          </div>
          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
