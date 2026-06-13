import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/jobs', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Failed to list jobs', err);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

router.get('/jobs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (!rows[0]) { res.status(404).json({ error: 'Job not found' }); return; }
    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to get job', err);
    res.status(500).json({ error: 'Failed to get job' });
  }
});

router.post('/jobs', requireAuth, async (req, res) => {
  try {
    const { company_name, role_name, description, requirements, eligibility_link, location, experience } = req.body ?? {};
    if (!company_name || !role_name || !description || !requirements || !eligibility_link || !location || !experience) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    const { rows } = await pool.query(
      'INSERT INTO jobs (company_name, role_name, description, requirements, eligibility_link, location, experience) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [company_name, role_name, description, requirements, eligibility_link, location, experience]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Failed to create job', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.put('/jobs/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const { company_name, role_name, description, requirements, eligibility_link, location, experience } = req.body ?? {};
    const { rows } = await pool.query(
      'UPDATE jobs SET company_name=$1, role_name=$2, description=$3, requirements=$4, eligibility_link=$5, location=$6, experience=$7 WHERE id=$8 RETURNING *',
      [company_name, role_name, description, requirements, eligibility_link, location, experience, id]
    );
    if (!rows[0]) { res.status(404).json({ error: 'Job not found' }); return; }
    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to update job', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/jobs/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
    const { rows } = await pool.query('DELETE FROM jobs WHERE id=$1 RETURNING id', [id]);
    if (!rows[0]) { res.status(404).json({ error: 'Job not found' }); return; }
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete job', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
