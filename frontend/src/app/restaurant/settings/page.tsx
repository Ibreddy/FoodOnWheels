'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { useTheme, ThemeMode } from '../../../context/ThemeContext';
import { useOwnerContext } from '../../../context/OwnerContext';
import {
  Utensils,
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
  Clock,
  Calendar,
  ChefHat,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Volume2,
  Eye
} from 'lucide-react';

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakTime?: string;
}

export interface RestaurantSettingsPayload {
  profile: {
    ownerName: string;
    photo: string;
    phone: string;
    email: string;
  };
  restaurantInfo: {
    name: string;
    description: string;
    logo: string;
    coverImage: string;
    address: string;
    phone: string;
    email: string;
    cuisine: string;
    priceRange: '₹' | '₹₹' | '₹₹₹';
    amenities: {
      ac: boolean;
      parking: boolean;
      wifi: boolean;
      outdoorSeating: boolean;
      accessible: boolean;
      familySeating: boolean;
    };
  };
  openingHours: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  tableSettings: {
    totalTables: number;
    capacity2Seater: number;
    capacity4Seater: number;
    capacity6Seater: number;
    capacityVip: number;
  };
  reservations: {
    enabled: boolean;
    bookingDurationMins: number;
    maxGuestsPerBooking: number;
    advanceWindowDays: number;
    cancellationPolicy: string;
    autoConfirm: boolean;
  };
  kitchen: {
    prepTimeMins: number;
    autoAccept: boolean;
    maxActiveOrders: number;
    orderAlertSound: boolean;
  };
  orderSettings: {
    acceptOrders: boolean;
    pickupAvailable: boolean;
    dineInAvailable: boolean;
    takeawayAvailable: boolean;
  };
  inventory: {
    lowStockThreshold: number;
    autoSoldOut: boolean;
  };
  notifications: {
    newOrder: boolean;
    newReservation: boolean;
    cancellation: boolean;
    kitchenAlert: boolean;
    lowStock: boolean;
    reviewAlert: boolean;
  };
  appearance: {
    theme: ThemeMode;
    density: 'COMFORTABLE' | 'COMPACT';
  };
  verification: {
    status: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';
    fssaiLicense: string;
  };
}

const DEFAULT_RESTAURANT_SETTINGS: RestaurantSettingsPayload = {
  profile: {
    ownerName: 'Vikramaditya Rao',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    phone: '+91 98765 11223',
    email: 'restaurant@streetbite.com',
  },
  restaurantInfo: {
    name: 'Toscano Fine Italian & Bistro',
    description: 'Authentic woodfired pizzas, handmade pasta & fine wines in a warm ambient space.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop',
    address: 'UB City, Vittal Mallya Road, Bengaluru',
    phone: '+91 98765 11223',
    email: 'restaurant@streetbite.com',
    cuisine: 'Italian, Continental, Fine Dining',
    priceRange: '₹₹₹',
    amenities: {
      ac: true,
      parking: true,
      wifi: true,
      outdoorSeating: true,
      accessible: true,
      familySeating: true,
    },
  },
  openingHours: {
    monday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    tuesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    wednesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    thursday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    friday: { isOpen: true, openTime: '11:00', closeTime: '23:30' },
    saturday: { isOpen: true, openTime: '11:00', closeTime: '23:30' },
    sunday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
  },
  tableSettings: {
    totalTables: 24,
    capacity2Seater: 8,
    capacity4Seater: 10,
    capacity6Seater: 4,
    capacityVip: 2,
  },
  reservations: {
    enabled: true,
    bookingDurationMins: 90,
    maxGuestsPerBooking: 12,
    advanceWindowDays: 14,
    cancellationPolicy: 'Free cancellation up to 2 hours before booking time.',
    autoConfirm: true,
  },
  kitchen: {
    prepTimeMins: 20,
    autoAccept: true,
    maxActiveOrders: 20,
    orderAlertSound: true,
  },
  orderSettings: {
    acceptOrders: true,
    pickupAvailable: true,
    dineInAvailable: true,
    takeawayAvailable: true,
  },
  inventory: {
    lowStockThreshold: 5,
    autoSoldOut: true,
  },
  notifications: {
    newOrder: true,
    newReservation: true,
    cancellation: true,
    kitchenAlert: true,
    lowStock: true,
    reviewAlert: true,
  },
  appearance: {
    theme: 'dark',
    density: 'COMFORTABLE',
  },
  verification: {
    status: 'VERIFIED',
    fssaiLicense: '11223344000998',
  },
};

