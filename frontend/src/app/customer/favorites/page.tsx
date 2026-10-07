'use client';

import React from 'react';
import { Heart, Star, Truck, Utensils } from 'lucide-react';
import { mockBusinesses } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerFavoritesPage() {
  const favorites = mockBusinesses.slice(0, 2);

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Favorites & Saved Spots
            </h1>
            <p className="text-xs text-gray-400">Quickly access your favorite food trucks, stalls, and restaurants.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map((b) => (
            <div key={b._id} className="bg-dark-card border border-dark-border p-4 rounded-3xl flex items-center gap-4 shadow-md">
              <img src={b.logo} alt={b.name} className="w-16 h-16 rounded-2xl object-cover border border-dark-border" />
              <div>
                <h3 className="font-extrabold text-sm text-white">{b.name}</h3>
                <p className="text-xs text-gray-400">{b.tagline}</p>
                <div className="flex items-center gap-2 text-xs font-bold mt-1 text-amber-400">
                  <span>⭐ {b.rating.average}</span>
                  <span className="text-gray-400">• {b.address.split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
