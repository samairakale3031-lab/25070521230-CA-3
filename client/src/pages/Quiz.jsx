import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Compass,
  Bookmark,
  Trophy,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Quiz = () => {
  const { user, isAuthenticated, showToast } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedForCurrent, setSelectedForCurrent] = useState(null);
  const [hasRevealedCurrent, setHasRevealedCurrent] = useState(false);

  // Result state
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    quizApi
      .getQuestions()
      .then((res) => {
        if (mounted && res?.questions) {
          setQuestions(res.questions);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load astronomy quiz.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    if (hasRevealedCurrent) return; // Prevent changing after revealing
    setSelectedForCurrent(optionIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedForCurrent === null) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedForCurrent,
    }));
    setHasRevealedCurrent(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedForCurrent(null);
      setHasRevealedCurrent(false);
    } else {
      finalizeQuiz();
    }
  };

  const finalizeQuiz = async () => {
    setEvaluating(true);
    try {
      const finalAnswers = {
        ...userAnswers,
        [currentQ.id]: selectedForCurrent,
      };

      // Server evaluates score strictly against verified answers
      const res = await quizApi.evaluate(finalAnswers);
      setEvaluationResult(res);
      setQuizCompleted(true);

      // If user is already authenticated, automatically persist attempt
      if (isAuthenticated) {
        try {
          await quizApi.submitAttempt(finalAnswers);
          setHasSavedAttempt(true);
          showToast(`Score of ${res.score}/${res.totalQuestions} saved to your Observatory!`, 'success');
        } catch {
          // Toast handles error
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to evaluate quiz score.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveResultManually = async () => {
    if (!isAuthenticated) {
      // Save pending score into session storage so it can be reclaimed after login
      sessionStorage.setItem('pending_quiz_answers', JSON.stringify(userAnswers));
      navigate('/login', { state: { from: '/quiz' } });
      return;
    }

    try {
      setSavingAttempt(true);
      await quizApi.submitAttempt(userAnswers);
      setHasSavedAttempt(true);
      showToast('Quiz result recorded in your personal Observatory!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save quiz attempt.', 'error');
    } finally {
      setSavingAttempt(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedForCurrent(null);
    setHasRevealedCurrent(false);
    setQuizCompleted(false);
    setEvaluationResult(null);
    setHasSavedAttempt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading Cosmic Knowledge Assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
          <p className="text-red-400 font-bold mb-2">Quiz System Error</p>
          <p className="text-sm text-slate-300 mb-6">{error || 'Quiz questions unavailable.'}</p>
          <Link to="/explore" className="btn-primary text-sm py-2 px-6">
            <span>Explore Planets Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  // COMPLETED RESULT SCREEN
  if (quizCompleted && evaluationResult) {
    const { score, totalQuestions, percentage, breakdown } = evaluationResult;
    const isPassing = percentage >= 70;

    return (
      <div className="relative pt-28 pb-20 min-h-screen">
        <div className="container max-w-3xl">
          {/* Result Score Banner */}
          <div
            className="glass-panel rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 25, 52, 0.85) 0%, rgba(7, 12, 29, 0.95) 100%)',
              border: isPassing ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4"
              style={{
                background: isPassing
                  ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.1) 100%)',
                border: isPassing ? '2px solid #34d399' : '2px solid #6366f1',
              }}
            >
              <Trophy size={36} className={isPassing ? 'text-emerald-400' : 'text-indigo-400'} />
            </div>

            <span className="tag-pill font-mono mb-2">Assessment Completed</span>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white mt-2">
              {isPassing ? 'Exceptional Stargazer!' : 'Voyage Complete!'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md mx-auto">
              {isPassing
                ? 'You demonstrated comprehensive mastery of planetary science and astronomical mechanics.'
                : 'Great effort navigating the Solar System! Review the breakdown below to sharpen your astronomy insights.'}
            </p>

            {/* Score Numerical Badge */}
            <div className="flex items-center justify-center gap-6 my-8">
              <div className="p-4 rounded-2xl glass-card text-center min-w-[130px]">
                <span className="text-xs text-slate-400 font-mono uppercase block">Correct Score</span>
                <span className="font-heading text-4xl font-extrabold text-white">
                  {score} <span className="text-lg text-slate-400 font-normal">/ {totalQuestions}</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl glass-card text-center min-w-[130px]">
                <span className="text-xs text-slate-400 font-mono uppercase block">Proficiency</span>
                <span className="font-heading text-4xl font-extrabold text-cyan-400">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Actions: Save / Retake / Explore */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={16} />
                  <span>Attempt recorded in your Observatory log</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveResultManually}
                  disabled={savingAttempt}
                  className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
                >
                  <Bookmark size={16} />
                  <span>Log In to Save Score to Observatory</span>
                </button>
              )}

              <button onClick={handleRetakeQuiz} className="btn-secondary text-sm py-2.5 px-6 flex items-center gap-2">
                <RotateCcw size={16} />
                <span>Retake Quiz</span>
              </button>

              <Link to="/explore" className="btn-ghost text-sm py-2.5 px-6 flex items-center gap-2">
                <Compass size={16} />
                <span>Return to Explore</span>
              </Link>
            </div>
          </div>

          {/* Detailed Question Breakdown Section */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-bold text-white mb-2">Question Breakdown & Explanations</h2>

            {breakdown.map((item, idx) => (
              <div
                key={item.id}
                className="glass-card p-6 rounded-2xl flex flex-col gap-3"
                style={{
                  borderLeft: item.isCorrect ? '4px solid #34d399' : '4px solid #f87171',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Question {idx + 1} • {item.topic}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: item.isCorrect ? '#34d399' : '#f87171' }}>
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 size={14} /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Incorrect
                      </>
                    )}
                  </span>
                </div>

                <p className="font-heading text-base font-semibold text-white">{item.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                  <div
                    className="p-2.5 rounded-lg"
                    style={{
                      background: item.isCorrect ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      border: item.isCorrect ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)',
                      color: item.isCorrect ? '#34d399' : '#f87171',
                    }}
                  >
                    Your answer: {item.userSelection !== null ? item.options[item.userSelection] : 'Not answered'}
                  </div>

                  {!item.isCorrect && (
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        background: 'rgba(52, 211, 153, 0.15)',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        color: '#34d399',
                      }}
                    >
                      Correct answer: {item.options[item.correctIndex]}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                  <strong className="text-cyan-400 font-mono">Fact:</strong> {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE INTERACTIVE QUESTION CARD
  const optionLetters = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="relative pt-28 pb-20 min-h-screen">
      <div className="container max-w-2xl">
        {/* Header Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="tag-pill font-mono">
              <HelpCircle size={13} />
              <span>Cosmic Quiz</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">{currentQ.topic}</span>
          </div>

          <span className="font-mono text-xs text-slate-400">
            Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div
          className="w-full rounded-full overflow-hidden mb-8"
          style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
            }}
          />
        </div>

        {/* Question Panel */}
        <div
          className="glass-panel rounded-3xl p-6 sm:p-10 mb-6 flex flex-col gap-6"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(12, 19, 42, 0.75)',
          }}
        >
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Multiple Choice Options Grid */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedForCurrent === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`quiz-option ${isSelected ? 'selected' : ''}`}
                  style={{
                    cursor: hasRevealedCurrent ? 'default' : 'pointer',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold"
                      style={{
                        background: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#030712' : '#94a3b8',
                      }}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>

                  {isSelected && <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span className="text-xs text-slate-400 font-mono">
              {selectedForCurrent === null ? 'Select an answer to continue' : 'Answer selected'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={selectedForCurrent === null || evaluating}
              className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
            >
              <span>{currentIndex === questions.length - 1 ? 'Calculate Score' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Quick Quiz Info */}
        <p className="text-center text-xs text-slate-500 font-mono">
          Authentic Solar System knowledge assessment • Server-verified scoring
        </p>
      </div>
    </div>
  );
};

export default Quiz;
