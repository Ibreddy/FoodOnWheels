'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" /> Restaurant Analytics & Table Occupancy
            </h1>
            <p className="text-xs text-gray-400">Analyze table turnover rates, reservation trends & monthly revenue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Monthly Sales</p>
            <p className="text-2xl font-black text-purple-400">₹1,84,200</p>
          </div>
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Table Occupancy Rate</p>
            <p className="text-2xl font-black text-emerald-400">84%</p>
          </div>
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Average Wait Time</p>
            <p className="text-2xl font-black text-amber-400">18 Mins</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
