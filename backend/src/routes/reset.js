import { Router } from 'express';

const router = Router();

// AUTH-9 ile geliştirilecek
router.post('/forgot-password', (req, res) => res.status(501).json({ error: 'Henüz uygulanmadı' }));
router.post('/reset-password', (req, res) => res.status(501).json({ error: 'Henüz uygulanmadı' }));

export default router;
