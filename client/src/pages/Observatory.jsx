import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { savedDiscoveriesApi, quizApi } from '../services/api.js';
import { PlanetVisual } from '../components/PlanetVisual.jsx';
import {
  Bookmark,
  Trophy,
  Trash2,
  Compass,
  HelpCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Orbit,
  ArrowRight,
} from 'lucide-react';

export const Observatory = () => {
  const { user, toggleSavePlanet, showToast } = useAuth();

  const [savedDiscoveries, setSavedDiscoveries] = useState([]);
  const [quizHistory, setQuizHistory] = useState({
    totalAttempts: 0,
    bestScore: null,
    bestPercentage: null,
    recentAttempts: [],
  });
  const [loading, setLoading] = useState(true);
  const [removingSlug, setRemovingSlug] = useState(null);

  const fetchObservatoryData = async () => {
    setLoading(true);
    try {
      const [savedRes, quizRes] = await Promise.all([
        savedDiscoveriesApi.getAll().catch(() => ({ savedDiscoveries: [] })),
        quizApi.getHistory().catch(() => ({
          totalAttempts: 0,
          bestScore: null,
          bestPercentage: null,
          recentAttempts: [],
        })),
      ]);

      if (savedRes?.savedDiscoveries) {
        setSavedDiscoveries(savedRes.savedDiscoveries);
      }
      if (quizRes) {
        setQuizHistory({
          totalAttempts: quizRes.totalAttempts || 0,
          bestScore: quizRes.bestScore,
          bestPercentage: quizRes.bestPercentage,
          recentAttempts: quizRes.recentAttempts || [],
        });
      }
    } catch {
      showToast('Error syncing Observatory records with MongoDB.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservatoryData();
  }, []);

  const handleRemovePlanet = async (planetSlug, planetName) => {
    try {
      setRemovingSlug(planetSlug);
      await toggleSavePlanet(planetSlug, planetName);
      setSavedDiscoveries((prev) => prev.filter((item) => item.planetSlug !== planetSlug));
    } catch {
      // Toast already informs user
    } finally {
      setRemovingSlug(null);
    }
  };

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      <div className="container">
        {/* Welcome Header */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl mb-10 relative overflow-hidden" style={{ background: 'rgba(12, 19, 42, 0.75)' }}>
          <div className="max-w-2xl relative z-10">
            <span className="tag-pill font-mono mb-3">
              <Sparkles size={13} />
              <span>Personal Cosmic Station</span>
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white mt-2">
              {user?.displayName?.toLowerCase().startsWith('commander') ? user.displayName : `Commander ${user?.displayName}`}'s Observatory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Your personalized telemetry archive stored in MongoDB. Inspect saved planetary bodies,
              track cosmic quiz assessments, and review scientific achievements.
            </p>
          </div>
        </div>

        {/* Real Statistics Telemetry Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Stat 1 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
              }}
            >
              <Bookmark size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Saved Discoveries</span>
              <span className="font-heading text-3xl font-extrabold text-white my-0.5">
                {savedDiscoveries.length}
              </span>
              <span className="text-[11px] text-slate-500 block">Planetary bodies bookmarked</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
              }}
            >
              <HelpCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Assessments Taken</span>
              <span className="font-heading text-3xl font-extrabold text-white my-0.5">
                {quizHistory.totalAttempts}
              </span>
              <span className="text-[11px] text-slate-500 block">Recorded quiz submissions</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34d399',
              }}
            >
              <Trophy size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-0.5">Top Quiz Score</span>
              <span className="font-heading text-3xl font-extrabold text-emerald-400 my-0.5">
                {quizHistory.bestScore !== null ? `${quizHistory.bestScore}/10` : 'None yet'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {quizHistory.bestPercentage !== null ? `${quizHistory.bestPercentage}% accuracy` : 'Take quiz to qualify'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: SAVED PLANETS */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Orbit size={20} className="text-cyan-400" />
              <h2 className="font-heading text-2xl font-bold text-white">Archived Worlds</h2>
              <span className="text-xs font-mono text-slate-400">({savedDiscoveries.length} Planets)</span>
            </div>

            <Link to="/explore" className="btn-ghost text-xs text-cyan-400 flex items-center gap-1">
              <span>Browse Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {savedDiscoveries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDiscoveries.map((item) => {
                const planet = item.planet;
                if (!planet) return null;

                return (
                  <div
                    key={item._id}
                    className="glass-card p-6 rounded-2xl flex flex-col justify-between relative group"
                    style={{ background: 'rgba(12, 19, 42, 0.65)' }}
                  >
                    <div>
                      {/* Top Action */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="tag-pill font-mono text-xs">#{planet.orderFromSun} From Sun</span>

                        <button
                          onClick={() => handleRemovePlanet(planet.slug, planet.name)}
                          disabled={removingSlug === planet.slug}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove from Observatory"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Planet Visual */}
                      <div className="flex items-center justify-center my-3 group-hover:scale-105 transition-transform">
                        <PlanetVisual slug={planet.slug} size="md" animate={false} />
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white mt-2">{planet.name}</h3>
                      <span className="text-xs font-mono text-cyan-400 block mb-2">{planet.type}</span>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                        {planet.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <Link
                        to={`/explore/${planet.slug}`}
                        className="btn-secondary w-full text-xs py-2 text-center flex items-center justify-center gap-1"
                      >
                        <span>Open Telemetry File</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl text-center max-w-md mx-auto">
              <Bookmark size={36} className="text-slate-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white">No saved planets yet</h3>
              <p className="text-sm text-slate-400 mt-2 mb-6">
                Bookmark worlds while exploring the planetary catalog to assemble your custom study list.
              </p>
              <Link to="/explore" className="btn-primary text-xs py-2.5 px-6">
                <span>Explore Eight Planets</span>
              </Link>
            </div>
          )}
        </section>

        {/* SECTION 2: RECENT QUIZ ATTEMPTS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-emerald-400" />
              <h2 className="font-heading text-2xl font-bold text-white">Cosmic Assessment Log</h2>
              <span className="text-xs font-mono text-slate-400">({quizHistory.recentAttempts.length} Records)</span>
            </div>

            <Link to="/quiz" className="btn-ghost text-xs text-cyan-400 flex items-center gap-1">
              <span>Attempt New Quiz</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {quizHistory.recentAttempts.length > 0 ? (
            <div className="glass-card rounded-2xl overflow-hidden" style={{ background: 'rgba(12, 19, 42, 0.65)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead style={{ background: 'rgba(2, 6, 23, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <tr>
                      <th className="p-4 text-xs font-mono uppercase text-slate-400">Completed Date</th>
                      <th className="p-4 text-xs font-mono uppercase text-slate-400">Score</th>
                      <th className="p-4 text-xs font-mono uppercase text-slate-400">Accuracy</th>
                      <th className="p-4 text-xs font-mono uppercase text-slate-400">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory.recentAttempts.map((attempt) => {
                      const isHigh = attempt.percentage >= 70;
                      return (
                        <tr
                          key={attempt._id}
                          className="hover:bg-white/5 transition-colors"
                          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                        >
                          <td className="p-4 text-xs text-slate-300 font-mono flex items-center gap-2">
                            <Calendar size={13} className="text-indigo-400" />
                            <span>{new Date(attempt.completedAt).toLocaleString()}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            {attempt.score} / {attempt.totalQuestions}
                          </td>
                          <td className="p-4 font-mono text-cyan-400 font-semibold">
                            {attempt.percentage}%
                          </td>
                          <td className="p-4">
                            <span
                              className="text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold"
                              style={{
                                background: isHigh ? 'rgba(52, 211, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: isHigh ? '#34d399' : '#818cf8',
                                border: isHigh ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                              }}
                            >
                              {isHigh ? 'Master Explorer' : 'Cadet'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl text-center max-w-md mx-auto">
              <HelpCircle size={36} className="text-slate-500 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white">No quiz attempts logged</h3>
              <p className="text-sm text-slate-400 mt-2 mb-6">
                Test your knowledge of our Solar System to see your results tracked here.
              </p>
              <Link to="/quiz" className="btn-primary text-xs py-2.5 px-6">
                <span>Start Cosmic Quiz</span>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Observatory;
