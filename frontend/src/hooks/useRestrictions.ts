'use client';

import { useEffect } from 'react';
import { useAppMessage } from './useAppMessage';
import { useLog } from '@/context/LogContext';

export const useRestrictions = () => {
  const { addLog } = useLog();
  const message = useAppMessage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlCmd = isMac ? e.metaKey : e.ctrlKey;

      if (isCtrlCmd && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();

        let eventType = '';
        switch (e.key.toLowerCase()) {
          case 'c': eventType = 'copy'; break;
          case 'v': eventType = 'paste'; break;
          case 'x': eventType = 'cut'; break;
        }

        message.warning({
          content: `${e.key.toUpperCase()} is disabled during the assessment`,
          duration: 2,
          style: { marginTop: '60px' },
        });

        addLog({ eventType, metadata: { key: e.key, ctrl: e.ctrlKey, meta: e.metaKey } });
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      message.warning('Copying is disabled');
      addLog({ eventType: 'copy' }); // Ensure 'copy' is in your Backend enum
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      message.warning('Pasting is disabled');
      addLog({ eventType: 'paste' });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      message.warning({
        content: 'Right-click is disabled',
        duration: 2,
        style: { marginTop: '60px' },
      });
      addLog({ eventType: 'rightclick', metadata: { x: e.clientX, y: e.clientY } });
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('input, textarea, [contenteditable="true"]')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('paste', handlePaste, true);
    document.addEventListener('selectstart', handleSelectStart, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
    };
  }, [addLog, message]);
};