'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Map, Truck, UtensilsCrossed, Film, Users, Award,
  Store, ChefHat, Gift, LogOut, User as UserIcon,
  Navigation, ListOrdered, Calendar, Table, Layers, Video, Image,
  Star, Tag, BarChart3, ShieldCheck, Search, ShoppingBag, Heart, Settings
} from 'lucide-react';
import { ProfileDrawer } from '../auth/ProfileDrawer';
import { AuthModal } from '../auth/AuthModal';

interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If on login or owner route, hide sidebar completely
  if (pathname?.includes('/login') || pathname?.startsWith('/owner')) return null;

  // If closed, return null so zero space is taken
  if (!isOpen) return null;

  const role = user?.role || 'CUSTOMER';

  // Customer Nav Items
  const customerNav = [
    { href: '/customer/home', label: 'Home', icon: <Home className="w-4 h-4 text-[#FF7A00]" /> },
    { href: '/customer/explore', label: 'Explore', icon: <Search className="w-4 h-4 text-blue-400" /> },
    { href: '/customer/map', label: 'Live Map', icon: <Map className="w-4 h-4 text-emerald-400" /> },
    { href: '/customer/vendors', label: 'Food Vendors', icon: <Truck className="w-4 h-4 text-amber-400" /> },
    { href: '/customer/restaurants', label: 'Restaurants', icon: <UtensilsCrossed className="w-4 h-4 text-purple-400" /> },
    { href: '/customer/reels', label: 'Food Videos', icon: <Film className="w-4 h-4 text-rose-400" /> },
    { href: '/customer/favorites', label: 'Favorites', icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { href: '/customer/orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4 text-amber-400" /> },
    { href: '/customer/reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4 text-blue-400" /> },
    { href: '/customer/community', label: 'Community', icon: <Users className="w-4 h-4 text-cyan-400" /> },
    { href: '/customer/passport', label: 'Foodie Passport', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { href: '/customer/rewards', label: 'Rewards', icon: <Gift className="w-4 h-4 text-emerald-400" /> },
    { href: '/customer/settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-gray-400" /> },
  ];

  // Vendor Nav Items
  const vendorNav = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: <Store className="w-4 h-4 text-amber-400" /> },
    { href: '/vendor/live-location', label: 'Live Location', icon: <Navigation className="w-4 h-4 text-emerald-400" /> },
    { href: '/vendor/routes', label: 'Routes', icon: <Map className="w-4 h-4 text-blue-400" /> },
    { href: '/vendor/orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4 text-amber-400" /> },
    { href: '/vendor/menu', label: 'Menu', icon: <ListOrdered className="w-4 h-4 text-emerald-400" /> },
    { href: '/vendor/inventory', label: 'Inventory', icon: <Layers className="w-4 h-4 text-[#FF7A00]" /> },
    { href: '/vendor/videos', label: 'Videos', icon: <Video className="w-4 h-4 text-purple-400" /> },
    { href: '/vendor/reviews', label: 'Reviews', icon: <Star className="w-4 h-4 text-amber-400" /> },
    { href: '/vendor/promotions', label: 'Promotions', icon: <Tag className="w-4 h-4 text-rose-400" /> },
    { href: '/vendor/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
    { href: '/vendor/verification', label: 'Verification', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { href: '/vendor/settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-gray-400" /> },
  ];

  // Restaurant Nav Items
  const restaurantNav = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: <ChefHat className="w-4 h-4 text-purple-400" /> },
    { href: '/restaurant/orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4 text-amber-400" /> },
    { href: '/restaurant/kitchen', label: 'Kitchen (KDS)', icon: <ChefHat className="w-4 h-4 text-[#FF7A00]" /> },
    { href: '/restaurant/reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4 text-blue-400" /> },
    { href: '/restaurant/tables', label: 'Tables', icon: <Table className="w-4 h-4 text-emerald-400" /> },
    { href: '/restaurant/menu', label: 'Menu', icon: <ListOrdered className="w-4 h-4 text-emerald-400" /> },
    { href: '/restaurant/inventory', label: 'Inventory', icon: <Layers className="w-4 h-4 text-[#FF7A00]" /> },
    { href: '/restaurant/videos', label: 'Videos', icon: <Video className="w-4 h-4 text-rose-400" /> },
    { href: '/restaurant/gallery', label: 'Gallery', icon: <Image className="w-4 h-4 text-cyan-400" /> },
    { href: '/restaurant/reviews', label: 'Reviews', icon: <Star className="w-4 h-4 text-amber-400" /> },
    { href: '/restaurant/promotions', label: 'Promotions', icon: <Tag className="w-4 h-4 text-rose-400" /> },
    { href: '/restaurant/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-emerald-400" /> },
    { href: '/restaurant/verification', label: 'Verification', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
    { href: '/restaurant/settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-gray-400" /> },
  ];

  const currentNav = role === 'MOBILE_VENDOR' ? vendorNav : role === 'RESTAURANT' ? restaurantNav : customerNav;
  const workspaceTitle = role === 'MOBILE_VENDOR' ? 'MOBILE VENDOR PORTAL' : role === 'RESTAURANT' ? 'RESTAURANT WORKSPACE' : 'CUSTOMER DISCOVERY';

  if (!mounted) return null;

  return (
    <aside className="w-64 bg-white dark:bg-[#14171F] border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between shrink-0 hidden md:flex h-[calc(100vh-61px)] sticky top-[61px] p-4 text-xs font-sans z-30 transition-colors">
      {/* Top Header Label & Nav Links */}
      <div className="flex-1 flex flex-col min-h-0">
        <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 px-2">
          {workspaceTitle}
        </h4>
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800">
          {currentNav.map((item) => {
            const isActive = pathname === item.href || (item.href === '/customer/home' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? role === 'MOBILE_VENDOR'
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-sm'
                      : role === 'RESTAURANT'
                      ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30 shadow-sm'
                      : 'bg-[#FF7A00]/20 text-[#D96B00] dark:text-[#FF7A00] border border-[#FF7A00]/30 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Account Card */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2 shrink-0">
        {user ? (
          <div className="bg-gray-100 dark:bg-[#0F1115] border border-gray-200 dark:border-gray-800 p-3 rounded-2xl space-y-2.5 shadow-lg">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#FF7A00]"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#FF7A00] transition-colors truncate">
                    {user.name}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#FF7A00]">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full py-2.5 rounded-xl bg-[#FF7A00] text-white font-extrabold text-xs shadow-md shadow-[#FF7A00]/20 flex items-center justify-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </Link>
        )}
      </div>

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onOpenAuth={() => setIsAuthOpen(true)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </aside>
  );
};
