import{ useState } from 'react';
import { Github, Linkedin, Mail, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:1111/login",{
        emailId,
        password,
      });
    }catch(error){
      console.log("Errro: "+error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Section - Branding & Info */}
          <div className="relative">
            {/* Floating logo badge */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-3xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">&lt;/&gt;</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
              {/* Logo */}
              <div className="mb-8">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 mb-2 tracking-tight">
                  TECHTINDER
                </h1>
                <p className="text-slate-400 text-lg font-medium">Where Developers Connect</p>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-8">
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-sm group hover:border-cyan-400/40 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Devs</span>
                    <span className="text-cyan-400 text-xs font-bold px-2 py-1 bg-cyan-500/20 rounded-full">+24%</span>
                  </div>
                  <div className="text-4xl font-black text-white">47,892</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm group hover:border-purple-400/40 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Matches Today</span>
                    <span className="text-fuchsia-400 text-xs font-bold px-2 py-1 bg-fuchsia-500/20 rounded-full">Live</span>
                  </div>
                  <div className="text-4xl font-black text-white">2,847</div>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="space-y-3">
                {[
                  { icon: '➡️', text: 'Instant matching with skilled developers' },
                  { icon: '➡️', text: 'Global community of 100k+ coders' },
                  { icon: '➡️', text: 'Build projects together in real-time' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300 group hover:text-white transition-colors duration-300">
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Decorative code snippet */}
              <div className="mt-8 bg-slate-950/50 rounded-xl p-4 border border-cyan-500/20 font-mono text-xs overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-cyan-400">
                  <span className="text-purple-400">const</span> match = <span className="text-fuchsia-400">await</span> findDeveloper();
                </div>
                <div className="text-slate-500">// Connect. Code. Create.</div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-10 shadow-2xl shadow-purple-900/50 transform hover:scale-[1.02] transition-all duration-500">
              {/* Welcome header */}
              <div className="mb-8">
                <h2 className="text-4xl font-black text-slate-900 mb-2">
                  Welcome Back 👋
                </h2>
                <p className="text-slate-600 text-lg">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <button className="group flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-900 border-2 border-slate-200 hover:border-slate-900 rounded-xl p-3 transition-all duration-300">
                  <Github className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </button>
                <button className="group flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-600 border-2 border-slate-200 hover:border-blue-600 rounded-xl p-3 transition-all duration-300">
                  <Linkedin className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </button>
                <button className="group flex items-center justify-center gap-2 bg-slate-50 hover:bg-red-600 border-2 border-slate-200 hover:border-red-600 rounded-xl p-3 transition-all duration-300">
                  <Mail className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-semibold">OR CONTINUE WITH EMAIL</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                    placeholder="developer@example.com"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 hover:from-cyan-400 hover:via-purple-500 hover:to-fuchsia-500 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg uppercase tracking-wider"
                >
                  {isHovered ? '🚀 Launch' : 'Sign In'}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-slate-600 font-medium">
                  New to TECHTINDER?{' '}
                  <a href="http://localhost:5173/signup" className="text-purple-600 hover:text-purple-700 font-bold underline decoration-2 underline-offset-4 hover:underline-offset-2 transition-all">
                    Create Account
                  </a>
                </p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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

export default Login;