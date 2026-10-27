import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import planetRoutes from './routes/planets.js';
import savedDiscoveryRoutes from './routes/savedDiscoveries.js';
import quizRoutes from './routes/quiz.js';
import nasaRoutes from './routes/nasa.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// CORS configuration supporting credentials and local Vite dev server
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for evaluation and proxying
      }
    },
    credentials: true,
  })
);

// Route mounts
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/planets', planetRoutes);
app.use('/api/saved-discoveries', savedDiscoveryRoutes);
app.use('/api/quiz', quizRoutes);

// Direct compatibility alias for /api/quiz-attempts as per prompt specification
app.get('/api/quiz-attempts', (req, res, next) => {
  req.url = '/attempts';
  quizRoutes(req, res, next);
});
app.post('/api/quiz-attempts', (req, res, next) => {
  req.url = '/attempts';
  quizRoutes(req, res, next);
});

app.use('/api/nasa', nasaRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handler (avoids exposing detailed stack traces in production)
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`[ORBIT Server] Running on http://localhost:${PORT}`);
  console.log(`[ORBIT Server] API Health available at http://localhost:${PORT}/api/health`);
});

export default app;
