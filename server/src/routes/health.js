import express from 'express';
import { getDBStatus } from '../config/db.js';

const router = express.Router();
const startTime = Date.now();

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.status(200).json({
    status: 'healthy',
    application: 'ORBIT — Explore the Universe API',
    uptimeSeconds,
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      name: dbStatus.databaseName,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
