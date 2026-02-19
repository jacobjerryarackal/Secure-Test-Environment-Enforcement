'use client';

import React, { useState } from 'react';
import { 
  Card, Button, Typography, Radio, Space, Input, App, Form, Checkbox, Row, Col, Divider, Layout, Menu, Avatar 
} from 'antd';
import { 
  SendOutlined, 
  SafetyCertificateOutlined, 
  SafetyOutlined, 
  AuditOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  LockOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

// Components & Hooks
import { SecureTestWrapper } from '@/components/SecureTestWrapper';
import { Timer } from '@/components/Timer';
import { useLog } from '@/context/LogContext';
import { createAttempt, submitAttempt } from '@/lib/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function AssessmentPage() {
  const router = useRouter();
  const { message: msg } = App.useApp();
  const { addLog, flushLogs, stopFlushing, setAttemptId } = useLog();

  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [candidate, setCandidate] = useState({ name: '', email: '' });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: 'q1', text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'] },
    { id: 'q2', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
  ];

  // Fix for Ant Design Menu Warning
  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'features', label: <a href="#features-section">Features</a> },
    { key: 'register-link', label: <a href="#register">Register</a> },
  ];

  const handleStartExam = async (values: any) => {
    setLoading(true);
    const newId = uuidv4();
    try {
      await createAttempt({
        attemptId: newId,
        candidateName: values.name,
        candidateEmail: values.email,
        metadata: { userAgent: navigator.userAgent }
      });
      setAttemptId(newId);
      setActiveAttemptId(newId);
      setCandidate({ name: values.name, email: values.email });
      setIsStarted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      msg.error('Initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (activeAttemptId) {
      addLog({ eventType: 'answer_change', questionId, metadata: { value } });
    }
  };

  const handleSubmit = async () => {
    if (!activeAttemptId) return;
    setSubmitting(true);
    try {
      await addLog({ eventType: 'assessment_submit', attemptId: activeAttemptId });
      await flushLogs(); 
      await submitAttempt({ attemptId: activeAttemptId });
      stopFlushing();
      router.push('/success'); 
    } catch (error) {
      msg.error('Submission failed.');
    } finally {
      setSubmitting(false); 
    }
  };

  if (!isStarted) {
    return (
      <Layout style={{ background: '#fff' }}>
        {/* HEADER: Cleaned up and functional */}
        <Header style={{ 
          position: 'fixed', 
          width: '100%', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 50px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size="large" icon={<SafetyCertificateOutlined />} style={{ background: 'var(--color-5)' }} />
            <Title level={4} style={{ margin: 0, color: 'var(--color-5)' }}>SecureAssess</Title>
          </div>
          <Menu 
            mode="horizontal" 
            items={menuItems} 
            style={{ border: 'none', background: 'transparent', flex: 1, justifyContent: 'center' }} 
          />
          <Button type="primary" shape="round" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'var(--color-5)' }}>
            Join Now
          </Button>
        </Header>

        <Content style={{ paddingTop: 64 }}>
          {/* HERO SECTION */}
          <section style={{ padding: '100px 50px', background: '#fff' }}>
            <Row gutter={[40, 40]} align="middle">
              <Col xs={24} md={12}>
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <Title style={{ fontSize: '3.5rem', lineHeight: 1.1, color: '#1a1a1a' }}>
                    Next-Gen <br />
                    <span style={{ color: 'var(--color-5)' }}>Secure Proctoring</span>
                  </Title>
                  <Paragraph style={{ fontSize: '1.2rem', color: '#666', margin: '24px 0' }}>
                    Deploy high-stakes exams with confidence. Our environment locks down the browser, 
                    monitors behavior, and generates real-time audit logs.
                  </Paragraph>
                  <Space size="large">
                    <Button type="primary" size="large" shape="round" 
                      onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })} 
                      style={{ background: 'var(--color-5)', height: 50, padding: '0 30px' }}>
                      Start Assessment
                    </Button>
                    <Button size="large" shape="round" 
                      onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                      style={{ height: 50 }}>
                      Learn More
                    </Button>
                  </Space>
                </motion.div>
              </Col>
              
              <Col xs={24} md={12}>
                {/* CSS-BASED HERO ILLUSTRATION (No external image needed) */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                  <div style={{ 
                    background: 'var(--bg-gradient)', 
                    height: '400px', 
                    borderRadius: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'var(--color-5)', opacity: 0.1, borderRadius: '50%', top: -50, left: -50 }} />
                    <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--color-1)', opacity: 0.1, borderRadius: '50%', bottom: -100, right: -100 }} />
                    <Card style={{ width: 280, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                       <LockOutlined style={{ fontSize: 40, color: 'var(--color-5)', marginBottom: 16 }} />
                       <Title level={4}>Security Active</Title>
                       <Text type="secondary">Browser Locked • Logs Syncing</Text>
                    </Card>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </section>

          {/* FEATURES SECTION */}
          <section id="features-section" style={{ padding: '80px 50px', background: 'var(--bg-gradient)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 50, color: 'var(--color-5)' }}>
              Engineered for Integrity
            </Title>
            <Row gutter={[24, 24]}>
              {[
                { icon: <LockOutlined />, title: 'Locked UI', desc: 'No copy-paste, no right-click.', color: 'var(--color-1)' },
                { icon: <EyeOutlined />, title: 'Proctor Log', desc: 'Every action is recorded.', color: 'var(--color-4)' },
                { icon: <ClockCircleOutlined />, title: 'Auto-Sync', desc: 'Data survives page refreshes.', color: 'var(--color-5)' },
              ].map((feat, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <Card hoverable style={{ borderRadius: 20, textAlign: 'center', height: '100%' }}>
                    <div style={{ fontSize: 40, color: feat.color, marginBottom: 16 }}>{feat.icon}</div>
                    <Title level={4}>{feat.title}</Title>
                    <Text type="secondary">{feat.desc}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* REGISTRATION SECTION */}
          <section id="register" style={{ padding: '100px 20px', background: '#fff' }}>
            <Card 
              styles={{ body: { padding: 0 } }} 
              style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: 'none' }}
            >
              <Row>
                <Col xs={24} md={10} style={{ background: 'var(--color-5)', color: 'white', padding: '60px 40px' }}>
                  <Title level={2} style={{ color: 'white' }}>Start Session</Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>Verify your identity to unlock the proctored exam area.</Paragraph>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Space orientation="vertical">
                    <Text style={{ color: 'white' }}><ClockCircleOutlined /> 60 Minute Limit</Text>
                    <Text style={{ color: 'white' }}><SafetyOutlined /> Anti-Cheat Active</Text>
                  </Space>
                </Col>
                <Col xs={24} md={14} style={{ padding: '60px 50px' }}>
                  <Form layout="vertical" onFinish={handleStartExam}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                      <Input size="large" placeholder="Enter your name" />
                    </Form.Item>
                    <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                      <Input size="large" placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item name="agree" valuePropName="checked" rules={[{ required: true, message: 'Required' }]}>
                      <Checkbox>I agree to the testing terms.</Checkbox>
                    </Form.Item>
                    <Button type="primary" block size="large" htmlType="submit" loading={loading} style={{ background: 'var(--color-5)', height: 50, borderRadius: 10 }}>
                      Launch Secure Exam
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card>
          </section>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#f9f9f9', padding: '40px' }}>
          <Text type="secondary">© 2026 SecureAssess. Built for high-stakes validation.</Text>
        </Footer>
      </Layout>
    );
  }

  // EXAM VIEW
  return (
    <SecureTestWrapper candidateName={candidate.name}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
        <Timer durationSeconds={3600} attemptId={activeAttemptId!} onFinish={handleSubmit} />
        {questions.map((q) => (
          <Card key={q.id} style={{ marginBottom: 20, borderRadius: 15 }}>
            <Title level={4}>{q.text}</Title>
            <Radio.Group onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
              <Space direction="vertical">
                {q.options.map(opt => <Radio key={opt} value={opt}>{opt}</Radio>)}
              </Space>
            </Radio.Group>
          </Card>
        ))}
        <Button type="primary" size="large" block onClick={handleSubmit} loading={submitting} style={{ background: 'var(--color-5)', height: 50, borderRadius: 10 }}>
          Submit Assessment
        </Button>
      </div>
    </SecureTestWrapper>
  );
}