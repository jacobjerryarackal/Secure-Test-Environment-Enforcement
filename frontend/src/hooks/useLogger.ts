'use client';

import { useLog } from '@/context/LogContext';

export const useLogger = () => {
  const { addLog, flushLogs, setAttemptId } = useLog();
  return { addLog, flushLogs, setAttemptId };
};