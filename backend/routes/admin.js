import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'nextjob2024';
  const jwtSecret = process.env.JWT_SECRET ?? 'NP_SECRET';
  if (username !== adminUsername || password !== adminPassword) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
