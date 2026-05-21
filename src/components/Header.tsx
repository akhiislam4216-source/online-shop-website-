import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Heart, User, Sparkles, Menu, X, 
  Sun, Moon, ShieldAlert, LogOut, LayoutDashboard 
} from 'lucide-react';
import { Product, CartItem, UserProf } from '../types';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cart: CartItem[];
  wishlist: string[];
  user: UserProf | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onSelectCategory: (catId: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({
  currentPage,
  setCurrentPage,
  cart,
  wishlist,
  user,
  onLogout,
  onSearch,
  onSelectCategory,
  darkMode,
  setDarkMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    setCurrentPage('shop');
  };

  const categoriesList = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'home', name: 'Home & Living' },
    { id: 'personal-care', name: 'Personal Care' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                Friend<span className="text-indigo-600">Shop</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                Shopping Made Friendly
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Find acoustic setups, organic creams, knit hoodie..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { onSearch(''); setCurrentPage('shop'); }}
              className={`text-sm font-medium transition-colors ${currentPage === 'shop' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}
            >
              Shop
            </button>
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl py-2 border border-slate-100 dark:border-slate-700 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { onSelectCategory(cat.id); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setCurrentPage('blog')}
              className={`text-sm font-medium transition-colors ${currentPage === 'blog' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}
            >
              About
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className={`text-sm font-medium transition-colors ${currentPage === 'contact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'}`}
            >
              Contact
            </button>
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-4 ml-2">
            
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (user) {
                  setCurrentPage('dashboard');
                } else {
                  setCurrentPage('auth');
                }
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
              title="Your Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-indigo-200 dark:border-slate-700 bg-slate-50 hover:opacity-90 transition-opacity"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                        <p className="font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => { setCurrentPage('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Dashboard
                      </button>

                      {user.email === 'admin@friendshop.com' && (
                        <button
                          onClick={() => { setCurrentPage('admin'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-slate-50 dark:border-slate-700 mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                  title="Sign In"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-3 px-4 flex flex-col gap-3 animate-fade-in text-sm">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
            <input
              type="text"
              placeholder="Search accessories, apparel, home care..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          <button 
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 font-medium ${currentPage === 'home' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { onSearch(''); setCurrentPage('shop'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 font-medium ${currentPage === 'shop' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Shop Product Catalog
          </button>

          <div className="py-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product Categories</p>
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => { onSelectCategory(cat.id); setMobileMenuOpen(false); }}
                className="w-full text-left py-1.5 pl-3 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 font-medium ${currentPage === 'blog' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Blog Articles
          </button>
          <button 
            onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 font-medium ${currentPage === 'about' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            About Us
          </button>
          <button 
            onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 font-medium ${currentPage === 'contact' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
