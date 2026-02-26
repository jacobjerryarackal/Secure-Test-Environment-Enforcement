export const corsConfig = {
  origin: [
    'http://localhost:3000',           // Local Frontend
    'https://secure-test-environment-enforcement-one.vercel.app/'     // Your future Vercel URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};