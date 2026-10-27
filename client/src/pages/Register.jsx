import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { quizApi } from '../services/api.js';
import { UserPlus, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { displayName, email, password, confirmPassword } = formData;

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await register(displayName.trim(), email.trim(), password, confirmPassword);

      // Check if user has an unfinished or guest quiz to save
      const pendingAnswers = sessionStorage.getItem('pending_quiz_answers');
      if (pendingAnswers) {
        try {
          const parsed = JSON.parse(pendingAnswers);
          await quizApi.submitAttempt(parsed);
          sessionStorage.removeItem('pending_quiz_answers');
          showToast('Your previous quiz attempt was saved to your new Observatory!', 'success');
        } catch {
          // Non-blocking
        }
      }

      navigate('/observatory', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #38bdf8 100%)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-white">Initialize Account</h1>
            <p className="text-sm text-slate-300 mt-2">
              Create your explorer profile to archive favorite planets and log celestial assessments.
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
                Explorer Name (Display Name)
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Commander Shepard"
                autoComplete="name"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cadet@orbit.org"
                autoComplete="email"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-3 flex items-center justify-center gap-2 text-sm"
            >
              <UserPlus size={16} />
              <span>{submitting ? 'Creating Profile...' : 'Launch Exploration Profile'}</span>
            </button>
          </form>

          {/* Link to Login */}
          <div
            className="mt-6 pt-6 text-center text-xs text-slate-400"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <span>Already have an account? </span>
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
