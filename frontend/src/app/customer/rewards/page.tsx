'use client';

import React from 'react';
import { Gift, Share2, Copy } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerRewardsPage() {
  const { user } = useAuth();
  const referralCode = user?.referralCode || 'RAHUL100';

  const copyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralCode);
      alert(`Referral Code ${referralCode} copied to clipboard!`);
    }
  };

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 via-brand-emerald to-teal-700 p-6 rounded-3xl text-white shadow-2xl text-center space-y-2">
          <Gift className="w-12 h-12 mx-auto" />
          <h1 className="text-2xl font-extrabold tracking-tight">Referral Rewards & Cash</h1>
          <p className="text-xs text-white/90">Invite your foodie friends to StreetBite & earn ₹100 Wallet Cash for every friend who orders!</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 text-center shadow-xl">
          <p className="text-xs text-gray-400 font-bold uppercase">Your Unique Referral Code</p>
          <div className="flex items-center justify-between bg-dark-bg border border-dark-border p-4 rounded-2xl">
            <span className="font-mono font-extrabold text-2xl text-amber-400 tracking-wider">{referralCode}</span>
            <button
              onClick={copyCode}
              className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs shadow-glow-orange flex items-center gap-1"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={copyCode}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share Link with Friends
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
