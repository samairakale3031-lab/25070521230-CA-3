import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanetVisual } from './PlanetVisual.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Heart, ArrowRight, Orbit } from 'lucide-react';

export const PlanetCard = ({ planet }) => {
  const { isPlanetSaved, toggleSavePlanet, isAuthenticated } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  const navigate = useNavigate();

  const saved = isPlanetSaved(planet.slug);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/explore/${planet.slug}` } });
      return;
    }

    try {
      setIsToggling(true);
      await toggleSavePlanet(planet.slug, planet.name);
    } catch {
      // Toast handles error display
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article
      className="glass-card flex flex-col justify-between p-6 relative overflow-hidden group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '1.25rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(12, 19, 40, 0.65)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Top Header: Order pill & Favorite button */}
      <div className="flex items-center justify-between w-full mb-4">
        <span className="tag-pill font-mono">
          <Orbit size={13} />
          <span>#{planet.orderFromSun} From Sun</span>
        </span>

        <button
          onClick={handleFavoriteClick}
          disabled={isToggling}
          aria-label={saved ? `Remove ${planet.name} from saved` : `Save ${planet.name} to Observatory`}
          className="p-2 rounded-full transition-all"
          style={{
            background: saved ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.06)',
            border: saved ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            color: saved ? '#ef4444' : '#94a3b8',
          }}
          title={saved ? 'Remove from Observatory' : 'Save to Observatory'}
        >
          <Heart size={16} fill={saved ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Visual Planet Representation */}
      <div className="flex items-center justify-center py-4 my-2 group-hover:scale-105 transition-transform duration-300">
        <PlanetVisual slug={planet.slug} size="lg" animate={false} />
      </div>

      {/* Body Content */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-baseline justify-between">
          <h3 className="font-heading text-2xl font-bold text-white tracking-tight">{planet.name}</h3>
          <span className="text-xs font-mono text-cyan-400">{planet.type}</span>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed" style={{ minHeight: '36px' }}>
          {planet.description}
        </p>

        {/* Fact snippet */}
        <div
          className="mt-3 p-3 rounded-xl flex flex-col gap-1 text-xs"
          style={{
            background: 'rgba(2, 6, 23, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex justify-between text-slate-400">
            <span>Diameter:</span>
            <span className="font-mono text-slate-200">{planet.diameterKm.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Year / Orbit:</span>
            <span className="font-mono text-slate-200">{planet.orbitalPeriod}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Link
          to={`/explore/${planet.slug}`}
          className="btn-secondary w-full text-center text-sm py-2 flex items-center justify-center gap-2 group-hover:bg-white/10"
          style={{ textDecoration: 'none' }}
        >
          <span>Explore Planet</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default PlanetCard;
