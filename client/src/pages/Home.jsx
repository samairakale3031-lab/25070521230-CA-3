import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroPlanetScene } from '../components/HeroPlanetScene.jsx';
import { PlanetVisual } from '../components/PlanetVisual.jsx';
import { planetsApi } from '../services/api.js';
import {
  Compass,
  Image as ImageIcon,
  HelpCircle,
  Bookmark,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layers,
  Globe,
  Radio,
} from 'lucide-react';

export const Home = () => {
  const [featuredPlanets, setFeaturedPlanets] = useState([]);

  useEffect(() => {
    planetsApi
      .getAll()
      .then((res) => {
        if (res?.planets) {
          // Feature 4 visually distinct worlds: Earth, Mars, Jupiter, Saturn
          const featured = res.planets.filter((p) =>
            ['earth', 'mars', 'jupiter', 'saturn'].includes(p.slug)
          );
          setFeaturedPlanets(featured);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden pt-20">
      {/* 1. CINEMATIC LANDING HERO */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center py-12"
        style={{ minHeight: 'calc(100vh - 72px)' }}
      >
        <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Column: Headlines & CTAs */}
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wider text-cyan-300 uppercase">
                Interactive Space Guide
              </span>
            </div>

            <h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Your universe <br />
              <span className="gradient-text">awaits.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Embark on a cinematic voyage through our Solar System. Uncover planetary
              mysteries, stream authentic NASA deep-space imagery, test your cosmic intellect,
              and record your voyage in a personalized observatory.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link to="/explore" className="btn-primary text-base py-3 px-8">
                <span>Explore the Universe</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/quiz" className="btn-secondary text-base py-3 px-6">
                <HelpCircle size={18} className="text-cyan-400" />
                <span>Cosmic Quiz</span>
              </Link>
            </div>

            {/* Quick Telemetry Counter Pills */}
            <div
              className="flex flex-wrap items-center gap-6 pt-6 mt-4 w-full"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-white block">8</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Planetary Worlds</span>
              </div>
              <div className="hidden sm:block" style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-cyan-400 block">100%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Live NASA Imagery</span>
              </div>
              <div className="hidden sm:block" style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-indigo-400 block">Personal</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Observatory Log</span>
              </div>
            </div>
          </div>

          {/* Right Column: Central Hero Planetary Scene */}
          <div className="flex items-center justify-center relative w-full">
            <HeroPlanetScene />
          </div>
        </div>

        {/* Subtle Scroll Cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 pointer-events-none">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Scroll to Venture</span>
          <ChevronDown size={18} className="animate-bounce text-cyan-400" />
        </div>
      </section>

      {/* 2. FEATURED WORLDS PREVIEW */}
      <section className="py-20 relative z-10" style={{ background: 'rgba(5, 9, 24, 0.5)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="tag-pill mb-2 font-mono">Planetary Showcase</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
                Marvels of the Solar System
              </h2>
            </div>
            <Link
              to="/explore"
              className="btn-ghost flex items-center gap-2 text-cyan-400 hover:text-white"
            >
              <span>View all eight planets</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlanets.map((planet) => (
              <div
                key={planet.slug}
                className="glass-card p-6 flex flex-col items-center text-center group"
              >
                <div className="py-4 my-2 group-hover:scale-110 transition-transform duration-300">
                  <PlanetVisual slug={planet.slug} size="md" animate={false} />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mt-2">{planet.name}</h3>
                <span className="text-xs font-mono text-cyan-400 mb-2">{planet.type}</span>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {planet.description}
                </p>
                <Link
                  to={`/explore/${planet.slug}`}
                  className="btn-secondary w-full text-xs py-2 mt-auto"
                >
                  Inspect Telemetry
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS & FEATURES HIGHLIGHT */}
      <section className="py-24 relative z-10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="tag-pill font-mono mb-3">Architectural Pillars</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2">
              Engineered for True Space Enthusiasts
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Explore scientific planetary datasets, browse genuine NASA imagery in real time,
              and maintain your personalized cosmic research record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="glass-card p-8 flex flex-col gap-4">
              <div
                className="flex items-center justify-center rounded-2xl w-12 h-12 text-cyan-400"
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <Compass size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Curated Planet Catalog</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Detailed telemetry for all eight recognized planets: diameter, orbital metrics,
                rotational periods, atmospheric chemistry, and notable moons stored in MongoDB.
              </p>
              <Link to="/explore" className="text-xs font-semibold text-cyan-400 hover:underline mt-auto flex items-center gap-1">
                <span>Discover planetary bodies</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="glass-card p-8 flex flex-col gap-4">
              <div
                className="flex items-center justify-center rounded-2xl w-12 h-12 text-indigo-400"
                style={{
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <ImageIcon size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Live NASA Image Proxy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Search directly through the NASA Images and Video Library API with backend caching,
                rate-limit protection, and instant access to actual spacecraft imagery.
              </p>
              <Link to="/gallery" className="text-xs font-semibold text-indigo-400 hover:underline mt-auto flex items-center gap-1">
                <span>Browse NASA archives</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="glass-card p-8 flex flex-col gap-4">
              <div
                className="flex items-center justify-center rounded-2xl w-12 h-12 text-purple-400"
                style={{
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                }}
              >
                <Bookmark size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Personal Observatory</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Sign in to save favorite worlds, track your astronomical quiz performance, and
                review calculated knowledge scores backed by genuine database persistence.
              </p>
              <Link to="/observatory" className="text-xs font-semibold text-purple-400 hover:underline mt-auto flex items-center gap-1">
                <span>Access your dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div
            className="rounded-3xl p-8 sm:p-14 relative overflow-hidden text-center flex flex-col items-center gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.3)',
            }}
          >
            <span className="tag-pill font-mono">Begin Your Expedition</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white max-w-2xl">
              Ready to transcend the boundaries of Earth?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Join students and stargazers exploring the celestial bodies that define our cosmic home.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/register" className="btn-primary text-base py-3 px-8">
                <span>Create Free Observatory</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/quiz" className="btn-secondary text-base py-3 px-6">
                <span>Take Cosmic Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
