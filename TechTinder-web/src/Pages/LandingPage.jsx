import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Users, Zap, CheckCircle, Menu, X } from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:1111/stats")
      .then((res) => res.json())
      .then((data) => setUserCount(data.activeDevs || 0))
      .catch((err) => console.log(err));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "bg-slate-900/95 border-b border-slate-800" : "bg-transparent"} py-4 transition-all`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold">TechTinder</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-slate-300 hover:text-white">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-300 hover:text-white">
              Pricing
            </a>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg text-left transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-purple-600 rounded-lg text-left transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-6 py-4 flex flex-col gap-3">
              <a href="#how" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </a>

              <button
                onClick={() => navigate("/login")}
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Coding Partner
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Connect with developers, work on projects together, and build
            something cool. Like Tinder, but for code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
            >
              Start Matching
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />{" "}
              {userCount - 1}+ developers
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Profile",
                desc: "Sign up and add your skills and interests",
                icon: Users,
              },
              {
                title: "Match",
                desc: "Find developers who match your vibe",
                icon: Zap,
              },
              {
                title: "Build",
                desc: "Start working on projects together",
                icon: Code2,
              },
            ].map((step, i) => (
              <div key={i} className="bg-slate-900 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "10 matches/month",
                  "Basic profile",
                  "Community access",
                ],
              },
              {
                name: "Pro",
                price: "$19",
                features: [
                  "Unlimited matches",
                  "Priority matching",
                  "Advanced features",
                  "24/7 support",
                ],
                popular: true,
              },
              {
                name: "Team",
                price: "$49",
                features: [
                  "Everything in Pro",
                  "Team workspace",
                  "Admin dashboard",
                  "API access",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-lg ${plan.popular ? "bg-purple-900/30 border-2 border-purple-600" : "bg-slate-800"}`}
              >
                {plan.popular && (
                  <div className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-bold mb-4">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <CheckCircle
                        size={20}
                        className="text-purple-400 flex-shrink-0 mt-0.5"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
                      : "bg-slate-700 hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-600/30 transform hover:scale-105"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-purple-600 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Match?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of developers building together
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white/20 transform hover:scale-105"
          >
            Start Matching Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  &lt;/&gt;
                </div>
                <span className="text-xl font-bold">TechTinder</span>
              </div>
              <p className="text-slate-400">
                Connect, collaborate, and create with developers worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#how">How It Works</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © 2026 TechTinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
