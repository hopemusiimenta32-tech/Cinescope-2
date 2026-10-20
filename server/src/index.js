import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import tmdbRoutes, { tmdbErrorHandler } from './routes/tmdb.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json());
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api', tmdbRoutes);
app.use((error, _request, response, _next) => {
  if (error.message === 'Origin is not allowed by CORS.') {
    return response.status(403).json({ error: { code: 'CORS_ORIGIN_DENIED', message: 'This origin is not allowed to access the API.' } });
  }
  return tmdbErrorHandler(error, _request, response, _next);
});

app.listen(port, () => {
  console.log(`CineScope API server listening on port ${port}`);
});
