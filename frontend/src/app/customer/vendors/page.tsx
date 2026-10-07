'use client';

import React, { useState } from 'react';
import { mockBusinesses, mockMenuItems, mockReviews, mockVideos } from '../../../utils/mockData';
import { Business } from '../../../types';
import { Truck, Star, MapPin, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { BottomSheet } from '../../../components/customer/BottomSheet';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerVendorsPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const vendors = mockBusinesses.filter((b) => b.businessType === 'MOBILE_VENDOR');

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-400" /> Live Mobile Food Vendors
            </h1>
            <p className="text-xs text-gray-400">Track moving food trucks, vans & carts on live GPS near your location.</p>
          </div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-extrabold">
            {vendors.length} Vendors Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((b) => (
            <div
              key={b._id}
              className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-xl hover:border-brand-orange/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={b.coverImage || b.logo}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-orange text-white shadow-md">
                      🚚 MOBILE VENDOR
                    </span>
                    {b.verification?.isVerified && (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {b.rating.average} ({b.rating.count})
                    </span>
                    <span className="font-bold bg-black/60 backdrop-blur px-2 py-0.5 rounded-full">
                      {b.address.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-brand-orange transition-colors">{b.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{b.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-dark-border/50">
                    <span className="font-bold text-brand-orange">{b.etaText || '03 mins ETA'}</span>
                    <span className="text-gray-400 font-semibold">{b.queue?.count || 5} waiting in queue</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedBusiness(b)}
                  className="w-full py-2.5 rounded-xl bg-brand-orange text-white font-bold text-xs shadow-glow-orange hover:scale-[1.02] transition-transform"
                >
                  View Truck & Menu
                </button>
              </div>
            </div>
          ))}
        </div>

        <BottomSheet
          business={selectedBusiness}
          menuItems={mockMenuItems}
          reviews={mockReviews}
          videos={mockVideos}
          onClose={() => setSelectedBusiness(null)}
        />
      </div>
    </AuthGuard>
  );
}
