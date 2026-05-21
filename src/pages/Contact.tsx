import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  
  // Contacts states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Catalog Inquiry');
  const [message, setMessage] = useState('');
  
  const [subStatus, setSubStatus] = useState<{ type: 'idle' | 'loading' | 'success'; message: string }>({
    type: 'idle',
    message: ''
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSubStatus({ type: 'loading', message: '' });
    
    setTimeout(() => {
      setSubStatus({
        type: 'success',
        message: 'Success! Your friendly message has been submitted. Our response crew will reply back within 24 hours!'
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  const faqs = [
    {
      q: 'Do you ship to global destinations?',
      a: 'Currently, the Friend Shop logistics line services all of North America, Europe, and select countries across Asia and Oceania with fully tracked parcel delivery.'
    },
    {
      q: 'How does code "FRIEND20" discount work?',
      a: 'Simply copy the promo coupon code and apply it within your shopping cart. This grants you a full 20% off your entire catalog order subtotal instantly!'
    },
    {
      q: 'Can I swap sizing specifications easily?',
      a: 'Absolutely. Reach out to our crew within 30 days of parcel arrival. We will generate a pre-paid returns slip with zero questions queried.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 text-left space-y-16">
      
      {/* Slogans */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Reach Our Crew
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-905 dark:text-white uppercase tracking-tight">
          We Are Here To Help
        </h1>
        <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-sans">
          Whether you hold inquiries about wooden mechanical specs, custom ring light sizing, or courier times, drop us a line below.
        </p>
      </section>

      {/* Forms and Coordinates splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contacts details Left Side */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-left space-y-6">
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Friend Shop Headquarters</h3>
            
            <div className="space-y-4 text-xs text-slate-655 dark:text-slate-300">
              <div className="flex gap-3 items-center">
                <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
                <span>320 Friendly Lane, Suite 100, Portland, Oregon, 97201</span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-indigo-600" />
                <span>+1 (503) 555-0142 (Available Mon-Fri 9AM-5PM PST)</span>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span>care@friendshop.com</span>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative text-center p-6 space-y-2">
              <MapPin className="h-7 w-7 text-indigo-600 mx-auto animate-bounce" />
              <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase">Oregon Cartographic Hub</h4>
              <p className="text-[10px] text-slate-400 max-w-xs font-semibold">Active Logistics & Design Studio, overlooking Mount Hood.</p>
            </div>
          </div>
        </div>

        {/* Email Form submissions Right Side */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-[32px] shadow-sm space-y-5 text-left">
          
          <h3 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Drop Message Inquiry</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5Col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex flex-col gap-1.5Col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-200 p-3 rounded-xl border border-slate-300 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5Col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Catalog Inquiry">General Catalog Specs</option>
              <option value="Order Tracking">Parcel Courier Operations</option>
              <option value="Creator Collaboration">Independent Collaboration</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5Col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Description</label>
            <textarea
              required
              rows={4}
              placeholder="Name your request detail here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-200 p-3.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={subStatus.type === 'loading'}
            className="w-full bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-xl py-3 text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow"
          >
            <Send className="h-4.5 w-4.5" />
            {subStatus.type === 'loading' ? 'Transmitting code...' : 'Send Friendly message'}
          </button>

          {subStatus.message && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 animate-bounce" />
              <span>{subStatus.message}</span>
            </div>
          )}

        </form>

      </div>

      {/* Frequently Asked Questions accordion row */}
      <section className="border-t border-slate-100 pt-16 space-y-10 max-w-4xl mx-auto w-full">
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight text-center">Frequently Queried Questions FAQ</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:text-indigo-600 flex items-center justify-between cursor-pointer focus:outline-none select-none capitalize"
              >
                <span>{faq.q}</span>
                <HelpCircle className="h-4 w-4 text-indigo-650" />
              </button>
              
              {activeFaq === index && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
