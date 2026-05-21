import React from 'react';
import { Star, Heart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onAddToCart: (p: Product, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  isInWishlist: boolean;
  onSelectProduct: (p: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct
}: ProductCardProps) {
  const currentPrice = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top absolute flags */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none text-[10px] font-bold text-white tracking-wide uppercase">
        {hasDiscount && (
          <span className="bg-rose-500 rounded-full px-2.5 py-1 shadow">
            Save {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </span>
        )}
        {product.flashSale && (
          <span className="bg-amber-500 rounded-full px-2.5 py-1 shadow">
            Flash Deal
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-emerald-600 rounded-full px-2.5 py-1 shadow">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-slate-500 rounded-full px-2.5 py-1 shadow">
            Sold Out
          </span>
        )}
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`p-2.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-md flex items-center justify-center transition-all bg-white hover:scale-110 active:scale-95 cursor-pointer`}
          title="Add to Wishlist"
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-colors ${
              isInWishlist ? 'text-rose-500 fill-rose-500' : 'text-slate-400 dark:text-slate-400 hover:text-rose-500'
            }`} 
          />
        </button>
      </div>

      {/* Hover Inspect overlay */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="cursor-pointer relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Hover Quick inspect action banner */}
        <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-800 dark:bg-slate-900/90 dark:text-slate-100 text-[11px] font-semibold tracking-wide uppercase px-4 py-2.5 rounded-xl border border-slate-200/50 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-4 w-4" />
            Product Specs
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 sm:p-5 flex flex-col gap-2.5 flex-1 justify-between">
        
        <div className="flex flex-col gap-1.5">
          {/* Category handle */}
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </span>

          {/* Heading */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-display font-medium text-xs sm:text-sm text-slate-800 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer min-h-[40px] tracking-tight leading-tight"
          >
            {product.title}
          </h3>

          {/* Star rating info */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star 
                  key={idx} 
                  className={`h-3 w-3 ${idx < Math.round(product.rating) ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-600'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        {/* Price & Cart row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  ${product.discountPrice?.toFixed(2)}
                </span>
                <span className="text-[10px] line-through text-slate-400 font-medium">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (product.stock > 0) {
                onAddToCart(product, 1);
              }
            }}
            disabled={product.stock === 0}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all ${
              product.stock === 0 
                ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add +'}
          </button>
        </div>

      </div>
    </div>
  );
}
