import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    warning: <AlertTriangle size={18} className="text-amber-400" />,
    info: <Info size={18} className="text-cyan-400" />,
  };

  const borders = {
    success: 'rgba(52, 211, 153, 0.4)',
    error: 'rgba(248, 113, 113, 0.4)',
    warning: 'rgba(251, 191, 36, 0.4)',
    info: 'rgba(56, 189, 248, 0.4)',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-float"
      style={{
        background: 'rgba(10, 16, 35, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${borders[type] || borders.info}`,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(99, 102, 241, 0.2)',
        maxWidth: '380px',
      }}
    >
      {icons[type] || icons.info}
      <span className="text-sm font-medium text-slate-100">{message}</span>
    </div>
  );
};

export default Toast;
