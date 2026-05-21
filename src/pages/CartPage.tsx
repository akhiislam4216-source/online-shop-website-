import React, { useState, useMemo } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Percent } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  setCurrentPage: (page: string) => void;
  onSelectProduct: (p: Product) => void;
  appliedCoupon: string;
  setAppliedCoupon: (coupon: string) => void;
}

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  setCurrentPage,
  onSelectProduct,
  appliedCoupon,
  setAppliedCoupon
}: CartPageProps) {
  const [couponInput, setCouponInput] = useState<string>(appliedCoupon);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const code = appliedCoupon.toUpperCase().trim();
    if (code === 'FRIEND20') return subtotal * 0.20;
    if (code === 'WELCOME10') return subtotal * 0.10;
    return 0;
  }, [subtotal, appliedCoupon]);

  const shippingCost = subtotal > 150 ? 0 : (cart.length > 0 ? 9.99 : 0);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponInput.trim()) {
      setCouponError('Please type a coupon code.');
      return;
    }

    const cleaned = couponInput.toUpperCase().trim();
    if (cleaned === 'FRIEND20') {
      setAppliedCoupon('FRIEND20');
      setCouponSuccess('Success! FRIEND20 coupon code loaded: 20% off subtotal.');
    } else if (cleaned === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setCouponSuccess('Success! WELCOME10 coupon code loaded: 10% off subtotal.');
    } else {
      setCouponError('Invalid coupon code. Try FRIEND20 or WELCOME10!');
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight pb-8 border-b border-slate-100 dark:border-slate-800">
        Your Shopping Cart
      </h1>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-10">
          
          {/* Main List summary Left Side */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {cart.map((item) => {
              const itemPrice = item.product.discountPrice ?? item.product.price;
              return (
                <div 
                  key={item.product.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm"
                >
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => { onSelectProduct(item.product); setCurrentPage('product-details'); }}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-xs sm:text-sm line-clamp-1 truncate max-w-xs">{item.product.title}</h4>
                      <p className="text-[10px] text-slate-400 capitalize mt-0.5">{item.product.category.replace('-', ' ')}</p>
                      
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          ${itemPrice.toFixed(2)}
                        </span>
                        {item.product.discountPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${item.product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity adjustments & delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    
                    <div className="flex items-center border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 select-none">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 font-extrabold text-xs text-slate-800 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-slate-900 dark:text-white w-20 text-right">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              );
            })}

            {/* Back action */}
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-wide uppercase hover:underline flex items-center gap-1 mt-4"
            >
              ← Back to Shop Catalogue
            </button>
          </div>

          {/* Pricing calculations details Right Side */}
          <div className="flex flex-col gap-6">
            
            {/* Coupon Code Input */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
              <h3 className="font-display font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-indigo-600" />
                Promo Coupon Code
              </h3>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. FRIEND20, WELCOME10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-medium focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl px-4 text-xs font-semibold cursor-pointer py-2 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/15 p-3 rounded-xl border border-emerald-100 font-medium">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5" />
                    Coupon <strong>{appliedCoupon}</strong> Applied
                  </span>
                  <button onClick={clearCoupon} className="text-[10px] text-rose-500 hover:underline font-bold uppercase">
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-[10px] text-rose-500 font-bold mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2">{couponSuccess}</p>}
            </div>

            {/* Calculations summaries */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-sm text-left flex flex-col gap-4">
              
              <h3 className="font-display font-semibold text-xs text-slate-850 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
                Purchase Summary
              </h3>

              <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400">
                <span>Cart Subtotal</span>
                <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-xs font-semibold text-emerald-600">
                  <span>Custom Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400">
                <span>Shipping Ground Rate</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Free Shipping</span>
                ) : (
                  <span className="text-slate-900 dark:text-white">${shippingCost.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400">
                <span>Sales Tax Proxy (8%)</span>
                <span className="text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>

              {subtotal < 150 && (
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-[10px] text-slate-500 font-medium leading-relaxed">
                  Add <strong className="text-indigo-600">${(150 - subtotal).toFixed(2)}</strong> more to unlock direct **FREE ground shipping**! 🚚
                </div>
              )}

              <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="uppercase text-[11px] tracking-wider">Estimated Total</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setCurrentPage('checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-98 transition-transform"
              >
                Proceed To Checkout
                <ArrowRight className="h-4.5 w-4.5" />
              </button>

            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-5 my-12 max-w-lg mx-auto py-20">
          <div className="p-4 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-full">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Your shopping cart is empty</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Join the circle and discover minimal setup hardware, custom knit hoodies, and botanical cosmetic creams.</p>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            Explore Hot Items
          </button>
        </div>
      )}

    </div>
  );
}
