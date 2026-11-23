import { Router } from 'express';

const router = Router();

// AUTH-8 ile geliştirilecek
router.post('/login', (req, res) => res.status(501).json({ error: 'Henüz uygulanmadı' }));

export default router;
