import React, { useState } from 'react';
import { Shield, Lock, Eye, UserCheck, Database, Bell, Globe, Mail, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: `We collect information that you provide directly to us, including:

• Account Information: Name, email address, username, password, profile picture, and bio
• Developer Profile: Skills, programming languages, project preferences, GitHub/LinkedIn profiles
• Usage Data: How you interact with our platform, features you use, and connections you make
• Communication Data: Messages, comments, and other content you share on TECHTINDER
• Device Information: IP address, browser type, operating system, and device identifiers
• Location Data: General location based on IP address (we do not track precise GPS location)

We may also collect information from third-party services when you connect your GitHub, LinkedIn, or other developer accounts to enhance your profile.`
    },
    {
      icon: Lock,
      title: '2. How We Use Your Information',
      content: `We use the collected information for the following purposes:

• Matching Algorithm: To connect you with compatible developers based on skills and interests
• Account Management: To create, maintain, and secure your account
• Platform Improvement: To analyze usage patterns and improve our services
• Communication: To send you updates, notifications, and promotional content (you can opt-out anytime)
• Safety & Security: To detect fraud, abuse, and ensure platform safety
• Personalization: To customize your experience and provide relevant recommendations
• Legal Compliance: To comply with legal obligations and enforce our Terms of Service

We will never sell your personal information to third parties for marketing purposes.`
    },
    {
      icon: UserCheck,
      title: '3. Information Sharing and Disclosure',
      content: `We may share your information in the following circumstances:

• With Other Users: Your public profile information is visible to other TECHTINDER users
• Service Providers: We share data with trusted third-party services that help us operate (hosting, analytics, email services)
• Business Transfers: In case of merger, acquisition, or sale of assets, your data may be transferred
• Legal Requirements: When required by law, court order, or government request
• Safety & Security: To protect the rights, property, or safety of TECHTINDER, our users, or the public
• With Your Consent: When you explicitly authorize us to share your information

We implement strict data protection agreements with all third-party service providers to ensure your information remains secure.`
    },
    {
      icon: Eye,
      title: '4. Your Privacy Rights',
      content: `You have the following rights regarding your personal data:

• Access: Request a copy of all personal data we hold about you
• Correction: Update or correct inaccurate information in your profile
• Deletion: Request deletion of your account and associated data
• Portability: Request a machine-readable copy of your data
• Opt-Out: Unsubscribe from marketing emails and notifications
• Restriction: Limit how we process your information
• Object: Object to certain types of data processing

To exercise these rights, contact us at privacy@techtinder.com. We will respond within 30 days. Note that some data may be retained for legal or security purposes even after account deletion.`
    },
    {
      icon: Shield,
      title: '5. Data Security',
      content: `We take data security seriously and implement industry-standard measures:

• Encryption: All data transmission uses SSL/TLS encryption
• Secure Storage: Passwords are hashed using bcrypt with salt
• Access Controls: Strict internal access policies and authentication requirements
• Regular Audits: Security assessments and vulnerability testing
• Monitoring: 24/7 monitoring for suspicious activity and potential breaches
• Backup Systems: Regular encrypted backups stored in secure locations

However, no system is 100% secure. We encourage you to use strong passwords and enable two-factor authentication (when available) to protect your account.`
    },
    {
      icon: Bell,
      title: '6. Cookies and Tracking',
      content: `We use cookies and similar technologies to enhance your experience:

• Essential Cookies: Required for basic platform functionality (login, security)
• Analytics Cookies: Help us understand how users interact with our platform (Google Analytics)
• Preference Cookies: Remember your settings and preferences
• Marketing Cookies: Track ad campaign effectiveness (can be disabled)

You can control cookie preferences through your browser settings. Note that disabling certain cookies may limit platform functionality. We use the following third-party services:
• Google Analytics for usage analytics
• Cloudflare for security and performance
• Stripe for payment processing (Pro/Team plans)

For more details, see our Cookie Policy.`
    },
    {
      icon: Globe,
      title: '7. International Data Transfers',
      content: `TECHTINDER operates globally, and your data may be transferred to and stored in countries outside your residence:

• Data Centers: We use cloud providers with data centers in the US, EU, and Asia
• Privacy Shield: We comply with applicable data transfer frameworks and regulations
• Safeguards: Standard contractual clauses and security measures protect international transfers
• GDPR Compliance: For EU users, we ensure compliance with GDPR requirements
• Local Laws: We respect and comply with local privacy laws in all operating regions

If you're in the EU/EEA, your data is primarily stored within the EU, with appropriate safeguards for any transfers outside.`
    },
    {
      icon: UserCheck,
      title: '8. Children\'s Privacy',
      content: `TECHTINDER is not intended for users under 18 years of age:

• Age Requirement: You must be at least 18 years old to create an account
• No Knowingly Collection: We do not knowingly collect information from minors
• Parental Rights: If we discover a minor has created an account, we will delete it immediately
• Reporting: If you believe a minor is using our platform, please contact us at support@techtinder.com

We encourage parents and guardians to monitor their children's online activities and educate them about online safety.`
    },
    {
      icon: Mail,
      title: '9. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time:

• Notification: We will notify you of significant changes via email or platform notification
• Effective Date: Changes become effective when posted unless otherwise stated
• Review: We encourage you to review this policy periodically
• Continued Use: Your continued use of TECHTINDER after changes constitutes acceptance

Previous versions of this policy are archived and available upon request. Last updated: February 2, 2026.`
    }
  ];

  const quickLinks = [
    { text: 'Contact Privacy Team', action: 'mailto:privacy@techtinder.com' },
    { text: 'Delete Your Account', action: '#account-deletion' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-6 border-b border-white/10 backdrop-blur-xl bg-slate-950/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="http://localhost:5173/signup" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </a>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex items-center gap-3">
                <div className="rotate-12 hover:rotate-0 transition-transform duration-500 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center font-black text-sm">
                  &lt;/&gt;
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  TECHTINDER
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-slate-500 font-semibold">
              Last Updated: February 2, 2026
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {quickLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.action}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-cyan-500/30 transition-all transform hover:-translate-y-1"
                >
                  <span className="text-cyan-400 font-semibold">{link.text}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                At TECHTINDER, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your data when you use our platform.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                By using TECHTINDER, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                >
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    {expandedSection === idx ? (
                      <ChevronUp className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedSection === idx && (
                    <div className="px-8 pb-6">
                      <div className="pl-16 pr-4 text-slate-300 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Questions or Concerns?</h3>
                  <p className="text-slate-300 mb-4">
                    If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to contact us.
                  </p>
                  <div className="space-y-2 text-slate-400">
                    <p><strong className="text-white">Email:</strong> privacy@techtinder.com</p>
                    <p><strong className="text-white">Address:</strong> 123 Tech Street, San Francisco, CA 94102, USA</p>
                    <p><strong className="text-white">Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Quick Summary</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>We collect information to provide and improve our matching services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Your data is encrypted and stored securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>We never sell your personal information to third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>You have full control over your data and can request deletion at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>We comply with GDPR, CCPA, and other privacy regulations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="rotate-12 hover:rotate-0 transition-transform duration-500 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center font-black text-sm">
                &lt;/&gt;
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                TECHTINDER
              </span>
            </div>
            <p className="text-slate-400 mb-4">
              © 2026 TECHTINDER. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a href="http://localhost:5173/terms" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">
                Terms of Service
              </a>
              <span className="text-slate-600">•</span>
              <a href="http://localhost:5173/privacypolicy" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default PrivacyPolicy;