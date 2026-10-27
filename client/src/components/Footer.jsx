import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { healthApi } from '../services/api.js';
import { Sparkles, Globe, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const [systemOnline, setSystemOnline] = useState(null);

  useEffect(() => {
    let mounted = true;
    healthApi
      .check()
      .then((res) => {
        if (mounted) setSystemOnline(res?.database?.connected === true);
      })
      .catch(() => {
        if (mounted) setSystemOnline(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer
      className="relative z-10 mt-20"
      style={{
        background: 'rgba(2, 6, 23, 0.92)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: '30px',
                  height: '30px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-wider text-white">ORBIT</span>
            </div>
            <p className="text-sm text-slate-400" style={{ maxWidth: '280px' }}>
              A cinematic full-stack space exploration platform built to celebrate the wonders of our Solar System.
            </p>
            {/* Live System Status Pill */}
            <div className="flex items-center gap-2 mt-2">
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: systemOnline === true ? '#10b981' : systemOnline === false ? '#ef4444' : '#f59e0b',
                  boxShadow:
                    systemOnline === true
                      ? '0 0 8px #10b981'
                      : systemOnline === false
                      ? '0 0 8px #ef4444'
                      : '0 0 8px #f59e0b',
                }}
              />
              <span className="text-xs text-slate-400 font-mono">
                {systemOnline === true
                  ? 'API & MongoDB Online'
                  : systemOnline === false
                  ? 'Database Reconnecting'
                  : 'Verifying Telemetry...'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-mono">Exploration</h4>
            <Link to="/explore" className="text-sm text-slate-300 hover:text-cyan-400" style={{ textDecoration: 'none' }}>
              Eight Planets Catalog
            </Link>
            <Link to="/gallery" className="text-sm text-slate-300 hover:text-cyan-400" style={{ textDecoration: 'none' }}>
              NASA Space Imagery
            </Link>
            <Link to="/quiz" className="text-sm text-slate-300 hover:text-cyan-400" style={{ textDecoration: 'none' }}>
              Cosmic Knowledge Quiz
            </Link>
            <Link to="/observatory" className="text-sm text-slate-300 hover:text-cyan-400" style={{ textDecoration: 'none' }}>
              Personal Observatory
            </Link>
          </div>

          {/* Sources & APIs */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-mono">Data & Imagery</h4>
            <a
              href="https://images.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-300 hover:text-cyan-400 flex items-center gap-1"
              style={{ textDecoration: 'none' }}
            >
              <Globe size={14} />
              <span>NASA Image Library API</span>
            </a>
            <a
              href="https://science.nasa.gov/solar-system/planets/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-300 hover:text-cyan-400 flex items-center gap-1"
              style={{ textDecoration: 'none' }}
            >
              <ShieldCheck size={14} />
              <span>NASA Planetary Science</span>
            </a>
            <Link to="/about" className="text-sm text-slate-300 hover:text-cyan-400" style={{ textDecoration: 'none' }}>
              Project Methodology
            </Link>
          </div>

          {/* Academic Submission */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-2 font-mono">Evaluation Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developed by <strong className="text-slate-200">samairakale3031-lab</strong> for College Continuous Assessment (CA).
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Stack: React • Vite • Node.js • Express • MongoDB • JWT
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <span>&copy; {new Date().getFullYear()} ORBIT — Explore the Universe. All planetary data curated for education.</span>
          <span className="flex items-center gap-1">
            Engineered with <Heart size={12} className="text-red-400" fill="#f87171" /> for space enthusiasts
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
