'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Home, Map, Heart, ShoppingBag, User, Store, Navigation, ChefHat, Table, ListOrdered } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname?.includes('/login')) return null;

  const role = user?.role || 'CUSTOMER';

  const customerItems = [
    { href: '/customer/home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/customer/map', label: 'Map', icon: <Map className="w-5 h-5" /> },
    { href: '/customer/favorites', label: 'Saved', icon: <Heart className="w-5 h-5" /> },
    { href: '/customer/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { href: '/customer/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const vendorItems = [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: <Store className="w-5 h-5 text-amber-400" /> },
    { href: '/vendor/live-location', label: 'GPS Live', icon: <Navigation className="w-5 h-5 text-emerald-400" /> },
    { href: '/vendor/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { href: '/vendor/menu', label: 'Menu', icon: <ListOrdered className="w-5 h-5" /> },
    { href: '/vendor/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const restaurantItems = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: <ChefHat className="w-5 h-5 text-purple-400" /> },
    { href: '/restaurant/kitchen', label: 'KDS Kitchen', icon: <ChefHat className="w-5 h-5 text-brand-orange" /> },
    { href: '/restaurant/tables', label: 'Tables', icon: <Table className="w-5 h-5 text-emerald-400" /> },
    { href: '/restaurant/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { href: '/restaurant/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const items = role === 'MOBILE_VENDOR' ? vendorItems : role === 'RESTAURANT' ? restaurantItems : customerItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur border-t border-dark-border py-2 px-4 flex items-center justify-around md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href === '/customer/home' && pathname === '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              isActive ? 'text-brand-orange scale-110' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
