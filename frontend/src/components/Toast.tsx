'use client';

import React from 'react';
import { message } from 'antd';

export const showToast = (content: string, duration = 2) => {
  message.info({
    content,
    duration,
    style: {
      marginTop: '60px',
      background: 'linear-gradient(145deg, var(--color-4), var(--color-5))',
      color: '#000',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  });
};

export const Toast = () => null; // not directly used