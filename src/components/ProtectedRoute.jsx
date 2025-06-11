import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin, isLoggedIn } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/fixbg.jpg)', backgroundAttachment: 'fixed' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/90 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/30">
          <div className="w-16 h-16 border-4 border-[#096B68] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Memuat Aplikasi</h3>
          <p className="text-slate-600">Memeriksa status autentikasi...</p>
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
