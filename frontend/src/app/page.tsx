'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Typography, Radio, Space, Input, App, Form, Checkbox, Row, Col, Divider, Layout, Menu, Avatar, Statistic 
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
  CheckCircleOutlined,
  RocketOutlined,
  GlobalOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const { scrollYProgress } = useScroll();
  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)']
  );

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

  const menuItems = [
    { key: 'home', label: <a href="#home">Home</a> },
    { key: 'features', label: <a href="#features">Features</a> },
    { key: 'stats', label: <a href="#stats">Stats</a> },
    { key: 'register', label: <a href="#register">Register</a> },
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
      <Layout style={{ background: '#fff', overflowX: 'hidden' }}>
        {/* Floating background shapes */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, background: 'var(--color-1)', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' }}
          />
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'var(--color-5)', opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }}
          />
        </div>

        {/* Animated Header */}
        <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backdropFilter: 'blur(10px)', backgroundColor: headerBg }}>
          <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', borderBottom: 'none', padding: '0 50px' }}>
            <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size="large" icon={<RocketOutlined />} style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))' }} />
              <Title level={4} style={{ margin: 0, background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SecureAssess
              </Title>
            </motion.div>
            <Menu mode="horizontal" items={menuItems} style={{ border: 'none', background: 'transparent', flex: 1, justifyContent: 'center' }} />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" shape="round" size="large" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })} 
                style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', border: 'none', boxShadow: '0 8px 20px rgba(132,94,194,0.3)' }}>
                Get Started
              </Button>
            </motion.div>
          </Header>
        </motion.div>

        <Content style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
          {/* HERO SECTION */}
          <section id="home" style={{ padding: '100px 50px', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
            <Row gutter={[60, 40]} align="middle">
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Title style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, color: '#1a1a1a' }}>
                    Secure <br />
                    <span style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Proctoring
                    </span>
                    <br /> for the Future
                  </Title>
                  <Paragraph style={{ fontSize: '1.2rem', color: '#666', margin: '24px 0 32px' }}>
                    High‑stakes assessments with zero‑tolerance for cheating. Real‑time monitoring, 
                    locked browser, and immutable audit trails – all in one seamless platform.
                  </Paragraph>
                  <Space size="large">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="primary" size="large" shape="round" 
                        onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })} 
                        style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', border: 'none', height: 54, padding: '0 36px', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(132,94,194,0.4)' }}>
                        Launch Demo
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="large" shape="round" 
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{ height: 54, padding: '0 36px', fontSize: '1.1rem', borderColor: 'var(--color-5)', color: 'var(--color-5)' }}>
                        Explore Features
                      </Button>
                    </motion.div>
                  </Space>
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                >
                  <div style={{ 
                    background: 'var(--bg-gradient)',
                    borderRadius: '40px 40px 40px 40px',
                    padding: '30px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'transform 0.3s',
                  }}>
                    <Card style={{ borderRadius: 30, border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
                      <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 20 }}>
                        <Avatar size={64} icon={<LockOutlined />} style={{ background: 'linear-gradient(145deg, var(--color-1), var(--color-2))' }} />
                        <div>
                          <Title level={3} style={{ margin: 0, color: 'var(--color-5)' }}>Secure Session</Title>
                          <Text type="secondary">Copy, paste, right‑click disabled</Text>
                        </div>
                      </div>
                      <Divider style={{ margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
                        <Statistic title="Active Users" value={1542} suffix="+" />
                        <Statistic title="Exams Proctored" value={12300} suffix="+" />
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </section>

          {/* FEATURES SECTION */}
          <section id="features" style={{ padding: '120px 50px', background: 'var(--bg-gradient)' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 60 }}
            >
              <Title level={2} style={{ fontSize: '3rem', color: 'var(--color-5)' }}>Powerful Features</Title>
              <Paragraph style={{ fontSize: '1.2rem', color: '#555' }}>Everything you need to ensure exam integrity</Paragraph>
            </motion.div>
            <Row gutter={[30, 30]} justify="center">
              {[
                { icon: <LockOutlined />, title: 'Browser Lock', desc: 'Disable copy/paste, right‑click, text selection', color: 'var(--color-1)' },
                { icon: <EyeOutlined />, title: 'Live Proctoring', desc: 'Real‑time monitoring with full audit trail', color: 'var(--color-2)' },
                { icon: <ClockCircleOutlined />, title: 'Timer & Auto‑submit', desc: 'Countdown with automatic submission', color: 'var(--color-3)' },
                { icon: <FileTextOutlined />, title: 'Offline Persistence', desc: 'Logs survive refresh and connection loss', color: 'var(--color-4)' },
                { icon: <DashboardOutlined />, title: 'Fullscreen Enforcement', desc: 'Exiting fullscreen is detected and prevented', color: 'var(--color-5)' },
                { icon: <CheckCircleOutlined />, title: 'Immutable Logs', desc: 'Tamper‑proof audit trail for employers', color: 'var(--color-1)' },
              ].map((feat, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  >
                    <Card
                      hoverable
                      style={{ height: '100%', borderRadius: 30, border: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                    >
                      <div style={{ fontSize: 48, color: feat.color, marginBottom: 20, textAlign: 'center' }}>{feat.icon}</div>
                      <Title level={4} style={{ textAlign: 'center' }}>{feat.title}</Title>
                      <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>{feat.desc}</Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>

          {/* STATS SECTION */}
          <section id="stats" style={{ padding: '80px 50px', background: '#fff' }}>
            <Row gutter={[40, 40]} justify="center">
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <Card style={{ textAlign: 'center', borderRadius: 30, border: 'none', background: 'linear-gradient(145deg, var(--color-1), var(--color-2))', color: 'white' }}>
                    <Statistic 
                      title={<span style={{ color: 'white' }}>Exams Proctored</span>} 
                      value={15420} 
                      suffix="+" 
                      styles={{ content: { color: 'white' } }} 
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                >
                  <Card style={{ textAlign: 'center', borderRadius: 30, border: 'none', background: 'linear-gradient(145deg, var(--color-3), var(--color-4))', color: 'white' }}>
                    <Statistic 
                      title={<span style={{ color: 'white' }}>Active Users</span>} 
                      value={3245}
                      styles={{ content: { color: 'white' } }} 
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                >
                  <Card style={{ textAlign: 'center', borderRadius: 30, border: 'none', background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', color: 'white' }}>
                    <Statistic 
                      title={<span style={{ color: 'white' }}>Trusted Companies</span>} 
                      value={128}
                      styles={{ content: { color: 'white' } }} 
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </section>

          {/* REGISTRATION SECTION */}
          <section id="register" style={{ padding: '120px 20px', background: 'var(--bg-gradient)' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card 
                styles={{ body: { padding: 0 } }} 
                style={{ maxWidth: '1100px', margin: '0 auto', borderRadius: '50px', overflow: 'hidden', border: 'none', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
              >
                <Row>
                  <Col xs={24} md={10} style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', color: 'white', padding: '80px 50px' }}>
                    <motion.div
                      initial={{ x: -20 }}
                      whileInView={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Title level={2} style={{ color: 'white', fontSize: '2.5rem' }}>Ready to Start?</Title>
                      <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Join thousands of candidates who trust our secure platform.</Paragraph>
                      <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                      <Space orientation="vertical" size="large">
                        <Text style={{ color: 'white' }}><ClockCircleOutlined /> 60‑minute timed exams</Text>
                        <Text style={{ color: 'white' }}><SafetyOutlined /> Full proctoring enabled</Text>
                        <Text style={{ color: 'white' }}><GlobalOutlined /> Works anywhere</Text>
                      </Space>
                    </motion.div>
                  </Col>
                  <Col xs={24} md={14} style={{ padding: '80px 60px', background: 'white' }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Title level={3} style={{ marginBottom: 30, color: 'var(--color-5)' }}>Candidate Registration</Title>
                      <Form layout="vertical" onFinish={handleStartExam}>
                        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                          <Input size="large" placeholder="John Doe" style={{ borderRadius: 12, padding: '12px 16px' }} />
                        </Form.Item>
                        <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                          <Input size="large" placeholder="john@example.com" style={{ borderRadius: 12, padding: '12px 16px' }} />
                        </Form.Item>
                        <Form.Item name="agree" valuePropName="checked" rules={[{ required: true, message: 'You must agree to the terms' }]}>
                          <Checkbox>I agree to the <a href="#">proctoring terms</a>.</Checkbox>
                        </Form.Item>
                        <Form.Item>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="primary" block size="large" htmlType="submit" loading={loading} 
                              style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', height: 60, borderRadius: 16, fontSize: '1.2rem', border: 'none' }}>
                              Launch Secure Session
                            </Button>
                          </motion.div>
                        </Form.Item>
                      </Form>
                    </motion.div>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </section>
        </Content>

        {/* FOOTER */}
        <Footer style={{ background: '#1a1a1a', padding: '60px 50px 20px', color: '#aaa' }}>
          <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white' }}>SecureAssess</Title>
              <Paragraph style={{ color: '#aaa' }}>Next‑generation proctoring for high‑stakes assessments.</Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ color: 'white' }}>Product</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#features" style={{ color: '#aaa' }}>Features</a></li>
                <li><a href="#pricing" style={{ color: '#aaa' }}>Pricing</a></li>
                <li><a href="#demo" style={{ color: '#aaa' }}>Request Demo</a></li>
              </ul>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ color: 'white' }}>Legal</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: '#aaa' }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: '#aaa' }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: '#aaa' }}>Cookie Policy</a></li>
              </ul>
            </Col>
          </Row>
          <Divider style={{ borderColor: '#333' }} />
          <Paragraph style={{ textAlign: 'center', color: '#aaa', margin: 0 }}>© 2026 SecureAssess. All rights reserved.</Paragraph>
        </Footer>
      </Layout>
    );
  }

  // EXAM VIEW (unchanged)
  return (
    <SecureTestWrapper candidateName={candidate.name}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
        <Timer durationSeconds={3600} attemptId={activeAttemptId!} onFinish={handleSubmit} />
        {questions.map((q) => (
          <Card key={q.id} style={{ marginBottom: 20, borderRadius: 15, border: '2px solid var(--color-5)' }}>
            <Title level={4}>{q.text}</Title>
            <Radio.Group onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
              <Space direction="vertical">
                {q.options.map(opt => <Radio key={opt} value={opt}>{opt}</Radio>)}
              </Space>
            </Radio.Group>
          </Card>
        ))}
        <Button type="primary" size="large" block onClick={handleSubmit} loading={submitting} style={{ background: 'linear-gradient(145deg, var(--color-5), var(--color-4))', height: 50, borderRadius: 10, border: 'none' }}>
          Submit Assessment
        </Button>
      </div>
    </SecureTestWrapper>
  );
}