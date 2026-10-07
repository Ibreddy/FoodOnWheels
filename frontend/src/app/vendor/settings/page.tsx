'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { useTheme, ThemeMode } from '../../../context/ThemeContext';
import { useLocation } from '../../../context/LocationContext';
import { useOwnerContext } from '../../../context/OwnerContext';
import {
  Truck,
  User as UserIcon,
  ShieldCheck,
  Bell,
  MapPin,
  Lock,
  Sun,
  Moon,
  Laptop,
  Check,
  Save,
  Sliders,
  LogOut,
  CreditCard,
  HelpCircle,
  Eye,
  Radio,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Volume2
} from 'lucide-react';

export interface VendorSettingsPayload {
  profile: {
    ownerName: string;
    photo: string;
    phone: string;
    email: string;
  };
  business: {
    name: string;
    tagline: string;
    description: string;
    categories: string[];
    phone: string;
    email: string;
    logo: string;
    coverImage: string;
    status: 'OPEN' | 'CLOSED' | 'UNAVAILABLE';
  };
  vehicle: {
    type: string;
    model3D: string;
    registrationNo: string;
    description: string;
  };
  liveLocation: {
    shareLiveLocation: boolean;
    updateInterval: '30s' | '1m' | '5m';
    visibilityMode: 'NEARBY' | 'BUSINESS_HOURS' | 'HIDDEN';
    autoStart: boolean;
    accuracyMode: 'HIGH' | 'BALANCED';
  };
  route: {
    defaultRoute: string;
    arrivalReminders: boolean;
    routeVisibility: 'PUBLIC' | 'PRIVATE';
    autoActivateRoute: boolean;
  };
  notifications: {
    newOrder: boolean;
    orderCancellation: boolean;
    lowStock: boolean;
    soldOut: boolean;
    newReview: boolean;
    newFollower: boolean;
    customerNearby: boolean;
    verificationUpdate: boolean;
  };
  orders: {
    autoAccept: boolean;
    maxQueue: number;
    estimatedPrepTime: number;
    pickupInstructions: string;
    orderSoundAlert: boolean;
  };
  privacy: {
    contactVisibility: 'PUBLIC' | 'CUSTOMER_ONLY' | 'PRIVATE';
  };
  payouts: {
    bankAccountMasked: string;
    ifscMasked: string;
    schedule: 'DAILY' | 'WEEKLY';
  };
  appearance: {
    theme: ThemeMode;
    density: 'COMFORTABLE' | 'COMPACT';
    mapTheme: 'DARK' | 'LIGHT';
  };
  verification: {
    status: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';
    fssaiLicense: string;
    kycDocument: string;
  };
}

const DEFAULT_VENDOR_SETTINGS: VendorSettingsPayload = {
  profile: {
    ownerName: 'Ramesh Kumar',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    phone: '+91 98765 43210',
    email: 'vendor@streetbite.com',
  },
  business: {
    name: 'Ramesh Burger Truck',
    tagline: 'Fresh & cheesy double patty love ❤️',
    description: 'Bengaluru’s favorite mobile gourmet burger truck serving flame-grilled patties on wheels.',
    categories: ['Burger', 'Fast Food', 'Beverages'],
    phone: '+91 98765 43210',
    email: 'vendor@streetbite.com',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
    status: 'OPEN',
  },
  vehicle: {
    type: 'Food Truck',
    model3D: 'BURGER_TRUCK_3D',
    registrationNo: 'KA-01-MJ-8890',
    description: 'Custom customized 20-foot flame grill gourmet burger van.',
  },
  liveLocation: {
    shareLiveLocation: true,
    updateInterval: '30s',
    visibilityMode: 'NEARBY',
    autoStart: true,
    accuracyMode: 'HIGH',
  },
  route: {
    defaultRoute: 'MG Road -> Indiranagar -> Koramangala',
    arrivalReminders: true,
    routeVisibility: 'PUBLIC',
    autoActivateRoute: true,
  },
  notifications: {
    newOrder: true,
    orderCancellation: true,
    lowStock: true,
    soldOut: true,
    newReview: true,
    newFollower: true,
    customerNearby: true,
    verificationUpdate: true,
  },
  orders: {
    autoAccept: false,
    maxQueue: 15,
    estimatedPrepTime: 12,
    pickupInstructions: 'Pick up at side window of Ramesh Burger Truck.',
    orderSoundAlert: true,
  },
  privacy: {
    contactVisibility: 'PUBLIC',
  },
  payouts: {
    bankAccountMasked: '•••• •••• 4421',
    ifscMasked: 'HDFC0001234',
    schedule: 'DAILY',
  },
  appearance: {
    theme: 'dark',
    density: 'COMFORTABLE',
    mapTheme: 'DARK',
  },
  verification: {
    status: 'VERIFIED',
    fssaiLicense: '11223344000645',
    kycDocument: 'VERIFIED_GSTIN_12A.pdf',
  },
};

