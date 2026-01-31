import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Users, Zap, Heart, Github, Linkedin, Twitter, 
  ChevronRight, Star, TrendingUp, Globe, Sparkles, 
  MessageCircle, CheckCircle, ArrowRight, Menu, X
} from 'lucide-react';
import axios from 'axios';


function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

  const handleSignUp = () => {
    navigate('/signup');
  }

  const handleLogin = () => {
    navigate('/login');
  }


  const stats = [
    { label: 'Active Developers', value: '50K+', icon: Users },
    { label: 'Successful Matches', value: '100K+', icon: Heart },
    { label: 'Countries', value: '150+', icon: Globe },
    { label: 'Projects Built', value: '25K+', icon: Code2 }
  ];

  
  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['10 matches per month', 'Basic profile', 'Community access', 'Public projects'],
      color: 'from-slate-500 to-slate-700',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: ['Unlimited matches', 'Priority matching', 'Advanced analytics', 'Private projects', 'Video calls', '24/7 support'],
      color: 'from-cyan-500 to-purple-600',
      popular: true
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month',
      features: ['Everything in Pro', 'Team workspace', 'Admin dashboard', 'Custom branding', 'Dedicated support', 'API access'],
      color: 'from-fuchsia-500 to-pink-600',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="transform rotate-12 hover:rotate-0 transition-transform duration-500 w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl">
              &lt;/&gt;
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              TECHTINDER
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['How It Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-slate-300 hover:text-white font-semibold transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={handleLogin} className="px-6 py-2 text-white font-bold hover:text-cyan-400 transition-colors">
              Sign In
            </button>
            <button onClick={handleSignUp} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 py-6">
            <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
              {['Features', 'How It Works', 'Pricing', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-slate-300 hover:text-white font-semibold transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <button onClick={handleLogin} className="px-6 py-3 text-white font-bold border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                  Sign In
                </button>
                <button onClick={handleSignUp} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
           
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent animate-fade-in-up">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                Coding Partner
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
              Connect with talented developers, collaborate on exciting projects, and build something amazing together. It's like Tinder, but for code.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-600">
              <button onClick={handleSignUp} className="group px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all flex items-center gap-2">
                Start Matching For Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-semibold">Growing Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">100% Free to Start</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="relative max-w-7xl mx-auto mt-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💻', text: 'Frontend Devs', count: '15K+' },
              { icon: '⚙️', text: 'Backend Devs', count: '12K+' },
              { icon: '📱', text: 'Mobile Devs', count: '8K+' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${1000 + idx * 100}ms` }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-2xl font-black text-white mb-1">{item.count}</div>
                <div className="text-slate-400 font-semibold">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
   
      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get started in minutes and find your coding match today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 -translate-y-1/2"></div>

            {[
              { step: '01', title: 'Create Profile', desc: 'Sign up and showcase your skills, interests, and project goals', icon: Users },
              { step: '02', title: 'Get Matched', desc: 'Our AI algorithm finds developers who complement your skills', icon: Sparkles },
              { step: '03', title: 'Start Building', desc: 'Connect, collaborate, and create amazing projects together', icon: Code2 }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all transform hover:-translate-y-2">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center font-black text-white text-sm border-4 border-slate-950">
                    {item.step}
                  </div>
                  <div className="mt-6 mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                      <item.icon className="w-10 h-10 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Simple Pricing
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Choose the perfect plan for your developer journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-8 transition-all transform hover:-translate-y-2 ${
                  plan.popular
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20 scale-105'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xs font-bold mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Find Your Match?
              </h2>
              
              <button onClick={handleSignUp} className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                Start Matching Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="transform rotate-12 hover:rotate-0 transition-transform duration-500 w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl">
                  &lt;/&gt;
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  TECHTINDER
                </span>
              </div>
              <p className="text-slate-400 mb-6">
                The ultimate platform for developers to connect, collaborate, and create together.
              </p>
              <div className="flex gap-4">
                {[Github, Linkedin, Twitter].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                  >
                    <Icon className="w-5 h-5 text-slate-400 hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Pricing', 'How It Works'] },
              { title: 'Company', links: ['About', 'Contact'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="text-white font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-slate-400">
            <p>© 2026 TECHTINDER. All rights reserved. Made with ❤️ by developer, for developers.</p>
          </div>
        </div>
      </footer>

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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;