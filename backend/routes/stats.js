import { Router } from 'express';
import { createHash } from 'crypto';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/track', async (req, res) => {
  try {
    const { path } = req.body ?? {};
    const raw = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    const ipHash = createHash('sha256').update(raw).digest('hex');
    await pool.query('INSERT INTO page_views (ip_hash, path) VALUES ($1, $2)', [ipHash, path || '/']);
  } catch (err) {
    console.error('Failed to track visit', err);
  }
  res.status(204).send();
});

router.get('/admin/stats', requireAuth, async (_req, res) => {
  try {
    const [total, unique] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM page_views'),
      pool.query('SELECT COUNT(DISTINCT ip_hash) FROM page_views'),
    ]);
    res.json({
      total_visits: parseInt(total.rows[0].count),
      unique_visitors: parseInt(unique.rows[0].count),
    });
  } catch (err) {
    console.error('Failed to get stats', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
