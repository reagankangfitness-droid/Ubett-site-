import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Ubett",
  description: "Terms of service for using Ubett.",
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back">&larr; Back to home</Link>
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: February 10, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using the Ubett website or app, you agree to these Terms of Service. If you do not agree, please do not use Ubett.</p>

      <h2>2. Description of Service</h2>
      <p>Ubett is a mobile application that provides departure checklists triggered by WiFi disconnection. The service includes a free tier and an optional paid subscription (&ldquo;PRO&rdquo;).</p>

      <h2>3. Waitlist</h2>
      <p>By joining the waitlist, you agree to receive emails about Ubett&rsquo;s launch and product updates. You can unsubscribe at any time.</p>

      <h2>4. User Responsibilities</h2>
      <ul>
        <li>You must provide a valid email address to join the waitlist</li>
        <li>You are responsible for the accuracy of information you provide</li>
        <li>You agree not to misuse the service or attempt to disrupt its operation</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>Ubett, its logo, design, and content are owned by Ubett and protected by applicable intellectual property laws. You may not copy, modify, or distribute our content without permission.</p>

      <h2>6. Disclaimer</h2>
      <p>Ubett is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that the app will prevent you from forgetting items. Ubett is a reminder tool, not a guarantee.</p>

      <h2>7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Ubett shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>

      <h2>8. Subscriptions and Payments</h2>
      <p>PRO subscriptions are billed through the Apple App Store or Google Play Store. Refunds are handled according to the respective store&rsquo;s policies. You can cancel your subscription at any time through your device&rsquo;s settings.</p>

      <h2>9. Changes to Terms</h2>
      <p>We may update these terms. Continued use of Ubett after changes constitutes acceptance of the new terms. We&rsquo;ll notify you of significant changes via email.</p>

      <h2>10. Contact</h2>
      <p>Questions about these terms? Email us at <a href="mailto:hello@ubett.app">hello@ubett.app</a>.</p>
    </div>
  );
}
