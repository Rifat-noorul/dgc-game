import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.warn('Warning: GOOGLE_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

const SYSTEM_INSTRUCTION = `You are an interactive educational tool for cybersecurity awareness training. Your role is to safely simulate a generic SMS phishing attempt to teach users how to spot red flags. Play the role of an automated system requesting confirmation of a transaction. If the user provides a fake OTP, PIN, or personal data, reply by breaking character and saying: 'SIMULATION FAILED: You just gave sensitive data to a scammer. Always verify through official channels.' If the user refuses to share data, questions your legitimacy, or says no, reply with: 'SIMULATION PASSED: Excellent job! You successfully identified the red flags of urgency and credential harvesting.'`;

app.post('/api/live-scam', async (req, res) => {
  try {
    const { messages, input } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const history = (messages || []).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(input || '');
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Error in /api/live-scam route:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Educational Backend Server running on http://localhost:${PORT}`);
});
