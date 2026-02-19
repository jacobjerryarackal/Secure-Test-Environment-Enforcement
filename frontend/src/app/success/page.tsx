'use client';

import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { CheckCircleOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f0f2f5',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          style={{ 
            maxWidth: 600, 
            borderRadius: 24, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: 'none'
          }}
        >
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title={
              <Title level={2} style={{ margin: 0 }}>
                Assessment Submitted!
              </Title>
            }
            subTitle={
              <Space orientation="vertical" style={{ marginTop: 10 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Thank you for completing the secure assessment. 
                  Your responses and proctoring logs have been successfully synced.
                </Text>
                <Text strong color="blue">
                  Attempt ID: Checked & Verified
                </Text>
              </Space>
            }
            extra={[
              <Button 
                type="primary" 
                key="home" 
                icon={<HomeOutlined />} 
                size="large"
                onClick={() => router.push('/')}
                style={{ borderRadius: 8, height: 45, padding: '0 30px' }}
              >
                Back to Portal
              </Button>,
              <Button 
                key="logout" 
                icon={<LogoutOutlined />} 
                size="large"
                style={{ borderRadius: 8, height: 45 }}
                onClick={() => window.close()} // Optional: tries to close the tab
              >
                Exit
              </Button>,
            ]}
          />
          
          <div style={{ marginTop: 20, padding: '15px', background: '#6dbb1e', border: '1px solid #6de80f', borderRadius: 12 }}>
            <Text type="success">
              Your session is now closed. No further data is being recorded.
            </Text>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}