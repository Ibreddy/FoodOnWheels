'use client';

import React from 'react';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function VendorVerificationPage() {
  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" /> Business Verification & FSSAI
            </h1>
            <p className="text-xs text-gray-400">Manage FSSAI license, food safety certification & KYC status.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED VENDOR
          </span>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 text-xs shadow-xl">
          <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
            <span className="text-gray-400 font-bold">FSSAI License Number</span>
            <span className="text-white font-mono font-bold">11223344556677</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 font-bold">KYC Identity Verification</span>
            <span className="text-emerald-400 font-bold">Approved ✓</span>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
