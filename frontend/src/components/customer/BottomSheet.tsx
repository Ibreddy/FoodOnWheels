'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Business, MenuItem as MenuItemType, Review as ReviewType, VideoReel } from '../../types';
import { useCart } from '../../context/CartContext';
import { checkOrderEligibility } from '../../utils/distance';
import { 
  X, Star, Navigation, Phone, Share2, Clock, Users, ShieldCheck, 
  Plus, Check, Flame, ThumbsUp, Calendar, Heart, MapPin, Eye 
} from 'lucide-react';
import { MapView } from '../map/MapView';

interface BottomSheetProps {
  business: Business | null;
  menuItems: MenuItemType[];
  reviews: ReviewType[];
  videos: VideoReel[];
  onClose: () => void;
  onOpenReservation?: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  business,
  menuItems,
  reviews,
  videos,
  onClose,
  onOpenReservation
}) => {
  const [activeTab, setActiveTab] = useState<'LOCATION' | 'MENU' | 'VIDEOS' | 'REVIEWS' | 'TIMINGS'>('LOCATION');
  const { addToCart, items } = useCart();
  const [followed, setFollowed] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!business) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [business, onClose]);

  // HTML5 Live Customer Location Tracking as customer moves
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.log('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!business || !isMounted) return null;

  const isMobile = business.businessType === 'MOBILE_VENDOR' || business.businessType === 'FOOD_TRUCK';
  const orderEligibility = checkOrderEligibility(business, userPos);

  const sheetContent = (
    <div className="fixed inset-0 z-[99990] flex items-end justify-center">
      {/* Dim Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl bg-dark-bg/98 backdrop-blur-xl border-t border-x border-dark-border rounded-t-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col transition-all">
      {/* Top Handle & Close */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-dark-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 rounded-full bg-gray-600 mx-auto"></span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {isMobile ? 'Mobile Food Truck Profile & Live GPS' : 'Restaurant Profile & Ambience'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="overflow-y-auto p-6 space-y-6 flex-1">
        {/* Vendor/Restaurant Header Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-card border border-dark-border p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <img
              src={business.logo || business.coverImage}
              alt={business.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-orange shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{business.name}</h2>
                {business.verification?.isVerified && (
                  <span className="flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{business.tagline}</p>
              <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {business.rating.average} ({business.rating.count} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-orange" /> {business.address}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFollowed(!followed)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                followed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${followed ? 'fill-emerald-400' : ''}`} />
              <span>{followed ? 'Following' : 'Follow'}</span>
            </button>

            {!isMobile && onOpenReservation && (
              <button
                onClick={onOpenReservation}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-bold text-xs shadow-glow-purple"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reserve Table</span>
              </button>
            )}
          </div>
        </div>

        {/* Ordering Eligibility & Restriction Banner */}
        {isMobile ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-300 font-bold shadow-sm">
            <span className="text-base">🚚</span>
            <div>
              <p className="font-extrabold text-amber-400">Food Truck — Live GPS Tracking Only</p>
              <p className="text-[11px] text-amber-300/80 font-normal">Online orders cannot be placed for food trucks. Orders can only be taken from Restaurants within a 10 km radius.</p>
            </div>
          </div>
        ) : !orderEligibility.canOrder ? (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-rose-300 font-bold shadow-sm">
            <span className="text-base">📍</span>
            <div>
              <p className="font-extrabold text-rose-400">Outside 10 km Delivery Zone</p>
              <p className="text-[11px] text-rose-300/80 font-normal">{orderEligibility.reason}</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 font-bold shadow-sm">
            <span className="text-base">🟢</span>
            <div>
              <p className="font-extrabold text-emerald-400">Restaurant Delivery & Pickup Available</p>
              <p className="text-[11px] text-emerald-300/80 font-normal">Located {orderEligibility.distanceKm?.toFixed(1)} km away — within the 10 km ordering radius.</p>
            </div>
          </div>
        )}

        {/* Real-Time Live Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isMobile ? (
            <>
              <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Arrival</p>
                <p className="text-sm font-extrabold text-brand-orange mt-0.5">{business.etaText || '03 mins ETA'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Live Queue</p>
                <p className="text-sm font-extrabold text-white mt-0.5">{business.queue?.count || 5} people waiting</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Table Wait Time</p>
                <p className="text-sm font-extrabold text-brand-purple mt-0.5">{business.waitTimeMinutes || 20} mins wait</p>
              </div>
              <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Opening Hours</p>
                <p className="text-sm font-extrabold text-emerald-400 mt-0.5">Open Now (09 AM - 11 PM)</p>
              </div>
            </>
          )}

          <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Crowd Level Meter</p>
            <p className={`text-sm font-extrabold mt-0.5 ${
              business.crowdLevel === 'QUIET' ? 'text-emerald-400' : business.crowdLevel === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {business.crowdLevel}
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border p-3 rounded-2xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Customer Geolocation</p>
            <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
              {userPos ? `${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}` : 'Live Tracking Active'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-dark-border pb-2 overflow-x-auto">
          {[
            { id: 'LOCATION', label: isMobile ? 'Truck Live Location Map' : 'Restaurant Map Location' },
            { id: 'MENU', label: `Digital Menu (${menuItems.length})` },
            { id: 'VIDEOS', label: `Food Videos (${videos.length})` },
            { id: 'REVIEWS', label: `Reviews (${reviews.length})` },
            { id: 'TIMINGS', label: isMobile ? 'Route Schedule' : 'Ambience & Amenities' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-orange text-white shadow-glow-orange'
                  : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {activeTab === 'LOCATION' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-dark-card p-3 rounded-2xl border border-dark-border text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-orange" /> {business.name} Position: {business.address}
              </span>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${business.location.coordinates[1]},${business.location.coordinates[0]}`)}
                className="px-3 py-1 bg-brand-orange text-white rounded-lg font-bold text-[11px]"
              >
                Open Google Maps Navigation
              </button>
            </div>
            <div className="h-72 rounded-2xl overflow-hidden border border-dark-border">
              <MapView
                businesses={[business]}
                selectedBusiness={business}
                onSelectBusiness={() => {}}
              />
            </div>
          </div>
        )}

        {activeTab === 'MENU' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const inCart = items.some((i) => i.menuItem._id === item._id);
              return (
                <div key={item._id} className="bg-dark-card border border-dark-border p-3.5 rounded-2xl flex gap-3.5 relative overflow-hidden group hover:border-brand-orange/50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-dark-border"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-400">⭐ {item.rating || 4.8}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-white">₹{item.price}</span>

                      {item.isSoldOut ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-1 rounded-lg">SOLD OUT</span>
                      ) : (
                        <button
                          onClick={() => addToCart(item, business)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            inCart ? 'bg-emerald-500 text-white' : 'bg-brand-orange text-white shadow-glow-orange hover:scale-105'
                          }`}
                        >
                          {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{inCart ? 'Added' : 'Add'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'VIDEOS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((vid) => (
              <div key={vid._id} className="relative rounded-2xl overflow-hidden border border-dark-border bg-black aspect-[9/12]">
                <video src={vid.videoUrl} poster={vid.thumbnailUrl} controls className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 right-3 bg-dark-bg/80 backdrop-blur p-2.5 rounded-xl border border-dark-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{vid.foodName}</p>
                    <p className="text-[10px] text-brand-orange font-bold">₹{vid.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      const found = menuItems.find((m) => m.name === vid.foodName) || menuItems[0];
                      if (found) addToCart(found, business);
                    }}
                    className="px-3 py-1 rounded-lg bg-brand-orange text-white text-xs font-bold"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'REVIEWS' && (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={rev.customerAvatar} alt={rev.customerName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-white">{rev.customerName}</h5>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500">Verified Customer Review</span>
                </div>
                <p className="text-xs text-gray-300">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TIMINGS' && (
          <div className="space-y-3">
            {isMobile && business.route ? (
              <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Scheduled Daily Route Stops</h4>
                <div className="space-y-2">
                  {business.route.map((stop, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-dark-bg p-3 rounded-xl border border-dark-border">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${stop.isCurrent ? 'bg-brand-orange animate-ping' : 'bg-gray-600'}`}></span>
                        <span className="text-xs font-bold text-white">{stop.stopName}</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-orange">{stop.timeSlot}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Amenities & Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {business.amenities?.map((am, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-xs font-semibold text-gray-300">
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

  if (typeof window === 'undefined') return null;
  return createPortal(sheetContent, document.body);
};
