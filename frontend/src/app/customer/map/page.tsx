'use client';

import React, { useState } from 'react';
import { MapView } from '../../../components/map/MapView';
import { BottomSheet } from '../../../components/customer/BottomSheet';
import { ReservationModal } from '../../../components/customer/ReservationModal';
import { mockBusinesses, mockMenuItems, mockReviews, mockVideos } from '../../../utils/mockData';
import { Business } from '../../../types';
import { Truck, Utensils } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerMapPage() {
  const [selectedType, setSelectedType] = useState<'ALL' | 'MOBILE_VENDORS' | 'RESTAURANTS'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [reservationBusiness, setReservationBusiness] = useState<Business | null>(null);

  const categories = ['ALL', 'Burger', 'Tea', 'Ice Cream', 'South Indian', 'Coffee', 'Biryani'];

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
        {/* Map Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-card border border-dark-border p-3 rounded-2xl shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === 'ALL' ? 'bg-brand-orange text-white' : 'bg-dark-bg text-gray-400'
              }`}
            >
              All Businesses
            </button>
            <button
              onClick={() => setSelectedType('MOBILE_VENDORS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                selectedType === 'MOBILE_VENDORS' ? 'bg-amber-500 text-dark-bg font-extrabold' : 'bg-dark-bg text-gray-400'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Mobile Vendors
            </button>
            <button
              onClick={() => setSelectedType('RESTAURANTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                selectedType === 'RESTAURANTS' ? 'bg-purple-500 text-white' : 'bg-dark-bg text-gray-400'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Restaurants
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === c ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Main Map Canvas */}
        <div className="flex-1 relative">
          <MapView
            businesses={mockBusinesses}
            selectedBusiness={selectedBusiness}
            onSelectBusiness={(b) => setSelectedBusiness(b)}
            filterType={selectedType}
            filterCategory={selectedCategory}
          />
        </div>

        {/* Detail BottomSheet Drawer */}
        <BottomSheet
          business={selectedBusiness}
          menuItems={mockMenuItems}
          reviews={mockReviews}
          videos={mockVideos}
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
