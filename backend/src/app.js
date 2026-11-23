import express from 'express';
import cors from 'cors';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import resetRouter from './routes/reset.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', registerRouter);
  app.use('/api/auth', loginRouter);
  app.use('/api/auth', resetRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  });

  return app;
}
