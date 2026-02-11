import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by calling your backend
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:1111/profile/view', {
          method: 'GET',
          credentials: 'include', // Important: sends cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
