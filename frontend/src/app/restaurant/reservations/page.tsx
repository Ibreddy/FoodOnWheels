'use client';

import React, { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantReservationsPage() {
  const [res, setRes] = useState([
    { id: 'r1', name: 'Ananya Rao', phone: '+91 9844556677', date: '2026-09-12', time: '07:30 PM', guests: 4, seating: 'INDOOR', status: 'CONFIRMED' }
  ]);

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" /> Table Reservations Manager
            </h1>
            <p className="text-xs text-gray-400">Accept or reject table booking requests from food customers.</p>
          </div>
        </div>

        <div className="space-y-4">
          {res.map((r) => (
            <div key={r.id} className="bg-dark-card border border-dark-border p-5 rounded-3xl flex items-center justify-between gap-4 shadow-md text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-white">{r.name} • {r.guests} Guests</h4>
                <p className="text-gray-400">{r.date} at {r.time} ({r.seating})</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-full">{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
