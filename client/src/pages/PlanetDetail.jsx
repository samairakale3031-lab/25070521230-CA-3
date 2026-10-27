import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planetsApi } from '../services/api.js';
import { PlanetVisual } from '../components/PlanetVisual.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Orbit,
  Sparkles,
  Thermometer,
  Compass,
  Clock,
  CircleDot,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export const PlanetDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isPlanetSaved, toggleSavePlanet, isAuthenticated } = useAuth();

  const [planet, setPlanet] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    planetsApi
      .getBySlug(slug)
      .then((res) => {
        if (mounted && res?.planet) {
          setPlanet(res.planet);
          setNavigation(res.navigation);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Planet not found in database.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin"
          />
          <p className="text-sm font-mono text-slate-400">Retrieving planetary telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !planet) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
          <p className="text-red-400 font-bold mb-2">Navigation Error</p>
          <p className="text-sm text-slate-300 mb-6">{error || 'Planet could not be found.'}</p>
          <Link to="/explore" className="btn-primary text-sm py-2 px-6">
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isPlanetSaved(planet.slug);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/explore/${planet.slug}` } });
      return;
    }

    try {
      setIsToggling(true);
      await toggleSavePlanet(planet.slug, planet.name);
    } catch {
      // Toast notifies user
    } finally {
      setIsToggling(false);
    }
  };

  const telemetryMetrics = [
    {
      label: 'Equatorial Diameter',
      value: `${planet.diameterKm.toLocaleString()} km`,
      approx: false,
      icon: CircleDot,
    },
    {
      label: 'Distance from Sun',
      value: `~${(planet.distanceFromSunKm / 1000000).toFixed(1)} million km`,
      approx: true,
      icon: Orbit,
    },
    {
      label: 'Orbital Period (Year)',
      value: planet.orbitalPeriod,
      approx: true,
      icon: Clock,
    },
    {
      label: 'Rotational Period (Day)',
      value: planet.rotationPeriod,
      approx: true,
      icon: Compass,
    },
    {
      label: 'Surface Gravity',
      value: planet.surfaceGravity || 'Approximate',
      approx: true,
      icon: Compass,
    },
    {
      label: 'Temperature Range',
      value: planet.temperatureRange || 'Approximate',
      approx: true,
      icon: Thermometer,
    },
    {
      label: 'Confirmed Moons',
      value: `${planet.moonCount} ${planet.moonCount === 1 ? 'Moon' : 'Moons'}`,
      approx: false,
      icon: Sparkles,
    },
  ];

  return (
    <div className="relative pt-24 pb-20 min-h-screen">
      <div className="container">
        {/* Back and Breadcrumb Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/explore"
            className="btn-ghost flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>Back to Planets Catalog</span>
          </Link>

          {/* Sequential Planet Navigation */}
          {navigation && (
            <div className="flex items-center gap-2">
              <Link
                to={`/explore/${navigation.previous.slug}`}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                title={`Previous: ${navigation.previous.name}`}
              >
                <ArrowLeft size={13} />
                <span className="hidden sm:inline">{navigation.previous.name}</span>
              </Link>
              <Link
                to={`/explore/${navigation.next.slug}`}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                title={`Next: ${navigation.next.name}`}
              >
                <span className="hidden sm:inline">{navigation.next.name}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Planet Showcase Hero Card */}
        <div
          className="glass-panel rounded-3xl p-8 sm:p-12 mb-12 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative overflow-hidden"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'radial-gradient(circle at 75% 50%, rgba(30, 27, 75, 0.4) 0%, rgba(10, 16, 35, 0.8) 100%)',
          }}
        >
          {/* Left Details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="tag-pill font-mono">#{planet.orderFromSun} From Sun</span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{planet.type}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              {planet.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {planet.overview || planet.description}
            </p>

            {/* Actions: Save/Unsave and Gallery Link */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleToggleSave}
                disabled={isToggling}
                className={`btn-primary flex items-center gap-2 text-sm py-3 px-6 ${
                  isSaved ? 'opacity-90' : ''
                }`}
                style={{
                  background: isSaved
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                    : undefined,
                }}
              >
                <Heart size={18} fill={isSaved ? '#ffffff' : 'none'} />
                <span>{isSaved ? 'Saved in Observatory' : 'Save to Observatory'}</span>
              </button>

              <Link
                to={`/gallery?q=${encodeURIComponent(planet.name)}`}
                className="btn-secondary flex items-center gap-2 text-sm py-3 px-6"
              >
                <ImageIcon size={18} className="text-cyan-400" />
                <span>Search NASA Imagery</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Representation */}
          <div className="flex items-center justify-center p-6">
            <PlanetVisual slug={planet.slug} size="xl" />
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Compass size={20} className="text-cyan-400" />
            <h2 className="font-heading text-2xl font-bold text-white">Scientific Telemetry</h2>
            <span className="text-xs text-slate-400 font-mono ml-2">(Approximate planetary metrics)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {telemetryMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-5 rounded-2xl flex flex-col justify-between"
                  style={{ background: 'rgba(12, 19, 42, 0.55)' }}
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs">{metric.label}</span>
                    <Icon size={15} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="font-mono text-lg font-bold text-white block">{metric.value}</span>
                    {metric.approx && (
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        Approximate datum
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Curated Facts & Atmosphere Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Key Facts Col (2 cols wide) */}
          <div className="md:col-span-2 glass-card p-8 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-cyan-400" />
              <h3 className="font-heading text-xl font-bold text-white">Notable Astronomical Facts</h3>
            </div>

            <div className="flex flex-col gap-4">
              {planet.facts?.map((fact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(2, 6, 23, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-200 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Atmosphere & Moons Col (1 col wide) */}
          <div className="flex flex-col gap-6">
            {/* Atmosphere */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="font-heading text-lg font-bold text-white mb-3">Atmospheric Chemistry</h4>
              {planet.atmosphere && planet.atmosphere.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {planet.atmosphere.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg font-mono text-slate-300"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No substantive atmospheric layer detected.</p>
              )}
            </div>

            {/* Notable Moons */}
            <div className="glass-card p-6 rounded-2xl">
              <h4 className="font-heading text-lg font-bold text-white mb-3">
                Notable Moons ({planet.moonCount})
              </h4>
              {planet.notableMoons && planet.notableMoons.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {planet.notableMoons.map((moon, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg font-mono text-slate-300"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      {moon}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {planet.name} has no natural moons orbiting its gravity well.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetDetail;
