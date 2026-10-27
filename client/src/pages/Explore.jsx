import React, { useEffect, useState, useMemo } from 'react';
import { PlanetCard } from '../components/PlanetCard.jsx';
import { planetsApi } from '../services/api.js';
import { Search, SlidersHorizontal, Orbit, Sparkles } from 'lucide-react';

export const Explore = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    planetsApi
      .getAll()
      .then((res) => {
        if (mounted && res?.planets) {
          setPlanets(res.planets);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load planets catalog from database.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlanets = useMemo(() => {
    return planets.filter((planet) => {
      const matchesSearch =
        planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planet.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || planet.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [planets, searchQuery, selectedType]);

  const categories = ['All', 'Terrestrial Planet', 'Gas Giant', 'Ice Giant'];

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      <div className="container">
        {/* Header Title Section */}
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="tag-pill font-mono">
              <Orbit size={13} />
              <span>Solar System Catalog</span>
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white">
            Planetary Worlds
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Discover the eight recognized celestial bodies orbiting our Sun, loaded directly from MongoDB
            with accurate astronomical telemetry, physical profiles, and exploration archives.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        >
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search planet name, classification, or features..."
              className="input-field"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline mr-1">Classification:</span>
            {categories.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="text-xs px-3 py-2 rounded-lg font-medium transition-all"
                style={{
                  background:
                    selectedType === type ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedType === type ? '#ffffff' : '#94a3b8',
                  border:
                    selectedType === type
                      ? '1px solid rgba(99, 102, 241, 0.6)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                }}
              >
                {type === 'All' ? 'All Worlds (8)' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="glass-card p-6 rounded-2xl animate-pulse"
                style={{ height: '420px', background: 'rgba(15, 23, 42, 0.4)' }}
              >
                <div className="w-20 h-5 bg-slate-700/50 rounded-full mb-6" />
                <div className="w-32 h-32 bg-slate-700/40 rounded-full mx-auto my-6" />
                <div className="w-3/4 h-6 bg-slate-700/50 rounded mb-2" />
                <div className="w-full h-12 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="p-8 rounded-2xl text-center max-w-lg mx-auto"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <p className="text-red-400 font-semibold mb-2">Error Connecting to Database</p>
            <p className="text-sm text-slate-300">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <>
            {filteredPlanets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlanets.map((planet) => (
                  <PlanetCard key={planet.slug} planet={planet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto p-8">
                <Sparkles size={36} className="text-slate-500 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-white">No celestial worlds found</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">
                  No planets matched your filter "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All');
                  }}
                  className="btn-secondary text-xs"
                >
                  Reset Catalog Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
