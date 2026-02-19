'use client';

import React, { useState } from 'react';
import { Card, Button, Typography, Radio, Space, Input, App, Form, Checkbox, Row, Col, Divider, Statistic } from 'antd';
import { 
  SendOutlined, 
  SafetyCertificateOutlined, 
  RocketOutlined, 
  SafetyOutlined, 
  AuditOutlined,
  ThunderboltOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

// Components & Hooks
import { SecureTestWrapper } from '@/components/SecureTestWrapper';
import { Timer } from '@/components/Timer';
import { useLog } from '@/context/LogContext';
import { createAttempt, submitAttempt } from '@/lib/api';

const { Title, Paragraph, Text } = Typography;

export default function AssessmentPage() {
  const router = useRouter();
  const { message: msg } = App.useApp();
  
  // Destructure what we actually need from LogContext
  const { addLog, flushLogs, stopFlushing, setAttemptId } = useLog();

  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Fixed: This state now actually gets updated
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [candidate, setCandidate] = useState({ name: '', email: '' });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: 'q1', text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'] },
    { id: 'q2', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
  ];

  // --- Start Assessment Logic ---
  const handleStartExam = async (values: any) => {
    setLoading(true);
    const newId = uuidv4();
    
    try {
      await createAttempt({
        attemptId: newId,
        candidateName: values.name,
        candidateEmail: values.email,
        metadata: {
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
        }
      });

      // Update both Context and local state
      setAttemptId(newId);
      setActiveAttemptId(newId);
      setCandidate({ name: values.name, email: values.email });
      setIsStarted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      msg.error('Initialization failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // --- Answer Logging ---
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (activeAttemptId) {
      addLog({ eventType: 'answer_change', questionId, metadata: { value } });
    }
  };

  // --- Final Submission ---
  const handleSubmit = async () => {
    if (!activeAttemptId) return;
    setSubmitting(true);
    try {
      // 1. Send final log
      await addLog({ eventType: 'assessment_submit', attemptId: activeAttemptId });
      
      // 2. Force a final sync of the queue
      await flushLogs(); 
      
      // 3. Close the attempt in the DB
      await submitAttempt({ attemptId: activeAttemptId });
      
      // 4. Kill the logger and timer processes
      stopFlushing();
      
      msg.success('Assessment submitted successfully');
      router.push('/success'); 
    } catch (error) {
      console.error(error);
      msg.error('Submission encountered an issue. Please contact support.');
    } finally {
      setSubmitting(false); 
    }
  };

  // LANDING PAGE VIEW
  if (!isStarted) {
    return (
      <div style={{ background: 'var(--bg-gradient)', minHeight: '100vh' }}>
        <section style={{ padding: '80px 20px', textAlign: 'center', background: 'white' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Title style={{ fontSize: '3rem', marginBottom: '10px', color: 'var(--color-5)' }}>
              Secure Assessment Portal
            </Title>
            <Paragraph style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 40px' }}>
              Enter your details to initialize the secure proctoring environment.
            </Paragraph>
          </motion.div>
        </section>

        <section style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="scroll-reveal" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ background: 'var(--color-2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <SafetyOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <Title level={4}>Secure Proctoring</Title>
                <Text type="secondary">Browser focus is monitored to ensure test integrity.</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="scroll-reveal" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ background: 'var(--color-1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ThunderboltOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <Title level={4}>Strict Controls</Title>
                <Text type="secondary">Copy/Paste and Right-click are disabled throughout.</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="scroll-reveal" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ background: 'var(--color-4)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <EyeOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <Title level={4}>Audit Logging</Title>
                <Text type="secondary">All activity is logged for verification purposes.</Text>
              </div>
            </Col>
          </Row>
        </section>

        <section id="register" style={{ padding: '60px 20px' }}>
          <Card 
            styles={{ body: { padding: 0 } }} 
            style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
          >
            <Row>
              <Col xs={24} md={10} style={{ background: 'var(--color-5)', color: 'white', padding: '40px' }}>
                <Title level={2} style={{ color: 'white' }}>Registration</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Confirm your identity to unlock the exam questions.
                </Paragraph>
                <Space orientation="vertical" style={{ marginTop: 20 }}>
                  <Text style={{ color: 'white' }}><AuditOutlined /> Duration: 60 Mins</Text>
                  <Text style={{ color: 'white' }}><SafetyCertificateOutlined /> Secure Session</Text>
                </Space>
              </Col>
              <Col xs={24} md={14} style={{ padding: '40px', background: 'white' }}>
                <Form layout="vertical" onFinish={handleStartExam} requiredMark={false}>
                  <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                    <Input size="large" placeholder="Your Name" />
                  </Form.Item>
                  <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input size="large" placeholder="email@example.com" />
                  </Form.Item>
                  <Form.Item name="agree" valuePropName="checked" rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('Required') }]}>
                    <Checkbox>I agree to the secure proctoring terms.</Checkbox>
                  </Form.Item>
                  <Button type="primary" block size="large" htmlType="submit" loading={loading} style={{ height: '50px', borderRadius: '10px', background: 'var(--color-5)', border: 'none' }}>
                    Launch Secure Assessment
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card>
        </section>
      </div>
    );
  }

  // EXAM VIEW
  return (
    <SecureTestWrapper candidateName={candidate.name}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ color: 'var(--color-5)' }}>Assessment in Progress</Title>
          <Text type="secondary">Candidate: {candidate.name}</Text>
        </div>

        {activeAttemptId && (
          <div style={{ marginBottom: 32 }}>
            <Timer durationSeconds={3600} attemptId={activeAttemptId} onFinish={handleSubmit} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {questions.map((q) => (
            <Card key={q.id} style={{ borderRadius: 15 }}>
              <Title level={4}>{q.text}</Title>
              <Radio.Group onChange={(e) => handleAnswerChange(q.id, e.target.value)} value={answers[q.id]}>
                <Space direction="vertical">
                  {q.options.map((opt) => (
                    <Radio key={opt} value={opt}>{opt}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSubmit} 
            loading={submitting}
            icon={<SendOutlined />}
            style={{ padding: '0 50px', height: 50, borderRadius: 25, background: 'var(--color-5)', border: 'none' }}
          >
            Submit Final Answers
          </Button>
        </div>
      </div>
    </SecureTestWrapper>
  );
}