import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TermsOfService() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">&lt;/&gt;</div>
            <span className="text-xl font-bold">TechTinder</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: {currentDate}</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance</h2>
            <p>By using TechTinder, you agree to these terms. If you don't agree, please don't use our service. You must be at least 18 years old to use TechTinder.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Your Account</h2>
            <p className="mb-2">When you create an account:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate information</li>
              <li>Keep your password secure</li>
              <li>You're responsible for all activity on your account</li>
              <li>One account per person</li>
              <li>Let us know if you think someone accessed your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How to Use TechTinder</h2>
            <p className="mb-2">Please don't:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Harass, threaten, or bully other users</li>
              <li>Post spam or inappropriate content</li>
              <li>Lie about who you are or your skills</li>
              <li>Try to hack or break the platform</li>
              <li>Use bots or fake accounts</li>
              <li>Do anything illegal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Your Content</h2>
            <p className="mb-2">You own what you post, but by posting you give us permission to use it on our platform. We can remove content that violates these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Our Rights</h2>
            <p>We own TechTinder - the code, design, name, and logos. You can't copy, modify, or sell any of it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Termination</h2>
            <p className="mb-2">We can suspend or close accounts that break these rules. You can delete your account anytime in settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Disclaimers</h2>
            <p className="mb-2">TechTinder is provided "as is". We don't guarantee:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The service will always work perfectly</li>
              <li>You'll find a perfect match</li>
              <li>Other users are who they say they are</li>
            </ul>
            <p className="mt-2">We're not responsible for what happens between users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Paid Services</h2>
            <p className="mb-2">If you buy a subscription:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>It auto-renews unless you cancel</li>
              <li>No refunds unless required by law</li>
              <li>We can change prices with 30 days notice</li>
              <li>Cancel anytime in settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Changes to Terms</h2>
            <p>We can update these terms. We'll let you know about big changes. Continuing to use TechTinder means you accept the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Contact Us</h2>
            <p className="mb-2">Questions? Email us at:</p>
            <p className="text-purple-400">support@techtinder.com</p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-slate-800 rounded-lg">
          <p className="text-center text-slate-400">
            By using TechTinder, you agree to these Terms of Service and our Privacy Policy.
          </p>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 TechTinder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TermsOfService;
