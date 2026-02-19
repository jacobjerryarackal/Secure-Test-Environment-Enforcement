'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Button, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useLog } from '@/context/LogContext';

const { Timer: AntTimer } = Statistic;
const { Text } = Typography;

interface TimerProps {
  durationSeconds: number;
  attemptId: string;
  onFinish?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ durationSeconds, attemptId, onFinish }) => {
  const [deadline, setDeadline] = useState<number>(Date.now() + durationSeconds * 1000);
  const [paused, setPaused] = useState(false);
  const [remainingMs, setRemainingMs] = useState(durationSeconds * 1000);
  const { addLog } = useLog();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");
  };

  const handlePause = () => {
    const now = Date.now();
    const stillLeft = Math.max(0, deadline - now);
    setRemainingMs(stillLeft);
    setPaused(true);
    addLog({ eventType: 'timer_pause', attemptId, metadata: { timeRemaining: formatTime(stillLeft) } });
  };

  const handleResume = () => {
    setDeadline(Date.now() + remainingMs);
    setPaused(false);
    addLog({ eventType: 'timer_start', attemptId, metadata: { resumed: true } });
  };

  useEffect(() => {
    addLog({ eventType: 'timer_start', attemptId, metadata: { initialDuration: durationSeconds } });
  }, []);

  return (
    <Card
      size="small"
      style={{
        background: 'linear-gradient(145deg, #845EC2, #D65DB1)',
        border: 'none',
        borderRadius: 20, // Matched your question card radius
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        width: '100%', 
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px 16px' 
      }}>
        {/* Left Section: Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ClockCircleOutlined style={{ color: 'white', fontSize: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, textTransform: 'uppercase' }}>
              Time Remaining
            </Text>
            {paused ? (
              <div style={{ color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}>
                {formatTime(remainingMs)}
              </div>
            ) : (
              <AntTimer
                type="countdown"
                value={deadline}
                onFinish={onFinish}
                format="HH:mm:ss"
                styles={{content: { color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace' }}}
              />
            )}
          </div>
        </div>

        {/* Right Section: Control Button */}
        <Button 
          type="text"
          icon={paused ? <PlayCircleOutlined /> : <PauseCircleOutlined />} 
          onClick={paused ? handleResume : handlePause}
          style={{ 
            color: 'white', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 12,
            height: 40,
            padding: '0 24px',
            fontWeight: 'bold'
          }}
        >
          {paused ? 'Resume' : 'Pause'}
        </Button>
      </div>
    </Card>
  );
};