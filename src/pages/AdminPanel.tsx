import React, { useState, useMemo } from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Package, ShoppingBag, Plus, Sparkles, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Product, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: any) => Promise<Product>;
  onUpdateProductStock: (productId: string, stock: number) => Promise<Product>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<Order>;
  setCurrentPage: (page: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onUpdateProductStock,
  onDeleteProduct,
  onUpdateOrderStatus,
  setCurrentPage
}: AdminPanelProps) {
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add-product'>('products');
  
  // Add new product fields states
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(49.99);
  const [newCategory, setNewCategory] = useState('electronics');
  const [newDescription, setNewDescription] = useState('Premium acoustic mechanics built for modern setups.');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400');
  const [newStock, setNewStock] = useState(15);

  const [addStatus, setAddStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Analytics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orders]);

  const activeCatalogCount = products.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setAddStatus({ type: 'error', message: 'Product title is required' });
      return;
    }

    setAddStatus({ type: 'loading', message: '' });

    try {
      const payload = {
        title: newTitle,
        price: Number(newPrice),
        category: newCategory,
        description: newDescription,
        images: [newImage],
        stock: Number(newStock),
        specifications: {
          material: "Cruelty Free Premium Composite",
          dimensions: "12 x 8 x 3 inches",
          origin: "Designed in USA Made with love",
          warranty: "2 Year Coverage"
        }
      };

      await onAddProduct(payload);
      setAddStatus({ type: 'success', message: 'Hooray! Custom catalog accessory registered successfully!' });
      
      // Reset inputs
      setNewTitle('');
      setNewPrice(49.99);
      setNewStock(15);
    } catch (err: any) {
      setAddStatus({ type: 'error', message: err.message || 'Error publishing product.' });
    }
  };

  const cycleStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'shipping';
    else if (currentStatus === 'shipping') nextStatus = 'delivered';
    else nextStatus = 'pending';

    try {
      await onUpdateOrderStatus(orderId, nextStatus);
    } catch (err) {
      console.error('Error shifting status: ', err);
    }
  };

  const handleStockUpdate = async (prodId: string, currentStock: number) => {
    const input = window.prompt("Type new catalog Stock capacity count:", String(currentStock));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 0) {
      alert("Please provide a valid non-negative integer.");
      return;
    }
    try {
      await onUpdateProductStock(prodId, num);
    } catch (err) {
      alert("Could not update product stock.");
    }
  };

  const handleRemoveProduct = async (prodId: string) => {
    if (!window.confirm("Are you absolutely sure you want to remove this product from the Friend Shop catalog?")) return;
    try {
      await onDeleteProduct(prodId);
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-left">
      
      {/* Visual Admin header card block */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800 mb-8 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Admin Cabinet Control
          </h1>
          <p className="text-xs text-slate-505 dark:text-slate-400 mt-0.5">Manage live stock, monitor Stripe transaction totals, and ship parcels.</p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer text-slate-705 dark:text-slate-300"
        >
          My Profile Dashboard
        </button>
      </div>

      {/* Analytics Bento Info widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 select-none">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-55 bg-indigo-50/50 text-indigo-600 rounded-2xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Store Revenue</span>
            <span className="text-xl font-black text-slate-909 dark:text-white">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 bg-indigo-50/50 text-indigo-600 rounded-2xl">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Combined Orders</span>
            <span className="text-xl font-black text-slate-909 dark:text-white">{orders.length} transactions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 bg-indigo-50/50 text-indigo-600 rounded-2xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Catalogue Size</span>
            <span className="text-xl font-black text-slate-909 dark:text-white">{activeCatalogCount} accessories</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6 text-xs font-semibold select-none mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'products' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Products Stock ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'orders' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('add-product')}
          className={`py-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'add-product' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus className="h-4 w-4" />
          Register Custom Accessory
        </button>
      </div>

      {/* TAB 1: PRODUCTS INVENTORY */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs p-2.5">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product Item</th>
                <th className="py-4 px-6">Shop Line</th>
                <th className="py-4 px-6">List Price</th>
                <th className="py-4 px-6 text-center">In-Stock units</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-805/30 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50"
                    />
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-white line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-slate-400 max-w-sm truncate mt-0.5">{p.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 capitalize text-slate-500 font-medium">{p.category.replace('-', ' ')}</td>
                  <td className="py-4 px-6 font-bold text-slate-850 dark:text-white">${p.price.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide ${
                      p.stock > 5 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : p.stock > 0
                          ? 'bg-amber-50 text-amber-700 font-bold'
                          : 'bg-rose-50 text-rose-500'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleStockUpdate(p.id, p.stock)}
                      className="inline-flex p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 rounded-lg pointer-events-auto cursor-pointer"
                      title="Adjust Stock"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="inline-flex p-2 bg-rose-50 hover:bg-rose-150 text-rose-500 rounded-lg pointer-events-auto cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: MANAGE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Shopper Consignee</th>
                <th className="py-4 px-6">Line Items count</th>
                <th className="py-4 px-6 text-center">Total Charged</th>
                <th className="py-4 px-6 text-center">Logistics State</th>
                <th className="py-4 px-6 text-right">Action Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-805/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-indigo-400">{order.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-850 dark:text-white">{order.shippingAddress.fullName}</p>
                    <p className="text-[10px] text-slate-400">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{order.items.reduce((acc, current) => acc + current.quantity, 0)} accessories</td>
                  <td className="py-4 px-6 font-extrabold text-indigo-600 text-center">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide capitalize ${
                      order.status === 'delivered' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : order.status === 'shipping'
                          ? 'bg-blue-50 text-blue-750'
                          : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => cycleStatus(order.id, order.status)}
                      className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-6500 font-semibold text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Cycle Logistics Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: REGISTER NEW PRODUCT FORMS */}
      {activeTab === 'add-product' && (
        <form onSubmit={handleCreateProductSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-10 rounded-3xl shadow-sm space-y-6 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider">Deploy Custom Catalog Selection</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Product title header</label>
              <input
                type="text"
                required
                placeholder="e.g. Ergonomic Walnut Keycaps Kit"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Category Grouping</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="electronics">Tech Accessories</option>
                <option value="apparel">Apparel & Shirts</option>
                <option value="beauty">Skincare Botanical</option>
                <option value="home">Minimal Tableware</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Inventory count</label>
              <input
                type="number"
                min="1"
                required
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Price Tag ($ USD)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Product Image asset URL</label>
              <input
                type="text"
                required
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-850 dark:text-slate-200 p-3 rounded-xl border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Specification Description</label>
              <textarea
                placeholder="Details of materials, design philosophy, composition elements..."
                rows={4}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {addStatus.message && (
              <p className={`text-[10px] font-bold ${addStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {addStatus.message}
              </p>
            )}
            
            <button
              type="submit"
              disabled={addStatus.type === 'loading'}
              className="bg-indigo-600 hover:bg-indigo-505 disabled:opacity-50 text-white rounded-xl py-2.5 px-6 text-xs font-bold uppercase transition ml-auto cursor-pointer"
            >
              Deploy Product Live
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
