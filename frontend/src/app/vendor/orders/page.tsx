'use client';

import React, { useState } from 'react';
import { ShoppingBag, Play, Check } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([
    { id: 'v101', number: 'FOW-849201', customerName: 'Rahul S.', items: '2x Double Cheese Burger, 1x Peri-Peri Fries', status: 'PREPARING', amount: 350 },
    { id: 'v102', number: 'FOW-849205', customerName: 'Ananya R.', items: '1x Cold Coffee, 1x Veg Club Sandwich', status: 'PLACED', amount: 220 }
  ]);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-brand-orange" /> Vendor Orders Manager
            </h1>
            <p className="text-xs text-gray-400">Accept incoming pickup orders, update cooking status & verify OTP.</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-white">{o.number} • {o.customerName}</h3>
                  <p className="text-xs text-gray-400">{o.items}</p>
                </div>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">₹{o.amount}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-dark-border">
                <span className="text-xs font-extrabold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
                  STATUS: {o.status}
                </span>

                <div className="flex items-center gap-2">
                  {o.status === 'PLACED' && (
                    <button onClick={() => updateStatus(o.id, 'PREPARING')} className="px-4 py-1.5 bg-brand-orange text-white font-bold rounded-xl text-xs flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" /> Accept Order
                    </button>
                  )}
                  {o.status === 'PREPARING' && (
                    <button onClick={() => updateStatus(o.id, 'READY')} className="px-4 py-1.5 bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mark Ready for Pickup
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
