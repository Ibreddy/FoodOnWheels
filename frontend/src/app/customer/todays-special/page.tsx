'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Star, Tag, Truck, Utensils, MapPin, Clock, ArrowLeft, Filter, Flame } from 'lucide-react';
import { useOwnerContext } from '@/context/OwnerContext';

export default function CustomerTodaysSpecialPage() {
  const { siteContent } = useOwnerContext();
  const [filterRole, setFilterRole] = useState<'ALL' | 'MOBILE_VENDOR' | 'RESTAURANT'>('ALL');
  const [sortBy, setSortBy] = useState<'DISCOUNT' | 'RATING' | 'PRICE'>('DISCOUNT');

  const businesses = siteContent.businesses || [];
  const menuItems = siteContent.menuItems || [];
  const specials = menuItems.filter((i) => i.isTodaysSpecial);

  const filteredSpecials = specials.filter((item) => {
    const biz = businesses.find((b) => b._id === item.businessId) || businesses[0];
    if (filterRole === 'MOBILE_VENDOR' && biz.businessType !== 'MOBILE_VENDOR') return false;
    if (filterRole === 'RESTAURANT' && (biz.businessType !== 'RESTAURANT' && biz.businessType !== 'CAFE')) return false;
    return true;
  }).sort((a, b) => {
    const origA = a.price || 160;
    const specA = a.specialPrice || Math.round(origA * 0.8);
    const discA = Math.round(((origA - specA) / origA) * 100);

    const origB = b.price || 160;
    const specB = b.specialPrice || Math.round(origB * 0.8);
    const discB = Math.round(((origB - specB) / origB) * 100);

    if (sortBy === 'DISCOUNT') return discB - discA;
    if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'PRICE') return specA - specB;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-dark-card border border-dark-border p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Link href="/customer/home" className="p-2 rounded-xl bg-dark-bg border border-dark-border text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
            DISCOVERY PORTAL
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#FF7A00]" /> Today's Special Deals
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Explore daily discounts and chef featured creations published directly by top rated mobile food trucks and dining restaurants near you.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dark-border">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filterRole === 'ALL' ? 'bg-[#FF7A00] text-white border-[#FF7A00]' : 'bg-dark-bg border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              All Specials ({specials.length})
            </button>
            <button
              onClick={() => setFilterRole('MOBILE_VENDOR')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                filterRole === 'MOBILE_VENDOR' ? 'bg-[#FF7A00] text-white border-[#FF7A00]' : 'bg-dark-bg border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Mobile Vendors
            </button>
            <button
              onClick={() => setFilterRole('RESTAURANT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                filterRole === 'RESTAURANT' ? 'bg-purple-600 text-white border-purple-600' : 'bg-dark-bg border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Restaurants
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-bold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-dark-bg border border-dark-border rounded-xl text-white font-bold focus:outline-none"
            >
              <option value="DISCOUNT">Highest Discount %</option>
              <option value="RATING">Highest Customer Rating</option>
              <option value="PRICE">Lowest Special Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Specials */}
      {filteredSpecials.length === 0 ? (
        <div className="bg-dark-card border border-dark-border p-12 rounded-3xl text-center space-y-2">
          <p className="text-base font-bold text-white">No active specials found for this filter.</p>
          <p className="text-xs text-gray-400">Check back later as vendors publish fresh daily deals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecials.map((item) => {
            const parentBiz = businesses.find((b) => b._id === item.businessId) || businesses[0];
            const isMobile = parentBiz?.businessType === 'MOBILE_VENDOR';
            const originalPrice = item.price || 160;
            const specialPrice = item.specialPrice || Math.round(originalPrice * 0.8);
            const discountPct = item.discountPercentage || Math.round(((originalPrice - specialPrice) / originalPrice) * 100);

            return (
              <div
                key={item._id}
                className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-xl hover:border-[#FF7A00]/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Header with Badges */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181C23] via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#FF7A00] text-white shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {item.specialLabel || (isMobile ? "TODAY'S PICK" : "CHEF SPECIAL")}
                      </span>
                      {discountPct > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-md">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-extrabold flex items-center gap-1 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {item.rating || 4.8}
                      </span>
                      <span className="font-semibold bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/10 text-[10px]">
                        ⏰ Available until {item.availableUntil || '10 PM'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-black text-lg text-white group-hover:text-[#FF7A00] transition-colors">{item.name}</h3>
                      <p className="text-xs font-bold text-gray-300 flex items-center gap-1 mt-0.5">
                        {isMobile ? (
                          <span className="text-[#FF7A00]">🚚 {parentBiz.name} • 🟢 LIVE</span>
                        ) : (
                          <span className="text-purple-400">🍽 {parentBiz.name}</span>
                        )}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2">{item.description || 'Special offer item prepared fresh today.'}</p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-1 border-t border-dark-border">
                      <span className="text-2xl font-black text-[#2CC55E]">₹{specialPrice}</span>
                      <span className="text-xs text-gray-500 line-through font-bold">₹{originalPrice}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded ml-auto">
                        🔥 Save ₹{originalPrice - specialPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <Link
                    href={isMobile ? `/customer/vendor/${parentBiz._id}` : `/customer/restaurants`}
                    className="flex-1 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs shadow-md text-center transition-transform hover:scale-[1.02]"
                  >
                    Order Special Now
                  </Link>
                  <Link
                    href={isMobile ? `/customer/vendor/${parentBiz._id}` : `/customer/restaurants`}
                    className="px-4 py-3 rounded-2xl bg-[#252A34] text-gray-300 hover:text-white font-bold text-xs border border-[#2A2F3D]"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
