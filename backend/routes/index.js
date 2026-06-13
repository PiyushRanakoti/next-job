import { Router } from 'express';
import healthRouter from './health.js';
import jobsRouter from './jobs.js';
import subscribersRouter from './subscribers.js';
import adminRouter from './admin.js';
import statsRouter from './stats.js';

const router = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(subscribersRouter);
router.use(adminRouter);
router.use(statsRouter);

export default router;
