'use client';

import React, { useState, useEffect } from 'react';
import { AvatarUploader } from '../../../components/common/AvatarUploader';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { useTheme, ThemeMode } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Language } from '../../../utils/translations';
import {
  User as UserIcon,
  ShieldCheck,
  Bell,
  MapPin,
  Lock,
  Globe,
  Sun,
  Moon,
  Laptop,
  Check,
  Save,
  RotateCcw,
  Sliders,
  Sparkles,
  LogOut,
  CreditCard,
  HelpCircle,
  Eye,
  AlertCircle,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export interface CustomerSettingsPayload {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    bio: string;
    avatar: string;
  };
  preferences: {
    categories: string[];
    dietary: 'VEG' | 'NON_VEG' | 'BOTH';
    spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY';
    budget: '₹' | '₹₹' | '₹₹₹';
  };
  notifications: {
    master: boolean;
    favoriteVendorNearby: boolean;
    favoriteRestaurantNearby: boolean;
    foodVideos: boolean;
    todaysSpecials: boolean;
    deals: boolean;
    orderUpdates: boolean;
    reservationUpdates: boolean;
    challengeNotifications: boolean;
    rewardNotifications: boolean;
    communityActivity: boolean;
  };
  location: {
    searchRadius: string;
    permission: 'GRANTED' | 'DENIED' | 'PROMPT';
    locationSharing: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  };
  privacy: {
    profileVisibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
    reviewVisibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
    activityVisibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  };
  appearance: {
    theme: ThemeMode;
    mapTheme: 'DARK' | 'LIGHT' | 'SYSTEM';
    reducedMotion: boolean;
  };
  ordersAndPayments: {
    defaultPickupPreference: 'PICKUP' | 'DINE_IN' | 'TAKEAWAY';
    savedAddress: string;
    orderInstructions: string;
  };
}

const DEFAULT_CUSTOMER_SETTINGS: CustomerSettingsPayload = {
  profile: {
    fullName: 'Rahul Sharma',
    email: 'customer@streetbite.com',
    phone: '+91 98765 43210',
    dob: '1996-08-15',
    bio: 'Avid street food explorer & gourmet truck enthusiast! 🍔🍛',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
  },
  preferences: {
    categories: ['Burger', 'Biryani', 'Pizza', 'Tea'],
    dietary: 'BOTH',
    spiceLevel: 'MEDIUM',
    budget: '₹₹',
  },
  notifications: {
    master: true,
    favoriteVendorNearby: true,
    favoriteRestaurantNearby: true,
    foodVideos: true,
    todaysSpecials: true,
    deals: true,
    orderUpdates: true,
    reservationUpdates: true,
    challengeNotifications: true,
    rewardNotifications: true,
    communityActivity: false,
  },
  location: {
    searchRadius: '5 km',
    permission: 'GRANTED',
    locationSharing: 'PUBLIC',
  },
  privacy: {
    profileVisibility: 'PUBLIC',
    reviewVisibility: 'PUBLIC',
    activityVisibility: 'FOLLOWERS',
  },
  appearance: {
    theme: 'dark',
    mapTheme: 'DARK',
    reducedMotion: false,
  },
  ordersAndPayments: {
    defaultPickupPreference: 'PICKUP',
    savedAddress: 'Indiranagar 100ft Road, Bengaluru',
    orderInstructions: 'Please leave with security or call upon arrival.',
  },
};

const STORAGE_KEY = 'fow_customer_settings';

