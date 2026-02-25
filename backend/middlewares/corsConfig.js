export const corsConfig = {
  origin: [
    'http://localhost:3000',           // Local Frontend
    'https://your-app.vercel.app'     // Your future Vercel URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};