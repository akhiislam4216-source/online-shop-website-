import React, { useState } from 'react';
import { Mail, Phone, MapPin, SendHorizontal, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onSubscribe: (email: string) => Promise<{ success: boolean; message: string; promoCode?: string }>;
}

export default function Footer({ setCurrentPage, onSubscribe }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please provide a valid email structure.' });
      return;
    }

    setStatus({ type: 'loading', message: '' });
    try {
      const res = await onSubscribe(email);
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Subscription helper ran into an issue.' });
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Grid (Top Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-slate-800">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                F
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                Friend<span className="text-indigo-400">Shop</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Premium curated essentials across electronics, loungewear, and wellness. Making your retail experiences clean, interactive, and completely friendly.
            </p>
            <div className="text-xs text-indigo-400 font-medium flex items-center gap-1.5 mt-2">
              <Sparkles className="h-4 w-4" />
              Slogan: "Shopping Made Friendly"
            </div>
          </div>
          
          {/* Quick links */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Store Catalogue</h4>
              <button onClick={() => setCurrentPage('shop')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Catalogues</button>
              <button onClick={() => setCurrentPage('blog')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Blog & News</button>
              <button onClick={() => setCurrentPage('about')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Our Mission</button>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Help & Guidelines</h4>
              <button onClick={() => setCurrentPage('contact')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Support Channels</button>
              <button onClick={() => setCurrentPage('about')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Terms of Care</button>
              <button onClick={() => setCurrentPage('contact')} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Store Locations</button>
            </div>
          </div>

          {/* Newsletter Input Form */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/65 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">Join Friend Circle</h4>
            <p className="text-xs text-slate-400">
              Subscribe to secure an instant **10% discount promo** code. Be first to notice flash events, acoustic setups, and seasonal loungewear restocks.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mt-1">
              <input
                type="email"
                placeholder="Name your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 text-stone-100 rounded-xl px-3.5 py-2 text-xs border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 min-w-0"
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl p-2.5 transition-colors cursor-pointer"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </form>

            {status.message && (
              <p className={`text-[11px] font-medium mt-1 ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {status.message}
              </p>
            )}
          </div>

        </div>

        {/* Contact/Details Row (Middle Section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl text-indigo-400">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Headquarters Address</p>
              <p>42 Friend Way, Suite 10, Portland, OR</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl text-indigo-400">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Phone Support Helpline</p>
              <p>+1 (800) Friendly-Retail (374-363)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl text-indigo-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Customer Support Mail</p>
              <p>support@friendshop.com</p>
            </div>
          </div>
        </div>

        {/* Footer legalities */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© 2026 Friend Shop Inc. All rights reserved. Designed with premium aesthetic care.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Security Systems</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookie Settings</span>
            <span className="hover:text-amber-400 cursor-pointer font-medium" onClick={() => setCurrentPage('admin')}>Admin Sandbox</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
