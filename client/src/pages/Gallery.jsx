import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nasaApi } from '../services/api.js';
import {
  Search,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  Building,
  Sparkles,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Mars Rover',
  'Saturn Rings',
  'James Webb Nebula',
  'Jupiter Storm',
  'Earth from Orbit',
  'Andromeda Galaxy',
  'Apollo Moon',
];

export const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Mars Rover';

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchNasaImages = (searchTopic) => {
    if (!searchTopic || !searchTopic.trim()) return;
    setLoading(true);
    setError(null);
    setActiveQuery(searchTopic);

    nasaApi
      .search(searchTopic)
      .then((res) => {
        if (res?.items) {
          setItems(res.items);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        setError(err.message || 'NASA image search is currently unavailable. Please try again.');
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNasaImages(initialQuery);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      fetchNasaImages(query.trim());
    }
  };

  const handleChipClick = (suggestion) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
    fetchNasaImages(suggestion);
  };

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="tag-pill font-mono">
              <ImageIcon size={13} />
              <span>Real NASA API Stream</span>
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white">
            Space Imagery Archive
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Browse genuine deep-space astrophotography and planetary exploration captures queried
            live from the official NASA Images and Video Library API.
          </p>
        </div>

        {/* Search Bar & Suggestions */}
        <div className="glass-panel p-6 rounded-2xl mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search spacecraft, nebulae, planets, galaxies..."
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <button type="submit" className="btn-primary py-3 px-6 text-sm">
              <span>Search NASA</span>
            </button>
          </form>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span className="text-xs text-slate-400 font-mono mr-1">Suggested Searches:</span>
            {SUGGESTED_QUERIES.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleChipClick(suggestion)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  activeQuery.toLowerCase() === suggestion.toLowerCase()
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
                style={{ cursor: 'pointer' }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Status Notification Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-300 font-mono">
            Showing results for <span className="text-cyan-400 font-bold">"{activeQuery}"</span>
            {!loading && items.length > 0 && ` (${items.length} records retrieved)`}
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <RefreshCw size={13} className="animate-spin text-cyan-400" />
              <span>Querying NASA servers...</span>
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden animate-pulse"
                style={{ height: '360px', background: 'rgba(15, 23, 42, 0.4)' }}
              >
                <div className="w-full h-48 bg-slate-800/60" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-3/4 h-5 bg-slate-700/50 rounded" />
                  <div className="w-1/2 h-3 bg-slate-700/30 rounded" />
                  <div className="w-full h-12 bg-slate-700/20 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="p-8 rounded-2xl text-center max-w-lg mx-auto glass-panel"
            style={{
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-white mb-2">NASA API Integration Notice</h3>
            <p className="text-sm text-slate-300 mb-6">{error}</p>
            <button onClick={() => fetchNasaImages(activeQuery)} className="btn-secondary text-xs">
              <RefreshCw size={13} />
              <span>Retry Search</span>
            </button>
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto p-8">
            <Sparkles size={36} className="text-slate-500 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-white">No NASA images found</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              We couldn't find matching media for "{activeQuery}". Try one of the suggested search queries.
            </p>
            <button onClick={() => handleChipClick('Mars Rover')} className="btn-secondary text-xs">
              Try "Mars Rover"
            </button>
          </div>
        )}

        {/* Image Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="glass-card rounded-2xl overflow-hidden flex flex-col cursor-pointer group transition-all duration-300"
                style={{ background: 'rgba(12, 19, 42, 0.65)' }}
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        'https://images-assets.nasa.gov/image/PIA14293/PIA14293~thumb.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-400/30">
                    {item.center}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                      <Calendar size={12} className="text-indigo-400" />
                      <span>{item.dateCreated}</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between text-xs text-cyan-400 font-semibold" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span>Inspect NASA Record</span>
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal for Expanded Image View */}
        {selectedImage && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="glass-panel rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#070c1d', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Close Preview"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <div className="rounded-2xl overflow-hidden bg-black mb-6 max-h-[420px] flex items-center justify-center">
                <img
                  src={selectedImage.thumbnailUrl}
                  alt={selectedImage.title}
                  className="max-h-[420px] w-auto object-contain mx-auto"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-indigo-400" />
                    <span>Created: {selectedImage.dateCreated}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Building size={13} className="text-cyan-400" />
                    <span>Center: {selectedImage.center}</span>
                  </span>
                  {selectedImage.nasaId && (
                    <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                      ID: {selectedImage.nasaId}
                    </span>
                  )}
                </div>

                <h2 className="font-heading text-2xl font-bold text-white">{selectedImage.title}</h2>

                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mt-2">
                  {selectedImage.description}
                </p>

                <div className="pt-6 mt-4 flex flex-wrap items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span className="text-xs text-slate-500 font-mono">
                    Direct stream from images-api.nasa.gov
                  </span>
                  <a
                    href={selectedImage.nasaAssetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs py-2 px-5"
                  >
                    <span>View Official NASA Asset</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
