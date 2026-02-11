import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:1111/login",
        { email, password },
        { withCredentials: true },
      );

      if (res.status === 200) {
        const profileRes = await fetch("http://localhost:1111/profile/view", {
          credentials: "include",
        });
        const profileData = await profileRes.json();
        const user = profileData.data;

        const isComplete = !!(
          user?.age &&
          user?.gender &&
          user?.bio &&
          user.bio.length >= 20 &&
          user?.role &&
          user?.skills &&
          user.skills.length > 0
        );
        navigate(isComplete ? "/feed" : "/onboarding");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:1111/google-login",
        { credential: authResponse.credential },
        { withCredentials: true },
      );
      navigate("/feed");
    } catch (error) {
      setError("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google login was unsuccessful");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                &lt;/&gt;
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            </div>
            <p className="text-slate-400">Sign in to TechTinder</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            New to TechTinder?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
