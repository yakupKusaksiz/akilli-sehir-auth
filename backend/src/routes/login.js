import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findByEmail, findById, publicUser } from '../userStore.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gelistirme-anahtari';
const JWT_EXPIRES = '2h';

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre zorunludur' });
    }
    const user = findByEmail(email.trim());
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (Authorization: Bearer <token>)
router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Oturum bulunamadı' });
  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    const user = findById(sub);
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user: publicUser(user) });
  } catch {
    res.status(401).json({ error: 'Geçersiz veya süresi dolmuş oturum' });
  }
});

export default router;
