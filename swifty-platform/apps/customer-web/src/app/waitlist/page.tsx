'use client';

import React, { useState } from 'react';
import { Users, Link as LinkIcon, Sparkles, ArrowRight, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API Call adding to Waitlist database
    setJoined(true);
    
    // Generate a mock unique referral link for the user
    const uniqueHash = Math.random().toString(36).substring(2, 8);
    setReferralLink(`https://swifty.com/invite/${uniqueHash}`);
  };

  const shareOnWhatsApp = () => {
    const text = `I just joined the Swifty VIP Waitlist! Sign up with my link and we both get 1 year of FREE delivery! 🛵✨ ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold mb-8 uppercase tracking-widest text-xs">
          <Sparkles size={14} /> Phase 8 Growth Loop
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6">
          swifty <span className="text-red-500 text-3xl md:text-5xl uppercase tracking-normal not-italic block mt-2">VIP Founders Club</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-lg mx-auto">
          We are launching exclusively in Koramangala. Be among the first 1,000 users to get <strong className="text-white">1 Year of Free Delivery</strong> & Offline Restaurant Prices.
        </p>

        {!joined ? (
          <form onSubmit={handleJoin} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your work email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 transition-colors text-white"
            />
            <button type="submit" className="bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
              Join Waitlist <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold mb-2 text-green-400">You're #842 on the list! 🎉</h3>
            <p className="text-zinc-400 mb-6">Want to bump up to the Top 100? Invite 3 friends using your unique link to unlock instant delivery routing.</p>
            
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 p-3 rounded-lg mb-4">
              <LinkIcon size={18} className="text-zinc-500" />
              <code className="flex-1 text-left text-zinc-300 font-mono text-sm">{referralLink}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(referralLink)}
                className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded transition-colors"
              >
                COPY
              </button>
            </div>

            <button 
              onClick={shareOnWhatsApp}
              className="w-full bg-[#25D366] text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1DA851] transition-colors"
            >
              <Share2 size={18} /> Share to WhatsApp
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row gap-6 justify-center items-center text-zinc-500 text-sm">
          <div className="flex items-center gap-2"><Users size={16} /> 8,421 friends already joined</div>
          <Link href="/" className="hover:text-white transition-colors underline underline-offset-4">Return to Homepage</Link>
        </div>
      </div>
    </main>
  );
}
