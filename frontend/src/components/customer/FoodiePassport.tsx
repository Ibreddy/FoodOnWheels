'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, CheckCircle2, Lock, Gift, MapPin, Sparkles } from 'lucide-react';

export const FoodiePassport: React.FC = () => {
  const { user } = useAuth();

  const cityZones = [
    { name: 'MG Road', icon: '📍', unlocked: true, stampDate: '24 Aug 2026' },
    { name: 'Indiranagar', icon: '☕', unlocked: true, stampDate: '22 Aug 2026' },
    { name: 'Koramangala', icon: '🍔', unlocked: true, stampDate: '20 Aug 2026' },
    { name: 'Whitefield', icon: '🍦', unlocked: false, stampDate: 'Locked' },
    { name: 'HSR Layout', icon: '🍕', unlocked: false, stampDate: 'Locked' },
    { name: 'Residency Road', icon: '🍛', unlocked: false, stampDate: 'Locked' }
  ];

  const unlockedCount = cityZones.filter((z) => z.unlocked).length;
  const points = user?.foodiePassport?.points || 450;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-brand-orange to-brand-yellow p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-7 h-7" />
            <h1 className="text-2xl font-extrabold tracking-tight">FOODIE PASSPORT</h1>
          </div>
          <p className="text-xs text-white/90">Collect stamps across city food zones & earn exclusive wallet rewards!</p>
        </div>

        <div className="bg-black/30 backdrop-blur px-5 py-3 rounded-2xl border border-white/20 text-center">
          <p className="text-[10px] text-white/80 uppercase font-bold tracking-wider">Food Points</p>
          <p className="text-2xl font-extrabold text-amber-300">{points} PTS</p>
        </div>
      </div>

      {/* Passport Book Surface */}
      <div className="bg-dark-card border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Bengaluru City Edition</span>
              <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {unlockedCount} / {cityZones.length} Stamps Collected
              </span>
            </h3>
            <p className="text-xs text-gray-400">Owner: {user?.name || 'Rahul Sharma'} • Passport ID: SB-IND-9842</p>
          </div>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cityZones.map((zone, idx) => (
            <div
              key={idx}
              className={`relative aspect-[4/3] rounded-2xl border-2 p-4 flex flex-col items-center justify-center text-center transition-all ${
                zone.unlocked
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-glow-orange scale-105'
                  : 'bg-dark-bg/60 border-dark-border opacity-60'
              }`}
            >
              {zone.unlocked ? (
                <>
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-xl bg-amber-500/20 mb-2 rotate-[-12deg] shadow-md animate-pulse">
                    {zone.icon}
                  </div>
                  <span className="font-extrabold text-sm text-white uppercase tracking-wider">{zone.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono mt-1">STAMPED ✓ {zone.stampDate}</span>
                </>
              ) : (
                <>
                  <Lock className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="font-bold text-xs text-gray-400">{zone.name}</span>
                  <span className="text-[9px] text-gray-500 mt-1">Visit 1 business to unlock</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Reward Redeem Pill */}
        <div className="mt-6 pt-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-brand-yellow" />
            <div>
              <p className="text-xs font-bold text-white">Next Reward Unlock: ₹100 Wallet Cash</p>
              <p className="text-[11px] text-gray-400">Collect 4 stamps to claim your foodie reward coupon.</p>
            </div>
          </div>
          <button
            disabled={unlockedCount < 4}
            onClick={() => alert('Congratulations! ₹100 added to your StreetBite wallet!')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-bold text-xs shadow-glow-orange disabled:opacity-40"
          >
            Claim Reward
          </button>
        </div>
      </div>
    </div>
  );
};
