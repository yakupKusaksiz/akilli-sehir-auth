import { Router } from 'express';

const router = Router();

// AUTH-7 ile geliştirilecek
router.post('/register', (req, res) => res.status(501).json({ error: 'Henüz uygulanmadı' }));

export default router;