const STORAGE_KEY = 'fow_restaurant_settings';

export default function RestaurantSettingsPage() {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { updateBusinessData } = useOwnerContext();

  const [activeTab, setActiveTab] = useState<string>('restaurant');
  const [settings, setSettings] = useState<RestaurantSettingsPayload>(DEFAULT_RESTAURANT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load restaurant settings', e);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('SAVING');
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        updateBusinessData('b4', {
          name: settings.restaurantInfo.name,
          description: settings.restaurantInfo.description,
          address: settings.restaurantInfo.address,
        });
        setSaveStatus('SUCCESS');
        setTimeout(() => setSaveStatus('IDLE'), 3000);
      } catch (e) {
        setSaveStatus('ERROR');
      }
    }, 400);
  };

  const tabs = [
    { id: 'restaurant', label: 'Restaurant Info', icon: Utensils },
    { id: 'hours', label: 'Opening Hours', icon: Clock },
    { id: 'reservations', label: 'Reservation Rules', icon: Calendar },
    { id: 'tables', label: 'Table Setup', icon: Sliders },
    { id: 'kitchen', label: 'Kitchen & KDS Rules', icon: ChefHat },
    { id: 'orders', label: 'Order & Prep Rules', icon: CheckCircle2 },
    { id: 'inventory', label: 'Inventory Rules', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'verification', label: 'Verification & FSSAI', icon: FileCheck },
    { id: 'security', label: 'Security & Account', icon: ShieldCheck },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>Restaurant Workspace</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Restaurant & KDS Settings
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure restaurant opening schedules, table capacities, reservation rules & kitchen display system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customer/home"
              className="px-4 py-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Customer Profile</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'SAVING'}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'SAVING' ? (
                <span>Saving...</span>
              ) : saveStatus === 'SUCCESS' ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved & Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Restaurant Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveStatus === 'SUCCESS' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Restaurant hours, table rules, and reservation settings updated!</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Navigation */}
          <div className="lg:col-span-4 bg-[#181C23] border border-[#2A2F3D] p-3 rounded-3xl space-y-1 shadow-xl shrink-0">
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 py-2">
              Restaurant Settings Menu
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
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
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
                <span>Exit Restaurant Portal</span>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. RESTAURANT INFO */}
            {activeTab === 'restaurant' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Restaurant Information</h2>
                  <p className="text-gray-400 text-xs">Manage public dining profile, amenities and address.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={settings.restaurantInfo.name}
                      onChange={(e) => setSettings({ ...settings, restaurantInfo: { ...settings.restaurantInfo, name: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Cuisine Specialty</label>
                    <input
                      type="text"
                      value={settings.restaurantInfo.cuisine}
                      onChange={(e) => setSettings({ ...settings, restaurantInfo: { ...settings.restaurantInfo, cuisine: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 font-bold mb-1">Address</label>
                    <input
                      type="text"
                      value={settings.restaurantInfo.address}
                      onChange={(e) => setSettings({ ...settings, restaurantInfo: { ...settings.restaurantInfo, address: e.target.value } })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. OPENING HOURS */}
            {activeTab === 'hours' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Opening Hours Schedule</h2>
                  <p className="text-gray-400 text-xs">Configure daily operational hours. Customer site updates "OPEN NOW" or "CLOSED" automatically.</p>
                </div>

                <div className="space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((dayKey) => {
                    const dayData = (settings.openingHours as any)[dayKey] as DaySchedule;
                    return (
                      <div key={dayKey} className="p-3 bg-[#252A34] rounded-2xl border border-[#2A2F3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-32">
                          <span className="font-extrabold uppercase text-white">{dayKey}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dayData.isOpen}
                              onChange={(e) => setSettings({
                                ...settings,
                                openingHours: {
                                  ...settings.openingHours,
                                  [dayKey]: { ...dayData, isOpen: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 accent-purple-600"
                            />
                            <span className={dayData.isOpen ? 'text-emerald-400 font-bold' : 'text-gray-500 font-bold'}>
                              {dayData.isOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                          </label>

                          {dayData.isOpen && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={dayData.openTime}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  openingHours: {
                                    ...settings.openingHours,
                                    [dayKey]: { ...dayData, openTime: e.target.value }
                                  }
                                })}
                                className="bg-[#0F1115] border border-[#2A2F3D] text-white px-2 py-1 rounded-lg text-xs"
                              />
                              <span className="text-gray-400">to</span>
                              <input
                                type="time"
                                value={dayData.closeTime}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  openingHours: {
                                    ...settings.openingHours,
                                    [dayKey]: { ...dayData, closeTime: e.target.value }
                                  }
                                })}
                                className="bg-[#0F1115] border border-[#2A2F3D] text-white px-2 py-1 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-white">Table Reservation Rules</h2>
                    <p className="text-gray-400 text-xs">Enable/disable table booking & set booking duration.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({
                      ...settings,
                      reservations: { ...settings.reservations, enabled: !settings.reservations.enabled }
                    })}
                    className={`px-3.5 py-1.5 rounded-full font-black text-[10px] uppercase ${
                      settings.reservations.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {settings.reservations.enabled ? 'RESERVATIONS ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Default Booking Duration (mins)</label>
                    <input
                      type="number"
                      value={settings.reservations.bookingDurationMins}
                      onChange={(e) => setSettings({
                        ...settings,
                        reservations: { ...settings.reservations, bookingDurationMins: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Max Guests Per Reservation</label>
                    <input
                      type="number"
                      value={settings.reservations.maxGuestsPerBooking}
                      onChange={(e) => setSettings({
                        ...settings,
                        reservations: { ...settings.reservations, maxGuestsPerBooking: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. TABLES */}
            {activeTab === 'tables' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Table Capacity Matrix</h2>
                  <p className="text-gray-400 text-xs">Configure seating arrangements for table reservations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Total Restaurant Tables</label>
                    <input
                      type="number"
                      value={settings.tableSettings.totalTables}
                      onChange={(e) => setSettings({
                        ...settings,
                        tableSettings: { ...settings.tableSettings, totalTables: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">2-Seater Tables Count</label>
                    <input
                      type="number"
                      value={settings.tableSettings.capacity2Seater}
                      onChange={(e) => setSettings({
                        ...settings,
                        tableSettings: { ...settings.tableSettings, capacity2Seater: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. KITCHEN */}
            {activeTab === 'kitchen' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4">
                  <h2 className="text-lg font-black text-white">Kitchen Display System (KDS) Rules</h2>
                  <p className="text-gray-400 text-xs">Set prep times and kitchen order alerts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Kitchen Prep Time Estimate (mins)</label>
                    <input
                      type="number"
                      value={settings.kitchen.prepTimeMins}
                      onChange={(e) => setSettings({
                        ...settings,
                        kitchen: { ...settings.kitchen, prepTimeMins: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1">Max Active Cooking Orders</label>
                    <input
                      type="number"
                      value={settings.kitchen.maxActiveOrders}
                      onChange={(e) => setSettings({
                        ...settings,
                        kitchen: { ...settings.kitchen, maxActiveOrders: Number(e.target.value) }
                      })}
                      className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. VERIFICATION */}
            {activeTab === 'verification' && (
              <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
                <div className="border-b border-[#2A2F3D] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-white">FSSAI & Restaurant Verification</h2>
                    <p className="text-gray-400 text-xs">Licensing and regulatory compliance badge.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    VERIFIED RESTAURANT ✓
                  </span>
                </div>

                <div className="p-4 bg-[#252A34] rounded-2xl border border-[#2A2F3D] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">FSSAI License:</span>
                    <span className="font-mono text-white font-bold">{settings.verification.fssaiLicense}</span>
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
