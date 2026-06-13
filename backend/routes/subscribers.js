import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Valid email is required' });
      return;
    }
    const existing = await pool.query('SELECT id FROM subscribers WHERE email=$1', [email]);
    if (existing.rows[0]) {
      res.status(409).json({ error: 'Email already subscribed' });
      return;
    }
    const { rows } = await pool.query('INSERT INTO subscribers (email) VALUES ($1) RETURNING *', [email]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Failed to subscribe', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

router.get('/subscribers', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Failed to list subscribers', err);
    res.status(500).json({ error: 'Failed to list subscribers' });
  }
});

router.delete('/subscribers/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const { rows } = await pool.query('DELETE FROM subscribers WHERE id=$1 RETURNING id', [id]);
    if (!rows[0]) { res.status(404).json({ error: 'Subscriber not found' }); return; }
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete subscriber', err);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

export default router;
