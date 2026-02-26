import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log("Current API Base:", process.env.NEXT_PUBLIC_API_URL);

if (!API_BASE) {
  console.error("CRITICAL: NEXT_PUBLIC_API_URL is not defined!");
}

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ CORRECT – wrap logs in an object
export const sendLogsBatch = (logs: any[]) => api.post('/logs', { logs });

// ✅ Keep other endpoints as they are
export const createAttempt = (data: any) => api.post('/attempts', data);
export const submitAttempt = (data: any) => api.post('/attempts/submit', data);