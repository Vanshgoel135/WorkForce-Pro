import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Tab,
  Tabs,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail) {
      setDemoFormSubmitted(true);
      setTimeout(() => {
        setDemoFormSubmitted(false);
        setDemoModalOpen(false);
        setDemoEmail('');
      }, 2500);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', color: '#1F2937', overflowX: 'hidden' }}>
      {/* ============================================================== */}
      {/* 1. STICKY ENTERPRISE NAVBAR */}
      {/* ============================================================== */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E5E7EB',
          py: 1.75,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Logo size="medium" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3.5,
              }}
            >
              <Typography
                component="a"
                href="#solutions"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                Solutions
              </Typography>
              <Typography
                component="a"
                href="#modules"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                Platform Modules
              </Typography>
              <Typography
                component="a"
                href="#why-us"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                Why WorkForce Pro
              </Typography>
              <Typography
                component="a"
                href="#pricing"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                Pricing
              </Typography>
              <Typography
                component="a"
                href="#testimonials"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                Customers
              </Typography>
              <Typography
                component="a"
                href="#faq"
                sx={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': { color: '#C62828' },
                  transition: 'color 0.2s',
                }}
              >
                FAQ
              </Typography>
            </Box>

            {/* Right Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {user ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#C62828',
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    borderRadius: 2.5,
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#1F2937',
                      fontWeight: 700,
                      px: 2.5,
                      '&:hover': { color: '#C62828', bgcolor: '#FEF2F2' },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setDemoModalOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
                      color: '#FFFFFF',
                      px: 3,
                      py: 1,
                      fontWeight: 700,
                      borderRadius: 2.5,
                      boxShadow: '0 4px 14px rgba(198, 40, 40, 0.25)',
                    }}
                  >
                    Request Demo
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 2. HERO SECTION */}
      {/* ============================================================== */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          background: 'radial-gradient(ellipse at 50% 0%, #FFF5F5 0%, #FFFFFF 75%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          {/* Eyebrow Badge */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Chip
                label="NEXT-GEN ENTERPRISE HCM & GLOBAL PAYROLL PLATFORM"
                size="small"
                sx={{
                  bgcolor: '#FEF2F2',
                  color: '#C62828',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid #FECACA',
                }}
              />
            </motion.div>
          </Box>

          {/* Main Headline */}
          <Box sx={{ textAlign: 'center', maxWidth: 960, mx: 'auto', mb: 3.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.2rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  color: '#111827',
                  mb: 2.5,
                }}
              >
                The Unified Human Capital & Payroll Operating System
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  color: '#4B5563',
                  lineHeight: 1.6,
                  maxWidth: 780,
                  mx: 'auto',
                }}
              >
                Empower your organization with enterprise employee management, automated
                tax-compliant payroll, real-time biometric attendance, and conversational AI
                workforce intelligence.
              </Typography>
            </motion.div>
          </Box>

          {/* Dual Call To Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 8,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
                  px: 4,
                  py: 1.75,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(198, 40, 40, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 100%)',
                    boxShadow: '0 12px 28px rgba(198, 40, 40, 0.45)',
                  },
                }}
              >
                Access WorkForce Pro
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={() => setDemoModalOpen(true)}
                startIcon={<PlayArrowOutlinedIcon />}
                sx={{
                  px: 3.5,
                  py: 1.75,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  borderColor: '#D1D5DB',
                  color: '#1F2937',
                  '&:hover': {
                    borderColor: '#C62828',
                    color: '#C62828',
                    bgcolor: '#FEF2F2',
                  },
                }}
              >
                Schedule Live Demo
              </Button>
            </motion.div>
          </Box>

          {/* Trust Guarantees */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2.5, sm: 5 },
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 600,
              mb: 7,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldOutlinedIcon sx={{ color: '#C62828', fontSize: '1.2rem' }} />
              SOC-2 Type II Certified
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserOutlinedIcon sx={{ color: '#10B981', fontSize: '1.2rem' }} />
              GDPR & Multi-Tenant Compliant
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedOutlinedIcon sx={{ color: '#2563EB', fontSize: '1.2rem' }} />
              99.99% Enterprise Uptime SLA
            </Box>
          </Box>

          {/* Interactive Enterprise Product Mockup Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <Card
              sx={{
                p: { xs: 1.5, sm: 3 },
                borderRadius: { xs: 4, sm: 6 },
                border: '1px solid #E5E7EB',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.03)',
                background: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              {/* Fake Browser Top Chrome */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 2,
                  mb: 2,
                  borderBottom: '1px solid #F3F4F6',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#EF4444' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
                </Box>
                <Box
                  sx={{
                    bgcolor: '#F3F4F6',
                    px: 3,
                    py: 0.6,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    color: '#6B7280',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: '0.9rem', color: '#10B981' }} />
                  app.workforcepro.com/dashboard
                </Box>
                <Chip label="ENTERPRISE PRODUCTION" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 700, fontSize: '0.68rem' }} />
              </Box>

              {/* Inside Dashboard Preview Grid */}
              <Grid container spacing={2}>
                {/* 4 Mini KPI Cards */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: '#FAFAFA', borderRadius: 3, border: '1px solid #F3F4F6' }}>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>Active Employees</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', my: 0.5 }}>1,280</Typography>
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>+12% this month</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: '#FAFAFA', borderRadius: 3, border: '1px solid #F3F4F6' }}>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>Today Attendance</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', my: 0.5 }}>98.4%</Typography>
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>1,259 Checked In</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: '#FAFAFA', borderRadius: 3, border: '1px solid #F3F4F6' }}>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>Disbursed Payroll</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#C62828', my: 0.5 }}>$1.42M</Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>Fully automated</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: '#FAFAFA', borderRadius: 3, border: '1px solid #F3F4F6' }}>
                    <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>AI Workforce Co-Pilot</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', my: 0.5 }}>Active</Typography>
                    <Typography variant="caption" sx={{ color: '#C62828', fontWeight: 700 }}>Zero latency NLP</Typography>
                  </Box>
                </Grid>

                {/* Visual Graphic Representation */}
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: '#F9FAFB',
                      borderRadius: 3,
                      border: '1px solid #F3F4F6',
                      height: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                        Quarterly Headcount & Department Distribution
                      </Typography>
                      <Chip label="Live Metrics" size="small" sx={{ bgcolor: '#E5E7EB', fontSize: '0.7rem' }} />
                    </Box>
                    {/* Simulated bars */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 130, pt: 2, px: 2 }}>
                      {[40, 65, 55, 80, 70, 95, 85, 100, 92, 110, 105, 128].map((val, idx) => (
                        <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: { xs: 12, sm: 24 },
                              height: `${val}%`,
                              bgcolor: idx % 2 === 0 ? '#C62828' : '#FCA5A5',
                              borderRadius: '4px 4px 0 0',
                            }}
                          />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#9CA3AF' }}>M{idx + 1}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* AI Assistant Preview Card */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: '#FEF2F2',
                      borderRadius: 3,
                      border: '1px solid #FECACA',
                      height: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#C62828', width: 28, height: 28 }}>
                        <SmartToyOutlinedIcon sx={{ fontSize: '1rem' }} />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#991B1B' }}>
                        WorkForce AI Intelligence
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#FFFFFF', p: 1.5, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#4B5563', display: 'block', mb: 0.5 }}>
                        "Show attendance anomalies in Engineering this week"
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                        Done. 99.1% present. No policy violations found.
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{ bgcolor: '#C62828', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      Try Enterprise Co-Pilot
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 3. TRUSTED COMPANIES LOGO MARQUEE */}
      {/* ============================================================== */}
      <Box sx={{ py: 6, borderBottom: '1px solid #E5E7EB', bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              fontWeight: 700,
              color: '#9CA3AF',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 3.5,
            }}
          >
            TRUSTED BY FORWARD-THINKING ENTERPRISES WORLDWIDE
          </Typography>

          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {['NEXUS CAPITAL', 'VERTEX CLOUD', 'HORIZON HEALTH', 'VANGUARD GLOBAL', 'LUMINA MEDIA', 'APEX DYNAMICS'].map((brand, i) => (
              <Grid item xs={6} sm={4} md={2} key={i} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#9CA3AF',
                    opacity: 0.8,
                    '&:hover': { color: '#C62828', opacity: 1 },
                    transition: 'all 0.2s',
                  }}
                >
                  {brand}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 4. STATISTICS COUNTER SECTION */}
      {/* ============================================================== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { stat: '45,000+', label: 'Active Employees Managed', sub: 'Across 180+ global entities' },
              { stat: '$1.4B+', label: 'Annual Payroll Disbursed', sub: '100% compliant on-time disbursement' },
              { stat: '99.98%', label: 'Biometric Attendance Accuracy', sub: 'Zero-fault audit logging' },
              { stat: '65%', label: 'Admin Overhead Reduction', sub: 'Automated approval workflows' },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    border: '1px solid #E5E7EB',
                    borderRadius: 4,
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    '&:hover': {
                      borderColor: '#C62828',
                      boxShadow: '0 12px 28px rgba(198, 40, 40, 0.1)',
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.25s ease',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: '#C62828',
                      fontSize: { xs: '2.2rem', md: '2.6rem' },
                      mb: 1,
                    }}
                  >
                    {item.stat}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.85rem' }}>
                    {item.sub}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 5. ENTERPRISE MODULES SUITE (Vensure Style) */}
      {/* ============================================================== */}
      <Box id="modules" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 8 }}>
            <Chip
              label="COMPREHENSIVE HCM ARCHITECTURE"
              size="small"
              sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 2 }}
            />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Everything Your Organization Needs to Scale
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem' }}>
              Replace fragmented tools with a single unified platform for human resources,
              payroll disbursements, attendance, and corporate intelligence.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {[
              {
                icon: <PeopleAltOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'Core Employee Management',
                desc: 'Unified employee profiles, document records, salary history, department allocation, and life-cycle progression.',
                tag: 'Central Registry',
              },
              {
                icon: <AccessTimeOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'Time & Attendance Engine',
                desc: 'Real-time clock-in and clock-out logs, automated status reporting (PRESENT, ABSENT, HALF_DAY), and multi-shift tracking.',
                tag: 'Real-Time Sync',
              },
              {
                icon: <PaymentsOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'Automated Enterprise Payroll',
                desc: 'Dynamic salary disbursements, automatic allowance computation, deductions, tax compliance, and instant payslip generation.',
                tag: 'Zero-Error Payroll',
              },
              {
                icon: <EventAvailableOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'Leave & Absence Workflows',
                desc: 'Multi-tier leave requests, manager approvals, pending leave queues, remaining quota balances, and real-time email alerts.',
                tag: 'Automated Approvals',
              },
              {
                icon: <CorporateFareOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'Multi-Tenant Organization Structure',
                desc: 'Multi-entity corporate architecture, branch nodes, department hierarchies, and fine-grained Role-Based Access Control (RBAC).',
                tag: 'Multi-Tenant',
              },
              {
                icon: <SmartToyOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'AI Workforce Intelligence Co-Pilot',
                desc: 'Conversational assistant connected directly to backend analytics. Inquire about attendance anomalies, policy questions, and metrics.',
                tag: 'NLP Intelligence',
              },
            ].map((module, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    '&:hover': {
                      borderColor: '#C62828',
                      boxShadow: '0 12px 30px rgba(198, 40, 40, 0.1)',
                      transform: 'translateY(-4px)',
                      '& .module-icon': {
                        bgcolor: '#C62828',
                        color: '#FFFFFF',
                      },
                    },
                    transition: 'all 0.25s ease',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Box
                        className="module-icon"
                        sx={{
                          width: 54,
                          height: 54,
                          borderRadius: 3,
                          bgcolor: '#FEF2F2',
                          color: '#C62828',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        {module.icon}
                      </Box>
                      <Chip label={module.tag} size="small" sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 600, fontSize: '0.72rem' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1.5 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6, fontSize: '0.9rem' }}>
                      {module.desc}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 3, mt: 2, borderTop: '1px solid #F3F4F6' }}>
                    <Typography
                      component="span"
                      onClick={() => navigate('/login')}
                      sx={{
                        color: '#C62828',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { gap: 1 },
                        transition: 'all 0.2s',
                      }}
                    >
                      Explore capability <ArrowForwardIcon sx={{ fontSize: '0.9rem' }} />
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 6. INTERACTIVE PRODUCT SHOWCASE TABS */}
      {/* ============================================================== */}
      <Box id="solutions" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Built for Modern People & Finance Leaders
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem' }}>
              Select a functional pillar to see how WorkForce Pro streamlines everyday operational complexity.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#C62828', height: 3, borderRadius: 2 },
                '& .MuiTab-root': {
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  color: '#6B7280',
                  '&.Mui-selected': { color: '#C62828' },
                },
              }}
            >
              <Tab label="1. People Operations" />
              <Tab label="2. Smart Attendance" />
              <Tab label="3. Automated Payroll" />
              <Tab label="4. AI Assistant" />
            </Tabs>
          </Box>

          {/* Tab Content Cards */}
          <Card
            sx={{
              p: { xs: 3, sm: 5 },
              bgcolor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 5,
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}
          >
            {activeTab === 0 && (
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="CORE HR" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
                    Effortless Employee Lifecycle Management
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', mb: 3, lineHeight: 1.7 }}>
                    From seamless new hire onboarding to organization department transfers and compensation records,
                    maintain an uncompromised single source of truth for your entire workforce.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {['Automated welcome emails on new hire creation', 'Role-based access for Admin, HR, and Employee tiers', 'Integrated photo upload with instant preview', 'Multi-department organizational assignment'].map((pt, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>{pt}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{ bgcolor: '#C62828', px: 3, py: 1.25, fontWeight: 700 }}
                  >
                    View Employee Directory
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                    alt="Office collaboration team"
                    sx={{
                      width: '100%',
                      height: 340,
                      objectFit: 'cover',
                      borderRadius: 4,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="TIME & ATTENDANCE" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
                    Precision Attendance & Shift Analytics
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', mb: 3, lineHeight: 1.7 }}>
                    Eliminate buddy-punching and time theft with real-time biometric and location-verified check-in.
                    Automatically calculate punctuality rates and integrate directly into payroll formulas.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {['Instant Check-In / Check-Out with real-time timestamps', 'Dynamic status categorization: PRESENT, ABSENT, HALF_DAY', 'Searchable attendance audit logs with date filters', 'Seamless sync with monthly salary calculation'].map((pt, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>{pt}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{ bgcolor: '#C62828', px: 3, py: 1.25, fontWeight: 700 }}
                  >
                    Explore Attendance Portal
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                    alt="Corporate business discussion"
                    sx={{
                      width: '100%',
                      height: 340,
                      objectFit: 'cover',
                      borderRadius: 4,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="PAYROLL & COMPENSATION" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
                    Tax-Compliant Automated Payroll
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', mb: 3, lineHeight: 1.7 }}>
                    Run error-free multi-state and multi-currency payroll in seconds. Automatically compute allowances,
                    tax deductions, net compensations, and generate official downloadable pay slips.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {['Automated base salary, allowances, and statutory deductions', 'Instant PDF / Printable pay slip generation for employees', 'Comprehensive salary disbursement history by month & year', 'Full enterprise payroll audit trail'].map((pt, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>{pt}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{ bgcolor: '#C62828', px: 3, py: 1.25, fontWeight: 700 }}
                  >
                    Review Payroll Engine
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
                    alt="Financial technology and payroll analytics"
                    sx={{
                      width: '100%',
                      height: 340,
                      objectFit: 'cover',
                      borderRadius: 4,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip label="ENTERPRISE AI CO-PILOT" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 1.5 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
                    Real-Time Organizational Intelligence
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', mb: 3, lineHeight: 1.7 }}>
                    Connected directly to your company data through secure backend APIs (`POST /ai/chat`).
                    Executives and employees can ask complex operational questions in plain conversational English.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {['Zero direct Gemini frontend leakage — 100% backend secured', 'Instant headcount, department, and salary analytics', 'Markdown formatted replies with structured bullet points', 'Always-available floating assistant across all dashboard screens'].map((pt, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.2rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>{pt}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{ bgcolor: '#C62828', px: 3, py: 1.25, fontWeight: 700 }}
                  >
                    Test AI Assistant
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                    alt="Corporate meeting analyzing intelligence"
                    sx={{
                      width: '100%',
                      height: 340,
                      objectFit: 'cover',
                      borderRadius: 4,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Card>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 7. WHY CHOOSE WORKFORCE PRO (Comparison Grid) */}
      {/* ============================================================== */}
      <Box id="why-us" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 8 }}>
            <Chip label="THE WORKFORCE PRO ADVANTAGE" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Why Modern Enterprises Choose Us Over Legacy HR
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem' }}>
              Built for speed, accuracy, and security without bloated 18-month implementation cycles.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: 'Instant Multi-Tenant Setup',
                text: 'Deploy entire corporate organizational structures, departments, and roles in minutes instead of months of custom consulting.',
              },
              {
                title: 'Native AI Intelligence',
                text: 'No bolt-on third party widgets. WorkForce Pro features deeply integrated conversational intelligence with backend security.',
              },
              {
                title: 'High-Velocity Performance',
                text: 'Sub-second API response times and stateless JWT authentication with automated token expiration guards.',
              },
              {
                title: 'Zero Hidden Fees',
                text: 'Transparent, predictable pricing with no per-run payroll surcharges or surprise compliance fees.',
              },
              {
                title: 'Bank-Grade Compliance',
                text: 'Automated email alerts, password hashing with BCrypt, strict role guards, and complete audit logging.',
              },
              {
                title: 'Dedicated Enterprise Support',
                text: '24/7 dedicated technical account executive and 99.99% guaranteed enterprise uptime SLA.',
              },
            ].map((feature, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 4,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    '&:hover': {
                      borderColor: '#C62828',
                      boxShadow: '0 8px 24px rgba(198, 40, 40, 0.08)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.4rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6 }}>
                    {feature.text}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 8. TESTIMONIALS SECTION */}
      {/* ============================================================== */}
      <Box id="testimonials" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 8 }}>
            <Chip label="PROVEN ENTERPRISE RESULTS" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Loved by HR Leaders & CFOs
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem' }}>
              Hear how multinational organizations rely on WorkForce Pro to streamline daily operations.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {[
              {
                quote: 'WorkForce Pro unified our 1,400 employees across 4 continents. Payroll processing time plummeted from 4 days to 45 minutes.',
                author: 'Sarah Jenkins',
                title: 'Chief People Officer, Horizon Global',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                rating: 5,
              },
              {
                quote: 'The AI Workforce Co-Pilot has completely eliminated routine policy tickets for our HR team. Our employees love the immediate answers.',
                author: 'David Zhao',
                title: 'VP of Human Resources, Vertex Cloud',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                rating: 5,
              },
              {
                quote: 'Finally an enterprise HRMS with modern UX and zero clutter. Our managers approved over 2,000 leave requests with zero training required.',
                author: 'Elena Rostova',
                title: 'Head of People Operations, Lumina Tech',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
                rating: 5,
              },
            ].map((testi, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: '#FAFAFA',
                    border: '1px solid #E5E7EB',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', gap: 0.5, color: '#F59E0B', mb: 2.5 }}>
                      {[...Array(testi.rating)].map((_, r) => (
                        <StarIcon key={r} sx={{ fontSize: '1.1rem' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#1F2937', fontStyle: 'italic', lineHeight: 1.7, mb: 3 }}>
                      "{testi.quote}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, borderTop: '1px solid #E5E7EB' }}>
                    <Avatar src={testi.avatar} alt={testi.author} sx={{ width: 48, height: 48, border: '2px solid #C62828' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                        {testi.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                        {testi.title}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 9. TRANSPARENT PRICING PLANS */}
      {/* ============================================================== */}
      <Box id="pricing" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 780, mx: 'auto', mb: 6 }}>
            <Chip label="PREDICTABLE INVESTMENT" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Simple, Transparent Enterprise Pricing
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem', mb: 4 }}>
              Scale effortlessly from fast-growing teams to multinational enterprises.
            </Typography>

            {/* Billing Toggle */}
            <Box sx={{ display: 'inline-flex', bgcolor: '#E5E7EB', p: 0.5, borderRadius: 3 }}>
              <Button
                size="small"
                onClick={() => setBillingCycle('monthly')}
                sx={{
                  bgcolor: billingCycle === 'monthly' ? '#FFFFFF' : 'transparent',
                  color: billingCycle === 'monthly' ? '#111827' : '#4B5563',
                  fontWeight: 700,
                  px: 2.5,
                  borderRadius: 2.5,
                  boxShadow: billingCycle === 'monthly' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Monthly Billing
              </Button>
              <Button
                size="small"
                onClick={() => setBillingCycle('annual')}
                sx={{
                  bgcolor: billingCycle === 'annual' ? '#C62828' : 'transparent',
                  color: billingCycle === 'annual' ? '#FFFFFF' : '#4B5563',
                  fontWeight: 700,
                  px: 2.5,
                  borderRadius: 2.5,
                  boxShadow: billingCycle === 'annual' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Annual Billing (Save 20%)
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3.5} alignItems="stretch">
            {/* Starter Tier */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>Starter Growth</Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>Essential HR core and automated attendance for emerging teams.</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#111827' }}>
                      {billingCycle === 'annual' ? '$6' : '$8'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>/ employee / month</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {['Up to 50 active employees', 'Core Employee Directory & Profiles', 'Real-time Attendance Clock-in', 'Basic Leave Requests & Approvals', 'Email Notifications & Alerts'].map((f, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.1rem' }} />
                        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/login')}
                  sx={{ py: 1.25, fontWeight: 700, borderRadius: 2.5 }}
                >
                  Get Started Free
                </Button>
              </Card>
            </Grid>

            {/* Professional Tier (Highlighted) */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: '#FFFFFF',
                  border: '2px solid #C62828',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: '0 12px 30px rgba(198, 40, 40, 0.12)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#C62828',
                    color: '#FFFFFF',
                    px: 2,
                    py: 0.4,
                    borderRadius: 2,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  MOST POPULAR FOR SCALE
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>Professional Scale</Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>Full-suite automated payroll, biometric sync, and department control.</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#C62828' }}>
                      {billingCycle === 'annual' ? '$12' : '$15'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>/ employee / month</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {[
                      'Unlimited employees & departments',
                      'Automated Tax-Compliant Payroll Engine',
                      'Printable Pay Slips & Salary Slips',
                      'Multi-tier Leave Policy & Quota Rules',
                      'AI Workforce Assistant (POST /ai/chat)',
                      'Priority Support & SLA Guarantees',
                    ].map((f, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.1rem' }} />
                        <Typography variant="body2" sx={{ color: '#111827', fontWeight: 700 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 1.5,
                    fontWeight: 800,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
                  }}
                >
                  Deploy Professional
                </Button>
              </Card>
            </Grid>

            {/* Enterprise Tier */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>Global Enterprise</Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>Custom multi-tenant infrastructure, dedicated account executive, and SLA.</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#111827' }}>Custom</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>tailored volume pricing</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                    {[
                      'Multi-tenant custom sub-organizations',
                      'Dedicated PostgreSQL cluster isolation',
                      '99.99% Guaranteed uptime SLA with financial penalty',
                      '24/7/365 Dedicated Senior Technical Manager',
                      'Custom AI Model fine-tuning & policy feeds',
                    ].map((f, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#C62828', fontSize: '1.1rem' }} />
                        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setDemoModalOpen(true)}
                  sx={{ py: 1.25, fontWeight: 700, borderRadius: 2.5 }}
                >
                  Contact Enterprise Sales
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ============================================================== */}
      <Box id="faq" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="FREQUENTLY ASKED QUESTIONS" size="small" sx={{ bgcolor: '#FEF2F2', color: '#C62828', fontWeight: 800, mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
              Everything You Need to Know
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.05rem' }}>
              Clear answers regarding security, compliance, backend architecture, and migration.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              {
                q: 'How does WorkForce Pro handle data security and multi-tenancy?',
                a: 'Each organization operates in complete data isolation via multi-tenant organization IDs attached to all database records. Authentication is secured using HMAC-SHA256 stateless JWT tokens with role-based method security (@PreAuthorize).',
              },
              {
                q: 'Can we migrate existing records from BambooHR, Workday, or spreadsheets?',
                a: 'Yes. WorkForce Pro provides automated onboarding workflows and REST API endpoints (/employees, /departments, /organization) allowing instant bulk imports without downtime.',
              },
              {
                q: 'How does the AI Assistant access corporate knowledge?',
                a: 'The AI Assistant communicates exclusively through your secure Spring Boot backend (POST /ai/chat). No customer credentials or private employee records are exposed to third-party endpoints directly from the browser.',
              },
              {
                q: 'How are automated payroll and payslips generated?',
                a: 'Salaries are computed based on base compensation, department allowances, deductions, and verified attendance rates. Official printable payslips are generated instantly through the Salary module.',
              },
              {
                q: 'Can we try the system before subscribing?',
                a: 'Yes. You can immediately access the live platform using the quick-fill Demo Accounts (Admin, HR, Employee) on our Sign In screen.',
              },
            ].map((faq, i) => (
              <Accordion
                key={i}
                elevation={0}
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: '#C62828' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#C62828' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                  <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 11. HIGH-CONVERSION CTA BANNER */}
      {/* ============================================================== */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, sm: 8 },
              borderRadius: 6,
              background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 50%, #E53935 100%)',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(198, 40, 40, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.8rem' },
                letterSpacing: '-0.03em',
                mb: 2,
              }}
            >
              Ready to Modernize Your Workforce Operations?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 680,
                mx: 'auto',
                mb: 4.5,
              }}
            >
              Join thousands of progressive organizations simplifying HR, payroll, and attendance with WorkForce Pro.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#C62828',
                  px: 4.5,
                  py: 1.75,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderRadius: 3,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#FFF5F5',
                    color: '#B71C1C',
                  },
                }}
              >
                Launch WorkForce Pro Workspace
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setDemoModalOpen(true)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  color: '#FFFFFF',
                  px: 4,
                  py: 1.75,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Schedule Private Consultation
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* 12. CORPORATE FOOTER */}
      {/* ============================================================== */}
      <Box component="footer" sx={{ bgcolor: '#111827', color: '#9CA3AF', pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ mb: 8 }}>
            {/* Col 1: Brand Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Logo variant="white" size="medium" />
              </Box>
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.7, mb: 3, maxWidth: 320 }}>
                WorkForce Pro is an enterprise Human Capital Management SaaS platform empowering global teams
                with automated payroll, intelligent attendance, and conversational HR AI.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip label="SOC-2 Certified" size="small" sx={{ bgcolor: '#1F2937', color: '#E5E7EB', fontSize: '0.72rem' }} />
                <Chip label="ISO 27001" size="small" sx={{ bgcolor: '#1F2937', color: '#E5E7EB', fontSize: '0.72rem' }} />
                <Chip label="GDPR Compliant" size="small" sx={{ bgcolor: '#1F2937', color: '#E5E7EB', fontSize: '0.72rem' }} />
              </Box>
            </Grid>

            {/* Col 2: Solutions */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2.5, letterSpacing: '0.04em' }}>
                SOLUTIONS
              </Typography>
              {['Core HR Registry', 'Smart Attendance', 'Payroll Engine', 'Leave Automation', 'Organization Units', 'AI Intelligence'].map((item, idx) => (
                <Typography
                  key={idx}
                  component="a"
                  href="#modules"
                  sx={{
                    display: 'block',
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    mb: 1.5,
                    '&:hover': { color: '#FFFFFF' },
                    transition: 'color 0.2s',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Col 3: Platform */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2.5, letterSpacing: '0.04em' }}>
                PLATFORM
              </Typography>
              {['Multi-Tenant Security', 'Role-Based Access', 'API Documentation', 'System Status', 'Uptime SLA', 'Audit Logs'].map((item, idx) => (
                <Typography
                  key={idx}
                  component="span"
                  onClick={() => navigate('/login')}
                  sx={{
                    display: 'block',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    mb: 1.5,
                    '&:hover': { color: '#FFFFFF' },
                    transition: 'color 0.2s',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Col 4: Company */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2.5, letterSpacing: '0.04em' }}>
                COMPANY
              </Typography>
              {['About WorkForce Pro', 'Enterprise Customers', 'Leadership Team', 'Careers', 'Press & Media', 'Contact Support'].map((item, idx) => (
                <Typography
                  key={idx}
                  component="span"
                  sx={{
                    display: 'block',
                    color: '#9CA3AF',
                    fontSize: '0.875rem',
                    mb: 1.5,
                    cursor: 'default',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Col 5: Security & Contact */}
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2.5, letterSpacing: '0.04em' }}>
                CONTACT
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon sx={{ fontSize: '1rem', color: '#C62828' }} /> support@workforcepro.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneOutlinedIcon sx={{ fontSize: '1rem', color: '#C62828' }} /> +1 (800) 555-WFPRO
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 4 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              fontSize: '0.825rem',
            }}
          >
            <Typography variant="caption" sx={{ color: '#6B7280' }}>
              &copy; {new Date().getFullYear()} WorkForce Pro Technologies Inc. All rights reserved. Vensure-inspired enterprise design.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#E5E7EB' } }}>
                Privacy Policy
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#E5E7EB' } }}>
                Terms of Service
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', cursor: 'pointer', '&:hover': { color: '#E5E7EB' } }}>
                Security Whitepaper
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* DEMO REQUEST MODAL */}
      {/* ============================================================== */}
      <Dialog open={demoModalOpen} onClose={() => setDemoModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', pb: 1 }}>
          Schedule a 1-on-1 Enterprise Demo
        </DialogTitle>
        <DialogContent>
          {demoFormSubmitted ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 56, color: '#10B981', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Demo Invitation Sent!</Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                An enterprise solution architect will contact you shortly with personalized demo credentials.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleDemoSubmit} sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ color: '#4B5563', mb: 3 }}>
                Experience live automated payroll, biometric attendance sync, and conversational AI tailored to your organizational scale.
              </Typography>
              <TextField
                fullWidth
                label="Corporate Email Address"
                placeholder="name@enterprise.com"
                type="email"
                required
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                sx={{ mb: 2.5 }}
              />
              <DialogActions sx={{ p: 0, pt: 1 }}>
                <Button onClick={() => setDemoModalOpen(false)} sx={{ color: '#6B7280' }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#C62828',
                    px: 3.5,
                    py: 1,
                    fontWeight: 700,
                  }}
                >
                  Confirm Request
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
