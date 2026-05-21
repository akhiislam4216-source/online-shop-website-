import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, Heart, ShoppingBag, Plus, Minus, ThumbsUp, Send } from 'lucide-react';
import { Product, Review } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductDetailsProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (p: Product, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  isInWishlist: boolean;
  onSelectProduct: (p: Product) => void;
  user: { name: string } | null;
  onSubmitReview: (productId: string, rating: number, comment: string) => Promise<Product>;
  onBuyNow: (p: Product, quantity: number) => void;
  wishlist: string[];
}

export default function ProductDetails({
  product,
  allProducts,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  user,
  onSubmitReview,
  onBuyNow,
  wishlist
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Review inputs
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewStatus, setReviewStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Track product switch to reset details
  useMemo(() => {
    setActiveImage(product.images[0]);
    setQuantity(1);
    setNewComment('');
    setReviewStatus({ type: 'idle', message: '' });
  }, [product]);

  const discountVal = product.discountPrice ? product.price - product.discountPrice : 0;
  const priceDisplay = product.discountPrice ?? product.price;

  // Recommendations: products in same category excluding opened product
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewStatus({ type: 'error', message: 'Review comment field cannot be blank.' });
      return;
    }

    const reviewerName = user ? user.name : 'Anonymous Shopper';
    setReviewStatus({ type: 'loading', message: '' });

    try {
      await onSubmitReview(product.id, newRating, newComment);
      setReviewStatus({ type: 'success', message: 'Thank you! Your friendly review details have been synced successfully!' });
      setNewComment('');
    } catch (err: any) {
      setReviewStatus({ type: 'error', message: err.message || 'We could not submit reviews.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      {/* Visual Navigation Breadcrumbs info */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium pb-6 select-none uppercase tracking-wider">
        <span className="hover:text-indigo-600 cursor-pointer">Shop Lines</span>
        <span>/</span>
        <span className="hover:text-indigo-600 cursor-pointer">{product.category.replace('-', ' ')}</span>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate">{product.title}</span>
      </nav>

      {/* Main product setup card block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm mt-2">
        
        {/* Left Side: Images galleries */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 relative flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300"
            />
            
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white rounded-full text-[10px] font-bold px-3 py-1 shadow-md uppercase tracking-wider">
                Discount Active
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-1.5 select-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-indigo-600 scale-95 shadow-md' : 'border-slate-200/50 hover:border-indigo-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumb`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details info selectors */}
        <div className="flex flex-col gap-6 justify-between">
          
          <div className="flex flex-col gap-4">
            
            <span className="text-[10px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Ratings row */}
            <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`h-4 w-4 ${idx < Math.round(product.rating) ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{product.ratingCount} shopper reviews</span>
              <span className="text-xs text-slate-400 font-medium">|</span>
              
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/15 dark:text-emerald-400 px-2 py-0.5 rounded">
                  Stock: {product.stock} left
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">
                  Sold Out
                </span>
              )}
            </div>

            {/* Price Tags */}
            <div className="py-2 flex items-baseline gap-4">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-base text-slate-400 line-through font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                    Save ${discountVal.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description lines */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Quantity Selector if stock fits */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 pt-4 select-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line Qty:</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button 
                    onClick={decrementQty}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-5 font-bold text-xs text-slate-800 dark:text-white">{quantity}</span>
                  <button 
                    onClick={incrementQty}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">Secure delivery within 2-4 days.</span>
              </div>
            )}

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-150 dark:border-slate-800">
            <button
              onClick={() => {
                if (product.stock > 0) {
                  onAddToCart(product, quantity);
                }
              }}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer ${
                product.stock === 0
                  ? 'bg-slate-100 text-slate-450 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              Add To Cart
            </button>
            
            <button
              onClick={() => {
                if (product.stock > 0) {
                  onBuyNow(product, quantity);
                }
              }}
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-2xl text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer ${
                product.stock === 0
                  ? 'bg-slate-100 text-slate-450 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10'
              }`}
            >
              Direct Buy Now
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer bg-white dark:bg-slate-800`}
              title="Add to Wishlist"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-500'}`} />
            </button>
          </div>

          {/* Small Guarantee badge */}
          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
            100% verified authentic Friend Shop product
          </div>

        </div>
      </div>

      {/* Specifications & Review Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 pt-10 border-t border-slate-200/60 dark:border-slate-800">
        
        {/* Specifications */}
        <div className="flex flex-col gap-6 text-left">
          <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Full Specifications</h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden p-6 shadow-sm">
            <table className="w-full text-xs">
              <tbody>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <tr 
                    key={idx} 
                    className="border-b last:border-0 border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-3 px-2 font-semibold text-slate-500 dark:text-slate-450 w-[40%] capitalize">{key}</td>
                    <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-200">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product reviews list & active form submissions */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Reviews ({product.reviews.length})</h2>
          
          <div className="flex flex-col gap-5 max-h-[350px] overflow-y-auto pr-2 scrollbar-none">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-xs">{rev.user}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rev.date}</p>
                    </div>
                    {/* Stars */}
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`h-3.5 w-3.5 ${idx < rev.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic mt-1 font-sans">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-6">Be the initial friendly shopper to review this amazing product! 🌸</p>
            )}
          </div>

          {/* Submission Review form */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-100 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-75/60 mt-2 flex flex-col gap-4 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Add Customer Review</h4>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Product Star Rating:</span>
              <div className="flex gap-1 select-none">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewRating(idx + 1)}
                    className="text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Star className={`h-5 w-5 ${idx < newRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 ">
              <textarea
                placeholder="Name your review experience with materials, packaging, dimensions, shipping time..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={reviewStatus.type === 'loading'}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs py-2.5 font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 self-end px-5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Upload Review
            </button>

            {reviewStatus.message && (
              <p className={`text-[10px] font-bold ${reviewStatus.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {reviewStatus.message}
              </p>
            )}
          </form>

        </div>

      </div>

      {/* 4. Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-8 mt-20 pt-10 border-t border-slate-200/70">
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">Shoppers Also Liked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
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
        </div>
      )}

    </div>
  );
}
