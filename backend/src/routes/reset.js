import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { findByEmail, updateUser } from '../userStore.js';
import { isStrongPassword } from '../validation.js';

const router = Router();
const CODE_TTL_MS = 15 * 60 * 1000; // 15 dakika

// Gerçek projede kod e-posta ile gönderilir; geliştirme ortamında yanıtta döner.
const exposeCode = () => process.env.NODE_ENV !== 'production';

// POST /api/auth/forgot-password  { email }
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-posta zorunludur' });

    const message = 'Bu e-posta kayıtlıysa sıfırlama kodu gönderildi.';
    const user = findByEmail(email.trim());
    // Kullanıcı olsun olmasın aynı yanıt: hesap varlığı dışarı sızdırılmaz
    if (!user) return res.json({ message });

    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    updateUser(user.email, {
      resetCode: await bcrypt.hash(code, 8),
      resetExpires: Date.now() + CODE_TTL_MS,
    });
    res.json(exposeCode() ? { message, devCode: code } : { message });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/reset-password  { email, code, password }
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, code, password } = req.body || {};
    if (!email || !code || !password) {
      return res.status(400).json({ error: 'E-posta, kod ve yeni şifre zorunludur' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli' });
    }
    const user = findByEmail(email.trim());
    const valid =
      user && user.resetCode && user.resetExpires > Date.now() &&
      (await bcrypt.compare(String(code), user.resetCode));
    if (!valid) {
      return res.status(400).json({ error: 'Kod geçersiz veya süresi dolmuş' });
    }
    updateUser(user.email, {
      passwordHash: await bcrypt.hash(password, 10),
      resetCode: null,
      resetExpires: null,
    });
    res.json({ message: 'Şifre güncellendi' });
  } catch (err) {
    next(err);
  }
});

export default router;
