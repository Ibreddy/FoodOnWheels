'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Search, Mic, ShoppingBag, Globe, Sun, Moon, User as UserIcon, LogOut, Truck, ChefHat, Menu } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { ProfileDrawer } from '../auth/ProfileDrawer';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onOpenCart?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange, searchValue = '', onOpenCart, onToggleSidebar, isSidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();
  const { location, refreshLocation } = useLocation();
  
  const [isListening, setIsListening] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const role = user?.role || 'CUSTOMER';
  const homeHref = role === 'MOBILE_VENDOR' ? '/vendor/dashboard' : role === 'RESTAURANT' ? '/restaurant/dashboard' : '/customer/home';

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is supported on Chrome and modern Edge browsers.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'TE' ? 'te-IN' : language === 'HI' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onSearchChange) onSearchChange(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-gray-300 hover:text-white hover:border-[#FF7A00] transition-colors"
              title="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5 text-[#FF7A00]" />
            </button>
          )}

          <Link href={homeHref} className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="StreetBite Logo"
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-gray-900 dark:text-white font-sans">
                  Street<span className="text-canva-gold-gradient">Bite</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#800020]/50 text-[#FFB800] border border-[#FFB800]/40 shadow-sm">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-tight hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>
        </div>



        {role === 'MOBILE_VENDOR' && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Mobile Vendor GPS Workspace</span>
          </div>
        )}

        {role === 'RESTAURANT' && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs text-purple-400 font-bold">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Restaurant KDS & Table Floor Plan</span>
          </div>
        )}

        {/* Search Bar for Customer */}
        {role === 'CUSTOMER' && (
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-10 py-2 rounded-full bg-dark-card/90 border border-dark-border text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange transition-all shadow-inner"
            />
            <button
              onClick={startVoiceSearch}
              title="AI Voice Search"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-gray-400 hover:text-brand-orange'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative group">
            <button className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-xs">
              <Globe className="w-4 h-4 text-brand-purple" />
              <span className="font-bold text-[11px]">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-28 bg-dark-card border border-dark-border rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <button onClick={() => setLanguage('EN')} className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-white/10 flex items-center justify-between">
                <span>English</span> {language === 'EN' && '✓'}
              </button>
              <button onClick={() => setLanguage('TE')} className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-white/10 flex items-center justify-between">
                <span>తెలుగు</span> {language === 'TE' && '✓'}
              </button>
              <button onClick={() => setLanguage('HI')} className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-white/10 flex items-center justify-between">
                <span>हिंदी</span> {language === 'HI' && '✓'}
              </button>
            </div>
          </div>

          {/* Light / Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-300 hover:text-amber-400 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>

          {/* Cart Counter (Only visible to CUSTOMER role as required) */}
          {role === 'CUSTOMER' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full bg-brand-orange text-white shadow-glow-orange hover:scale-105 transition-transform"
              title="Customer Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile & Account Details Button */}
          {user ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border hover:border-brand-orange transition-colors text-xs font-bold text-white shadow-sm"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-brand-orange object-cover"
              />
              <span className="hidden sm:inline line-clamp-1 max-w-[100px]">{user.name.split(' ')[0]}</span>
              <span className="text-[10px] font-extrabold bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded">
                {role === 'MOBILE_VENDOR' ? 'Vendor' : role === 'RESTAURANT' ? 'Rest.' : 'User'}
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-full bg-brand-orange text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </Link>
          )}
        </div>
      </div>

      {/* Auth & Profile Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onOpenAuth={() => setIsAuthOpen(true)} />
    </header>
  );
};
