const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Configure the AI model with your hackathon educational prompt
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are an interactive cybersecurity training AI. Your goal is to simulate an SMS phishing (smishing) scam to teach users how to spot fraud. 
            
Start by acting like a scammer. Use urgency, authority, or panic (e.g., 'Your bank account will be locked in 24 hours'). Keep your messages short, realistic, and formatted like text messages.

Follow these strict rules:
1. If the user shares any sensitive information (like an OTP, PIN, password, or credit card number), immediately break character and reply exactly with: 'SIMULATION FAILED: You just shared sensitive data. Real organizations will never ask for your PIN or OTP via text. Look out for the red flag of urgency.'
2. If the user successfully calls out the scam, refuses to share info, or says they will call the official support line, immediately break character and reply exactly with: 'SIMULATION PASSED: Excellent job! You correctly identified the scam. You noticed the red flags and protected your data.'
3. If the user asks questions, try to manipulate them into giving the info, but never break character until they either pass or fail.`
    });

    // Send the user's message to Gemini and get the reply
    const result = await model.generateContent(userMessage);
    const response = await result.response;

    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to connect to AI." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});