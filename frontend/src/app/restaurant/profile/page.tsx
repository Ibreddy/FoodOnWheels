'use client';

import React from 'react';
import { ChefHat, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { AvatarUploader } from '../../../components/common/AvatarUploader';

export default function RestaurantProfilePage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl text-center space-y-3 shadow-xl">
          <AvatarUploader size="xl" showDownload={false} />
          <div>
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Role: Restaurant Owner
            </span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
            <span className="text-gray-400 font-bold">Email</span>
            <span className="text-white font-mono">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
            <span className="text-gray-400 font-bold">Phone</span>
            <span className="text-white font-mono">{user?.phone || '+91 9844556677'}</span>
          </div>
          <button onClick={logout} className="w-full py-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-extrabold flex items-center justify-center gap-2 hover:bg-rose-500/30">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
