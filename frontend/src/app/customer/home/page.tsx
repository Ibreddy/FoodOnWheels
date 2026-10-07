'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOwnerContext } from '@/context/OwnerContext';
import { Business } from '@/types';
import { MapView } from '@/components/map/MapView';
import { BottomSheet } from '@/components/customer/BottomSheet';
import { ReservationModal } from '@/components/customer/ReservationModal';
import { FoodiePassport } from '@/components/customer/FoodiePassport';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  TodaysSpecialSection,
  ComingNearYouSection,
  TrendingNearYouSection,
  RestaurantsNearYouSection,
  DealsSection,
  FoodAlongRouteSection,
  NewBusinessesSection,
  CustomerChoiceSection,
  TodaysChallengeSection,
  FoodStoriesSection
} from '@/components/customer/DiscoverySections';
import {
  MapPin,
  Truck,
  Utensils,
  Star,
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function CustomerHomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { siteContent } = useOwnerContext();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [reservationBusiness, setReservationBusiness] = useState<Business | null>(null);

  const searchValue = (typeof searchParams?.q === 'string' ? searchParams.q : '') || '';

  // Filter businesses from OwnerContext siteContent
  const activeBusinesses = siteContent.businesses || [];
  const activeMenuItems = siteContent.menuItems || [];

  const filteredBusinesses = activeBusinesses.filter((b) => {
    if (selectedCategory !== 'ALL' && !b.categories.includes(selectedCategory)) {
      return false;
    }
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchTag = b.tagline.toLowerCase().includes(q);
      const matchCat = b.categories.some((c) => c.toLowerCase().includes(q));
      const matchAddr = b.address.toLowerCase().includes(q);
      return matchName || matchTag || matchCat || matchAddr;
    }
    return true;
  });

  // Get active homepage sections sorted by owner configured order
  const activeSections = [...siteContent.homepageSections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSectionComponent = (secId: string, secTitle: string, secSubtitle: string) => {
    switch (secId) {
      case 'hero':
        if (searchValue) return null;
        return (
          <section key={secId} className="relative rounded-3xl bg-canva-vignette border border-[#800020]/40 p-6 sm:p-10 overflow-hidden shadow-canva-red">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 hidden lg:block pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop"
                alt="Food Background"
                className="w-full h-full object-cover rounded-r-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#2E0308]/80 to-[#1C0508]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/40 border border-[#FFB800]/50 text-[#FFB800] text-xs font-extrabold shadow-canva-gold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>PREMIUM LOCAL FOOD & RESTAURANT EXPERIENCE</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  {secTitle || 'Good Food, Brighter Journeys'} <br />
                  <span className="text-canva-gold-gradient">
                    Photographic Culinary
                  </span> <br />
                  Discovery.
                </h1>

                <p className="text-sm sm:text-base text-gray-200 max-w-lg leading-relaxed">
                  {secSubtitle || 'Track real-time food trucks on live GPS, reserve restaurant tables, watch foodie reels & enjoy authentic local street food near you.'}
                </p>

                {/* Integrated Search Bar */}
                <div className="relative max-w-lg flex items-center bg-[#2B080C]/90 border border-[#800020]/60 rounded-2xl p-1.5 shadow-canva-red backdrop-blur-md">
                  <input
                    type="text"
                    placeholder="Search for food, vendors, restaurants..."
                    className="w-full pl-4 pr-12 py-2.5 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF9900] text-[#1C0508] font-black text-xs shadow-canva-gold flex items-center gap-1.5 transition-transform hover:scale-105 uppercase tracking-wider">
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4 text-[#1C0508]" />
                  </button>
                </div>
              </div>

              {/* Satellite Live Map Window */}
              <div className="relative h-[360px] rounded-3xl overflow-hidden border border-[#2A2F3D] shadow-2xl">
                <MapView
                  businesses={activeBusinesses}
                  selectedBusiness={selectedBusiness}
                  onSelectBusiness={(b) => setSelectedBusiness(b)}
                  filterType="ALL"
                  filterCategory={selectedCategory}
                />
              </div>
            </div>
          </section>
        );

      case 'live_near_you':
        return (
          <section key={secId} className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">{secTitle || 'Live Near You'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{secSubtitle || 'Broadcasting live GPS coordinates & real-time ETA'}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <button className="px-3.5 py-1.5 rounded-xl bg-[#FF7A00] text-white">Vendors</button>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#181C23] text-gray-400 border border-[#2A2F3D] hover:text-white">Restaurants</button>
                <Link href="/customer/vendors" className="text-[#FF7A00] hover:underline ml-2 hidden sm:inline">View All →</Link>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-8 rounded-3xl text-center space-y-2">
                <p className="text-base font-bold text-white">No food businesses match your search "{searchValue}"</p>
                <p className="text-xs text-gray-400">Try searching for "Burger", "Chai", "Biryani", or "Indiranagar".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((b) => {
                  const isMobile = b.businessType === 'MOBILE_VENDOR';
                  return (
                    <div
                      key={b._id}
                      className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl hover:border-[#FF7A00]/60 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={b.coverImage || b.logo}
                            alt={b.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181C23] via-transparent to-transparent"></div>

                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md flex items-center gap-1 ${
                              isMobile ? 'bg-[#FF7A00]' : 'bg-purple-600'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                              {isMobile ? 'LIVE VENDOR' : 'RESTAURANT'}
                            </span>
                            {b.verification?.isVerified && (
                              <span className="bg-[#2CC55E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                                <ShieldCheck className="w-3 h-3" /> VERIFIED
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                            <span className="font-extrabold flex items-center gap-1 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {b.rating.average} ({b.rating.count})
                            </span>
                            <span className="font-extrabold bg-black/70 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                              {b.address.split(',')[0]}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="font-black text-base text-white group-hover:text-[#FF7A00] transition-colors">{b.name}</h3>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{b.tagline}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2A2F3D] text-gray-300">
                            {isMobile ? (
                              <>
                                <span className="font-extrabold text-[#FF7A00]">📍 {b.etaText || '350 m away'}</span>
                                <span className="text-gray-400 font-semibold">⏳ {b.queue?.count || 8} in queue</span>
                              </>
                            ) : (
                              <>
                                <span className="font-extrabold text-purple-400">⏳ {b.waitTimeMinutes || 20} mins wait</span>
                                <span className="text-[#2CC55E] font-bold">Open Now</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBusiness(b)}
                          className="w-full py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] transition-transform"
                        >
                          View Menu
                        </button>

                        {!isMobile && (
                          <button
                            onClick={() => setReservationBusiness(b)}
                            className="px-3.5 py-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-extrabold hover:bg-purple-500/30"
                          >
                            Reserve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );

      case 'todays_special':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <TodaysSpecialSection
              businesses={activeBusinesses}
              menuItems={siteContent.todaysSpecials && siteContent.todaysSpecials.length > 0 ? siteContent.todaysSpecials : activeMenuItems}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
            />
          </div>
        );

      case 'coming_near_you':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <ComingNearYouSection
              businesses={activeBusinesses}
              menuItems={activeMenuItems}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
            />
          </div>
        );

      case 'trending_near_you':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <TrendingNearYouSection
              businesses={activeBusinesses}
              menuItems={activeMenuItems}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
            />
          </div>
        );

      case 'restaurants_near_you':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <RestaurantsNearYouSection
              businesses={activeBusinesses}
              menuItems={activeMenuItems}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
              onOpenReservation={(b) => setReservationBusiness(b)}
            />
          </div>
        );

      case 'food_stories':
        if (searchValue) return null;
        return <div key={secId}><FoodStoriesSection /></div>;

      case 'deals':
        if (searchValue) return null;
        return <div key={secId}><DealsSection /></div>;

      case 'food_along_route':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <FoodAlongRouteSection
              businesses={activeBusinesses}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
            />
          </div>
        );

      case 'new_businesses':
        if (searchValue) return null;
        return (
          <div key={secId}>
            <NewBusinessesSection
              businesses={activeBusinesses}
              onSelectBusiness={(b) => setSelectedBusiness(b)}
            />
          </div>
        );

      case 'customer_choice':
        if (searchValue) return null;
        return <div key={secId}><CustomerChoiceSection /></div>;

      case 'foodie_passport':
        if (searchValue) return null;
        return <div key={secId}><FoodiePassport /></div>;

      case 'todays_challenge':
        if (searchValue) return null;
        return <div key={secId}><TodaysChallengeSection /></div>;

      case 'footer':
        return (
          <footer key={secId} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-center gap-2">
              <img src="/logo.png" alt="FoodOnWheels" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-xl text-white">
                {siteContent.themeSettings.brandName.slice(0, 4)}
                <span className="text-[#FF7A00]">{siteContent.themeSettings.brandName.slice(4)}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              {siteContent.themeSettings.brandTagline}
            </p>
            <div className="pt-2 text-[11px] text-gray-500 font-semibold">
              © 2026 {siteContent.themeSettings.brandName} Inc. All Rights Reserved. • Good Food. Brighter Journeys.
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Search active notice */}
        {searchValue.trim() && (
          <div className="bg-[#FF7A00]/20 border border-[#FF7A00]/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-white">
            <span>Search Results for: <strong className="text-[#FF7A00]">"{searchValue}"</strong> ({filteredBusinesses.length} matches)</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF7A00]" />
              <span>Explore Categories</span>
            </h2>
            <Link href="/customer/map" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
              View Live Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
            {[
              { id: 'ALL', label: 'All 🎛️' },
              { id: 'Burger', label: 'Burgers 🍔' },
              { id: 'Biryani', label: 'Biryani 🍛' },
              { id: 'Pizza', label: 'Pizza 🍕' },
              { id: 'Coffee', label: 'Coffee ☕' },
              { id: 'Tea', label: 'Desserts 🍰' },
              { id: 'Ice Cream', label: 'Healthy 🥗' },
              { id: 'South Indian', label: 'South Indian 🥘' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-lg scale-105'
                    : 'bg-white dark:bg-[#181C23] border-gray-200 dark:border-[#2A2F3D] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Render Discovery Sections dynamically according to Owner order and toggles */}
        {activeSections.map((sec) => renderSectionComponent(sec.id, sec.title, sec.subtitle))}

        {/* Popups */}
        <BottomSheet
          business={selectedBusiness}
          menuItems={activeMenuItems}
          reviews={[]}
          videos={[]}
          onClose={() => setSelectedBusiness(null)}
          onOpenReservation={() => {
            setReservationBusiness(selectedBusiness);
            setSelectedBusiness(null);
          }}
        />

        <ReservationModal
          business={reservationBusiness}
          isOpen={!!reservationBusiness}
          onClose={() => setReservationBusiness(null)}
        />
      </div>
    </AuthGuard>
  );
}
