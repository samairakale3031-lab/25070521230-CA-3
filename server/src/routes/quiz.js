import express from 'express';
import QuizAttempt from '../models/QuizAttempt.js';
import { quizQuestions } from '../data/quizQuestions.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/quiz/questions - Fetch quiz questions without exposing correct answer indices
router.get('/questions', (req, res) => {
  const publicQuestions = quizQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    topic: q.topic,
  }));

  res.status(200).json({
    success: true,
    count: publicQuestions.length,
    questions: publicQuestions,
  });
});

// POST /api/quiz/evaluate - Validate score and return answer breakdown (available to both guests and users)
router.post('/evaluate', (req, res) => {
  try {
    const { answers } = req.body; // e.g. { "1": 1, "2": 2, ... }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid quiz answers payload.' });
    }

    let calculatedScore = 0;
    const breakdown = quizQuestions.map((q) => {
      const selectedOption = answers[q.id];
      const isCorrect = selectedOption !== undefined && Number(selectedOption) === q.correctIndex;
      if (isCorrect) calculatedScore++;

      return {
        id: q.id,
        question: q.question,
        options: q.options,
        userSelection: selectedOption !== undefined ? Number(selectedOption) : null,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic,
      };
    });

    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((calculatedScore / totalQuestions) * 100);

    res.status(200).json({
      success: true,
      score: calculatedScore,
      totalQuestions,
      percentage,
      breakdown,
    });
  } catch (error) {
    console.error('[Quiz Evaluation Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to evaluate quiz answers.' });
  }
});

// POST /api/quiz-attempts - Authenticated: calculate score server-side and persist in MongoDB
router.post('/attempts', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid quiz submission format.' });
    }

    // Server-side calculated score
    let verifiedScore = 0;
    quizQuestions.forEach((q) => {
      const selected = answers[q.id];
      if (selected !== undefined && Number(selected) === q.correctIndex) {
        verifiedScore++;
      }
    });

    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((verifiedScore / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      score: verifiedScore,
      totalQuestions,
      percentage,
      completedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Quiz result recorded successfully in your Observatory.',
      attempt: {
        _id: attempt._id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        completedAt: attempt.completedAt,
      },
    });
  } catch (error) {
    console.error('[Save Quiz Attempt Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to record quiz attempt.' });
  }
});

// GET /api/quiz-attempts - Retrieve user's quiz history and summary stats
router.get('/attempts', authenticate, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ completedAt: -1 }).limit(10);

    const totalAttempts = await QuizAttempt.countDocuments({ userId: req.user._id });

    // Calculate best score
    const bestAttempt = await QuizAttempt.findOne({ userId: req.user._id }).sort({ score: -1, completedAt: -1 });

    res.status(200).json({
      success: true,
      totalAttempts,
      bestScore: bestAttempt ? bestAttempt.score : null,
      bestPercentage: bestAttempt ? bestAttempt.percentage : null,
      recentAttempts: attempts,
    });
  } catch (error) {
    console.error('[Get Quiz History Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve quiz history.' });
  }
});

export default router;
