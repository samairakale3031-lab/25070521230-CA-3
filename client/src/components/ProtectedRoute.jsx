import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <div
          className="rounded-full animate-spin flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#38bdf8',
          }}
        >
          <Sparkles size={20} className="text-cyan-400" />
        </div>
        <p className="text-sm font-mono text-slate-400">Verifying cosmic authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
