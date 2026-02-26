export const corsConfig = {
  // Try this to allow ANY Vercel deployment from your account
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://secure-test-environment-enforcement-one.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS
  credentials: true,
};