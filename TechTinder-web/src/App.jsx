import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

import LandingPage from "./Pages/LandingPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import Feed from "./Pages/Feed";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProfileOnboarding from "./Pages/ProfileOnboarding";
import ProfilePage from "./Pages/ProfilePage";

import "./App.css";

//Check if profile is complete or not
const isProfileComplete = (user) => {
  return !!(
    user?.age &&
    user?.gender &&
    user?.bio &&
    user.bio.length >= 20 &&
    user?.role &&
    user?.skills &&
    user.skills.length > 0
  );
};

const AuthGate = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check if token exists in cookies by making a request
        const response = await fetch("http://localhost:1111/profile/view", {
          method: "GET",
          credentials: "include", //yeh cookie bhejega request ke sath
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!isMounted) return;

        if (response.ok) {
          try {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data.data);
          } catch (err) {
            console.error("Auth check: failed to parse JSON", err);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.warn("Auth check: non-OK response", response.status);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        if (!isMounted) return;
        console.log("Auth check failed: ", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-2xl">&lt;/&gt;</span>
          </div>
          <p className="text-slate-600 font-bold tracking-widest uppercase text-xs animate-pulse">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const profileComplete = isProfileComplete(user);

    //replace - it'll not allow to go back to last page that we were on

    if (["/", "/signup", "/login"].includes(location.pathname)) {
      return (
        <Navigate to={profileComplete ? "/feed" : "/onboarding"} replace />
      );
    }

    if (location.pathname === "/feed" && !profileComplete) {
      return <Navigate to="/onboarding" replace />;
    }

    if (location.pathname === "/onboarding" && profileComplete) {
      return <Navigate to="/feed" replace />;
    }
  }
  return children;
};

function onboarding() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:1111/profile/view", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.log("Profile fetched failed: ", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleComplete = (updateUser) => {
    navigate("/feed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-2xl">&lt;/&gt;</span>
          </div>
          <p className="text-slate-600 font-bold tracking-widest uppercase text-xs animate-pulse">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  <ProfileOnboarding user={user} onComplete={handleComplete} />;
}

function HomePage() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await fetch("http://localhost:1111/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout failed: ", err);
    }
    navigate("/login");
  };

  return <Feed onLogout={handleLogOut} />;
}

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <AuthGate>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected: Onboarding (must be logged in, profile incomplete) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <ProfileOnboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected: Home (must be logged in, profile complete) */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthGate>
      </BrowserRouter>
    </>
  );
}

export default App;
