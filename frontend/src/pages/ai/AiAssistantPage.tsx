import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import ReactMarkdown from 'react-markdown';

import PageHeader from '../../components/common/PageHeader';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### Welcome to WorkForce AI 🚀\n\nI am your intelligent enterprise HRMS Copilot powered by **Spring AI & Gemini**.\n\nHere are a few things I can assist you with:\n- **HR Policies & Compliance:** Drafting employee handbooks, onboarding guides, or grievance resolution steps.\n- **Payroll Calculations:** Explaining gross-to-net pay computations, tax withholdings, and bonus incentives.\n- **Attendance & Shift Rules:** Managing biometric logging, overtime rules, and half-day absence formulas.\n- **Team Communications:** Writing formal announcements, welcome emails, or performance feedback.\n\n*How can I help you today?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await aiService.chat(textToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response || 'No response received from AI model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **AI Service Error:** ${err.message || 'Unable to connect to Spring AI endpoint /ai/chat. Please ensure backend service is running.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'ai',
        text: 'Session reset. What would you like to explore next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const promptStarters = [
    {
      title: 'Calculate Net Salary',
      prompt: 'How is net salary calculated from basic salary, bonuses, and deductions in WorkForce Pro?',
    },
    {
      title: 'Leave Policy Draft',
      prompt: 'Draft a standard corporate annual leave and emergency sick leave policy for a SaaS company.',
    },
    {
      title: 'Onboarding Checklist',
      prompt: 'Give me a comprehensive 30-day onboarding checklist for newly joined software engineers.',
    },
    {
      title: 'Performance Review Questions',
      prompt: 'Suggest 5 impactful questions for a manager to conduct a constructive quarterly performance review.',
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="AI Workforce Assistant"
        subtitle="Intelligent copilot connected directly to Spring AI (POST /ai/chat) with Gemini language intelligence."
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleClear}
            sx={{ borderRadius: 2.5 }}
          >
            Clear Conversation
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        {/* Left Side: Starter Templates */}
        <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}>
          <Card sx={{ height: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <HelpOutlineIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Recommended Prompts
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Click any prompt to instantly run intelligence analysis:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {promptStarters.map((item, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    onClick={() => handleSend(item.prompt)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                      {item.prompt}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  SECURITY NOTE
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.5 }}>
                  Frontend strictly calls your Spring Boot backend <code>POST /ai/chat</code>. API keys are safely held in the backend and never exposed to the client.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Main Chat Interface */}
        <Grid size={{ xs: 12, md: 8.5 }} sx={{ height: '100%' }}>
          <Card sx={{ height: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Messages Body */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                bgcolor: (theme: any) =>
                  theme.palette.mode === 'light' ? '#f8fafc' : '#0c1322',
              }}
            >
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignSelf: isAi ? 'flex-start' : 'flex-end',
                      maxWidth: { xs: '100%', md: '85%' },
                      flexDirection: isAi ? 'row' : 'row-reverse',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: isAi ? 'primary.main' : 'secondary.main',
                        color: '#ffffff',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isAi ? <SmartToyOutlinedIcon fontSize="small" /> : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>

                    <Box sx={{ width: '100%' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3.5,
                          borderTopLeftRadius: isAi ? 4 : 16,
                          borderTopRightRadius: isAi ? 16 : 4,
                          bgcolor: isAi ? 'background.paper' : 'primary.main',
                          color: isAi ? 'text.primary' : '#ffffff',
                          border: isAi ? '1px solid' : 'none',
                          borderColor: 'divider',
                          boxShadow: isAi
                            ? '0 2px 10px rgba(0,0,0,0.04)'
                            : '0 4px 14px rgba(79, 70, 229, 0.3)',
                          fontSize: '0.925rem',
                          lineHeight: 1.6,
                          '& pre': {
                            bgcolor: 'action.hover',
                            p: 1.5,
                            borderRadius: 2,
                            overflowX: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.82rem',
                          },
                          '& code': {
                            fontFamily: 'monospace',
                            bgcolor: isAi ? 'action.hover' : 'rgba(255,255,255,0.2)',
                            px: 0.6,
                            py: 0.2,
                            borderRadius: 1,
                          },
                          '& p': { m: 0, mb: 1.2, '&:last-child': { mb: 0 } },
                          '& ul, & ol': { pl: 2.5, mb: 1 },
                        }}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </Paper>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isAi ? 'flex-start' : 'flex-end',
                          gap: 1.5,
                          mt: 0.5,
                          px: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
                          {msg.timestamp}
                        </Typography>
                        {isAi && (
                          <Tooltip title={copiedId === msg.id ? 'Copied' : 'Copy message'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(msg.id, msg.text)}
                              sx={{ p: 0.5, color: 'text.secondary' }}
                            >
                              {copiedId === msg.id ? (
                                <CheckIcon sx={{ fontSize: 14, color: 'success.main' }} />
                              ) : (
                                <ContentCopyIcon sx={{ fontSize: 14 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    WorkForce AI is reasoning with Spring AI and Gemini...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Bar */}
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSend();
              }}
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                gap: 1.5,
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your message or policy question to WorkForce AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!input.trim() || loading}
                sx={{ px: 3, borderRadius: 2.5, minWidth: 100 }}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AiAssistantPage;
