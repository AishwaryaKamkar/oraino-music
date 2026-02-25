import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 1, 2026</p>

      <div className="space-y-6 text-secondary-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
          <p>When you use Oraino Music, we collect certain information to provide and improve our service:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Account Information:</strong> Email address and display name when you create an account.</li>
            <li><strong className="text-foreground">Usage Data:</strong> Songs played, playlists created, favorites, and listening history to personalize your experience.</li>
            <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, and device type for optimization.</li>
            <li><strong className="text-foreground">Cookies:</strong> We use cookies and similar technologies to maintain sessions and improve functionality.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Provide, maintain, and improve Oraino Music services</li>
            <li>Personalize music recommendations and content</li>
            <li>Send important service updates and notifications</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Display relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. Advertising</h2>
          <p>
            Oraino Music is a free, ad-supported platform. We use Google AdSense and other advertising partners to display ads. These partners may use cookies and similar technologies to serve ads based on your interests. You can manage your ad preferences through Google's Ad Settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Third-Party Services</h2>
          <p>
            We integrate with third-party APIs (YouTube API, Jamendo API) to provide music content. Your use of these services is also governed by their respective privacy policies. We also use Google Analytics to understand how users interact with our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Access, update, or delete your personal information</li>
            <li>Opt out of personalized advertising</li>
            <li>Request a copy of your data</li>
            <li>Delete your account at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">7. Children's Privacy</h2>
          <p>Oraino Music is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@oraino-music.com" className="text-primary hover:underline">privacy@oraino-music.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
