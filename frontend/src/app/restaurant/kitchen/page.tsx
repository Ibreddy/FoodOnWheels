'use client';

import React, { useState } from 'react';
import { ChefHat, Clock, Play, Check } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantKitchenPage() {
  const [orders, setOrders] = useState([
    { id: 'o101', number: 'FOW-849201', items: '2x Chicken Dum Biryani, 1x Paneer Butter Masala', type: 'DINE_IN', table: 2, status: 'PREPARING', minsAgo: 5 },
    { id: 'o102', number: 'FOW-849202', items: '1x Masala Dosa, 2x Cold Coffee', type: 'PICKUP', table: null, status: 'PLACED', minsAgo: 2 }
  ]);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-brand-orange" /> Kitchen Display System (KDS)
            </h1>
            <p className="text-xs text-gray-400">Live kitchen order queue feed for chefs & cooking staff.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-full">
            ● KDS Live Feed
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">{ord.number}</span>
                  <span className="text-[10px] font-bold bg-dark-bg border border-dark-border text-gray-300 px-2 py-0.5 rounded">
                    {ord.type} {ord.table ? `• Table #${ord.table}` : ''}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-400">{ord.minsAgo} mins ago</span>
              </div>

              <p className="text-xs text-gray-200 font-bold">{ord.items}</p>

              <div className="flex items-center justify-between pt-2 border-t border-dark-border">
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400">
                  STATUS: {ord.status}
                </span>

                <div className="flex items-center gap-2">
                  {ord.status === 'PLACED' && (
                    <button onClick={() => updateStatus(ord.id, 'PREPARING')} className="px-4 py-1.5 bg-amber-500 text-dark-bg font-bold text-xs rounded-xl flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" /> Start Cooking
                    </button>
                  )}
                  {ord.status === 'PREPARING' && (
                    <button onClick={() => updateStatus(ord.id, 'READY')} className="px-4 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-glow-emerald">
                      <Check className="w-3.5 h-3.5" /> Mark Ready
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
