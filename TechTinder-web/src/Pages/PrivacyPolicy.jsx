import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: {currentDate}</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What We Collect</h2>
            <p className="mb-2">We collect information you give us:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Name, email, and profile info</li>
              <li>Skills, languages, and project interests</li>
              <li>Messages and connections you make</li>
              <li>How you use the app</li>
              <li>Basic device info (browser type, IP address)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">How We Use It</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Match you with other developers</li>
              <li>Run and improve the platform</li>
              <li>Send you updates (you can opt out)</li>
              <li>Keep the platform safe</li>
              <li>Comply with laws</li>
            </ul>
            <p className="mt-3 font-semibold">We never sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Who Can See Your Info</h2>
            <p className="mb-2">Your profile is visible to other TechTinder users. We might share your info with:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Services that help us run the platform (like hosting providers)</li>
              <li>Law enforcement if legally required</li>
              <li>Other companies if we merge or get acquired</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Your Rights</h2>
            <p className="mb-2">You can:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>See what data we have about you</li>
              <li>Update your information</li>
              <li>Delete your account</li>
              <li>Export your data</li>
              <li>Opt out of marketing emails</li>
            </ul>
            <p className="mt-3">Email us at <span className="text-purple-400">privacy@techtinder.com</span> to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Security</h2>
            <p>We use industry-standard security to protect your data. This includes encryption, secure passwords (hashed), and access controls. But no system is 100% secure, so use a strong password.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Cookies</h2>
            <p className="mb-2">We use cookies to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Understand how people use TechTinder (via Google Analytics)</li>
            </ul>
            <p className="mt-3">You can disable cookies in your browser, but some features might not work.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Data Retention</h2>
            <p>We keep your data as long as your account is active. When you delete your account, we remove your data within 30 days (except what we need to keep for legal reasons).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Children's Privacy</h2>
            <p>TechTinder is not for anyone under 18. We don't knowingly collect data from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">International Users</h2>
            <p>If you're outside the US, your data might be transferred to and stored in the US. By using TechTinder, you consent to this.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Changes to This Policy</h2>
            <p>We might update this policy. We'll let you know about important changes via email or a notice on the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
            <p className="mb-2">Questions about privacy? Reach out:</p>
            <p className="text-purple-400">privacy@techtinder.com</p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-slate-800 rounded-lg">
          <p className="text-center text-slate-400">
            By using TechTinder, you agree to this Privacy Policy and our Terms of Service.
          </p>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 TechTinder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
