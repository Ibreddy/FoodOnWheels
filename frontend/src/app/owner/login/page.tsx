'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOwnerContext } from '@/context/OwnerContext';
import { Crown, KeyRound, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('owner@foodonwheels.com');
  const [password, setPassword] = useState('owner123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { ownerLogin } = useOwnerContext();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = ownerLogin(email, password);
      setIsLoading(false);

      if (success) {
        router.push('/owner/dashboard');
      } else {
        setError('Invalid owner email or security key. Access denied.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E65100]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#14171F] border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Top Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#E65100] text-white shadow-xl shadow-[#FF7A00]/25 mb-2">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">FoodOnWheels Owner Panel</h1>
            <p className="text-gray-400 text-xs mt-1">Private Control Dashboard & Content Manager</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Owner Authorization</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Owner Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@foodonwheels.com"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Owner Password / Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 text-[11px] text-gray-400 space-y-1">
            <p className="font-semibold text-gray-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF7A00]" /> Default Credentials:
            </p>
            <p><span className="text-gray-500">Email:</span> <code className="text-[#FF7A00]">owner@foodonwheels.com</code></p>
            <p><span className="text-gray-500">Password:</span> <code className="text-[#FF7A00]">owner123</code></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FF7A00]/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Access...' : 'Unlock Owner Control'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-500 text-xs border-t border-gray-800/60 pt-5">
          <p>© FoodOnWheels Private Management Portal</p>
        </div>
      </div>
    </div>
  );
}
