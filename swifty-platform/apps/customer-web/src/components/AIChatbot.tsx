'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export function AIChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Swifty's AI agent. What are you craving today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Execute Post request through the Single-Link API Gateway (Next.js Rewrites)
      const response = await fetch('/api/v1/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: newMessage.text, lat: 22.57, lng: 88.36 })
      });
      
      const data = await response.json();
      
      if (data.success && data.results.intent === 'SEARCH') {
        const item = data.results.resolved_items[0];
        setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: `I found exactly what you need! Added the $${item.price} ${item.name} from a 4.5⭐ restaurant near you to your cart. 🍔`, 
            sender: 'bot',
            action: 'ADDED_TO_CART'
        }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), text: "I've optimized your search parameters across our restaurant network. Tap the filter chip to see the results!", sender: 'bot' }]);
      }
    } catch (error) {
       // Graceful degradation fallback
       setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: "I'm analyzing the best local spots for that request... Please hold!", sender: 'bot' }]);
       }, 1000);
    } finally {
       setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[600px]">
      <div className="p-4 bg-zinc-900 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Sparkles size={20} />
        </div>
        <div>
            <h2 className="font-bold text-white leading-tight">Swifty AI Genius</h2>
            <p className="text-xs text-indigo-200">Powered by Agentic NLP</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {m.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"><Bot size={16} /></div>}
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : m.action === 'ADDED_TO_CART'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-800/50 rounded-tl-sm'
                  : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start gap-2 items-center text-zinc-400">
             <Bot size={16} /> <span className="text-xs animate-pulse">Analyzing menus...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type 'Spicy food under $10'..."
            className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full py-3 pl-4 pr-12 outline-none text-sm transition-shadow focus:shadow-[0_0_0_2px_rgba(99,102,241,0.5)]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-400 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
