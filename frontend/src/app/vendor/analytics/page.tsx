'use client';

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function VendorAnalyticsPage() {
  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" /> Vendor Revenue & Sales Analytics
            </h1>
            <p className="text-xs text-gray-400">Track daily sales, customer traffic & peak route hours.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">This Week Revenue</p>
            <p className="text-2xl font-black text-emerald-400">₹42,850</p>
          </div>
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Total Orders</p>
            <p className="text-2xl font-black text-white">248 Orders</p>
          </div>
          <div className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Top Route Stop</p>
            <p className="text-base font-black text-amber-400">Indiranagar 100ft Rd</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
