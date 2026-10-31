import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Button,
  Avatar,
  CircularProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ReactMarkdown from 'react-markdown';
import aiService from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: "👋 Hello! I am your **WorkForce Pro AI Assistant** powered by Spring AI & enterprise intelligence.\n\nAsk me anything about company HR policies, payroll calculations, leave quotas, or attendance records!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      const reply = await aiService.chat(textToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply || 'I received an empty response. Please rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **AI Service Notification**: ${err.message || 'Error communicating with backend AI endpoint.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        id: 'init-cleared',
        sender: 'ai',
        text: 'Chat history cleared. How can I assist you with your workforce operations today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    'How is net salary computed in WorkForce Pro?',
    'What are the mandatory parameters for leave approval?',
    'Draft an employee welcome announcement email',
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1300,
          }}
        >
          <Tooltip title="Ask WorkForce AI" placement="left">
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C62828 0%, #E53935 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(198, 40, 40, 0.45)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'scale(1.08) translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(198, 40, 40, 0.6)',
                },
              }}
            >
              <SmartToyOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <Paper
          elevation={16}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 28 },
            right: { xs: 16, sm: 28 },
            width: { xs: 'calc(100vw - 32px)', sm: 400 },
            height: { xs: 'calc(100vh - 120px)', sm: 580 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1300,
            bgcolor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Assistant Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #B71C1C 0%, #C62828 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  width: 36,
                  height: 36,
                }}
              >
                <SmartToyOutlinedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  WorkForce AI
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  Spring AI + Gemini Enterprise
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Clear chat history">
                <IconButton onClick={handleClear} size="small" sx={{ color: '#ffffff', opacity: 0.85 }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Minimize">
                <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: '#ffffff', ml: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Quick suggestions if chat only has welcome message */}
          {messages.length <= 1 && (
            <Box sx={{ p: 1.5, bgcolor: '#FAFAFA', borderBottom: '1px solid #E5E7EB' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B7280', display: 'block', mb: 0.75 }}>
                Suggested inquiries:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {quickPrompts.map((prompt, idx) => (
                  <Chip
                    key={idx}
                    label={prompt}
                    size="small"
                    onClick={() => handleSend(prompt)}
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      justifyContent: 'flex-start',
                      cursor: 'pointer',
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      '&:hover': { bgcolor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Messages Stream */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: '#F9FAFB',
            }}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '85%',
                      p: 1.75,
                      borderRadius: 3,
                      borderTopLeftRadius: isAi ? 0 : 12,
                      borderTopRightRadius: isAi ? 12 : 0,
                      bgcolor: isAi ? '#FFFFFF' : '#C62828',
                      color: isAi ? '#1F2937' : '#FFFFFF',
                      border: isAi ? '1px solid #E5E7EB' : 'none',
                      boxShadow: isAi ? '0 2px 6px rgba(0,0,0,0.03)' : '0 4px 12px rgba(198, 40, 40, 0.25)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      position: 'relative',
                      '& pre': {
                        bgcolor: '#F3F4F6',
                        p: 1,
                        borderRadius: 1.5,
                        overflowX: 'auto',
                        fontSize: '0.78rem',
                        color: '#111827',
                      },
                      '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
                      '& ul, & ol': { pl: 2, m: 0 },
                    }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, px: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.68rem' }}>
                      {msg.timestamp}
                    </Typography>
                    {isAi && (
                      <Tooltip title={copiedId === msg.id ? 'Copied!' : 'Copy reply'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          sx={{ p: 0.25, color: '#9CA3AF', fontSize: '0.75rem', '&:hover': { color: '#C62828' } }}
                        >
                          {copiedId === msg.id ? (
                            <CheckIcon sx={{ fontSize: 13, color: '#10B981' }} />
                          ) : (
                            <ContentCopyIcon sx={{ fontSize: 13 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              );
            })}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
                <CircularProgress size={18} thickness={5} sx={{ color: '#C62828' }} />
                <Typography variant="caption" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                  WorkForce AI is analyzing and generating response...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Box */}
          <Box
            component="form"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{
              p: 1.5,
              borderTop: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <InputBase
              placeholder="Ask WorkForce AI..."
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{
                fontSize: '0.875rem',
                px: 1.5,
                py: 0.75,
                borderRadius: 2.5,
                bgcolor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!input.trim() || loading}
              sx={{
                minWidth: 42,
                width: 42,
                height: 42,
                p: 0,
                borderRadius: 2.5,
                bgcolor: '#C62828',
                '&:hover': { bgcolor: '#B71C1C' },
              }}
            >
              <SendIcon fontSize="small" />
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default FloatingAiAssistant;
