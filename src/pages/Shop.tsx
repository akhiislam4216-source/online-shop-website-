import React, { useState, useMemo } from 'react';
import { Filter, Star, Search, SlidersHorizontal, Grid, X } from 'lucide-react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onSelectProduct: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (p: Product) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (catId: string) => void;
  onFilterByCategory: (catId: string) => void;
}

export default function Shop({
  products,
  categories,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
  selectedCategoryId,
  setSelectedCategoryId
}: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const itemsPerPage = 8;

  // Track synchronous updates from prop-level selectedCategory
  useMemo(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  // Combined synchronous filters log
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search bar query
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    // Filter by price
    result = result.filter(p => {
      const actualPrice = p.discountPrice ?? p.price;
      return actualPrice <= maxPrice;
    });

    // Filter by rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Filter by stock
    if (showInStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, sortBy, showInStockOnly]);

  // Paginated outputs
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPageNum - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPageNum]);

  const ratingOptions = [
    { label: 'All Reviews', value: 0 },
    { label: '4.5 Stars & above', value: 4.5 },
    { label: '4.0 Stars & above', value: 4 },
    { label: '3.5 Stars & above', value: 3.5 }
  ];

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCategoryId('all');
    setSearchQuery('');
    setMaxPrice(350);
    setMinRating(0);
    setShowInStockOnly(false);
    setSortBy('featured');
    setCurrentPageNum(1);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setSelectedCategoryId(id);
    setCurrentPageNum(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Search & Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="text-left">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">Friendly Bazaar</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing {filteredProducts.length} high-standard functional accessories.</p>
        </div>

        {/* Mini search control inside shop */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:max-w-xs md:w-64">
            <input
              type="text"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPageNum(1); }}
              className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <Filter className="h-3.5 w-3.5" />
            Sidebar Tools
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-10">
        
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col gap-8 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Catalogue Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wide uppercase hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Lines */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Shop Line</h4>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`text-xs text-left px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedCategory === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-xs text-left px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-400/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing bar */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pricing Limit</h4>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="350"
              step="5"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPageNum(1); }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>$10</span>
              <span>$350 Max</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Star Rating</h4>
            <div className="flex flex-col gap-1.5">
              {ratingOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMinRating(opt.value); setCurrentPageNum(1); }}
                  className={`text-xs text-left px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    minRating === opt.value 
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value > 0 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filter Switches */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Availability</h4>
            <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => { setShowInStockOnly(e.target.checked); setCurrentPageNum(1); }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 accent-indigo-600"
              />
              Show instock only
            </label>
          </div>

        </aside>

        {/* Active Products lists */}
        <main className="md:col-span-3 flex flex-col gap-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              We found <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> corresponding items
            </span>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPageNum(1); }}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 sm:flex-none cursor-pointer"
              >
                <option value="featured">Store Recommendations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="alphabetical">A - Z Index</option>
              </select>
            </div>

          </div>

          {/* Grid list elements */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedProducts.map((p) => (
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
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center flex flex-col items-center gap-4">
              <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-full text-indigo-500">
                <Grid className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm">No corresponding products found</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">Try broadening your search term queries, clearing rating caps, or lowering pricing limits!</p>
              </div>
              <button
                onClick={clearAllFilters}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-indigo-500/10"
              >
                Restore Core Catalog
              </button>
            </div>
          )}

          {/* Pagination widgets */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum(prev => prev - 1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPageNum(idx + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    currentPageNum === idx + 1
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum(prev => prev + 1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Drawer Slide filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>
          
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto text-left z-50">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase text-xs">Sidebar Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile filters lines */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Lines</h4>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { handleCategorySelect('all'); setMobileFiltersOpen(false); }}
                  className={`text-left text-xs px-3 py-2 rounded-lg ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { handleCategorySelect(cat.id); setMobileFiltersOpen(false); }}
                    className={`text-left text-xs px-3 py-2 rounded-lg ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Range */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</h4>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPageNum(1); }}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Clear All mobile */}
            <button
              onClick={() => { clearAllFilters(); setMobileFiltersOpen(false); }}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs py-2.5 rounded-xl font-bold uppercase transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
