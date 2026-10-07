'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantOrdersPage() {
  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-purple-400" /> Restaurant Dine-In & Pickup Orders
            </h1>
            <p className="text-xs text-gray-400">View incoming dine-in, pickup & takeaway orders.</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Order #FOW-849201 • Table #2</span>
            <span className="text-emerald-400 font-extrabold font-mono">₹850</span>
          </div>
          <p className="text-gray-400">2x Chicken Dum Biryani, 1x Paneer Butter Masala</p>
        </div>
      </div>
    </AuthGuard>
  );
}
