import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — DoorCheck",
  description: "How DoorCheck handles your data. TL;DR: we collect very little and never sell it.",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back">&larr; Back to home</Link>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: February 10, 2026</p>

      <h2>What We Collect</h2>
      <p>When you join the waitlist, we collect your <strong>email address</strong> and the date you signed up. That&rsquo;s it.</p>
      <p>When you use the DoorCheck app (coming soon), we may collect:</p>
      <ul>
        <li>Your checklist items (stored locally on your device)</li>
        <li>Streak and usage data (stored locally on your device)</li>
        <li>WiFi connection status (used locally to trigger checklists — never sent to our servers)</li>
        <li>Anonymous crash reports (if you opt in)</li>
      </ul>

      <h2>What We Don&rsquo;t Collect</h2>
      <ul>
        <li>Your location data is never sent to our servers</li>
        <li>Your WiFi network name is never sent to our servers</li>
        <li>We do not use third-party trackers or analytics that collect personal data</li>
        <li>We do not sell, rent, or share your data with anyone</li>
      </ul>

      <h2>How We Use Your Email</h2>
      <p>We use your email solely to:</p>
      <ul>
        <li>Notify you when DoorCheck launches</li>
        <li>Send occasional product updates (you can unsubscribe anytime)</li>
      </ul>

      <h2>Data Storage</h2>
      <p>Waitlist emails are stored securely in our database (hosted on Supabase with encryption at rest). App data stays on your device.</p>

      <h2>Your Rights</h2>
      <p>You can request deletion of your data at any time by emailing us. We&rsquo;ll remove it within 7 days.</p>

      <h2>Children&rsquo;s Privacy</h2>
      <p>DoorCheck is not directed at children under 13. We do not knowingly collect data from children.</p>

      <h2>Changes</h2>
      <p>We may update this policy. If we make significant changes, we&rsquo;ll notify you via email.</p>

      <h2>Contact</h2>
      <p>Questions? Email us at <a href="mailto:hello@doorcheck.app">hello@doorcheck.app</a>.</p>
    </div>
  );
}
