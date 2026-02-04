import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  Github,
  Mail,
  Linkedin,
  Eye,
  EyeOff,
  Code2,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Other",
    agreeToTerms: false,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(""); // Clear error when user starts typing
  };
  
  // Log Google Client ID to verify it's loaded
  // console.log("GOOGLE CLIENT ID:", import.meta.env.VITE_APP_GOOGLE_CLIENT_ID);

  // Google SSO Integration
  const handleGoogleSuccess = async (authResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:1111/google-login",
        { credential: authResponse.credential },
        { withCredentials: true },
      );
      alert("Welcome to TECHTINDER! 🎉 Your Google account is now connected!");
      navigate('/home'); // Redirect to home after successful signup
    } catch (error) {
      console.log("Google signup error:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Google signup failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleGoogleError = (error) => {
    console.log("Google auth error:", error);
    setError("Google Sign In was unsuccessful. Please try again later.");
    alert("Google Sign In was unsuccessful. Please try again later.");
  };

  //LinkedIN SSO integration
  const handleLinkedInLogin=()=>{
    window.location.href = "http://localhost:1111/linkedin";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    try {
      const res = await axios.post("http://localhost:1111/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }, {
        withCredentials: true
      });
      alert("Welcome to TECHTINDER! 🎉 Your developer journey begins now!");
      navigate('/home'); // Redirect to home after successful signup
    } catch (error) {
      console.log("Error: " + error);
      const errorMessage =
        error.response?.data?.error ||
        "Signup failed. Please check your details and try again.";
      setError(errorMessage);
      alert(errorMessage);
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
          {/* Left Section - Branding & Benefits */}
          <div className="relative order-2 lg:order-1">
            {/* Floating logo badge */}
            <div className="absolute -top-6 -left-9 w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-3xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                &lt;/&gt;
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
              {/* Logo */}
              <div className="mb-8">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 mb-2 tracking-tight">
                  TECHTINDER
                </h1>
                <p className="text-slate-400 text-lg font-medium">
                  Join the Developer Revolution
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-6 mb-8">
                {[
                  {
                    icon: Code2,
                    title: "Find Your Coding Partner",
                    description:
                      "Connect with developers who share your passion and skills",
                    color: "from-cyan-500 to-blue-500",
                  },
                  {
                    icon: Users,
                    title: "Build Together",
                    description:
                      "Collaborate on projects and grow your portfolio",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Zap,
                    title: "Level Up Fast",
                    description: "Learn from peers and accelerate your career",
                    color: "from-fuchsia-500 to-orange-500",
                  },
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative code snippet */}
              <div className="mt-8 bg-slate-950/50 rounded-xl p-4 border border-fuchsia-500/20 font-mono text-xs overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-fuchsia-400">
                  <span className="text-purple-400">import</span> {"{ future }"}{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-cyan-400">'techtinder'</span>;
                </div>
                <div className="text-slate-500">
                  // Your journey starts here
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Signup Form */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-purple-900/50 transform hover:scale-[1.02] transition-all duration-500">
              {/* Header */}
              <div className="mb-3 text-center">
                <h2 className="text-4xl font-black text-slate-900 mb-2">
                  Create Account 
                </h2>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={handleLinkedInLogin} className="group flex items-center justify-center gap-2 hover:bg-blue-600 border-2 hover:border-blue-600 rounded-md p-2 transition-all duration-300">
                  <Linkedin className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </button>

                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              {/* Divider */}
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-semibold">
                    OR SIGN UP WITH EMAIL
                  </span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold text-sm">
                        Signup Error
                      </p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* First Name & Last Name in a row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                    placeholder="developer@example.com"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                  >
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium cursor-pointer"
                    required
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Fullstack Developer">Full Stack Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Designer">UI/UX Designer</option>
                    <option value="Student">Student/Learning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 ml-1">
                    Password must contain: uppercase, lowercase, number, symbol,
                    and be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-slate-900 mb-1 uppercase tracking-wide"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 font-medium"
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      required
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      I agree to the{" "}
                      <a
                        href="http://localhost:5173/terms"
                        className="text-purple-600 hover:text-purple-700 font-bold underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="http://localhost:5173/privacypolicy"
                        className="text-purple-600 hover:text-purple-700 font-bold underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 hover:from-cyan-400 hover:via-purple-500 hover:to-fuchsia-500 text-white font-black py-1.5 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg uppercase tracking-wider"
                >
                  {isHovered ? "Join Now" : "Create Account"}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-4 text-center">
                <p className="text-slate-600 font-medium">
                  Already have an account?{" "}
                  <a
                    href="http://localhost:5173/login"
                    className="text-purple-600 hover:text-purple-700 font-bold underline decoration-2 underline-offset-4 hover:underline-offset-2 transition-all"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
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

export default Signup;
