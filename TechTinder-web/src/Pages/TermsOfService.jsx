import React, { useState } from 'react';
import { FileText, AlertCircle, Ban, Scale, UserX, Shield, Gavel, Check, ArrowLeft, ChevronDown, ChevronUp, Mail } from 'lucide-react';

function TermsOfService() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      icon: Check,
      title: '1. Acceptance of Terms',
      content: `By accessing or using TECHTINDER, you agree to be bound by these Terms of Service and all applicable laws and regulations.

• Legal Agreement: These Terms constitute a legally binding agreement between you and TECHTINDER
• Age Requirement: You must be at least 18 years old to use our services
• Account Responsibility: You are responsible for maintaining the confidentiality of your account
• Updates: We may modify these Terms at any time, and continued use constitutes acceptance
• Severability: If any provision is found invalid, the remaining provisions remain in effect

If you do not agree to these Terms, you must not access or use TECHTINDER. Your use of the platform signifies your acceptance of these Terms and our Privacy Policy.`
    },
    {
      icon: UserX,
      title: '2. User Accounts and Registration',
      content: `To use TECHTINDER, you must create an account and provide accurate information:

• Accurate Information: You must provide truthful, current, and complete information
• Account Security: You are responsible for all activities under your account
• One Account: You may only maintain one active account per person
• Username Policy: Usernames must not be offensive, misleading, or impersonate others
• Password Security: Use a strong password and never share it with anyone
• Unauthorized Access: Notify us immediately if you suspect unauthorized account access
• Account Termination: We reserve the right to suspend or terminate accounts that violate these Terms

You agree to:
• Keep your login credentials confidential
• Notify us of any security breaches
• Accept responsibility for all activities conducted through your account
• Not sell, transfer, or share your account with others`
    },
    {
      icon: Shield,
      title: '3. Acceptable Use Policy',
      content: `You agree to use TECHTINDER only for lawful purposes and in accordance with these Terms:

PROHIBITED ACTIVITIES:
• Harassment: Do not harass, abuse, threaten, or intimidate other users
• Spam: No unsolicited messages, promotional content, or commercial solicitation
• Fraud: No deceptive practices, impersonation, or false information
• Illegal Content: No content that violates laws or promotes illegal activities
• Malware: No viruses, malicious code, or harmful software
• Scraping: No automated data collection or bot activity without permission
• Intellectual Property: No copyright, trademark, or patent infringement
• Hate Speech: No content promoting discrimination, violence, or hatred
• Inappropriate Content: No sexually explicit, violent, or disturbing content
• Platform Manipulation: No attempts to manipulate matching algorithms or ratings

PROPER USE:
• Professional conduct in all communications
• Honest representation of skills and experience
• Respectful collaboration with other developers
• Constructive feedback and contributions
• Compliance with community guidelines`
    },
    {
      icon: FileText,
      title: '4. User Content and Intellectual Property',
      content: `You retain ownership of content you post, but grant us certain rights:

YOUR CONTENT:
• Ownership: You retain all rights to content you create and post
• License Grant: You grant TECHTINDER a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
• Responsibility: You are solely responsible for your content and its legality
• Removal Rights: We may remove content that violates these Terms without notice
• No Guarantee: We do not guarantee the accuracy or reliability of user-generated content

OUR CONTENT:
• Platform Rights: TECHTINDER owns all rights to the platform, code, design, and features
• Trademarks: Our logos, trademarks, and brand elements are protected
• No License: These Terms do not grant you any rights to our intellectual property
• Restrictions: You may not copy, modify, or reverse engineer our platform

DMCA COMPLIANCE:
• Copyright Claims: Submit DMCA takedown requests to legal@techtinder.com
• Counter-Notices: Users may submit counter-notices for disputed claims
• Repeat Infringers: Accounts with multiple violations will be terminated`
    },
    {
      icon: Ban,
      title: '5. Prohibited Conduct',
      content: `The following conduct is strictly prohibited and may result in immediate account termination:

SECURITY VIOLATIONS:
• Attempting to gain unauthorized access to accounts or systems
• Circumventing security measures or authentication processes
• Distributing malware, viruses, or harmful code
• Conducting denial-of-service attacks or similar disruptions

ABUSE & HARASSMENT:
• Stalking, threatening, or harassing other users
• Discriminatory behavior based on race, gender, religion, etc.
• Unwanted romantic or sexual advances
• Doxxing or sharing private information without consent

PLATFORM MANIPULATION:
• Creating fake accounts or using bots
• Manipulating matching algorithms or ratings
• Gaming the system for unfair advantages
• Coordinating with others to artificially inflate metrics

COMMERCIAL ABUSE:
• Unauthorized advertising or marketing
• Multi-level marketing or pyramid schemes
• Selling access to accounts or services
• Using the platform for illegal business activities

CONSEQUENCES:
Violations may result in:
• Warning notifications
• Temporary account suspension
• Permanent account termination
• Legal action and law enforcement referral
• Liability for damages caused`
    },
    {
      icon: Scale,
      title: '6. Disclaimers and Limitation of Liability',
      content: `TECHTINDER is provided "as is" without warranties of any kind:

SERVICE DISCLAIMERS:
• No Warranty: We provide the platform "as is" without guarantees of any kind
• Availability: We do not guarantee uninterrupted or error-free service
• User Interactions: We are not responsible for interactions between users
• Third-Party Content: We do not endorse or verify user-generated content
• External Links: We are not responsible for third-party websites or services
• Matching Results: We do not guarantee successful matches or collaborations

LIMITATION OF LIABILITY:
To the maximum extent permitted by law:
• TECHTINDER shall not be liable for indirect, incidental, or consequential damages
• Our total liability shall not exceed $100 or the amount you paid in the last 12 months
• We are not liable for user conduct, content, or disputes between users
• We are not responsible for data loss, business interruption, or lost profits

INDEMNIFICATION:
You agree to indemnify and hold TECHTINDER harmless from:
• Claims arising from your use of the platform
• Violations of these Terms or applicable laws
• Infringement of third-party rights
• Your content and interactions with other users

Some jurisdictions do not allow limitations on implied warranties or liability, so these limitations may not apply to you.`
    },
    {
      icon: Gavel,
      title: '7. Termination and Account Suspension',
      content: `We reserve the right to suspend or terminate accounts at our discretion:

TERMINATION BY US:
We may suspend or terminate your account if:
• You violate these Terms of Service
• You engage in prohibited conduct or illegal activities
• You create multiple accounts or use fake identities
• Your account remains inactive for an extended period
• We receive legal requests or court orders
• We discontinue the service (with 30 days notice for paid users)

TERMINATION BY YOU:
• You may delete your account at any time through account settings
• Account deletion is permanent and cannot be undone
• Some data may be retained for legal or security purposes
• Paid subscriptions must be cancelled separately

EFFECTS OF TERMINATION:
• Immediate loss of access to your account and content
• Forfeiture of any unused credits or subscription time (no refunds)
• Deletion of profile, matches, and conversations
• Continued application of certain Terms (intellectual property, liability, etc.)

APPEALS:
• You may appeal account suspensions by contacting support@techtinder.com
• We will review appeals within 7 business days
• Final decisions are at our sole discretion`
    },
    {
      icon: AlertCircle,
      title: '8. Dispute Resolution and Governing Law',
      content: `These Terms are governed by applicable laws and dispute resolution procedures:

GOVERNING LAW:
• These Terms are governed by the laws of the State of California, USA
• Federal law applies where applicable
• International users agree to California jurisdiction

DISPUTE RESOLUTION:
Step 1 - Informal Resolution:
• Contact us at legal@techtinder.com to resolve disputes informally
• We will attempt good faith resolution within 30 days

Step 2 - Mediation:
• If informal resolution fails, disputes will be submitted to mediation
• Both parties must participate in good faith mediation

Step 3 - Arbitration:
• Unresolved disputes will be settled by binding arbitration
• Arbitration conducted under American Arbitration Association rules
• Arbitration takes place in San Francisco, California
• You waive the right to jury trial and class action lawsuits

CLASS ACTION WAIVER:
• You agree to resolve disputes individually, not as part of a class action
• You may not consolidate claims with other users
• This waiver is a material term of these Terms

EXCEPTIONS:
The following may be brought in court:
• Claims seeking injunctive relief
• Intellectual property disputes
• Small claims court matters (under jurisdictional limits)

TIME LIMIT:
• Claims must be filed within one year of the dispute arising
• Claims filed after one year are permanently barred`
    },
    {
      icon: FileText,
      title: '9. Paid Services and Subscriptions',
      content: `If you purchase Pro or Team subscriptions, additional terms apply:

BILLING:
• Subscriptions are billed monthly or annually in advance
• Prices are subject to change with 30 days notice
• Payment processed via Stripe or other payment providers
• All fees are non-refundable except as required by law

AUTO-RENEWAL:
• Subscriptions automatically renew unless cancelled
• Cancel anytime before the next billing cycle
• Cancellation takes effect at the end of the current period
• No partial refunds for mid-cycle cancellations

FREE TRIALS:
• Free trials available for new users (if offered)
• Credit card required, charged if not cancelled before trial ends
• One free trial per user, per lifetime

PAYMENT ISSUES:
• Failed payments may result in service suspension
• We will attempt to notify you of payment issues
• Restore access by updating payment information
• Continued non-payment may result in account termination

REFUND POLICY:
• Generally, all sales are final and non-refundable
• Exceptions may be made at our sole discretion
• EU users have 14-day right of withdrawal (see GDPR compliance)
• Contact billing@techtinder.com for refund requests`
    },
    {
      icon: Shield,
      title: '10. Privacy and Data Protection',
      content: `Your privacy is important to us. Please review our Privacy Policy for details:

DATA COLLECTION:
• We collect data as described in our Privacy Policy
• You consent to data collection and processing by using our services
• Data may be transferred internationally as described in Privacy Policy

YOUR RIGHTS:
• Access, correct, or delete your personal data
• Export your data in machine-readable format
• Opt-out of marketing communications
• File complaints with data protection authorities (EU users)

SECURITY:
• We implement industry-standard security measures
• However, no system is 100% secure
• You are responsible for maintaining password security
• Report security incidents to security@techtinder.com

GDPR COMPLIANCE (EU Users):
• We comply with GDPR requirements
• EU data primarily stored within EU
• Legal basis for processing: contract performance, legitimate interest, consent
• Data Protection Officer: dpo@techtinder.com

CCPA COMPLIANCE (California Users):
• Right to know what data we collect
• Right to delete personal information
• Right to opt-out of data sales (we don't sell data)
• Non-discrimination for exercising rights

For complete details, see our Privacy Policy at techtinder.com/privacy`
    },
    {
      icon: AlertCircle,
      title: '11. Changes to Terms',
      content: `We reserve the right to modify these Terms at any time:

NOTIFICATION:
• Material changes will be announced via email or platform notification
• Changes posted on this page with updated "Last Modified" date
• Non-material changes may be made without specific notice

REVIEW:
• We encourage you to review these Terms periodically
• Continued use after changes constitutes acceptance
• If you disagree with changes, you must stop using the service

EFFECTIVE DATE:
• Changes become effective immediately upon posting
• For paid users, material changes may take effect at next renewal
• We will provide 30 days notice for significant changes affecting paid services

PREVIOUS VERSIONS:
• Previous versions archived and available upon request
• Contact legal@techtinder.com for historical versions

YOUR OPTIONS:
If you disagree with updated Terms:
• Stop using the platform immediately
• Delete your account within 30 days
• Contact us to discuss concerns
• Exercise your termination rights as described in Section 7`
    },
    {
      icon: Mail,
      title: '12. Contact Information',
      content: `For questions, concerns, or notices regarding these Terms:

GENERAL INQUIRIES:
Email: support@techtinder.com
Response Time: Within 48 hours

LEGAL NOTICES:
Email: legal@techtinder.com
Address: TECHTINDER Legal Department
         123 Tech Street
         San Francisco, CA 94102
         United States

SPECIFIC DEPARTMENTS:
• Privacy: privacy@techtinder.com
• Security: security@techtinder.com
• Billing: billing@techtinder.com
• DMCA: dmca@techtinder.com
• Data Protection Officer: dpo@techtinder.com

MAILING ADDRESS:
TECHTINDER Inc.
123 Tech Street, Suite 400
San Francisco, CA 94102
United States

BUSINESS HOURS:
Monday - Friday: 9:00 AM - 6:00 PM PST
Emergency Security Issues: 24/7

We strive to respond to all inquiries within 48 hours during business days. For urgent security matters, please mark your email as "URGENT - SECURITY".`
    }
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-orange-600 rounded-2xl mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">
              Please read these terms carefully before using TECHTINDER. By using our platform, you agree to these terms.
            </p>
            <p className="text-sm text-slate-500 font-semibold">
              Last Updated: February 2, 2026
            </p>
          </div>
        </section>

        {/* Important Notice */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Important Legal Notice</h3>
                  <p className="text-slate-300 leading-relaxed">
                    These Terms of Service contain important information about your legal rights, remedies, and obligations. 
                    They include various limitations and exclusions, and a clause that governs the jurisdiction and venue of disputes. 
                    Please read them carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                Welcome to TECHTINDER! These Terms of Service ("Terms") govern your access to and use of TECHTINDER's 
                website, mobile applications, and related services (collectively, the "Platform").
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                By accessing or using TECHTINDER, you agree to be bound by these Terms and our Privacy Policy. 
                If you don't agree to these Terms, you may not access or use our Platform.
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
                      <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    {expandedSection === idx ? (
                      <ChevronUp className="w-6 h-6 text-fuchsia-400 flex-shrink-0" />
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
            <div className="mt-12 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Questions About These Terms?</h3>
                  <p className="text-slate-300 mb-4">
                    If you have any questions about these Terms of Service, please contact our legal team.
                  </p>
                  <div className="space-y-2 text-slate-400">
                    <p><strong className="text-white">Email:</strong> legal@techtinder.com</p>
                    <p><strong className="text-white">Address:</strong> 123 Tech Street, San Francisco, CA 94102, USA</p>
                    <p><strong className="text-white">Response Time:</strong> Within 5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Points Summary */}
            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">Key Points to Remember</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>You must be 18+ to use TECHTINDER</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>You're responsible for all activity on your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>Harassment, spam, and illegal activities are strictly prohibited</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>We may modify these Terms with notice to users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>Disputes are resolved through arbitration in California</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>Paid subscriptions are non-refundable except as required by law</span>
                </li>
              </ul>
            </div>

            {/* Acknowledgment */}
            <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <p className="text-slate-300 text-center">
                By clicking "I Agree" or by accessing or using TECHTINDER, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
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
              <a href="http://localhost:5173/terms" className="text-slate-400 hover:text-fuchsia-400 transition-colors font-semibold">
                Terms of Service
              </a>
              <span className="text-slate-600">•</span>
              <a href="http://localhost:5173/privacypolicy" className="text-slate-400 hover:text-fuchsia-400 transition-colors font-semibold">
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

export default TermsOfService;