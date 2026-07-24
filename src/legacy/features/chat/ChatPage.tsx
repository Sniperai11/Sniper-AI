import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Bot, User, ShieldAlert, Cpu, FileText, Code, CheckCircle } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';

export interface ChatPageProps {
  userProfile: any;
  chatMessages: Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>;
  onSendMessage: (message: string) => void;
  isChatSending: boolean;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  userProfile,
  chatMessages = [],
  onSendMessage,
  isChatSending
}) => {
  const [input, setInput] = useState('');
  const safeChatMessages = Array.isArray(chatMessages) ? chatMessages : [];

  const quickPrompts = [
    { label: "Explain vulnerability", prompt: "Explain this SQL Injection vulnerability and its root cause in detail." },
    { label: "Generate Fix", prompt: "Generate a secure code fix using Prepared Statements." },
    { label: "Create Patch", prompt: "Create a Git patch to apply security headers to Express.js server." },
    { label: "Summarize Report", prompt: "Summarize the latest security audit report for executive stakeholders." },
    { label: "Security Advice", prompt: "Give me security advice to protect JWT authentication in Node.js." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isChatSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleQuickPromptClick = (pText: string) => {
    if (!isChatSending) {
      onSendMessage(pText);
    }
  };

  return (
    <div className="space-y-6 text-right flex flex-col h-[80vh]" dir="rtl">
      
      {/* HEADER */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            AI Security Assistant (Ask Sniper AI)
          </h2>
          <p className="text-xs text-slate-400 mt-1">مساعد ومستشار الأمن السيبراني الذكي لتحليل الشفرات والتقارير الأثرية وتوليد الحلول</p>
        </div>
      </div>

      {/* QUICK PROMPTS BAR */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPromptClick(qp.prompt)}
            disabled={isChatSending}
            className="px-3 py-1.5 bg-[#0D111C] hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {qp.label}
          </button>
        ))}
      </div>

      {/* CHAT VIEWPORT */}
      <Card variant="cyber" className="flex-1 flex flex-col min-h-0 p-4">
        
        {/* MESSAGES HUB */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {safeChatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}
            >
              {/* Avatar */}
              <div className={`p-2 rounded-xl border shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20' 
                  : 'bg-purple-950/40 text-purple-400 border-purple-500/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Text Bubble */}
              <div className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-slate-100 border-slate-800'
                  : 'bg-[#070B14] text-slate-200 border-slate-800 font-sans'
              }`}>
                {msg.text}
                <span className="text-[9px] text-slate-500 block mt-2 text-left">
                  {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isChatSending && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold animate-pulse p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> Sniper AI Analysis in progress...
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="border-t border-slate-800 pt-3 mt-2 flex gap-3 shrink-0">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isChatSending}
            placeholder="Ask Sniper AI anything about vulnerabilities, remediation, code patches..."
            className="flex-1 bg-[#070B14] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Button 
            type="submit" 
            disabled={isChatSending || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl flex items-center gap-2 shrink-0 font-bold"
          >
            <Send className="w-4 h-4" /> Ask
          </Button>
        </form>

      </Card>

    </div>
  );
};
