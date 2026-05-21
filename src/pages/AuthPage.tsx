import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, Key, Check } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => Promise<{ token: string; user: any }>;
  onRegister: (name: string, email: string, pass: string) => Promise<{ token: string; user: any }>;
  setCurrentPage: (page: string) => void;
}

export default function AuthPage({ onLogin, onRegister, setCurrentPage }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Registration / Logins
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus({ type: 'error', message: 'Please enter your email credentials and password.' });
      return;
    }

    setStatus({ type: 'loading', message: '' });
    try {
      await onLogin(email, password);
      setStatus({ type: 'success', message: 'Welcome back Shopper!' });
      setTimeout(() => {
        setCurrentPage('home');
      }, 800);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Incorrect email credentials or password match.' });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setStatus({ type: 'error', message: 'All registration parameters are required.' });
      return;
    }

    setStatus({ type: 'loading', message: '' });
    try {
      await onRegister(name, email, password);
      setStatus({ type: 'success', message: 'Account constructed successfully! Welcome to the Friend circle!' });
      setTimeout(() => {
        setCurrentPage('home');
      }, 1000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Registration has run into conflicts.' });
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please type your registered email address.' });
      return;
    }
    setStatus({ type: 'success', message: `Verify mail code forwarded to details inside: ${email}` });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-left">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
        
        {/* Slogans */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow">
            F
          </div>
          <h2 className="font-display font-black text-xl text-slate-855 dark:text-white uppercase tracking-tight">
            {activeTab === 'signin' && 'Welcome Companion'}
            {activeTab === 'signup' && 'Craft Account'}
            {activeTab === 'forgot' && 'Reset Shield'}
          </h2>
          <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
            Friend Shop : Shopping Made Friendly
          </p>
        </div>

        {activeTab !== 'forgot' && (
          <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl select-none text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('signin'); setStatus({ type: 'idle', message: '' }); }}
              className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                activeTab === 'signin' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In Account
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setStatus({ type: 'idle', message: '' }); }}
              className={`py-2 rounded-xl text-center cursor-pointer transition-all ${
                activeTab === 'signup' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Register New
            </button>
          </div>
        )}

        {/* Dynamic Forms elements */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shopper Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="shopper@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-medium focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password Block</label>
                <button
                  type="button"
                  onClick={() => { setActiveTab('forgot'); setStatus({ type: 'idle', message: '' }); }}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wide hover:underline cursor-pointer"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-xl py-3 text-xs font-bold uppercase transition shadow"
            >
              Authenticate & Enter
            </button>

            <div className="text-center pt-2 text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              Sandbox profiles registered:<br />
              User: <strong className="text-slate-600">user@friendshop.com</strong> / <strong className="text-slate-600">password123</strong><br />
              Admin: <strong className="text-slate-600">admin@friendshop.com</strong> / <strong className="text-slate-600">admin123</strong>
            </div>

          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shopper Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Account</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="companion@friendshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Choose password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-xl py-3 text-xs font-bold uppercase transition"
            >
              Construct Guard Credentials
            </button>

          </form>
        )}

        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Provide your active registered email coordinates below. We will transmit an automatic authorization key to reset things.
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Email Coordinates</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="shopper@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setStatus({ type: 'idle', message: '' }); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer flex-1 text-center"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl py-3 px-5 text-xs font-bold uppercase cursor-pointer flex-1 text-center"
              >
                Verify Mail
              </button>
            </div>

          </form>
        )}

        {status.message && (
          <p className={`text-[10px] font-bold text-center ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
            {status.message}
          </p>
        )}

        {/* Friendly perk bullet badges */}
        <div className="border-t border-slate-150 pt-5 space-y-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-indigo-50 text-indigo-600">
              <Check className="h-3 w-3" />
            </div>
            <span>Sync wishlists across devices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-indigo-50 text-indigo-600">
              <Check className="h-3 w-3" />
            </div>
            <span>Track transaction logistics lines</span>
          </div>
        </div>

      </div>

    </div>
  );
}
