'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Button, Space } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { useRestrictions } from '@/hooks/useRestrictions';
import { useFullscreenGuard } from '@/hooks/useFullscreenGuard';
import { useAppMessage } from '@/hooks/useAppMessage';
import { useLog } from '@/context/LogContext';
import { generateAttemptId } from '@/utils/attemptId';
import { createAttempt } from '@/lib/api';
import { clearQueue } from '@/lib/localQueue';

interface SecureTestWrapperProps {
  children: React.ReactNode;
  candidateName?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const SecureTestWrapper: React.FC<SecureTestWrapperProps> = ({
  children,
  candidateName = 'Candidate',
}) => {
  const [attemptId, setAttemptIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = React.useRef(false);
  const [fullscreenRequested, setFullscreenRequested] = useState(false);
  const { setAttemptId, addLog, startFlushing } = useLog();
  const message = useAppMessage();

  useRestrictions();
  useFullscreenGuard(true); // fullscreen logic now requires user gesture

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreenRequested(true);
      message.success('Fullscreen mode enabled');
    } catch (err) {
      message.error('Fullscreen permission denied. Please enable manually.');
    }
  };

  const initAttempt = async (retryCount = 0): Promise<void> => {
    try {
      const newAttemptId = generateAttemptId();

      // 1. Register attempt on backend FIRST
      await createAttempt({
        attemptId: newAttemptId,
        candidateName,
        metadata: {
          userAgent: navigator.userAgent,
          screenSize: `${window.screen.width}x${window.screen.height}`,
        },
      });

      setAttemptIdState(newAttemptId);
      setAttemptId(newAttemptId);

      // Log the start event (will be queued, not sent until attempt is created)
      await addLog({
        eventType: 'assessment_start',
        attemptId: newAttemptId,
        metadata: { candidateName },
      });

      console.log('✅ Attempt ID (UUID):', newAttemptId);
      await clearQueue();
      // ✅ Attempt created successfully – now safe to start flushing
      startFlushing();
      setLoading(false);
    } catch (error) {
      console.error(`Attempt creation failed (retry ${retryCount}):`, error);
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => initAttempt(retryCount + 1), RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        setLoading(false);
        message.error('Failed to initialize secure environment. Please refresh.');
      }
    }
  };

    useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initAttempt();
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 24 }}>
        <Spin size="large" description="Initializing secure environment..." />
        {!fullscreenRequested && (
          <Button
            type="primary"
            icon={<FullscreenOutlined />}
            onClick={requestFullscreen}
            style={{
              background: 'linear-gradient(145deg, var(--color-5), var(--color-4))',
              border: 'none',
              borderRadius: 30,
            }}
          >
            Enter Fullscreen
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};