const STORAGE_KEY = 'fow_vendor_settings';

export default function VendorSettingsPage() {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { location } = useLocation();
  const { updateBusinessData } = useOwnerContext();

  const [activeTab, setActiveTab] = useState<string>('business');
  const [settings, setSettings] = useState<VendorSettingsPayload>(DEFAULT_VENDOR_SETTINGS);
  const [isLiveBroadcasting, setIsLiveBroadcasting] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load vendor settings', e);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        updateBusinessData('v1', {
          name: settings.business.name,
          tagline: settings.business.tagline,
          description: settings.business.description,
          isAvailable: settings.business.status === 'OPEN',
        });
        setSaveStatus('SUCCESS');
        setTimeout(() => setSaveStatus('IDLE'), 3000);
      } catch (e) {
        setSaveStatus('ERROR');
      }
    }, 400);
  };

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Truck },
    { id: 'vehicle', label: 'Vehicle & 3D Model', icon: Sliders },
    { id: 'location', label: 'Live GPS Broadcast', icon: Radio },
    { id: 'routes', label: 'Route Behavior', icon: MapPin },
    { id: 'orders', label: 'Order & Queue Rules', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payouts', label: 'Payouts & Banking', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'verification', label: 'Verification & KYC', icon: FileCheck },
    { id: 'security', label: 'Security & Account', icon: ShieldCheck },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4" />
              <span>Mobile Vendor Workspace</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Mobile Vendor Settings
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage truck profile, vehicle specs, live GPS broadcast rules, order acceptance & payouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customer/home"
              className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Customer Profile</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'SAVING'}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'SAVING' ? (
                <span>Saving...</span>
              ) : saveStatus === 'SUCCESS' ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved & Applied!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Vendor Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveStatus === 'SUCCESS' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Vendor business & GPS settings successfully updated!</span>
          </div>
        )}

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Navigation */}
          <div className="lg:col-span-4 bg-[#181C23] border border-[#2A2F3D] p-3 rounded-3xl space-y-1 shadow-xl shrink-0">
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 py-2">
              Vendor Settings Menu
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
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-[#252A34]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-gray-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-gray-600'}`} />
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
                <span>Exit Vendor Portal</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. BUSINESS PROFILE */}
            {activeTab === 'business' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-white">Business Details</h2>
                    <p className="text-gray-400 text-xs">Public truck branding and operating status.</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    settings.business.status === 'OPEN'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    Status: {settings.business.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Business Name</label>
                    <input
                      type="text"
                      value={settings.business.name}
                      onChange={(e) => setSettings({ ...settings, business: { ...settings.business, name: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Operating Status</label>
                    <select
                      value={settings.business.status}
                      onChange={(e) => setSettings({ ...settings, business: { ...settings.business, status: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="OPEN">Open & Serving Customers 🟢</option>
                      <option value="CLOSED">Closed for Today 🔴</option>
                      <option value="UNAVAILABLE">Temporarily Unavailable 🟡</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.business.tagline}
                      onChange={(e) => setSettings({ ...settings, business: { ...settings.business, tagline: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={settings.business.description}
                      onChange={(e) => setSettings({ ...settings, business: { ...settings.business, description: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. VEHICLE & 3D MODEL */}
            {activeTab === 'vehicle' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Vehicle & 3D Model Representation</h2>
                  <p className="text-gray-400 text-xs">Select your vehicle type for customer map and 3D stage rendering.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Vehicle Type</label>
                    <select
                      value={settings.vehicle.type}
                      onChange={(e) => setSettings({ ...settings, vehicle: { ...settings.vehicle, type: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="Food Truck">Food Truck 🚚</option>
                      <option value="Food Van">Food Van 🚐</option>
                      <option value="Coffee Van">Coffee Van ☕</option>
                      <option value="Tea Cart">Tea Cart 🍵</option>
                      <option value="Ice Cream Truck">Ice Cream Truck 🍦</option>
                      <option value="Fruit Cart">Fruit Cart 🍎</option>
                      <option value="Juice Cart">Juice Cart 🧃</option>
                      <option value="Push Cart">Push Cart 🛒</option>
                      <option value="Auto Food Cart">Auto Food Cart 🛺</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Registration No.</label>
                    <input
                      type="text"
                      value={settings.vehicle.registrationNo}
                      onChange={(e) => setSettings({ ...settings, vehicle: { ...settings.vehicle, registrationNo: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. LIVE GPS LOCATION */}
            {activeTab === 'location' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-white">Live GPS Broadcast Control</h2>
                    <p className="text-gray-400 text-xs">Broadcast your real-time coordinates to nearby hungry customers.</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                    isLiveBroadcasting
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    <Radio className="w-3 h-3 animate-pulse" />
                    {isLiveBroadcasting ? '🟢 LIVE GPS BROADCASTING' : '⚪ LOCATION OFF'}
                  </span>
                </div>

                <div className="p-5 bg-[#252A34] rounded-3xl border border-[#2A2F3D] space-y-4 text-center">
                  <p className="text-sm font-bold text-white">GPS Broadcast Control Button</p>
                  <button
                    type="button"
                    onClick={() => setIsLiveBroadcasting(!isLiveBroadcasting)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
                      isLiveBroadcasting
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                        : 'bg-[#FF7A00] hover:bg-[#E65100] text-white'
                    }`}
                  >
                    {isLiveBroadcasting ? 'PAUSE LIVE GPS BROADCAST' : 'START LIVE LOCATION BROADCAST NOW'}
                  </button>
                  <p className="text-[11px] text-gray-400">
                    Current Coordinates: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : '12.9716, 77.6070'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">GPS Update Interval</label>
                    <select
                      value={settings.liveLocation.updateInterval}
                      onChange={(e) => setSettings({ ...settings, liveLocation: { ...settings.liveLocation, updateInterval: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="30s">Every 30 seconds (High Accuracy)</option>
                      <option value="1m">Every 1 minute (Recommended)</option>
                      <option value="5m">Every 5 minutes (Battery Saver)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Location Visibility</label>
                    <select
                      value={settings.liveLocation.visibilityMode}
                      onChange={(e) => setSettings({ ...settings, liveLocation: { ...settings.liveLocation, visibilityMode: e.target.value as any } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="NEARBY">Visible to nearby customers</option>
                      <option value="BUSINESS_HOURS">Visible only during business hours</option>
                      <option value="HIDDEN">Hidden</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Order & Queue Rules</h2>
                  <p className="text-gray-400 text-xs">Configure auto-acceptance, preparation times and queue capacity.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-[#2A2F3D]">
                    <div>
                      <p className="font-bold text-white">Accept Orders Automatically</p>
                      <p className="text-[11px] text-gray-400">Auto-approve incoming orders without manual confirmation.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.orders.autoAccept}
                      onChange={(e) => setSettings({ ...settings, orders: { ...settings.orders, autoAccept: e.target.checked } })}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Maximum Order Queue Capacity</label>
                      <input
                        type="number"
                        value={settings.orders.maxQueue}
                        onChange={(e) => setSettings({ ...settings, orders: { ...settings.orders, maxQueue: Number(e.target.value) } })}
                        className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Estimated Preparation Time (mins)</label>
                      <input
                        type="number"
                        value={settings.orders.estimatedPrepTime}
                        onChange={(e) => setSettings({ ...settings, orders: { ...settings.orders, estimatedPrepTime: Number(e.target.value) } })}
                        className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. VERIFICATION */}
            {activeTab === 'verification' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-white">Business Verification & FSSAI License</h2>
                    <p className="text-gray-400 text-xs">Official licensing and verification badge status.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    STATUS: VERIFIED ✓
                  </span>
                </div>

                <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">FSSAI License No:</span>
                    <span className="font-mono text-white font-bold">{settings.verification.fssaiLicense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">KYC Status:</span>
                    <span className="text-emerald-400 font-bold">Approved & Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PAYOUTS */}
            {activeTab === 'payouts' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Payouts & Settlement Account</h2>
                  <p className="text-gray-400 text-xs">Configured bank account for daily earnings settlements.</p>
                </div>

                <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank Account:</span>
                    <span className="font-mono text-white">{settings.payouts.bankAccountMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IFSC Code:</span>
                    <span className="font-mono text-white">{settings.payouts.ifscMasked}</span>
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
