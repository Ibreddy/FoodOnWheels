'use client';

import React from 'react';
import { Bell, Truck, CheckCircle2 } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerNotificationsPage() {
  const notifications = [
    { id: '1', title: 'Order Accepted', desc: 'Ramesh Burger Truck has accepted your order #FOW-849201.', time: '10 mins ago' },
    { id: '2', title: 'Truck Nearby!', desc: 'Coffee Van is now 200m away from your location on MG Road.', time: '25 mins ago' }
  ];

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-brand-orange" /> Notifications & Alerts
            </h1>
            <p className="text-xs text-gray-400">Live order status updates and nearby vendor alerts.</p>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-dark-card border border-dark-border p-4 rounded-2xl flex items-start gap-3 shadow-md">
              <div className="p-2 rounded-xl bg-brand-orange/20 text-brand-orange border border-brand-orange/30 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-white">{n.title}</h4>
                  <span className="text-[10px] text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
