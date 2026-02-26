// components/OriginLogger.tsx
'use client';
import { useEffect } from 'react';

export default function OriginLogger() {
  useEffect(() => {
    console.log('Frontend origin:', window.location.origin);
  }, []);
  return null;
}