'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, Clock, Tag, Navigation, Sparkles, Star, ArrowRight, ShieldCheck, 
  MapPin, Trophy, Gift, CheckCircle2, ChevronRight, Heart, Bell, Radio, Zap 
} from 'lucide-react';
import { Business, MenuItem } from '../../types';
import { mockDeals, mockCustomerChoiceWinners } from '../../utils/mockData';
import { useOwnerContext } from '../../context/OwnerContext';

interface DiscoveryProps {
  businesses: Business[];
  menuItems: MenuItem[];
  onSelectBusiness: (b: Business) => void;
  onOpenReservation?: (b: Business) => void;
}

// 1. TODAY'S SPECIAL SECTION
export const TodaysSpecialSection: React.FC<DiscoveryProps> = ({ businesses, menuItems, onSelectBusiness }) => {
  const specials = menuItems.filter((i) => i.isTodaysSpecial);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
              DAILY FEATURE
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7A00]" /> TODAY'S SPECIAL
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Freshly selected dishes and special offers available today.</p>
        </div>
        <a href="/customer/todays-special" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
          View All Specials →
        </a>
      </div>

      {specials.length === 0 ? (
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl text-center text-xs text-gray-400">
          No special offers today. Check back soon for fresh daily deals!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specials.map((item) => {
            const parentBiz = businesses.find((b) => b._id === item.businessId) || businesses[0];
            const isMobile = parentBiz?.businessType === 'MOBILE_VENDOR';
            const originalPrice = item.price || 160;
            const specialPrice = item.specialPrice || Math.round(originalPrice * 0.8);
            const discountPct = item.discountPercentage || Math.round(((originalPrice - specialPrice) / originalPrice) * 100);

            return (
              <div
                key={item._id}
                className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl hover:border-[#FF7A00]/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Header with Badge */}
                  <div className="relative h-44 overflow-hidden">
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
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-base text-white group-hover:text-[#FF7A00] transition-colors">{item.name}</h3>
                        <p className="text-xs font-bold text-gray-300 flex items-center gap-1 mt-0.5">
                          {isMobile ? (
                            <span className="text-[#FF7A00]">🚚 {parentBiz.name} • 🟢 LIVE</span>
                          ) : (
                            <span className="text-purple-400">🍽 {parentBiz.name}</span>
                          )}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                        📍 {parentBiz.address.split(',')[0]}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-black text-[#2CC55E]">₹{specialPrice}</span>
                      <span className="text-xs text-gray-500 line-through font-bold">₹{originalPrice}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        🔥 Save ₹{originalPrice - specialPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onSelectBusiness(parentBiz)}
                    className="flex-1 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02]"
                  >
                    Order Special Now
                  </button>
                  <button
                    onClick={() => onSelectBusiness(parentBiz)}
                    className="px-3.5 py-2.5 rounded-2xl bg-[#252A34] text-gray-300 hover:text-white font-bold text-xs border border-[#2A2F3D]"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

// 2. COMING NEAR YOU SECTION
export const ComingNearYouSection: React.FC<DiscoveryProps> = ({ businesses, onSelectBusiness }) => {
  const movingVendors = businesses.filter((b) => b.businessType === 'MOBILE_VENDOR' && b.headingTo);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              LIVE EN ROUTE
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400 animate-pulse" /> COMING NEAR YOU
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Food vendors travelling toward your area right now.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movingVendors.map((b) => (
          <div key={b._id} className="bg-[#181C23] border border-[#2A2F3D] p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={b.logo} alt={b.name} className="w-14 h-14 rounded-2xl object-cover border border-[#2A2F3D] shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">{b.name}</h3>
                  <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                    🚚 MOVING
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Currently: <strong className="text-gray-100">{b.address.split(',')[0]}</strong> → Heading to: <strong className="text-[#FF7A00]">{b.headingTo}</strong>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
                  <span>⏳ ETA: <strong className="text-white">{b.etaMinutes || 15} mins</strong></span>
                  <span>⏰ Expected: <strong className="text-white">{b.expectedArrival || '6:30 PM'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => alert(`You are now following ${b.name}! You will receive live arrival notifications.`)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md"
              >
                Follow Vendor
              </button>
              <button
                onClick={() => alert(`Reminder set for ${b.name} arrival at ${b.expectedArrival || '6:30 PM'}!`)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-gray-300 hover:text-white font-bold text-xs"
              >
                Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 3. TRENDING NEAR YOU SECTION
export const TrendingNearYouSection: React.FC<DiscoveryProps> = ({ businesses, onSelectBusiness }) => {
  const trending = businesses.filter((b) => b.trendingRank).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
              POPULARITY RANK
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" /> TRENDING NEAR YOU
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">What people around you are loving right now based on live orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trending.map((b) => (
          <div key={b._id} className="bg-[#181C23] border border-[#2A2F3D] p-5 rounded-3xl shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#FF7A00]">#{b.trendingRank}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                🔥 {b.recentOrdersCount || 40} orders recently
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-2xl object-cover border border-[#2A2F3D]" />
              <div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-[#FF7A00] transition-colors">{b.name}</h3>
                <p className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  ⭐ {b.rating.average} ({b.rating.count} reviews)
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 line-clamp-1">{b.tagline}</p>

            <button
              onClick={() => onSelectBusiness(b)}
              className="w-full py-2 rounded-xl bg-[#252A34] hover:bg-[#FF7A00] text-white font-bold text-xs border border-[#2A2F3D] transition-colors"
            >
              View Menu
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. RESTAURANTS NEAR YOU SECTION
export const RestaurantsNearYouSection: React.FC<DiscoveryProps> = ({ businesses, onSelectBusiness, onOpenReservation }) => {
  const restaurants = businesses.filter((b) => b.businessType === 'RESTAURANT' || b.businessType === 'CAFE');

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            🍽️ RESTAURANTS & CAFES NEAR YOU
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Fine dining, seating tables & KDS kitchen places around you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {restaurants.map((r) => (
          <div key={r._id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <img src={r.coverImage || r.logo} alt={r.name} className="w-24 h-24 rounded-2xl object-cover border border-[#2A2F3D] shrink-0" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-white">{r.name}</h3>
                  <span className="text-[10px] font-bold text-[#2CC55E] bg-[#2CC55E]/20 px-2 py-0.5 rounded-full border border-[#2CC55E]/30">
                    Open Now
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{r.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-gray-300 pt-1">
                  <span className="font-bold text-purple-400">⏳ {r.waitTimeMinutes || 20} mins wait</span>
                  <span className="font-extrabold text-amber-400">⭐ {r.rating.average}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-[#2A2F3D] pt-3">
              <button
                onClick={() => onSelectBusiness(r)}
                className="flex-1 py-2.5 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                View Menu
              </button>
              {onOpenReservation && (
                <button
                  onClick={() => onOpenReservation(r)}
                  className="px-4 py-2.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-extrabold rounded-xl"
                >
                  Reserve Table
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 5. DEALS NEAR YOU SECTION
export const DealsSection: React.FC = () => {
  const { siteContent } = useOwnerContext();
  const [timeLeft, setTimeLeft] = useState(5072);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeDeals = (siteContent.deals || []).filter((d) => d.isActive !== false);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-[#2CC55E] border border-[#2CC55E]/30">
              LIMITED TIME
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#2CC55E]" /> DEALS NEAR YOU
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Limited-time food offers around you with live countdown timers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {activeDeals.map((deal) => (
          <div key={deal.id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl space-y-3 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-36 rounded-2xl overflow-hidden">
                <img src={deal.bannerImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop'} alt={deal.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-full shadow-md">
                  {deal.discountPercentage}% OFF • {deal.code}
                </span>
                <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 backdrop-blur text-amber-400 font-extrabold text-[10px] rounded-full border border-white/10">
                  Ends in: {formatTimer(timeLeft)}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white line-clamp-1">{deal.title}</h3>
                <p className="text-xs text-gray-400 font-semibold">{deal.businessName}</p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{deal.description}</p>
              </div>
            </div>

            <button
              onClick={() => alert(`Deal code ${deal.code} copied! Applied ${deal.discountPercentage}% discount to cart.`)}
              className="w-full py-2.5 bg-[#2CC55E] hover:bg-[#2CC55E]/90 text-white font-extrabold text-xs rounded-xl shadow-md mt-2"
            >
              Claim Code: {deal.code}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// 6. FOOD ALONG YOUR ROUTE SECTION
export const FoodAlongRouteSection: React.FC<{ businesses: Business[]; onSelectBusiness: (b: Business) => void }> = ({ businesses, onSelectBusiness }) => {
  const [fromLoc, setFromLoc] = useState('Hyderabad Airport');
  const [toLoc, setToLoc] = useState('Hitech City');
  const [isSearching, setIsSearching] = useState(false);

  const availableBiz = (businesses && businesses.length > 0) ? businesses : [];
  const b1 = availableBiz[0];
  const b2 = availableBiz[1] || availableBiz[0];
  const b3 = availableBiz[2] || availableBiz[1] || availableBiz[0];

  const routeStops = [
    { biz: b1, detour: '+4 min detour', stopName: 'Airport Exit Food Stop' },
    { biz: b2, detour: '+2 min detour', stopName: 'Outer Ring Road Stop' },
    { biz: b3, detour: '+6 min detour', stopName: 'Hitech Flyover Stop' },
  ].filter(s => s.biz);

  return (
    <section className="bg-gradient-to-br from-[#181C23] to-[#252A34] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-2xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
            SIGNATURE FEATURE
          </span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#FF7A00]" /> FOOD ALONG YOUR ROUTE
          </h2>
        </div>
        <p className="text-xs text-gray-300 mt-1">Find great food trucks & restaurants along your travel route.</p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181C23] p-3 rounded-2xl border border-[#2A2F3D]">
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-gray-400 uppercase">FROM</label>
          <input
            type="text"
            value={fromLoc}
            onChange={(e) => setFromLoc(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold text-gray-400 uppercase">TO</label>
          <input
            type="text"
            value={toLoc}
            onChange={(e) => setToLoc(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white font-bold"
          />
        </div>
      </div>

      {/* Route Graphic */}
      <div className="bg-[#181C23] p-4 rounded-2xl border border-[#2A2F3D] space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-300 font-bold">
          <span>🏁 {fromLoc}</span>
          <span className="text-[#FF7A00]">{routeStops.length} Food Stops Discovered</span>
          <span>📍 {toLoc}</span>
        </div>

        <div className="relative h-2 bg-[#252A34] rounded-full overflow-hidden flex items-center justify-around">
          <div className="absolute inset-0 bg-[#FF7A00]/40 animate-pulse"></div>
          <span className="relative z-10 w-3 h-3 rounded-full bg-[#FF7A00] border-2 border-white"></span>
          <span className="relative z-10 w-3 h-3 rounded-full bg-[#FF7A00] border-2 border-white"></span>
          <span className="relative z-10 w-3 h-3 rounded-full bg-[#FF7A00] border-2 border-white"></span>
        </div>
      </div>

      {/* Food Stops Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {routeStops.map((stop, idx) => (
          <div key={idx} className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#FF7A00] bg-[#FF7A00]/20 px-2 py-0.5 rounded-md">
                {stop.detour}
              </span>
              <h4 className="font-extrabold text-sm text-white mt-1">{stop.biz?.name || 'Local Food Spot'}</h4>
              <p className="text-xs text-amber-400 font-bold">⭐ {stop.biz?.rating?.average || 4.5} • Open Now</p>
            </div>
            <button
              onClick={() => stop.biz && onSelectBusiness(stop.biz)}
              className="w-full py-2 bg-[#252A34] hover:bg-[#FF7A00] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Explore Stop
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// 7. NEW ON FOODONWHEELS SECTION
export const NewBusinessesSection: React.FC<{ businesses: Business[]; onSelectBusiness: (b: Business) => void }> = ({ businesses, onSelectBusiness }) => {
  const newBiz = businesses.filter((b) => b.registeredDaysAgo);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-400 border border-purple-500/30">
              FRESH ONBOARDING
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" /> NEW ON FOODONWHEELS
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Give newly registered vendors & restaurants visibility in your area.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {newBiz.map((b) => (
          <div key={b._id} className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl shadow-xl flex items-center gap-4">
            <img src={b.logo} alt={b.name} className="w-16 h-16 rounded-2xl object-cover border border-[#2A2F3D] shrink-0" />
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-500 text-white">
                NEW • {b.registeredDaysAgo} DAYS AGO
              </span>
              <h3 className="font-extrabold text-sm text-white line-clamp-1">{b.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{b.categories.join(', ')}</p>
              <button onClick={() => onSelectBusiness(b)} className="text-xs font-extrabold text-[#FF7A00] hover:underline pt-1">
                Explore Business →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 8. CUSTOMER CHOICE SECTION
export const CustomerChoiceSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
              COMMUNITY VOTED
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> CUSTOMER CHOICE
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Top-rated food experiences selected by our community this week.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {mockCustomerChoiceWinners.map((winner, idx) => (
          <div key={idx} className="bg-[#181C23] border-2 border-amber-500/30 p-5 rounded-3xl shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                {winner.emoji} {winner.categoryTitle} Winner
              </span>
              <span className="text-xs text-gray-400 font-bold">{winner.votesCount}</span>
            </div>

            <div className="relative h-32 rounded-2xl overflow-hidden">
              <img src={winner.image} alt={winner.dishName} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
                ⭐ {winner.rating} Rating
              </div>
            </div>

            <div>
              <h3 className="font-black text-base text-white">{winner.dishName}</h3>
              <p className="text-xs text-gray-300 font-semibold">{winner.winnerBusiness}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 9. TODAY'S FOOD CHALLENGE SECTION
export const TodaysChallengeSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-amber-600/20 via-[#FF7A00]/20 to-purple-600/20 border border-[#FF7A00]/40 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00] text-white font-extrabold text-[10px]">
          <Gift className="w-3.5 h-3.5" /> TODAY'S FOOD CHALLENGE
        </div>
        <h3 className="text-xl font-black text-white">Try a new food category today! 🍜 Asian / South Indian</h3>
        <p className="text-xs text-gray-300">Complete this daily goal to earn <strong className="text-amber-400">+50 Foodie Points</strong> in your wallet!</p>
        
        {/* Progress bar */}
        <div className="w-full max-w-xs bg-[#181C23] h-2.5 rounded-full overflow-hidden border border-[#2A2F3D] mt-2">
          <div className="bg-[#FF7A00] h-full w-1/4"></div>
        </div>
        <span className="text-[10px] text-gray-400 font-bold">Progress: 0 / 1 Completed</span>
      </div>

      <button
        onClick={() => alert('Challenge active! Explore food categories below to earn +50 points.')}
        className="px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 shrink-0"
      >
        Explore Challenge
      </button>
    </section>
  );
};

// 10. FOOD STORIES SECTION
export const FoodStoriesSection: React.FC = () => {
  const { siteContent } = useOwnerContext();
  const liveStories = siteContent.stories && siteContent.stories.length > 0 ? siteContent.stories : [
    {
      _id: 's1',
      title: 'Fresh double patty sizzling on flame right now 🍔🔥',
      businessName: 'Ramesh Burger Truck',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
      views: 2400,
      likes: 420,
    },
    {
      _id: 's2',
      title: 'Slow dum biryani pot unsealing ceremony 🥘✨',
      businessName: 'Spice Garden Restaurant',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
      views: 5800,
      likes: 1100,
    },
    {
      _id: 's3',
      title: 'Brewing hot kulhad ginger chai ☕',
      businessName: 'Chai Tapri Mobile',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop',
      views: 1900,
      likes: 310,
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
              REELS & REVIEWS
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> FOOD STORIES
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Fresh food. Real people. Real experiences.</p>
        </div>
        <a href="/customer/reels" className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
          View All Stories <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {liveStories.map((story) => (
          <div key={story._id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl relative group">
            <div className="relative h-64 overflow-hidden">
              <img src={story.thumbnailUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <a href="/customer/reels" className="w-12 h-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform font-bold text-sm">
                  ▶
                </a>
              </div>

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-[10px] font-extrabold text-white">
                LIVE REEL
              </div>

              <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white">
                <p className="text-xs font-extrabold line-clamp-2">{story.title}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-300 pt-1">
                  <span>{story.businessName}</span>
                  <span>👁️ {story.views} • ❤️ {story.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

