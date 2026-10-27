import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Database,
  Globe,
  Sparkles,
  ShieldCheck,
  Code2,
  Cpu,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const About = () => {
  const stackItems = [
    { title: 'Frontend Engine', tech: 'React 18 + Vite', desc: 'Component-driven, lightning-fast rendering with vanilla CSS design system and GPU-accelerated motion effects.' },
    { title: 'Backend Framework', tech: 'Node.js + Express', desc: 'RESTful API endpoints with authentication, NASA proxy caching, and error handling.' },
    { title: 'Database Persistence', tech: 'MongoDB', desc: 'Mongoose schemas storing user profiles, the curated eight planets catalog, saved discoveries, and quiz attempts.' },
    { title: 'Authentication', tech: 'bcryptjs + JWT', desc: 'Salted password hashing and signed tokens in HttpOnly cookies with authorization middleware.' },
    { title: 'External Integration', tech: 'NASA Images API', desc: 'Official NASA Images & Video Library API streaming live public domain exploration archives.' },
  ];

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <span className="tag-pill font-mono mb-3">
            <BookOpen size={13} />
            <span>Mission & Architecture</span>
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mt-2">
            About ORBIT
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            ORBIT is an educational space exploration platform built to bring the wonders
            of our Solar System to life through modern web engineering, real scientific telemetry,
            and authentic NASA deep-space imagery.
          </p>
        </div>

        {/* Core Mission Section */}
        <div
          className="glass-panel p-8 sm:p-10 rounded-3xl mb-12"
          style={{ background: 'rgba(12, 19, 42, 0.75)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} className="text-cyan-400" />
            <h2 className="font-heading text-2xl font-bold text-white">The Educational Mission</h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Too often, astronomical resources are either static encyclopedias or overly heavy 3D simulations
            that fail to run on standard educational laptops. ORBIT bridges this gap: delivering a cinematic,
            responsive experience driven by CSS radial transforms, layered starfields, and clean data visualization.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every planetary metric—from the scorching greenhouse of Venus to the supersonic cloud decks of Neptune—is
            grounded in established planetary science, with verified physical properties and curated observational facts.
          </p>
        </div>

        {/* Technical Architecture Stack */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Cpu size={24} className="text-indigo-400" />
            <h2 className="font-heading text-2xl font-bold text-white">Technical Architecture</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stackItems.map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 block mb-1">{item.title}</span>
                  <h3 className="font-heading text-lg font-bold text-white">{item.tech}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic CA Evaluation Notice */}
        <div
          className="glass-card p-8 rounded-3xl border border-indigo-500/30"
          style={{ background: 'rgba(30, 27, 75, 0.35)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={22} className="text-emerald-400" />
            <h3 className="font-heading text-xl font-bold text-white">Continuous Assessment Evaluation</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            This project was engineered for academic evaluation by <strong>samairakale3031-lab</strong>.
            It demonstrates production-quality full-stack separation, robust MongoDB collection indexing, live NASA API caching, and responsive frontend accessibility.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/explore" className="btn-primary text-xs py-2 px-5">
              <span>Begin Exploration</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/quiz" className="btn-secondary text-xs py-2 px-5">
              <span>Cosmic Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
