import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Bot, User, Trash2 } from 'lucide-react';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isChatSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="space-y-6 text-right flex flex-col h-[75vh]" dir="rtl">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> مستشار الأمن السيبراني الذكي
        </h2>
        <p className="text-xs text-slate-400 mt-1">توجيه فني فوري بالذكاء الاصطناعي لتحليل وحل الثغرات، ومراجعة الشفرات المصدرية بما يوافق معايير الأمان الدولية</p>
      </div>

      {/* CHAT VIEWPORT */}
      <Card className="flex-1 flex flex-col min-h-0 p-4">
        
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
                  : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Text Bubble */}
              <div className={`p-3.5 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-[#0f172a] text-slate-100 border-slate-800'
                  : 'bg-[#090d16] text-slate-200 border-slate-850'
              }`}>
                {msg.text}
                <span className="text-[9px] text-slate-600 block mt-2 text-left">
                  {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isChatSending && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> المستشار الأمني يفكر الآن...
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="border-t border-slate-850 pt-3 mt-4 flex gap-3 shrink-0">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isChatSending}
            placeholder="اسأل المستشار الذكي عن أي ثغرة أو حل أمني مخصص..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500"
          />
          <Button 
            type="submit" 
            disabled={isChatSending || !input.trim()}
            className="px-5 py-3 rounded-xl flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" /> إرسال
          </Button>
        </form>

      </Card>

    </div>
  );
};
