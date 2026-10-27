import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Compass,
  Image as ImageIcon,
  HelpCircle,
  Info,
  Bookmark,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/gallery', label: 'Space Gallery', icon: ImageIcon },
    { to: '/quiz', label: 'Cosmic Quiz', icon: HelpCircle },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(3, 7, 18, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: '72px' }}>
        {/* Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white"
          style={{ textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className="font-heading font-extrabold tracking-wider text-xl text-white"
              style={{ letterSpacing: '0.12em' }}
            >
              ORBIT
            </span>
            <span className="text-xs text-slate-400 -mt-1 tracking-widest uppercase" style={{ fontSize: '0.65rem' }}>
              Universe Guide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav items-center gap-1">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `btn-ghost flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'text-cyan-400 bg-white/10 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    boxShadow: isActive ? 'inset 0 0 12px rgba(56, 189, 248, 0.15)' : 'none',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  })}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Auth CTA Area */}
        <div className="desktop-nav items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/observatory"
                className="btn-secondary text-sm py-2 px-4"
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  color: '#e0e7ff',
                }}
              >
                <Bookmark size={15} className="text-indigo-400" />
                <span>My Observatory</span>
              </Link>

              <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div
                  className="flex items-center justify-center rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/50"
                  style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                  title={user?.email}
                >
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={16} />}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost p-2 text-slate-400 hover:text-red-400"
                  title="Sign Out"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-4">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Launch Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle p-2 text-slate-300 hover:text-white"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="p-6 flex flex-col gap-4"
          style={{
            background: '#070c1d',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-slate-200"
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#38bdf8' : '#e2e8f0',
                    textDecoration: 'none',
                  })}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/observatory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  <Bookmark size={16} />
                  <span>My Observatory</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary w-full text-center mt-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out ({user?.displayName})</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Launch Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
