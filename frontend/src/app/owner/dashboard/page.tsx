'use client';

import React from 'react';
import NextLink from 'next/link';
import { useOwnerContext } from '@/context/OwnerContext';
import {
  Truck,
  Flame,
  Tag,
  Film,
  Home,
  ArrowRight,
  Plus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const { siteContent } = useOwnerContext();

  const totalBusinesses = siteContent.businesses.length;
  const vendorCount = siteContent.businesses.filter(b => b.businessType === 'MOBILE_VENDOR' || b.vehicleType).length;
  const restaurantCount = totalBusinesses - vendorCount;
  const todaysSpecialsCount = siteContent.todaysSpecials.length;
  const dealsCount = siteContent.deals.length;
  const storiesCount = siteContent.stories.length;
  const enabledSectionsCount = siteContent.homepageSections.filter(s => s.enabled).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E2330] via-[#14171F] to-[#1E2330] p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#FF7A00] font-semibold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Owner Control Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome back, Project Owner!
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              From here, you have full authority to modify homepage discovery sections, manage food vendors, change dishes, update deals, and customize site settings in real-time.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <NextLink
              href="/owner/homepage"
              className="px-4 py-2.5 bg-[#FF7A00] hover:bg-[#E65100] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF7A00]/20 transition-all flex items-center space-x-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Control Homepage</span>
            </NextLink>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Businesses */}
        <div className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Businesses</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{totalBusinesses}</span>
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-emerald-400 font-semibold">{vendorCount} Trucks</span> • <span className="text-blue-400 font-semibold">{restaurantCount} Restaurants</span>
            </p>
          </div>
        </div>

        {/* Today's Specials */}
        <div className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today's Specials</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{todaysSpecialsCount}</span>
            <p className="text-xs text-amber-400 mt-1 font-medium">Active daily deals & discounts</p>
          </div>
        </div>

        {/* Active Deals & Coupons */}
        <div className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Promo Deals</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{dealsCount}</span>
            <p className="text-xs text-purple-400 mt-1 font-medium">Promotional banner coupons</p>
          </div>
        </div>

        {/* Active Discovery Sections */}
        <div className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Homepage Sections</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{enabledSectionsCount} / {siteContent.homepageSections.length}</span>
            <p className="text-xs text-emerald-400 mt-1 font-medium">Sections currently ON</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>Owner Control Modules</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Homepage Manager */}
          <NextLink
            href="/owner/homepage"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-[#FF7A00]/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF7A00] group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-[#FF7A00] transition-colors">
                Homepage Discovery Sections
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Reorder the 14 discovery sections, turn sections ON/OFF, and set max display items.
              </p>
            </div>
          </NextLink>

          {/* Module 2: Today's Special Manager */}
          <NextLink
            href="/owner/todays-special"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                Today's Specials & Discounts
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Add, edit, or remove featured daily food items, chef tags, and countdown timers.
              </p>
            </div>
          </NextLink>

          {/* Module 3: Deals & Coupons */}
          <NextLink
            href="/owner/deals"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
                Deals & Promo Coupons
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Configure promotional banners, discount percentages, coupon codes, and expiry dates.
              </p>
            </div>
          </NextLink>

          {/* Module 4: Businesses */}
          <NextLink
            href="/owner/businesses"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                Vendors & Restaurants
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Manage mobile food trucks, cafes, restaurants, verification badges, and ratings.
              </p>
            </div>
          </NextLink>

          {/* Module 5: Food & Menu */}
          <NextLink
            href="/owner/menu"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                Central Food Menu Manager
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Edit prices, change availability, add new dishes, and manage food categories.
              </p>
            </div>
          </NextLink>

          {/* Module 6: Stories & Reels */}
          <NextLink
            href="/owner/stories"
            className="group bg-[#14171F] p-5 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
                <Film className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-pink-400 transition-colors">
                Food Stories & Reels
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Manage video reels, engagement likes, video URLs, and business attributions.
              </p>
            </div>
          </NextLink>
        </div>
      </div>

      {/* System Live Status */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>Real-time Website Synchronization Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">LocalStorage Override</p>
              <p className="text-[11px] text-gray-400">Synced to key <code className="text-[#FF7A00]">fow_owner_content</code></p>
            </div>
          </div>

          <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Public Homepage Sync</p>
              <p className="text-[11px] text-gray-400">Instant updates on customer refresh</p>
            </div>
          </div>

          <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Authentication State</p>
              <p className="text-[11px] text-gray-400">Token isolated to owner session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
