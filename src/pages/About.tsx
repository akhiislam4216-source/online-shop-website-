import { Sparkles, Heart, HelpCircle, Trophy, Users } from 'lucide-react';

export default function About() {
  
  const values = [
    {
      title: 'Ethical Supply Chains',
      desc: 'We form close bonds with small creators. Materials are completely certified cruelty-free and sourced sustainably.',
      icon: <Heart className="h-6 w-6 text-indigo-600" />
    },
    {
      title: 'Tactility Standards',
      desc: 'Physical objects must evoke visual delight. Every walnut keycap, loop weave thread, and cosmetic formula is heavily vetted.',
      icon: <Sparkles className="h-6 w-6 text-indigo-600" />
    },
    {
      title: 'Aesthetics for All',
      desc: 'Premium design should not support gatekeeping. We maintain modest margins to keep daily objects friendly.',
      icon: <Trophy className="h-6 w-6 text-indigo-600" />
    }
  ];

  const milestones = [
    { year: '2023', event: 'Friend Shop was established inside Portland, Oregon with an goal of friendly shopping.' },
    { year: '2024', event: 'Delivered our 10,000th tactile mechanical sound keyboard, expanding catalog options.' },
    { year: '2025', event: 'Ranked best emerging minimalist lifestyle brand with active circular products lines.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-left space-y-16">
      
      {/* Editorial Slogans Info */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Who We Are
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
          Shopping Made Friendly
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
          Friend Shop is an independent creative studio supplying professional workspace tech, heavy knit loungewear, botanical cosmetics, and minimal kitchen tableware. We believe objects in daily living should carry rich warmth and material honesty.
        </p>
      </section>

      {/* Philosophy Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {values.map((v, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-[24px] shadow-sm flex flex-col gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl h-fit w-fit">
              {v.icon}
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="font-semibold text-slate-850 dark:text-white text-sm tracking-tight">{v.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Visual story grid splits */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 items-center">
        <div className="space-y-6">
          <h2 className="font-display font-black text-2xl text-slate-909 dark:text-white uppercase tracking-tight">Our Honest Story</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            Founded by a collective of creators frustrated with bloated marketing channels, synthetic fibers, and cold tech layouts. We built Friend Shop to celebrate independent craftsmanship. 
          </p>
          <p className="text-xs sm:text-sm text-slate-605 dark:text-slate-350 leading-relaxed">
            By hosting small production runs and working directly with family-owned workshops, we bypass traditional department markup practices. The outcome holds premium tactility designed to age gracefully alongside you.
          </p>
        </div>

        <div className="bg-slate-100/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl relative">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-indigo-6500 mb-6">Historical Milestones</h3>
          
          <div className="space-y-6 relative border-l border-indigo-100/80 pl-6 ml-2 select-none text-xs text-left">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative space-y-1">
                <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center"></span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-display block">{m.year}</span>
                <p className="text-slate-600 dark:text-slate-300 font-sans">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Team area */}
      <section className="text-center pt-8 space-y-8">
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">Meet the Crew</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Marcus Sterling', role: 'Hardware Curator', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
            { name: 'Diana Thorne', role: 'Aesthetic Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
            { name: 'Siddharth Mehta', role: 'Platform Architect', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' },
            { name: 'Sophie Dubios', role: 'Cosmetics Alchemist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }
          ].map((crew, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-100 shadow-md">
                <img
                  src={crew.img}
                  alt={crew.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-xs text-slate-800 dark:text-white">{crew.name}</h4>
                <p className="text-[10px] text-slate-400 capitalize">{crew.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
