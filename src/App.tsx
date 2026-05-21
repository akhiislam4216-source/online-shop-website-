import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

// Shared mock constants for fallback and layout descriptors
import { CATEGORIES, BLOG_POSTS, PRODUCTS } from './data';
import { Product, Category, BlogPost, CartItem, Order, UserProf, ChatMessage } from './types';

// Page components imports
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

export default function App() {
  // Navigation states
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('p1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Loaded Catalog lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [blogs] = useState<BlogPost[]>(BLOG_POSTS);

  // Authentications
  const [user, setUser] = useState<UserProf | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Order List cache for Admin monitoring
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);

  // Cart / Wishlist state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('friend_shop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('friend_shop_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>('');

  // Document level dark-mode selector state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });

  // Track state syncing to storage
  useEffect(() => {
    localStorage.setItem('friend_shop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('friend_shop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Synchronize Dark Mode Class and Storage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Combined product load
  const loadCatalog = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } else {
        // Fallback to static mock products if backend has load issues
        setProducts(PRODUCTS);
      }
    } catch (err) {
      setProducts(PRODUCTS);
    }
  };

  // Profile lookup on startup if token is cached
  const restoreSession = async () => {
    const cachedToken = localStorage.getItem('friend_shop_token');
    if (!cachedToken) return;

    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${cachedToken}`
        }
      });
      if (response.ok) {
        const profData = await response.json();
        setUser(profData);
        setAuthToken(cachedToken);
        
        // Populate orders logs
        if (profData.orders) {
          // If admin, load global orders catalog for panel view
          if (profData.email === 'admin@friendshop.com') {
            loadGlobalOrders(cachedToken);
          }
        }
      } else {
        localStorage.removeItem('friend_shop_token');
      }
    } catch (err) {
      localStorage.removeItem('friend_shop_token');
    }
  };

  const loadGlobalOrders = async (token: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const list = await response.json();
        setAdminOrders(list);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCatalog();
    restoreSession();
  }, []);

  // Shared variables
  const currentCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  const currentProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || PRODUCTS[0];
  }, [products, selectedProductId]);

  // 1. Authentications functions
  const handleLogin = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Authentication denied.');
    }

    const payload = await res.json();
    setUser(payload.user);
    setAuthToken(payload.token);
    localStorage.setItem('friend_shop_token', payload.token);

    if (payload.user.email === 'admin@friendshop.com') {
      loadGlobalOrders(payload.token);
    }
    return payload;
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Registration denied.');
    }

    const payload = await res.json();
    setUser(payload.user);
    setAuthToken(payload.token);
    localStorage.setItem('friend_shop_token', payload.token);
    return payload;
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setAdminOrders([]);
    localStorage.removeItem('friend_shop_token');
    setCurrentPage('home');
  };

  const handleUpdateProfile = async (profileData: any) => {
    if (!authToken) throw new Error('Not Authenticated');

    const res = await fetch('/api/auth/profile/update', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(profileData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Profile update failed.');
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    return updatedUser;
  };

  // 2. Cart Operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const matchIdx = prev.findIndex(item => item.product.id === product.id);
      if (matchIdx > -1) {
        const updated = [...prev];
        const newQty = updated[matchIdx].quantity + quantity;
        updated[matchIdx].quantity = Math.min(newQty, product.stock);
        return updated;
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    // Visual shortcut to Cart
    setCurrentPage('cart');
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    setCart([{ product, quantity: Math.min(quantity, product.stock) }]);
    setCurrentPage('cart');
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const matchedLimit = Math.min(quantity, item.product.stock);
          return { ...item, quantity: matchedLimit };
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon('');
  };

  // 3. Wishlist Toggle
  const handleToggleWishlist = async (product: Product) => {
    const isPresent = wishlist.includes(product.id);
    let updatedWishlist = [];
    if (isPresent) {
      updatedWishlist = wishlist.filter(id => id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product.id];
    }
    setWishlist(updatedWishlist);

    // If logged in, sync wishlist array to backend profile securely
    if (authToken) {
      try {
        await fetch('/api/auth/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ wishlist: updatedWishlist })
        });
        // refresh profile
        restoreSession();
      } catch (err) {
        console.error('Wishlist sync error:', err);
      }
    }
  };

  // 10. Submission Review Handler
  const handleSubmitReview = async (productId: string, rating: number, comment: string) => {
    const response = await fetch(`/api/products/${productId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user ? user.name : "Anonymous companion",
        rating,
        comment
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Review submission rejected.");
    }

    const updatedProduct = await response.json();
    // Update local products copy
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            reviews: updatedProduct.reviews,
            rating: updatedProduct.rating,
            ratingCount: updatedProduct.ratingCount
          };
        }
        return p;
      });
    });

    return updatedProduct;
  };

  // 11. Checkout order submit
  const handleCheckoutSubmitOrder = async (orderData: any) => {
    // Inject auth header if logged in
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Checkout transaction failed.');
    }

    const result = await response.json();
    
    // Refresh products catalog limits
    loadCatalog();
    
    // Refresh user profile for order lists
    if (authToken) {
      await restoreSession();
    }

    return result;
  };

  // 12. Chatbot Message Proxy
  const handleChatbotMessage = async (conversation: ChatMessage[]) => {
    const response = await fetch('/api/gemini/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'AI gateway busy.');
    }

    return await response.json();
  };

  // 14. Admin Actions Syncs
  const handleAdminAddProduct = async (productData: any) => {
    if (!authToken) throw new Error('Unauthenticated');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(productData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Create product failed');
    }

    const published = await res.json();
    loadCatalog(); // Refresh catalog listings
    return published;
  };

  const handleAdminUpdateProductStock = async (productId: string, stock: number) => {
    if (!authToken) throw new Error('Unauthenticated');
    const res = await fetch(`/api/admin/products/${productId}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ stock })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update stock failed');
    }

    const published = await res.json();
    loadCatalog(); // Refresh catalog listings
    return published;
  };

  const handleAdminDeleteProduct = async (productId: string) => {
    if (!authToken) throw new Error('Unauthenticated');
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Delete failed');
    }

    loadCatalog(); // Refresh catalog listings
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, status: string) => {
    if (!authToken) throw new Error('Unauthenticated');
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update status failed');
    }

    const updatedOrder = await res.json();
    loadGlobalOrders(authToken);
    if (authToken) {
      restoreSession(); // Refresh profile values
    }
    return updatedOrder;
  };

  // Newsletter Subscriber
  const handleNewsletterSubscribe = async (email: string) => {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Subscription issue.');
    }
    return await res.json();
  };

  // Nav categories callback
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setCurrentPage('category');
  };

  // Nav direct product details
  const handleSelectProduct = (prod: Product) => {
    setSelectedProductId(prod.id);
    setCurrentPage('product-details');
  };

  const handleSelectProductById = (prodId: string) => {
    setSelectedProductId(prodId);
    setCurrentPage('product-details');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors antialiased">
      
      {/* Dynamic Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cart={cart}
        wishlist={wishlist}
        user={user}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Core Router View Panels */}
      <main className="flex-1 bg-slate-50/20 dark:bg-slate-955/2 flex flex-col pt-4">
        
        {currentPage === 'home' && (
          <Home
            products={products}
            categories={categories}
            blogs={blogs}
            setCurrentPage={setCurrentPage}
            onSelectCategory={handleSelectCategory}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentPage === 'shop' && (
          <Shop
            products={products}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            onFilterByCategory={handleSelectCategory}
          />
        )}

        {currentPage === 'product-details' && (
          <ProductDetails
            product={currentProduct}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={wishlist.includes(currentProduct.id)}
            onSelectProduct={handleSelectProduct}
            user={user}
            onSubmitReview={handleSubmitReview}
            onBuyNow={handleBuyNow}
            wishlist={wishlist}
          />
        )}

        {currentPage === 'category' && (
          <CategoryPage
            category={currentCategory}
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            setCurrentPage={setCurrentPage}
            onSelectProduct={handleSelectProduct}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            appliedCoupon={appliedCoupon}
            user={user}
            onCheckout={handleCheckoutSubmitOrder}
            onClearCart={handleClearCart}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            onLogin={handleLogin}
            onRegister={handleRegister}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'dashboard' && user && (
          <Dashboard
            user={user}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onUpdateProfile={handleUpdateProfile}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'admin' && user && user.email === 'admin@friendshop.com' && (
          <AdminPanel
            products={products}
            orders={adminOrders}
            onAddProduct={handleAdminAddProduct}
            onUpdateProductStock={handleAdminUpdateProductStock}
            onDeleteProduct={handleAdminDeleteProduct}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'about' && <About />}
        
        {currentPage === 'contact' && <Contact />}
        
        {currentPage === 'blog' && <Blog blogs={blogs} />}

      </main>

      {/* Floating Action AI Companion Chatbot Button */}
      <AIChatbot 
        onSendMessage={handleChatbotMessage}
        setCurrentPage={setCurrentPage}
        onSelectProductById={handleSelectProductById}
      />

      {/* Elegant footer */}
      <Footer setCurrentPage={setCurrentPage} onSubscribe={handleNewsletterSubscribe} />

    </div>
  );
}
