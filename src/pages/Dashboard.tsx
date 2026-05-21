import React, { useState, useMemo } from 'react';
import { User, Package, Heart, Settings, MapPin, Truck, CheckCircle, ShieldAlert, Star } from 'lucide-react';
import { UserProf, Product } from '../types';
import ProductCard from '../components/ProductCard';

interface DashboardProps {
  user: UserProf;
  allProducts: Product[];
  onAddToCart: (p: Product, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onUpdateProfile: (profileData: any) => Promise<UserProf>;
  setCurrentPage: (page: string) => void;
}

export default function Dashboard({
  user,
  allProducts,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onUpdateProfile,
  setCurrentPage
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');

  // Profile Settings inputs
  const [profileName, setProfileName] = useState(user.name);
  const [fullName, setFullName] = useState(user.address?.fullName || user.name);
  const [addressLine, setAddressLine] = useState(user.address?.addressLine1 || '320 Friendly Lane, Suite 100');
  const [city, setCity] = useState(user.address?.city || 'Portland');
  const [stateVal, setStateVal] = useState(user.address?.state || 'Oregon');
  const [postal, setPostal] = useState(user.address?.postalCode || '97201');
  const [phone, setPhone] = useState(user.address?.phone || '+1 (503) 555-0142');

  const [settingsStatus, setSettingsStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const wishlistProducts = useMemo(() => {
    return allProducts.filter(p => user.wishlist.includes(p.id));
  }, [allProducts, user.wishlist]);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus({ type: 'loading', message: '' });

    try {
      const payload = {
        name: profileName,
        address: {
          fullName,
          addressLine1: addressLine,
          city,
          state: stateVal,
          postalCode: postal,
          country: 'United States',
          phone
        }
      };
      await onUpdateProfile(payload);
      setSettingsStatus({ type: 'success', message: 'Success! Your friendly profile parameters have been updated.' });
    } catch (err: any) {
      setSettingsStatus({ type: 'error', message: err.message || 'Error saving settings.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      {/* Visual profile header card block */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-10 rounded-[32px] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full border-2 border-indigo-400 bg-slate-800/80 shadow"
          />
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="font-display font-black text-2xl truncate">{user.name}</h1>
              {user.email === 'admin@friendshop.com' && (
                <span className="text-[9px] bg-amber-500 text-white font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldAlert className="h-2.5 w-2.5" />
                  Admin Privilege
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold uppercase mt-2 tracking-wide">
              <Star className="h-3.5 w-3.5" />
              Shopper segment: Gold Friend
            </div>
          </div>
        </div>

        {user.email === 'admin@friendshop.com' && (
          <button
            onClick={() => setCurrentPage('admin')}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs py-3 px-6 rounded-2xl cursor-pointer shadow-lg shadow-amber-500/10"
          >
            Open Admin Cabinet
          </button>
        )}
      </div>

      {/* Selector Tabs and Main layouts split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-12 items-start">
        
        {/* Navigation panel */}
        <nav className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="h-4.5 w-4.5" />
            My Orders ({user.orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="h-4.5 w-4.5" />
            Wishlist ({user.wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            Profile Settings
          </button>
        </nav>

        {/* Content displays Area */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Your Orders Logs</h2>
              
              {user.orders.length > 0 ? (
                user.orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden p-6 shadow-sm flex flex-col gap-5 text-xs text-left"
                  >
                    
                    {/* Order header information */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                      
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Order ID</p>
                          <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Order Date</p>
                          <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</p>
                          <p className="font-bold text-indigo-600 mt-0.5">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Status pills */}
                      <span className={`px-3 py-1.5 rounded-full font-semibold uppercase text-[10px] tracking-wide self-start sm:self-center flex items-center gap-1.5 ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400' 
                          : order.status === 'shipping'
                            ? 'bg-blue-50 text-blue-750 dark:bg-blue-900/10 dark:text-blue-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/10 dark:text-amber-400'
                      }`}>
                        {order.status === 'delivered' && <CheckCircle className="h-3.5 w-3.5" />}
                        {order.status === 'shipping' && <Truck className="h-3.5 w-3.5 animate-pulse" />}
                        {order.status === 'pending' && <Settings className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '4s' }} />}
                        {order.status}
                      </span>

                    </div>

                    {/* Order Items previews */}
                    <div className="flex flex-col gap-4 select-none">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-805/30 p-3 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white line-clamp-1">{item.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.quantity} units</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-350">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking address summary */}
                    <div className="bg-slate-50 dark:bg-slate-805/4 w-full p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px]">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase text-slate-400 font-bold block">Delivery Target:</span>
                        <p className="font-medium text-slate-750 dark:text-slate-300 leading-snug">
                          {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 shrink-0">
                        <span className="text-[8px] uppercase text-slate-400 font-bold block">Tracking Code:</span>
                        <code className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold uppercase">{order.trackingNumber}</code>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center flex flex-col items-center gap-3 py-20">
                  <p className="text-slate-400">You have no historic order transactions registered.</p>
                  <button 
                    onClick={() => setCurrentPage('shop')} 
                    className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Your Wishlist Selection</h2>
              
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      isInWishlist={true}
                      onSelectProduct={onSelectProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center flex flex-col items-center gap-3 py-20">
                  <p className="text-slate-400">Your wishlist folder is quiet empty currently.</p>
                  <button 
                    onClick={() => setCurrentPage('shop')} 
                    className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Explore Shop Lines
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS EDITOR */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Profile & Saved Addresses</h2>
              
              <form onSubmit={handleUpdateProfileSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-3xl shadow-sm space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5Col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Profile Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-75/60 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5Col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (Locked)</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Default Saved Address</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Attention Consignee Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">State</label>
                      <input
                        type="text"
                        required
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Helpline phone</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  {settingsStatus.message && (
                    <p className={`text-[10px] font-extrabold ${settingsStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {settingsStatus.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={settingsStatus.type === 'loading'}
                    className="bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-xl py-2.5 px-6 text-xs font-bold uppercase transition shadow ml-auto cursor-pointer"
                  >
                    Save Set parameters
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
