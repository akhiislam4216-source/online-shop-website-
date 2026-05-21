import React, { useMemo } from 'react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  onAddToCart: (p: Product, quantity: number) => void;
  onSelectProduct: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (p: Product) => void;
  setCurrentPage: (page: string) => void;
}

export default function CategoryPage({
  category,
  products,
  onAddToCart,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
  setCurrentPage
}: CategoryPageProps) {
  
  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category.toLowerCase() === category.id.toLowerCase());
  }, [products, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      {/* Hero Banner Grid */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] mb-12 h-64 sm:h-80 flex items-center shadow-xl">
        <img
          src={category.bannerImage}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 px-6 sm:px-12 max-w-2xl flex flex-col gap-3">
          <span className="text-[10px] bg-indigo-600 text-white font-extrabold uppercase px-3 py-1 rounded-full shadow tracking-wider w-fit">
            Store Collection
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            {category.name}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white uppercase tracking-tight">
          Catalogue Listings ({categoryProducts.length})
        </h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Full Shop Catalogue
        </button>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categoryProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlist.includes(p.id)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-dashed text-center flex flex-col items-center gap-4 py-20">
          <p className="text-sm text-slate-400">There are no listing models in this category currently.</p>
          <button 
            onClick={() => setCurrentPage('shop')} 
            className="bg-indigo-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold"
          >
            Explore Other Sections
          </button>
        </div>
      )}

    </div>
  );
}