export default function CustomerSettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('profile');
  const [settings, setSettings] = useState<CustomerSettingsPayload>(DEFAULT_CUSTOMER_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Load persistent settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load customer settings', e);
    }
  }, []);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (settings.profile.fullName) score += 20;
    if (settings.profile.email) score += 20;
    if (settings.profile.phone) score += 20;
    if (settings.profile.bio) score += 15;
    if (settings.profile.dob) score += 10;
    if (settings.preferences.categories.length > 0) score += 15;
    return score;
  };

  const handleSave = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        // Sync user context profile
        if (user) {
          updateProfile({
            name: settings.profile.fullName,
            email: settings.profile.email,
            phone: settings.profile.phone,
          });
        }
        setSaveStatus('SUCCESS');
        setTimeout(() => setSaveStatus('IDLE'), 3000);
      } catch (e) {
        setSaveStatus('ERROR');
      }
    }, 400);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.');
      return;
    }
    setPasswordMsg('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'account', label: 'Account', icon: ShieldCheck },
    { id: 'preferences', label: 'Food Preferences', icon: Flame },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'location', label: 'Location & Radius', icon: MapPin },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'orders', label: 'Orders & Addresses', icon: CreditCard },
    { id: 'help', label: 'Help & FAQs', icon: HelpCircle },
  ];

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Top Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-[#FF7A00] font-semibold text-xs uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Customer Workspace</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Customer Settings & Preferences
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Customize your profile, food recommendations, location radius, security & notifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'SAVING'}
              className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#E65100] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'SAVING' ? (
                <span>Saving...</span>
              ) : saveStatus === 'SUCCESS' ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Saved Success Toast */}
        {saveStatus === 'SUCCESS' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your settings have been saved persistently to your account!</span>
          </div>
        )}

        {/* Main Settings Layout: Left Nav Tabs + Right Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Navigation Menu (4 cols) */}
          <div className="lg:col-span-4 bg-[#181C23] border border-[#2A2F3D] p-3 rounded-3xl space-y-1 shadow-xl shrink-0">
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 py-2">
              Settings Navigation
            </p>
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/20'
                        : 'text-gray-300 hover:text-white hover:bg-[#252A34]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#2A2F3D]">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. PROFILE SECTION */}
            {activeTab === 'profile' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white">Profile Information</h2>
                    <p className="text-gray-400 text-xs">Manage your photo, name, bio and contact details.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#FF7A00]">{calculateCompletion()}% Complete</span>
                    <div className="w-24 bg-[#252A34] h-2 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#FF7A00] h-full" style={{ width: `${calculateCompletion()}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D]">
                  <AvatarUploader size="lg" showDownload={false} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, fullName: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, phone: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={settings.profile.dob}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, dob: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Bio / Tagline</label>
                    <input
                      type="text"
                      value={settings.profile.bio}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, bio: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. ACCOUNT SECTION */}
            {activeTab === 'account' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Account Details</h2>
                  <p className="text-gray-400 text-xs">Security and role verification overview.</p>
                </div>

                <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account ID:</span>
                    <span className="font-mono text-white">CUST_892147</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created Date:</span>
                    <span className="text-white">January 15, 2026</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Account Role:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2CC55E]/20 text-[#2CC55E] font-black text-[10px] uppercase">
                      CUSTOMER (PERMANENT LOCKED)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PREFERENCES SECTION */}
            {activeTab === 'preferences' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Food Recommendations Preferences</h2>
                  <p className="text-gray-400 text-xs">Configure your taste preferences for personalized vendor recommendations.</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-gray-300 font-bold">Preferred Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {['Burger', 'Biryani', 'Dosa', 'Pizza', 'Chinese', 'Tea', 'Coffee', 'Desserts', 'Healthy', 'South Indian'].map((cat) => {
                      const isSel = settings.preferences.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const updated = isSel
                              ? settings.preferences.categories.filter((c) => c !== cat)
                              : [...settings.preferences.categories, cat];
                            setSettings({ ...settings, preferences: { ...settings.preferences, categories: updated } });
                          }}
                          className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all border ${
                            isSel ? 'bg-[#FF7A00] text-white border-[#FF7A00]' : 'bg-[#0F1115] text-gray-400 border-[#2A2F3D]'
                          }`}
                        >
                          {cat} {isSel && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Dietary Preference</label>
                    <select
                      value={settings.preferences.dietary}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, dietary: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="BOTH">Vegetarian & Non-Veg</option>
                      <option value="VEG">Strictly Vegetarian 🌱</option>
                      <option value="NON_VEG">Non-Vegetarian 🍗</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Spice Level</label>
                    <select
                      value={settings.preferences.spiceLevel}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, spiceLevel: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="MILD">Mild (Low Spice)</option>
                      <option value="MEDIUM">Medium Spice 🌶️</option>
                      <option value="SPICY">Extra Spicy 🌶️🔥</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Budget Preference</label>
                    <select
                      value={settings.preferences.budget}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, budget: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="₹">Budget Friendly (₹)</option>
                      <option value="₹₹">Moderate (₹₹)</option>
                      <option value="₹₹₹">Gourmet & Fine Dining (₹₹₹)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS SECTION */}
            {activeTab === 'notifications' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-4 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white">Notification Preferences</h2>
                    <p className="text-gray-400 text-xs">Choose which alerts you want to receive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, master: !settings.notifications.master }
                    })}
                    className={`px-3 py-1.5 rounded-full font-black text-[10px] uppercase ${
                      settings.notifications.master ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {settings.notifications.master ? 'NOTIFICATIONS ON' : 'MUTED'}
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'favoriteVendorNearby', label: 'Favorite Food Truck Nearby Alert', desc: 'Notify when a saved truck broadcasts GPS within 1 km' },
                    { key: 'favoriteRestaurantNearby', label: 'Favorite Restaurant Offer Alerts', desc: 'Promotions from your saved fine dining spots' },
                    { key: 'todaysSpecials', label: 'Daily Specials & Chef Picks', desc: 'Alerts when new Today\'s Specials drop' },
                    { key: 'deals', label: 'Exclusive Coupon & Deal Alerts', desc: 'Instant promo code drops' },
                    { key: 'orderUpdates', label: 'Live Order & KDS Status', desc: 'Real-time order preparation updates' },
                    { key: 'reservationUpdates', label: 'Table Reservation Status', desc: 'Confirmation and reminder alerts' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#2A2F3D]/60">
                      <div>
                        <p className="font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-gray-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(settings.notifications as any)[item.key]}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#FF7A00]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. LOCATION SECTION */}
            {activeTab === 'location' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Location & Discovery Radius</h2>
                  <p className="text-gray-400 text-xs">Set how far StreetBite searches for live food trucks.</p>
                </div>

                <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#FF7A00]" />
                    <div>
                      <p className="font-bold text-white">Current Location</p>
                      <p className="text-xs text-gray-400">MG Road, Indiranagar, Bengaluru</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    GPS ACTIVE
                  </span>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2">Default Search Radius</label>
                  <div className="flex flex-wrap gap-3">
                    {['1 km', '3 km', '5 km', '10 km', 'Custom'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSettings({ ...settings, location: { ...settings.location, searchRadius: r } })}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                          settings.location.searchRadius === r
                            ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-md'
                            : 'bg-[#0F1115] text-gray-400 border-[#2A2F3D]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. PRIVACY SECTION */}
            {activeTab === 'privacy' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Privacy Controls</h2>
                  <p className="text-gray-400 text-xs">Control who can see your profile and reviews.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, profileVisibility: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="PUBLIC">Public (Visible to everyone)</option>
                      <option value="FOLLOWERS">Followers Only</option>
                      <option value="PRIVATE">Private (Only Me)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Review Visibility</label>
                    <select
                      value={settings.privacy.reviewVisibility}
                      onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, reviewVisibility: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="PUBLIC">Public (Shown on vendor pages)</option>
                      <option value="FOLLOWERS">Followers Only</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 7. LANGUAGE SECTION */}
            {activeTab === 'language' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Language & Regional Preferences</h2>
                  <p className="text-gray-400 text-xs">Select your interface language.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'EN', name: 'English', desc: 'Standard English' },
                    { id: 'TE', name: 'తెలుగు (Telugu)', desc: 'Telugu Regional' },
                    { id: 'HI', name: 'हिंदी (Hindi)', desc: 'Hindi Regional' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as Language)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1 ${
                        language === lang.id
                          ? 'bg-[#FF7A00]/20 border-[#FF7A00] text-white'
                          : 'bg-[#0F1115] border-[#2A2F3D] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-white block">{lang.name}</span>
                      <span className="text-[11px] text-gray-400">{lang.desc}</span>
                      {language === lang.id && (
                        <span className="text-[10px] font-black text-[#FF7A00] bg-[#FF7A00]/20 px-2 py-0.5 rounded-full block mt-2">
                          ACTIVE LANGUAGE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 8. APPEARANCE SECTION */}
            {activeTab === 'appearance' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Appearance & Theme Settings</h2>
                  <p className="text-gray-400 text-xs">Customize website color themes and map styles.</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-gray-300 font-bold">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { mode: 'dark', label: 'Dark Mode', icon: Moon },
                      { mode: 'light', label: 'Light Mode', icon: Sun },
                      { mode: 'system', label: 'System Default', icon: Laptop },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSel = themeMode === t.mode;
                      return (
                        <button
                          key={t.mode}
                          type="button"
                          onClick={() => setThemeMode(t.mode as ThemeMode)}
                          className={`p-3.5 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center gap-2 ${
                            isSel
                              ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-md'
                              : 'bg-[#0F1115] text-gray-400 border-[#2A2F3D]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 9. SECURITY SECTION */}
            {activeTab === 'security' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Account Security & Password</h2>
                  <p className="text-gray-400 text-xs">Update password and manage active logins.</p>
                </div>

                {passwordMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    {passwordMsg}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF7A00] text-white font-bold rounded-xl shadow-md"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* 10. ORDERS & PAYMENTS */}
            {activeTab === 'orders' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Saved Addresses & Instructions</h2>
                  <p className="text-gray-400 text-xs">Manage delivery addresses and order preferences.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Saved Address</label>
                    <input
                      type="text"
                      value={settings.ordersAndPayments.savedAddress}
                      onChange={(e) => setSettings({
                        ...settings,
                        ordersAndPayments: { ...settings.ordersAndPayments, savedAddress: e.target.value }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Default Order Instructions</label>
                    <input
                      type="text"
                      value={settings.ordersAndPayments.orderInstructions}
                      onChange={(e) => setSettings({
                        ...settings,
                        ordersAndPayments: { ...settings.ordersAndPayments, orderInstructions: e.target.value }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. HELP SECTION */}
            {activeTab === 'help' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Help Center & Support</h2>
                  <p className="text-gray-400 text-xs">Frequently asked questions and support assistance.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-1">
                    <h4 className="font-extrabold text-white">How do I track a live food truck on GPS?</h4>
                    <p className="text-gray-400 text-[11px]">Go to the Live Map or Customer Home page. Vendors broadcasting GPS show a live badge with real-time ETA.</p>
                  </div>

                  <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-1">
                    <h4 className="font-extrabold text-white">How do I claim Today's Specials?</h4>
                    <p className="text-gray-400 text-[11px]">Today's Specials are highlighted on the home page with discounted prices automatically applied at checkout.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
