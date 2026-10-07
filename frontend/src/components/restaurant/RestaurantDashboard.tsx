'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChefHat, Calendar, CheckCircle2, Clock, Users, Play, Check, AlertCircle, 
  LayoutDashboard, ShoppingBag, Utensils, Table, Package, Video, Image as ImageIcon, 
  Star, Megaphone, BarChart3, ShieldCheck, Settings, Bell, Eye
} from 'lucide-react';
import { mockBusinesses } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { useOwnerContext } from '../../context/OwnerContext';

export const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    siteContent,
    updateTableStatus: updateContextTableStatus,
    addTableToBusiness,
    deleteTableFromBusiness,
    addMenuItem
  } = useOwnerContext();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');

  const userRestaurant = siteContent.businesses.find(
    (b) => b.ownerId === user?.id || b.ownerId === (user as any)?._id
  ) || siteContent.businesses.find(
    (b) => b.businessType === 'RESTAURANT' || b.businessType === 'CAFE' || b.businessType === 'BAKERY'
  );

  const restaurant = userRestaurant || {
    _id: 'r_' + (user?.id || 'new_rest'),
    name: user?.name ? `${user.name}'s Restaurant` : 'My Fine Dining Spot',
    tagline: 'Authentic Flavors & Great Ambience',
    description: 'Serving delicious dining experiences.',
    businessType: 'RESTAURANT' as const,
    ownerId: user?.id,
    logo: user?.avatar || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop',
    categories: ['Fine Dining', 'North Indian'],
    rating: { average: 5.0, count: 1 },
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    location: { type: 'Point' as const, coordinates: [77.6412, 12.9784] },
    tables: [],
    isAvailable: true,
    isFeatured: true
  };

  const restaurantMenuItems = siteContent.menuItems.filter((i) => i.businessId === restaurant._id);
  const liveTables = restaurant.tables || [];
  const totalTablesCount = liveTables.length;
  const availableTablesCount = liveTables.filter((t) => t.status === 'AVAILABLE').length;

  const [isOpen, setIsOpen] = useState(true);

  // Kitchen KDS orders state
  const [kdsOrders, setKdsOrders] = useState({
    new: [
      { id: '#3012', name: 'Chicken Biryani', qty: '2 items', time: '2 mins' },
      { id: '#3011', name: 'Paneer Butter Masala', qty: '1 item', time: '5 mins' },
      { id: '#3009', name: 'Masala Dosa', qty: '3 items', time: '8 mins' },
    ],
    preparing: [
      { id: '#3008', name: 'Veg Fried Rice', qty: '2 items', time: '12 mins' },
      { id: '#3007', name: 'Chicken Tikka', qty: '1 item', time: '15 mins' },
      { id: '#3006', name: 'Naan & Curry', qty: '2 items', time: '18 mins' },
    ],
    ready: [
      { id: '#3005', name: 'Veg Biryani', qty: '1 item', time: '22 mins' },
      { id: '#3004', name: 'Chicken Curry', qty: '2 items', time: '25 mins' },
    ]
  });

  // Reservations state
  const [reservations, setReservations] = useState([
    { id: 'r1', name: 'Aarav Sharma', guests: '4 guests', time: '7:00 PM', status: 'Confirmed', statusColor: 'bg-[#2CC55E]/20 text-[#2CC55E] border border-[#2CC55E]/30' },
    { id: 'r2', name: 'Priya Nair', guests: '2 guests', time: '7:30 PM', status: 'Confirmed', statusColor: 'bg-[#2CC55E]/20 text-[#2CC55E] border border-[#2CC55E]/30' },
    { id: 'r3', name: 'Rahul Mehta', guests: '6 guests', time: '8:00 PM', status: 'Pending', statusColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'r4', name: 'Sneha Iyer', guests: '4 guests', time: '8:30 PM', status: 'Confirmed', statusColor: 'bg-[#2CC55E]/20 text-[#2CC55E] border border-[#2CC55E]/30' },
  ]);

  const handleUpdateTableStatus = (tableId: string, newStatus: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING') => {
    updateContextTableStatus(restaurant._id, tableId, newStatus);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'kitchen', label: 'Kitchen', icon: Utensils },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'menu', label: 'Menu', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white space-y-6 p-2 sm:p-4 rounded-3xl">
      {/* 2. Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Top Header Selector & Open Status Switch (Matching Image 2 Panel 5) */}
        <header className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#252A34] px-4 py-2 rounded-2xl border border-[#2A2F3D]">
              <ChefHat className="w-4 h-4 text-purple-400" />
              <span className="font-extrabold text-xs text-white">Spice Garden Restaurant</span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                isOpen ? 'bg-[#2CC55E]/20 text-[#2CC55E] border border-[#2CC55E]/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#2CC55E] animate-pulse' : 'bg-rose-400'}`}></span>
              <span>{isOpen ? '+ OPEN' : 'CLOSED'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customer/home"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 text-xs font-extrabold transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Customer Profile</span>
            </Link>
            <button className="p-2.5 rounded-2xl bg-[#252A34] border border-[#2A2F3D] text-gray-300 hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#252A34] border border-[#2A2F3D]">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop"} className="w-6 h-6 rounded-full object-cover border border-purple-400" alt="User Avatar" />
              <span className="text-xs font-bold text-white">{user?.name?.split(' ')[0] || 'Vikram'}</span>
            </div>
          </div>
        </header>

        {/* Greeting Banner */}
        <section className="bg-white dark:bg-gradient-to-r dark:from-[#181C23] dark:to-[#252A34] border border-gray-200 dark:border-[#2A2F3D] rounded-3xl p-6 shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Good Morning, {user?.name ? user.name.split(' ')[0] : 'Restaurant Owner'}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Here's what's happening at your restaurant today.</p>
        </section>

        {/* 5 Dynamic KPI Performance Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link href="/restaurant/orders" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-4 rounded-3xl shadow-xl space-y-1.5 hover:border-purple-500 transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-purple-500 transition-colors">Today's Revenue</p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-gray-900 dark:text-white">₹42,850</span>
              <span className="text-[10px] font-extrabold text-[#2CC55E]">▲ +15%</span>
            </div>
          </Link>

          <Link href="/restaurant/orders" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-4 rounded-3xl shadow-xl space-y-1.5 hover:border-purple-500 transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-purple-500 transition-colors">Orders</p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-gray-900 dark:text-white">126</span>
              <span className="text-[10px] font-extrabold text-[#2CC55E]">▲ +10%</span>
            </div>
          </Link>

          <Link href="/restaurant/tables" className="bg-white dark:bg-[#181C23] border border-purple-500/40 p-4 rounded-3xl shadow-xl space-y-1.5 hover:border-purple-500 transition-all group">
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-wider flex items-center justify-between">
              <span>Floor Tables</span>
              <span className="text-[9px] bg-purple-500/10 px-1.5 py-0.5 rounded">View Matrix →</span>
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-gray-900 dark:text-white">{totalTablesCount} Tables</span>
              <span className="text-[10px] font-extrabold text-emerald-500">{availableTablesCount} Free</span>
            </div>
          </Link>

          <Link href="/restaurant/menu" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-4 rounded-3xl shadow-xl space-y-1.5 hover:border-purple-500 transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-purple-500 transition-colors">Menu Catalog</p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-gray-900 dark:text-white">{restaurantMenuItems.length} Items</span>
              <span className="text-[10px] font-extrabold text-purple-400">Active</span>
            </div>
          </Link>

          <Link href="/restaurant/reservations" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-4 rounded-3xl shadow-xl space-y-1.5 hover:border-purple-500 transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-purple-500 transition-colors">Reservations</p>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-amber-400 flex items-center gap-1">28 Booked</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-bold">Today</span>
            </div>
          </Link>
        </section>

        {/* Middle Section: Kitchen Orders KDS & Today's Reservations (Matching Image 2 Panel 5) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kitchen Orders (KDS Columns) - takes 2 cols */}
          <div className="lg:col-span-2 bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#FF7A00]" /> Kitchen Orders
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* New Column */}
              <div className="space-y-2">
                <div className="bg-[#252A34] px-3 py-1.5 rounded-xl border border-[#2A2F3D] flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>New ({kdsOrders.new.length})</span>
                </div>
                <div className="space-y-2">
                  {kdsOrders.new.map((ord) => (
                    <div key={ord.id} className="bg-[#252A34] border border-[#2A2F3D] p-3 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#FF7A00]">{ord.id}</span>
                        <span className="text-[10px] text-gray-400">{ord.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{ord.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{ord.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparing Column */}
              <div className="space-y-2">
                <div className="bg-[#252A34] px-3 py-1.5 rounded-xl border border-[#2A2F3D] flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Preparing ({kdsOrders.preparing.length})</span>
                </div>
                <div className="space-y-2">
                  {kdsOrders.preparing.map((ord) => (
                    <div key={ord.id} className="bg-[#252A34] border border-[#2A2F3D] p-3 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-amber-400">{ord.id}</span>
                        <span className="text-[10px] text-gray-400">{ord.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{ord.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{ord.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready Column */}
              <div className="space-y-2">
                <div className="bg-[#252A34] px-3 py-1.5 rounded-xl border border-[#2A2F3D] flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Ready ({kdsOrders.ready.length})</span>
                </div>
                <div className="space-y-2">
                  {kdsOrders.ready.map((ord) => (
                    <div key={ord.id} className="bg-[#252A34] border border-[#2A2F3D] p-3 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#2CC55E]">{ord.id}</span>
                        <span className="text-[10px] text-gray-400">{ord.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{ord.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{ord.qty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reservations - takes 1 col */}
          <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Today's Reservations
              </h3>
              <button className="text-xs font-extrabold text-[#FF7A00] hover:underline">View All →</button>
            </div>

            <div className="space-y-3">
              {reservations.map((res) => (
                <div key={res.id} className="bg-[#252A34] border border-[#2A2F3D] p-3.5 rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">{res.name}</span>
                    <span className="text-gray-400">{res.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400 font-semibold">{res.guests}</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${res.statusColor}`}>
                      {res.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Table Floor Plan Management Matrix */}
        <section className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Table Floor Plan Management Matrix
            </h3>
            <button
              onClick={() => setShowAddTable(!showAddTable)}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-black flex items-center gap-1.5 hover:bg-purple-500/30 transition-all cursor-pointer"
            >
              <span>{showAddTable ? '✕ Cancel' : '+ Add Table'}</span>
            </button>
          </div>

          {showAddTable && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const num = Number(newTableNumber) || (liveTables.length + 1);
                addTableToBusiness(restaurant._id, { number: num, seats: Number(newTableSeats) || 4 });
                setNewTableNumber('');
                setShowAddTable(false);
              }}
              className="bg-[#252A34] border border-[#2A2F3D] p-4 rounded-2xl space-y-3"
            >
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add New Dining Table</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Table Number</label>
                  <input
                    type="number"
                    required
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder={`e.g. ${liveTables.length + 1}`}
                    className="w-full px-3 py-2 rounded-xl bg-[#181C23] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Seating Capacity</label>
                  <select
                    value={newTableSeats}
                    onChange={(e) => setNewTableSeats(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#181C23] border border-[#2A2F3D] text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="2">2 Seats (Pair Table)</option>
                    <option value="4">4 Seats (Standard Table)</option>
                    <option value="6">6 Seats (Family Table)</option>
                    <option value="8">8 Seats (Large Group Table)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg transition-all"
              >
                Save & Add Table to Matrix
              </button>
            </form>
          )}

          {liveTables.length === 0 ? (
            <div className="bg-[#252A34]/50 border border-dashed border-[#2A2F3D] p-8 rounded-2xl text-center space-y-3">
              <Table className="w-10 h-10 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Tables Added Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                As a new restaurant owner, you can manually add your tables to manage floor plan availability and customer reservations.
              </p>
              <button
                onClick={() => setShowAddTable(true)}
                className="px-4 py-2 rounded-xl bg-purple-500 text-white font-extrabold text-xs shadow-md"
              >
                + Add Your First Table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {liveTables.map((t) => (
                <div key={t.id} className="bg-[#252A34] border border-[#2A2F3D] p-3.5 rounded-2xl space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white">Table #{t.tableNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 font-bold">{t.seats} Seats</span>
                      <button
                        onClick={() => deleteTableFromBusiness(restaurant._id, t.id)}
                        className="text-gray-500 hover:text-rose-400 text-[10px] font-bold ml-1"
                        title="Delete Table"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateTableStatus(t.id, st)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all ${
                          t.status === st
                            ? st === 'AVAILABLE'
                              ? 'bg-[#2CC55E] text-white border-[#2CC55E]'
                              : st === 'OCCUPIED'
                              ? 'bg-rose-500 text-white border-rose-500'
                              : st === 'RESERVED'
                              ? 'bg-purple-500 text-white border-purple-500'
                              : 'bg-amber-500 text-white border-amber-500'
                            : 'bg-[#181C23] border-[#2A2F3D] text-gray-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
