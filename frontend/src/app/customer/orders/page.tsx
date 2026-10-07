'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { getSocket } from '../../../services/socket';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerOrdersPage() {
  const [orderStatus, setOrderStatus] = useState<'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED'>('PREPARING');

  useEffect(() => {
    const socket = getSocket();
    socket.on('order:status:update', (data: { status: any }) => {
      setOrderStatus(data.status);
    });

    return () => {
      socket.off('order:status:update');
    };
  }, []);

  const steps = [
    { id: 'PLACED', label: 'Order Confirmed', time: '12:40 PM' },
    { id: 'ACCEPTED', label: 'Vendor Accepted', time: '12:41 PM' },
    { id: 'PREPARING', label: 'Food Preparing', time: '12:43 PM' },
    { id: 'READY', label: 'Ready for Pickup', time: '12:52 PM' },
    { id: 'COMPLETED', label: 'Completed', time: '12:55 PM' }
  ];

  const getStepIndex = (status: string) => steps.findIndex((s) => s.id === status);
  const currentIdx = getStepIndex(orderStatus);

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-2xl">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-brand-orange" />
              <span>Live Order Tracking & OTP</span>
            </h1>
            <p className="text-xs text-gray-400">Track real-time order status timeline & live vendor location arrival.</p>
          </div>
        </div>

        {/* Live Active Order Tracking Card */}
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dark-border pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Order #FOW-849201</span>
              <h3 className="text-lg font-bold text-white">Ramesh Burger Truck</h3>
              <p className="text-xs text-gray-400">2x Double Cheese Burger, 1x Peri-Peri Fries</p>
            </div>

            <div className="bg-dark-bg px-4 py-2 rounded-2xl border border-dark-border text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup OTP</p>
              <p className="text-xl font-mono font-extrabold text-brand-orange">4829</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Progress Timeline</h4>

            <div className="relative pl-6 border-l-2 border-dark-border space-y-6">
              {steps.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step.id} className="relative flex items-center justify-between">
                    <div
                      className={`absolute -left-[31px] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-glow-emerald'
                          : 'bg-dark-bg border-2 border-dark-border text-gray-500'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>

                    <div>
                      <h5 className={`text-xs font-bold ${isCurrent ? 'text-brand-orange' : isDone ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </h5>
                      {isCurrent && <p className="text-[10px] text-emerald-400 font-semibold">In Progress...</p>}
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono">{step.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
