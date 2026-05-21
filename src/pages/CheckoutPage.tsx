import React, { useState, useMemo } from 'react';
import { CreditCard, ShoppingBag, Truck, Lock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { CartItem, Product, Order } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  appliedCoupon: string;
  user: { email: string; name: string } | null;
  onCheckout: (orderData: any) => Promise<{ order: Order; summary: any }>;
  onClearCart: () => void;
  setCurrentPage: (page: string) => void;
}

export default function CheckoutPage({
  cart,
  appliedCoupon,
  user,
  onCheckout,
  onClearCart,
  setCurrentPage
}: CheckoutPageProps) {
  
  // Shipping input states
  const [fullName, setFullName] = useState(user?.name || '');
  const [addressLine1, setAddressLine1] = useState('320 Friendly Lane, Suite 100');
  const [city, setCity] = useState('Portland');
  const [stateForm, setStateForm] = useState('Oregon');
  const [postalCode, setPostalCode] = useState('97201');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 (503) 555-0142');

  // Billing details
  const [billingEmail, setBillingEmail] = useState(user?.email || 'user@friendshop.com');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('***');

  const [checkoutStatus, setCheckoutStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string; data?: Order }>({
    type: 'idle',
    message: ''
  });

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'FRIEND20') return subtotal * 0.20;
    if (appliedCoupon === 'WELCOME10') return subtotal * 0.10;
    return 0;
  }, [subtotal, appliedCoupon]);

  const shippingCost = subtotal > 150 ? 0 : (cart.length > 0 ? 9.99 : 0);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !addressLine1 || !city || !stateForm || !postalCode || !phone || !billingEmail) {
      setCheckoutStatus({ type: 'error', message: 'Please provide all delivery shipping fields.' });
      return;
    }

    setCheckoutStatus({ type: 'loading', message: '' });

    try {
      // Package order schema
      const orderPayload = {
        cartItems: cart.map(it => ({
          productId: it.product.id,
          title: it.product.title,
          price: it.product.discountPrice ?? it.product.price,
          quantity: it.quantity
        })),
        shippingAddress: {
          fullName,
          addressLine1,
          city,
          state: stateForm,
          postalCode,
          country,
          phone
        },
        billingDetails: {
          fullName,
          email: billingEmail
        },
        couponCode: appliedCoupon,
        paymentMethod: 'Card (Stripe Proxy Verified)'
      };

      const result = await onCheckout(orderPayload);
      setCheckoutStatus({
        type: 'success',
        message: `Hooray! Friendly order generated successfully! Unique tracking registered: ${result.order.trackingNumber}`,
        data: result.order
      });
      onClearCart();
    } catch (err: any) {
      setCheckoutStatus({ type: 'error', message: err.response?.data?.error || err.message || 'Payment gateway returned a brief card validation issue.' });
    }
  };

  // Receipt block
  if (checkoutStatus.type === 'success' && checkoutStatus.data) {
    const receipt = checkoutStatus.data;
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center animate-bounce shadow">
          <CheckCircle className="h-9 w-9" />
        </div>
        
        <div className="space-y-1.5">
          <h1 className="font-display font-black text-2xl uppercase tracking-tight text-slate-900 dark:text-white">Order Successfully Registered!</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Thank you for shopping friendly at Friend Shop. We are preparing your assets.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl w-full text-left space-y-4 shadow-sm text-xs">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between font-bold">
            <span className="text-slate-450 uppercase tracking-widest text-[10px]">Order Receipt Reference:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{receipt.id}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Consignee Address:</h4>
            <p className="text-slate-600 dark:text-slate-350">{receipt.shippingAddress.fullName}</p>
            <p className="text-slate-600 dark:text-slate-350">{receipt.shippingAddress.addressLine1}, {receipt.shippingAddress.city}, {receipt.shippingAddress.state} {receipt.shippingAddress.postalCode}</p>
            <p className="text-slate-500">{receipt.shippingAddress.phone}</p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
            <h4 className="font-semibold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">Tracking Number:</h4>
            <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 font-mono text-center font-bold">
              {receipt.trackingNumber}
            </div>
            <p className="text-[10px] text-slate-400 italic text-center">Use this code inside your User Dashboard to trace the freight line.</p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-bold text-slate-900 dark:text-white">
            <span className="uppercase text-[10px] tracking-wider">Total Charge</span>
            <span className="text-sm">${receipt.totalAmount.toFixed(2)}</span>
          </div>

        </div>

        <button
          onClick={() => setCurrentPage('home')}
          className="bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl py-3 px-8 text-xs font-bold uppercase transition"
        >
          Return Home
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight pb-8 border-b border-slate-100">
        Checkout Order Gateway
      </h1>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-10">
        
        {/* Left forms sections Left Side */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* 1. Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5" />
              1. Delivery Shipping specs
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Consignee Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Contact</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Street line address</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-medium focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">City Territory</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">State/Region</label>
                <input
                  type="text"
                  required
                  value={stateForm}
                  onChange={(e) => setStateForm(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment details card (Stripe secure mock proxy) */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5" />
              2. Secure Stripe credit payment
            </h3>
            
            <div className="bg-indigo-950 text-white rounded-[24px] p-6 shadow-xl relative overflow-hidden max-w-sm border border-slate-700/50">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <CreditCard className="h-8 w-8 text-indigo-400" />
                  <span className="font-display font-black text-xs uppercase tracking-wide">Proxy Secure Card</span>
                </div>

                <div className="font-semibold tracking-widest text-sm">{cardNumber}</div>

                <div className="flex justify-between items-end border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[8px] uppercase text-indigo-300 block">Holder</span>
                    <span className="text-xs font-semibold truncate block w-28 uppercase">{cardHolder || 'Alex Johnson'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-indigo-300 block">Expiry</span>
                    <span className="text-xs font-semibold block">{cardExpiry}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mt-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Billing Email Account</label>
                <input
                  type="email"
                  required
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Card Holder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Calculations summaries Right Side */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm text-left flex flex-col gap-4">
            
            <h3 className="font-display font-semibold text-xs text-slate-850 dark:text-white uppercase tracking-wider pb-3 border-b border-indigo-100/50">
              Confirm Purchase Summary
            </h3>

            {/* Micro items row */}
            <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-col gap-3 select-none">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 justify-between text-xs pb-2 border-b last:border-0 border-slate-100/60 dark:border-slate-800">
                  <div className="truncate max-w-[70%]">
                    <p className="font-semibold text-slate-800 dark:text-white truncate">{item.product.title}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity} units</p>
                  </div>
                  <span className="font-extrabold text-slate-700 dark:text-slate-350">
                    ${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-850">
              <span>Cart Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs font-semibold text-emerald-600">
                <span>Coupon Applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400">
              <span>Ground Logistics</span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600 font-bold">Free Shipment</span>
              ) : (
                <span>${shippingCost.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-xs font-medium text-slate-650 dark:text-slate-400">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="uppercase text-[10px] tracking-wider">Total Amount</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
            </div>

            {checkoutStatus.message && checkoutStatus.type === 'error' && (
              <p className="text-[10px] font-bold text-rose-500 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">{checkoutStatus.message}</p>
            )}

            <button
              type="submit"
              disabled={checkoutStatus.type === 'loading'}
              className="w-full bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mt-4 cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              <Lock className="h-4 w-4" />
              {checkoutStatus.type === 'loading' ? 'Securing Stripe Handshake...' : `Pay secure $${total.toFixed(2)}`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-widest font-bold pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              End-to-End Encrypted Stripe proxy validation
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
