'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  X, User as UserIcon, Mail, Phone, ShieldCheck, Award, LogOut, 
  RefreshCw, Save, Edit3, MapPin, Store, ChefHat, Bell, Settings, Heart, ShoppingBag, Calendar, Gift, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AvatarUploader } from '../common/AvatarUploader';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, onOpenAuth }) => {
  const { user, login, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Keyboard shortcut: Press ESC to close drawer & prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone, avatar });
    setEditing(false);
    alert('Profile details & photo updated successfully!');
  };

  const role = user?.role || 'CUSTOMER';

  const getHeaderTitle = () => {
    if (role === 'MOBILE_VENDOR') return 'Profile & Business Details';
    if (role === 'RESTAURANT') return 'Profile & Restaurant Details';
    return 'Profile & Account Details';
  };

  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push(path);
    onClose();
  };

  const getProfilePath = () => {
    if (role === 'MOBILE_VENDOR') return '/vendor/profile';
    if (role === 'RESTAURANT') return '/restaurant/profile';
    return '/customer/profile';
  };

  const getOrdersPath = () => {
    if (role === 'MOBILE_VENDOR') return '/vendor/orders';
    if (role === 'RESTAURANT') return '/restaurant/orders';
    return '/customer/orders';
  };

  const getReservationsPath = () => {
    if (role === 'RESTAURANT') return '/restaurant/reservations';
    return '/customer/reservations';
  };

  const getSettingsPath = () => {
    if (role === 'MOBILE_VENDOR') return '/vendor/settings';
    if (role === 'RESTAURANT') return '/restaurant/settings';
    return '/customer/settings';
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Background Overlay - Click outside to close */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Side Drawer Panel */}
      <aside 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:w-[420px] max-w-[100vw] h-full bg-white dark:bg-dark-bg border-l border-gray-200 dark:border-dark-border flex flex-col shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0"
        aria-modal="true"
        role="dialog"
      >
        {/* Fixed Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-gray-200 dark:border-dark-border p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-5 h-5 text-brand-orange" />
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
              {getHeaderTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-brand-orange transition-colors"
            title="Close Drawer (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {user ? (
            <>
              {/* User Avatar Card */}
              <div className="bg-gray-50 dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-5 rounded-3xl text-center space-y-3 shadow-xl">
                <AvatarUploader size="lg" showDownload={false} />
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-0.5">{user.email}</p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
                    <Star className="w-3.5 h-3.5 fill-[#FF7A00]" />
                    <span>Food Explorer | Level 5</span>
                  </div>
                </div>
              </div>

              {/* Menu List Options */}
              <div className="bg-gray-50 dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-3 rounded-3xl space-y-1 shadow-xl text-xs">
                {/* 1. My Profile */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleNav(getProfilePath(), e)}
                    className="flex-1 p-3 rounded-2xl flex items-center justify-between text-left hover:bg-gray-200/60 dark:hover:bg-[#252A34] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gray-200 dark:bg-[#252A34] text-[#FF7A00]"><UserIcon className="w-4 h-4" /></div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-[#FF7A00]">My Profile</h4>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">View & edit your full profile page</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(!editing); }}
                    className="p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-gray-400 hover:text-white hover:border-[#FF7A00] transition-colors text-[10px] font-bold shrink-0"
                    title="Quick edit avatar / details inline"
                  >
                    <Edit3 className="w-4 h-4 text-[#FF7A00]" />
                  </button>
                </div>

                {/* 2. Favorites */}
                <button
                  onClick={(e) => handleNav('/customer/favorites', e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-rose-400"><Heart className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Favorites</h4>
                      <p className="text-[10px] text-gray-400">Your saved vendors & restaurants</p>
                    </div>
                  </div>
                </button>

                {/* 3. Orders */}
                <button
                  onClick={(e) => handleNav(getOrdersPath(), e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-amber-400"><ShoppingBag className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Orders</h4>
                      <p className="text-[10px] text-gray-400">
                        {role === 'MOBILE_VENDOR' ? 'Manage vendor food orders' : role === 'RESTAURANT' ? 'Manage restaurant orders & KDS' : 'Track your food orders'}
                      </p>
                    </div>
                  </div>
                </button>

                {/* 4. Reservations */}
                <button
                  onClick={(e) => handleNav(getReservationsPath(), e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-blue-400"><Calendar className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Reservations</h4>
                      <p className="text-[10px] text-gray-400">
                        {role === 'RESTAURANT' ? 'Manage table bookings' : 'Your restaurant bookings'}
                      </p>
                    </div>
                  </div>
                </button>

                {/* 5. Foodie Passport */}
                <button
                  onClick={(e) => handleNav('/customer/passport', e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-purple-400"><Award className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Foodie Passport</h4>
                      <p className="text-[10px] text-gray-400">Your food journey & badges</p>
                    </div>
                  </div>
                </button>

                {/* 6. Rewards */}
                <button
                  onClick={(e) => handleNav('/customer/rewards', e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-[#2CC55E]"><Gift className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Rewards</h4>
                      <p className="text-[10px] text-gray-400">Points, offers & benefits</p>
                    </div>
                  </div>
                </button>

                {/* 7. Settings */}
                <button
                  onClick={(e) => handleNav(getSettingsPath(), e)}
                  className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-[#252A34] transition-colors group border-t border-[#2A2F3D]/60 pt-3 mt-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#252A34] text-[#FF7A00]"><Settings className="w-4 h-4" /></div>
                    <div>
                      <h4 className="font-extrabold text-white group-hover:text-[#FF7A00]">Settings</h4>
                      <p className="text-[10px] text-gray-400">Preferences, security & app options</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Edit Details Form (Toggle) */}
              {editing && (
                <form onSubmit={handleSaveProfile} className="bg-[#181C23] border border-[#2A2F3D] p-5 rounded-3xl space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-400 block mb-1">Email / Gmail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-400 block mb-1">Profile Photo URL / Avatar</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-white font-mono text-[11px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2CC55E] text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Profile Details & Photo
                  </button>
                </form>
              )}


              {/* Logout Action (Matching Image 2 Panel 3) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-rose-500/30 transition-colors shadow-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout (Sign out from account)</span>
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <UserIcon className="w-16 h-16 text-gray-500" />
              <h3 className="text-lg font-bold text-white">Not Signed In</h3>
              <p className="text-xs text-gray-400">Sign in or create an account to view your details & track orders.</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-3.5 rounded-2xl bg-[#FF7A00] text-white font-extrabold text-xs shadow-md"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
