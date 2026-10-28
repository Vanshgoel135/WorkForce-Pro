import api from './api';

export const aiService = {
  chat: async (prompt: string): Promise<string> => {
    try {
      const response = await api.post('/ai/chat', prompt, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      const data = response.data;

      // Handle if response is string containing Gemini JSON
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return parsed.candidates[0].content.parts[0].text;
          }
        } catch {
          // If it's pure plain text string
          return data;
        }
        return data;
      }

      // Handle if response is parsed object
      if (typeof data === 'object' && data !== null) {
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
        if (data.text) {
          return data.text;
        }
        if (data.message) {
          return data.message;
        }
      }

      return String(data);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      throw new Error(err.message || 'Failed to communicate with WorkForce AI');
    }
  },
};

export default aiService;
