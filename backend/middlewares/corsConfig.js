export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'https://secure-test-environment-enforcement-one.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Ensure these are allowed
  credentials: true,
  optionsSuccessStatus: 200
};
