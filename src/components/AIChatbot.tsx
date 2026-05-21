import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Bot, HelpCircle, 
  Sparkles, Laptop, Shirt, Home, Sparkle 
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatbotProps {
  onSendMessage: (messages: ChatMessage[]) => Promise<{ text: string }>;
  setCurrentPage: (page: string) => void;
  onSelectProductById: (productId: string) => void;
}

export default function AIChatbot({ onSendMessage, setCurrentPage, onSelectProductById }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, Friend! 👋 I am your ultimate shop companion at **Friend Shop**.\n\nI can suggest headphones, mechanical keyboards, French Terry hoodies, skincare formulas, or answer general shopping questions.\n\nUse code **FRIEND20** for a stylish **20% off** your checkout order today!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(updatedMessages);
      
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const botErrorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: "I am having a small connection issue with my database context right now, but please ask again shortly or inspect our product catalog manually! 🌸",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterQueries = [
    { text: 'Suggest top tech items?', icon: <Laptop className="h-3 w-3" /> },
    { text: 'Any holiday discounts?', icon: <Sparkles className="h-3 w-3" /> },
    { text: 'Recommendations for dry skin?', icon: <Sparkle className="h-3 w-3" /> },
    { text: 'Heavy cotton apparel specs?', icon: <Shirt className="h-3 w-3" /> }
  ];

  // Quick link parsing for model IDs (e.g. [p1], [p2], etc) to let user click to go to product details!
  const renderMessageText = (text: string) => {
    // Basic regex looking for product references like [p1], p2 inside text
    const parts = text.split(/(\[p\d+\])/g);
    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {parts.map((part, index) => {
          const match = part.match(/\[(p\d+)\]/);
          if (match) {
            const prodId = match[1];
            return (
              <button
                key={index}
                onClick={() => {
                  onSelectProductById(prodId);
                  setCurrentPage('product-details');
                }}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-indigo-200/50 cursor-pointer"
              >
                Inspect Product {prodId} 🔍
              </button>
            );
          }
          
          // Render bold formatting or simple markdown paragraphs
          const lineParts = part.split('\n').map((line, lIdx) => {
            // Check for bold notation
            const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={lIdx} className="mb-1 last:mb-0">
                {boldParts.map((bp, bpIdx) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return <strong key={bpIdx} className="font-semibold text-slate-900 dark:text-white">{bp.slice(2, -2)}</strong>;
                  }
                  return bp;
                })}
              </p>
            );
          });

          return <span key={index}>{lineParts}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden mb-4 animate-fade-in transition-all">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 shrink-0 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-tight">AI Shop Companion</h3>
                <div className="flex items-center gap-1 text-[10px] text-indigo-100 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Friendly Catalog Master
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/40 space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-slate-800 flex items-center justify-center shrink-0 self-start text-indigo-600 dark:text-indigo-400">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className="max-w-[80%] flex flex-col">
                  <div className={`p-3 rounded-2xl rounded-tl-sm ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm rounded-tl-2xl'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60'
                  }`}>
                    {renderMessageText(m.text)}
                  </div>
                  <span className={`text-[9px] text-slate-400 dark:text-slate-500 mt-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-indigo-600">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starters */}
          <div className="bg-white dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-1.5 overflow-x-auto scrollbar-none select-none">
            {starterQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSend(query.text)}
                className="shrink-0 flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-600 dark:text-slate-300 py-1.5 px-2.5 rounded-full transition-colors cursor-pointer"
              >
                {query.icon}
                {query.text}
              </button>
            ))}
          </div>

          {/* Foot Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Friend Shop catalog..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 pl-3 pr-2 py-2 rounded-xl text-xs border border-slate-200/70 dark:border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl p-2 transition-colors cursor-pointer"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-300/40 hover:scale-105 active:scale-95 transition-all text-lg cursor-pointer animate-bounce"
        title="Friend Shop AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

    </div>
  );
}
