'use client';

import React from 'react';
import Link from 'next/router';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useOwnerContext } from '@/context/OwnerContext';
import {
  LayoutDashboard,
  Home,
  Flame,
  Tag,
  Truck,
  UtensilsCrossed,
  Film,
  MapPin,
  Trophy,
  Target,
  Sliders,
  LogOut,
  ExternalLink,
  Crown
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard Overview', href: '/owner/dashboard', icon: LayoutDashboard },
  { name: 'Homepage Sections', href: '/owner/homepage', icon: Home, badge: 'Live' },
  { name: 'Today\'s Specials', href: '/owner/todays-special', icon: Flame },
  { name: 'Deals & Coupons', href: '/owner/deals', icon: Tag },
  { name: 'Vendors & Restaurants', href: '/owner/businesses', icon: Truck },
  { name: 'Food & Menu Items', href: '/owner/menu', icon: UtensilsCrossed },
  { name: 'Video Stories & Reels', href: '/owner/stories', icon: Film },
  { name: 'Moving Routes & Stops', href: '/owner/routes', icon: MapPin },
  { name: 'Customer Choice Awards', href: '/owner/awards', icon: Trophy },
  { name: 'Daily Challenges', href: '/owner/challenges', icon: Target },
  { name: 'Theme & Site Settings', href: '/owner/settings', icon: Sliders },
];

export const OwnerSidebar: React.FC = () => {
  const pathname = usePathname();
  const { ownerLogout, siteContent } = useOwnerContext();

  return (
    <aside className="w-64 bg-[#14171F] border-r border-gray-800 flex flex-col justify-between shrink-0 select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#E65100] flex items-center justify-center text-white shadow-lg shadow-[#FF7A00]/20">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                {siteContent.themeSettings.brandName}
              </h1>
              <span className="text-[11px] font-semibold tracking-wider text-[#FF7A00] uppercase bg-[#FF7A00]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Owner Panel
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/owner/dashboard' && pathname === '/owner');
            const Icon = item.icon;

            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/20 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white text-[#FF7A00]' : 'bg-[#FF7A00]/20 text-[#FF7A00]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NextLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        <NextLink
          href="/customer/home"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-gray-400 bg-gray-900/60 hover:bg-gray-800 hover:text-white transition-all border border-gray-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#FF7A00]" />
            Preview Customer Site
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">Live</span>
        </NextLink>

        <button
          onClick={ownerLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-red-500/20"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Exit Owner Control</span>
        </button>
      </div>
    </aside>
  );
};
