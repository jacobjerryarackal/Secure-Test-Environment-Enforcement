'use client';

import React from 'react';
import { useFullscreenGuard } from '@/hooks/useFullscreenGuard';

export const FullscreenGuard: React.FC<{ enabled?: boolean; children: React.ReactNode }> = ({
  enabled = true,
  children,
}) => {
  useFullscreenGuard(enabled);
  return <>{children}</>;
};