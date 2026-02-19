'use client';

import { useEffect } from 'react';
import { useAppMessage } from './useAppMessage';
import { useLog } from '@/context/LogContext';

export const useFullscreenGuard = (enabled = true) => {
  const { addLog } = useLog();
  const message = useAppMessage();

  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      addLog({ eventType: isFullscreen ? 'fullscreen_enter' : 'fullscreen_exit', metadata: {} });
      if (!isFullscreen) {
        message.warning({
          content: 'You exited fullscreen mode. Click the button to re-enter.',
          duration: 3,
          style: { marginTop: '60px' },
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [enabled, addLog, message]);
};