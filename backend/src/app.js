import cors from 'cors';
import express from 'express';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server healthy' });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
