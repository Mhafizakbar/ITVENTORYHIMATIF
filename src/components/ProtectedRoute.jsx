import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin, isLoggedIn } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#096b68] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  // If admin access required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
