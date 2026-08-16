import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "🎨 Gợi ý tranh phong cảnh Sci-Fi",
  "🖌️ Giải thích trường phái Trừu tượng",
  "✨ Tạo Prompt vẽ tranh Midjourney"
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là **ArtMind AI** 🎨. Tôi có thể giúp gì cho bạn về kiến thức hội họa, gợi ý tranh hay tạo prompt sáng tác?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Thêm tin nhắn của User
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Gọi API Backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...newMessages, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages([...newMessages, { sender: 'ai', text: '⚠️ Có lỗi xảy ra, vui lòng thử lại!' }]);
      }
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: '❌ Không thể kết nối tới Server Backend!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. Nút Bấm Tròn Floating góc phải */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">Hỏi ArtMind AI</span>
        </button>
      )}

      {/* 2. Khung Cửa Sổ Chatbot */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  ArtMind AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </h3>
                <p className="text-xs text-slate-400">Trợ lý hội họa & sáng tác</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Danh sách Tin Nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none prose prose-invert max-w-none'
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Indicator Loading */}
            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2 rounded-2xl border border-slate-700">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>ArtMind AI đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Gợi Ý Nhanh (Gợi ý đầu trận) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] bg-slate-800 hover:bg-purple-950/50 text-slate-300 hover:text-purple-300 border border-slate-700 hover:border-purple-500/50 px-2.5 py-1 rounded-full transition text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Khung Nhập Khảo */}
          <div className="p-3 bg-slate-800/80 border-t border-slate-700 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi hoặc gợi ý..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}