import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { Product, Category, BlogPost } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  categories: Category[];
  blogs: BlogPost[];
  setCurrentPage: (page: string) => void;
  onSelectCategory: (catId: string) => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onSelectProduct: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (p: Product) => void;
}

export default function Home({
  products,
  categories,
  blogs,
  setCurrentPage,
  onSelectCategory,
  onAddToCart,
  onSelectProduct,
  wishlist,
  onToggleWishlist
}: HomeProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  // Simple flashing timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 14, minutes: 32, seconds: 45 }; // Reset mock cycle
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProds = products.filter(p => p.featured).slice(0, 4);
  const flashSaleProds = products.filter(p => p.flashSale).slice(0, 3);
  const trendingProds = products.filter(p => p.trending).slice(0, 4);

  const perks = [
    {
      title: 'Free Ground Shipping',
      description: 'On all curated orders valued over $150. Shipped with fully green packaging.',
      icon: <Truck className="h-6 w-6 text-indigo-600" />
    },
    {
      title: '30-Day Rest Assured Return',
      description: 'Unhappy with spacing, sizes, or feel? Ship back with zero questioned queries.',
      icon: <RefreshCw className="h-6 w-6 text-indigo-600" />
    },
    {
      title: '2-Year Hardware Warranty',
      description: 'Complete technical shielding on all smart electronics setups bought from our line.',
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />
    }
  ];

  const brandPartners = [
    { name: 'Shopify Partner', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200' },
    { name: 'Stripe Secure', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200' },
    { name: 'Google Cloud Ingress', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200' }
  ];

  const testimonials = [
    {
      name: 'Michael Henderson',
      role: 'Creative Director',
      quote: 'Friend Shop is a masterclass in modern curation. The walnut keyboard feels absolutely tactile, and their support is incredibly helpful.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Jessica Chastain',
      role: 'Skincare Blogger',
      quote: 'My skin holds such visual glow after trying their botanical cleansing kits. Cruelty free and organic, delivered in 2 days flat!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <div className="space-y-20 pb-20 scrollbar-none">
      
      {/* 1. Hero Premium Area */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white rounded-[32px] mx-4 sm:mx-8 mt-6 shadow-xl shadow-indigo-950/10">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-28 relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide w-fit border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              FRIENDLY DEALS: GET 20% OFF WITH CODE "FRIEND20"
            </div>
            
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tighter text-white">
              Essential Goods,<br />
              <span className="text-white/90">Shopping Made Friendly</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-sans">
              Discover professional electronics, loop French Terry loungewear, organic botanical beauty collections, and minimal tableware. Elegantly crafted for modern daily living.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-2 border border-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
              >
                Browse Catalog Selection
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => onSelectCategory('electronics')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-2xl cursor-pointer"
              >
                Shop Tech Gear
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="w-[450px] h-[380px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=700"
                alt="Premium Acoustics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-left">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Aesthetic Workspace</span>
                <h3 className="font-display font-extrabold text-lg text-white">Active Noise-Cancelling Audio</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">Pair with mechanical walnuts, organic desks and task setups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. visual perk badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          {perks.map((perk, idx) => (
            <div key={idx} className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm text-left">
              <div className="p-3 bg-indigo-50 dark:bg-slate-900 rounded-2xl h-fit">
                {perk.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm tracking-tight">{perk.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Circular Category Selections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 items-center">
          <div className="text-center space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Explore Shop Lines</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curated groupings featuring high material standards and minimalist design.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full max-w-4xl">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group cursor-pointer flex flex-col items-center gap-3.5"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-600 shadow-md group-hover:shadow-lg transition-all duration-300 relative bg-slate-100">
                  <img
                    src={cat.bannerImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/0 transition-colors"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 px-2 px-1 dark:text-slate-500">{cat.id.replace('-', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flash Sale area */}
      <section className="bg-amber-50 dark:bg-amber-950/20 py-12 rounded-[32px] mx-4 sm:mx-8 px-6 sm:px-12 border border-amber-100/40 dark:border-amber-900/40">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <span className="text-[10px] bg-amber-500 text-white font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm w-fit">Active Limited Deals</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight pt-1">Flash Promo Sale</h2>
            </div>
            
            {/* Clock */}
            <div className="flex items-center gap-3 self-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1.5 uppercase">Promo ends in:</span>
              <div className="flex gap-1.5 text-slate-800 font-display">
                <div className="bg-white dark:bg-slate-800 dark:text-white px-3 py-2 rounded-xl text-center border border-slate-200/50 shadow-sm flex flex-col">
                  <span className="text-sm font-extrabold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Hr</span>
                </div>
                <span className="text-slate-400 font-bold self-center">:</span>
                <div className="bg-white dark:bg-slate-800 dark:text-white px-3 py-2 rounded-xl text-center border border-slate-200/50 shadow-sm flex flex-col">
                  <span className="text-sm font-extrabold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Min</span>
                </div>
                <span className="text-slate-400 font-bold self-center">:</span>
                <div className="bg-white dark:bg-slate-800 dark:text-white px-3 py-2 rounded-xl text-center border border-slate-200/50 shadow-sm flex flex-col">
                  <span className="text-sm font-extrabold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Sec</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {flashSaleProds.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(product.id)}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Lists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Picked With Love</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Our Curated Classics</h2>
            </div>
            <button 
              onClick={() => setCurrentPage('shop')} 
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              Browse Shop
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProds.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(product.id)}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. High Quality Reviews carousel style */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 border-y border-slate-100/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          
          <div className="text-center space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Loyal Shopper Testimonials</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">See what creative professionals are building using Friend Shop.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {testimonials.map((test, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between text-left"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-500 mt-1">
                    {Array.from({ length: test.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white text-xs">{test.name}</h4>
                    <p className="text-[10px] text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trending Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">In Great Demand</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Active Trending Items</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trendingProds.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlist.includes(product.id)}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Brand Partners Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="border-t border-slate-100 dark:border-slate-800 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Our Secure Operational Partners:</span>
          <div className="flex flex-wrap items-center gap-10 sm:gap-16">
            <span className="font-display font-black text-rose-500 text-sm tracking-tight">Stripe Gateway</span>
            <span className="font-display font-black text-slate-700 dark:text-slate-300 text-lg tracking-tight">Shopify API</span>
            <span className="font-display font-black text-indigo-500 text-md tracking-tight">Google Gemini Core</span>
          </div>
        </div>
      </section>

    </div>
  );
}
