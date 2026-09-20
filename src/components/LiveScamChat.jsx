import React, { useState } from 'react';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';

export default function LiveScamChat() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'SECURITY ALERT: Urgent verification required for transaction #8839 of $499.00. Reply with your 6-digit OTP to block this transaction.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/live-scam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          input: currentInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || 'No response from simulator.' },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Error connecting to educational simulator server. Please verify server is running on port 5000.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 border-b border-slate-700/50 flex items-center justify-between backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">SMS Phishing Simulator</h2>
            <p className="text-xs text-slate-400">Educational Training Module</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[350px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Educational simulator analyzing response...
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-slate-800/50 border-t border-slate-700/50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          disabled={loading}
          className="flex-1 bg-slate-950 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl font-medium transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
