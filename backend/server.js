import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import attemptRoutes from './routes/attempt-routes.js';
import logRoutes from './routes/log-routes.js';
import { notFound } from './middlewares/notFound.js';
import { corsConfig } from './middlewares/corsConfig.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors(corsConfig));
console.log('CORS config:', corsConfig);
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send('API is Online'));

// Routes
app.use('/api/attempts', attemptRoutes);
app.use('/api/logs', logRoutes);

// 404 handler
app.use(notFound);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});