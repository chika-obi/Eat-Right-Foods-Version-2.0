import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const CHAT_SUGGESTIONS = [
  "Recommend a weight loss meal plan",
  "Is the smoky Jollof rice healthy?",
  "What is in the Fisherman Soup?",
  "Tell me about corporate catering packages",
  "What areas in Port Harcourt do you deliver to?"
];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I am your EatRight Foods AI Specialist. 🌿 I can help you find low-calorie meals, customize our corporate catering menu, describe traditional vegetable ingredients, or order delivery in Port Harcourt. What are you looking to eat today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText("");
    setIsLoading(true);

    const statuses = [
      "Consulting nutrition logs...",
      "Analyzing caloric values...",
      "Checking Port Harcourt direct dispatch map...",
      "Whipping up expert advice..."
    ];
    let statusIdx = 0;
    setStatusMessage(statuses[0]);
    const statusInterval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setStatusMessage(statuses[statusIdx]);
    }, 1200);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages
        })
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      // Fallback response
      setMessages(prev => [...prev, {
        role: 'model',
        text: "My apologies! I encountered a small digestive hiccup on our servers. Please dial or WhatsApp our delivery team directly at 08030522403 to order the smoky Jollof or check our catering availability. We are fully active in Port Harcourt!"
      }]);
    } finally {
      clearInterval(statusInterval);
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="ai-chat-root">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          id="chat-toggle-btn"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-semibold tracking-wide whitespace-nowrap text-sm">
            AI Nutritionist
          </span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 md:w-96 max-h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300" id="chat-box-expanded">
          {/* Branded Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-full">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">EatRight AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-100 font-medium">Online • Grounded in PH Menu</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 max-h-[300px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-green-700 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] mr-auto">
                <div className="p-2 rounded-full h-8 w-8 bg-green-700 text-white flex items-center justify-center animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="bg-white text-slate-500 border border-slate-100 p-3 rounded-2xl rounded-tl-none text-xs flex flex-col gap-1 shadow-sm">
                  <span className="font-semibold text-[10px] text-green-700 animate-pulse uppercase tracking-wider">
                    {statusMessage}
                  </span>
                  <div className="flex gap-1 items-center mt-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Quick Context-Grounded Suggestion Chips */}
          <div className="border-t border-slate-100 p-2 bg-white overflow-x-auto whitespace-nowrap flex gap-1 scrollbar-none">
            {CHAT_SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                className="bg-green-50 hover:bg-green-100 text-green-800 text-[10px] font-semibold tracking-wide py-1 px-2.5 rounded-full border border-green-200/50 shrink-0 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer Form */}
          <form onSubmit={handleFormSubmit} className="border-t border-slate-100 p-3 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about calories, soups, catering..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs border border-slate-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-slate-50 disabled:opacity-50"
            />
            {/* CTA Red Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2.5 transition-colors disabled:opacity-40 cursor-pointer shadow-md shadow-red-600/10 flex items-center justify-center"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
