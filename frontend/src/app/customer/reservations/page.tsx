'use client';

import React from 'react';
import { Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerReservationsPage() {
  const reservations = [
    {
      id: 'r1',
      restaurantName: 'Spice Garden',
      date: '2026-09-12',
      timeSlot: '07:30 PM',
      guestCount: 4,
      seating: 'INDOOR',
      status: 'CONFIRMED'
    }
  ];

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" /> Restaurant Table Reservations
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">View and manage your upcoming dining table reservations.</p>
          </div>
        </div>

        <div className="space-y-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-5 rounded-3xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{r.restaurantName}</h3>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {r.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold bg-gray-50 dark:bg-dark-bg p-3 rounded-2xl border border-gray-200 dark:border-dark-border">
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-extrabold">Date</p>
                  <p className="text-gray-900 dark:text-white font-extrabold">{r.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-extrabold">Time</p>
                  <p className="text-brand-orange font-extrabold">{r.timeSlot}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-extrabold">Guests</p>
                  <p className="text-gray-900 dark:text-white font-extrabold">{r.guestCount} People ({r.seating})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
