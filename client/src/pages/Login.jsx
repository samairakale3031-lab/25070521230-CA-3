import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { quizApi } from '../services/api.js';
import { LogIn, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from || '/observatory';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login(formData.email.trim(), formData.password);

      // Check for pending quiz result to save automatically
      const pendingAnswers = sessionStorage.getItem('pending_quiz_answers');
      if (pendingAnswers) {
        try {
          const parsed = JSON.parse(pendingAnswers);
          await quizApi.submitAttempt(parsed);
          sessionStorage.removeItem('pending_quiz_answers');
          showToast('Your recent quiz result was saved to your Observatory!', 'success');
        } catch {
          // Non-blocking
        }
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative pt-28 pb-20 min-h-screen flex items-center justify-center">
      <div className="container max-w-md">
        <div
          className="glass-panel p-8 sm:p-10 rounded-3xl"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(12, 19, 42, 0.8)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-sm text-slate-300 mt-2">
              Sign in to access your saved celestial discoveries and quiz achievements.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl flex items-start gap-3"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-200 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="astronaut@orbit.org"
                autoComplete="email"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="input-field"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-3 flex items-center justify-center gap-2 text-sm"
            >
              <LogIn size={16} />
              <span>{submitting ? 'Verifying Authorization...' : 'Sign In to ORBIT'}</span>
            </button>
          </form>

          {/* Link to Register */}
          <div
            className="mt-6 pt-6 text-center text-xs text-slate-400"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <span>Don't have an observatory account? </span>
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
