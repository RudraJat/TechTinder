 
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Body from "./Components/Body";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import OAuthSuccess from "./Components/LinkedInOauth";
import LandingPage from "./Pages/LandingPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import TechTinderHome from "./Pages/TechTinderHome";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";

const AuthGate = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:1111/profile/view", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!isMounted) return;
        setIsAuthenticated(response.ok);
      } catch (error) {
        if (!isMounted) return;
        console.error("Auth check failed:", error);
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
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && location.pathname !== "/home") {
    return <Navigate to="/home" replace />;
  }

  return children;
};


function App() {
  
  return (
    <>
      <BrowserRouter basename="/">
        <AuthGate>
          <Routes>
              <Route path='/' element={<LandingPage/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/oauth-success' element={<OAuthSuccess/>} />
              <Route path='/privacypolicy' element={<PrivacyPolicy/>} />
              <Route path='/terms' element={<TermsOfService/>} />
              <Route 
                path='/home' 
                element={
                  <ProtectedRoute>
                    <TechTinderHome />
                  </ProtectedRoute>
                } 
              />
          </Routes>
        </AuthGate>
      </BrowserRouter>


      
    </>
  );
}

export default App;
