import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>

      <div className="space-y-6 text-secondary-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Oraino Music ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
          <p>Oraino Music is a free, ad-supported music streaming platform that allows users to search, play, and organize music from various sources including YouTube and Jamendo. The service is provided "as is" without warranties of any kind.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. User Accounts</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must be at least 13 years old to use the Service</li>
            <li>One person may not maintain more than one account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to circumvent ads or manipulate the platform</li>
            <li>Download, copy, or redistribute music content</li>
            <li>Use automated systems to access the Service</li>
            <li>Interfere with the proper working of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Content & Copyright</h2>
          <p>All music content available through Oraino Music is sourced from third-party APIs. We do not host music files directly. All content remains the property of its respective copyright holders. If you believe content infringes your copyright, please contact us.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Advertisements</h2>
          <p>Oraino Music is ad-supported. By using the Service, you agree to the display of advertisements. Ad revenue helps us keep the service free for all users.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">7. Limitation of Liability</h2>
          <p>Oraino Music shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. We do not guarantee uninterrupted or error-free operation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">8. Termination</h2>
          <p>We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our sole discretion.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:legal@oraino-music.com" className="text-primary hover:underline">legal@oraino-music.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
