'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useOwnerContext } from '@/context/OwnerContext';
import { RefreshCw, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import NextLink from 'next/link';

export const OwnerHeader: React.FC = () => {
  const pathname = usePathname();
  const { resetAllToDefault } = useOwnerContext();

  const getPageTitle = () => {
    switch (pathname) {
      case '/owner':
      case '/owner/dashboard':
        return { title: 'Owner Dashboard', subtitle: 'Central Control Panel & System Metrics' };
      case '/owner/homepage':
        return { title: 'Homepage Content Manager', subtitle: 'Reorder sections, toggle visibility & manage limits' };
      case '/owner/todays-special':
        return { title: 'Today\'s Specials Manager', subtitle: 'Highlight daily discounted dishes & chef choices' };
      case '/owner/deals':
        return { title: 'Deals & Coupons Manager', subtitle: 'Manage promotional banners, coupons & discount codes' };
      case '/owner/businesses':
        return { title: 'Vendors & Restaurants Manager', subtitle: 'Feature businesses, verify licenses & set status' };
      case '/owner/menu':
        return { title: 'Food & Menu Items Manager', subtitle: 'Add, update, or remove menu items across all vendors' };
      case '/owner/stories':
        return { title: 'Food Stories & Video Reels', subtitle: 'Manage street food clips & engagement metrics' };
      case '/owner/routes':
        return { title: 'Moving Vendor Routes & Stops', subtitle: 'Configure live vehicle routes & arrival schedules' };
      case '/owner/awards':
        return { title: 'Customer Choice Awards', subtitle: 'Update category winners & voting leaderboards' };
      case '/owner/challenges':
        return { title: 'Daily Foodie Challenges', subtitle: 'Configure daily gamification tasks & bonus points' };
      case '/owner/settings':
        return { title: 'Theme & Site Settings', subtitle: 'Customize colors, branding, defaults & credentials' };
      default:
        return { title: 'Private Control Area', subtitle: 'FoodOnWheels Owner Settings' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="h-16 bg-[#14171F] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
      {/* Title & Description */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Header Actions & Profile */}
      <div className="flex items-center space-x-3">
        {/* System Sync Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Real-time Sync Active</span>
        </div>

        {/* Reset Defaults Action */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all website data to default initial values?')) {
              resetAllToDefault();
            }
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700 transition-all"
          title="Reset all owner data overrides back to initial defaults"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>

        {/* View Customer Website Link */}
        <NextLink
          href="/customer/home"
          target="_blank"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#FF7A00] hover:bg-[#E65100] transition-all shadow-md shadow-[#FF7A00]/20"
        >
          <Eye className="w-3.5 h-3.5 text-white" />
          <span>View Site</span>
        </NextLink>

        {/* Owner Profile Badge */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#E65100] text-white flex items-center justify-center font-bold text-xs shadow-md">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight">Project Owner</p>
            <p className="text-[10px] text-gray-400">superadmin@foodonwheels</p>
          </div>
        </div>
      </div>
    </header>
  );
};
