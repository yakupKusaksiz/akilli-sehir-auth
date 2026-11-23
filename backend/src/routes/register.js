import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findByEmail, createUser, publicUser } from '../userStore.js';
import { isValidEmail, isStrongPassword } from '../validation.js';

const router = Router();

// POST /api/auth/register  { name, email, password }
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: 'Ad soyad en az 2 karakter olmalı' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli' });
    }
    if (findByEmail(email)) {
      return res.status(409).json({ error: 'Bu e-posta ile kayıtlı bir hesap var' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ name: String(name).trim(), email: email.trim(), passwordHash });
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
