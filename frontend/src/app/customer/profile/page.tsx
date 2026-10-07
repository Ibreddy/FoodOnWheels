'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Award, LogOut, Edit3, Save } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { AvatarUploader } from '../../../components/common/AvatarUploader';

export default function CustomerProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl text-center space-y-3 shadow-xl">
          <AvatarUploader size="xl" showDownload={false} />
          <div>
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Role: Food Customer
            </span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Account Details</h3>
            <button onClick={() => setEditing(!editing)} className="text-xs font-bold text-brand-orange flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-white font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-gray-400 block mb-1">Email / Gmail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-white font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-gray-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-white font-bold"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-orange" /> Name
                </span>
                <span className="font-bold text-white">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-orange" /> Email
                </span>
                <span className="font-bold text-white font-mono">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-orange" /> Phone
                </span>
                <span className="font-bold text-white font-mono">{user?.phone || '+91 9876543210'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> Foodie Passport Points
                </span>
                <span className="font-bold text-amber-400">{user?.foodiePassport?.points || 450} PTS</span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full py-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-rose-500/30"
          >
            <LogOut className="w-4 h-4" /> Log Out of Account
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
