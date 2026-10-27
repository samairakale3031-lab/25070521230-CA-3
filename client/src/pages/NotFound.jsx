import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { PlanetVisual } from '../components/PlanetVisual.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-lg text-center flex flex-col items-center">
        <PlanetVisual slug="uranus" size="lg" />
        <span className="tag-pill font-mono mt-6 mb-2">Error 404 • Lost in Deep Space</span>
        <h1 className="font-heading text-3xl font-extrabold text-white">Coordinate Not Found</h1>
        <p className="text-sm text-slate-300 mt-2 mb-8 leading-relaxed">
          The celestial coordinates you requested do not exist within our charted solar system.
        </p>
        <Link to="/" className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
          <Compass size={16} />
          <span>Return to Mission Control</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
