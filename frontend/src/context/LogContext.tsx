'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { logger, LogEntry } from '@/lib/logger';

interface LogContextType {
  addLog: (entry: Omit<LogEntry, 'timestamp' | 'attemptId'> & { attemptId?: string }) => Promise<void>;
  flushLogs: () => Promise<boolean>;
  setAttemptId: (id: string) => void;
  attemptId: string | null;
  startFlushing: (intervalMs?: number) => void;
  stopFlushing: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attemptId, setAttemptIdState] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      logger.stopFlushing();
      logger.flush();
    };
  }, []);

  const addLog = async (entry: Omit<LogEntry, 'timestamp' | 'attemptId'> & { attemptId?: string }) => {
    await logger.add(entry);
  };

  const flushLogs = async () => {
    return await logger.flush();
  };

  const setAttemptId = (id: string) => {
    logger.setAttemptId(id);
    setAttemptIdState(id);
  };

  const startFlushing = (intervalMs = 5000) => {
    logger.startFlushing(intervalMs);
  };

  const stopFlushing = () => {
    logger.stopFlushing();
  };

  return (
    <LogContext.Provider value={{ addLog, flushLogs, setAttemptId, attemptId, startFlushing, stopFlushing }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within LogProvider');
  }
  return context;
};