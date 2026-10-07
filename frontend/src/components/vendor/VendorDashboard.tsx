'use client';

import React, { useState, useEffect } from 'react';
import { getSocket } from '../../services/socket';
import { mockBusinesses, mockMenuItems } from '../../utils/mockData';
import { useLocation } from '../../context/LocationContext';
import { useOwnerContext } from '../../context/OwnerContext';
import Link from 'next/link';
import { 
  Truck, MapPin, Play, Pause, AlertTriangle, CheckCircle2, DollarSign, 
  TrendingUp, Package, Video, Plus, Star, LayoutDashboard, Navigation, 
  Route, ShoppingBag, Eye, Megaphone, BarChart3, ShieldCheck, Settings, Users, Bell
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { MapView } from '../map/MapView';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { siteContent, updateBusinessData, updateMenuItem, addMenuItem } = useOwnerContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLive, setIsLive] = useState(true);

  const userVendor = siteContent.businesses.find(
    (b) => b.ownerId === user?.id || b.ownerId === (user as any)?._id
  ) || siteContent.businesses.find(
    (b) => b.businessType === 'MOBILE_VENDOR' || b.businessType === 'FOOD_TRUCK'
  );

  const vendorData: any = userVendor || {
    _id: 'b_' + (user?.id || 'new_vendor'),
    name: user?.name ? `${user.name}'s Food Truck` : 'My Mobile Vendor Spot',
    tagline: 'Fresh Eats On The Move',
    description: 'Serving delicious fresh street food dishes.',
    businessType: 'MOBILE_VENDOR' as const,
    vehicleType: 'BURGER_TRUCK' as const,
    ownerId: user?.id,
    logo: user?.avatar || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
    categories: ['Fast Food', 'Street Food'],
    rating: { average: 5.0, count: 1 },
    address: 'MG Road',
    city: 'Bengaluru',
    location: { type: 'Point' as const, coordinates: [77.607, 12.9716] },
    crowdLevel: 'MODERATE' as const,
    verification: { status: 'VERIFIED' as const, badgeLabel: 'FSSAI Certified' },
    followersCount: 0,
    isAvailable: true,
    isFeatured: true
  };

  const items = siteContent.menuItems.filter((i) => i.businessId === vendorData._id);
  const { location } = useLocation();

  // Toggle Live Broadcast in OwnerContext & Socket
  const handleToggleLive = () => {
    const nextLive = !isLive;
    setIsLive(nextLive);
    updateBusinessData(vendorData._id, {
      liveLocation: {
        lat: location.lat,
        lng: location.lng,
        speed: nextLive ? 12 : 0,
        heading: 90,
        isLive: nextLive,
        lastUpdated: new Date().toISOString(),
      },
    });
    const socket = getSocket();
    socket.emit('vendor:status:update', { businessId: vendorData._id, isLive: nextLive });
  };

  // Real-time GPS broadcast via socket & browser Geolocation API
  useEffect(() => {
    if (!isLive) return;
    const socket = getSocket();

    // Broadcast current real GPS position
    socket.emit('vendor:location:update', {
      businessId: vendorData._id,
      lat: location.lat,
      lng: location.lng,
      speed: 12,
      heading: 90
    });

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit('vendor:location:update', {
            businessId: vendorData._id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed || 15,
            heading: pos.coords.heading || 0
          });
          updateBusinessData(vendorData._id, {
            liveLocation: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              speed: pos.coords.speed || 15,
              heading: pos.coords.heading || 0,
              isLive: true,
              lastUpdated: new Date().toISOString()
            }
          });
        },
        (err) => console.warn('Vendor GPS Watch error:', err.message),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLive, vendorData._id, location.lat, location.lng]);

  const [orders, setOrders] = useState([
    { id: '#2045', status: 'New', statusColor: 'bg-[#FF7A00] text-white', time: '2 min ago', total: '₹320', items: '1x Classic Cheese Burger, 1x Fries' },
    { id: '#2044', status: 'Preparing', statusColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', time: '12 min ago', total: '₹450', items: '2x Double Bacon Burger' },
    { id: '#2043', status: 'Ready', statusColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', time: '28 min ago', total: '₹280', items: '1x Veg Supreme Burger, 1x Coke' },
    { id: '#2042', status: 'Completed', statusColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', time: '1 hr ago', total: '₹390', items: '1x Monster Truck Combo' },
  ]);

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Burgers');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(true);

  const updateItemStock = (itemId: string, newStock: number) => {
    updateMenuItem(itemId, { stock: newStock });
    const socket = getSocket();
    socket.emit('vendor:inventory:update', { itemId, stock: newStock });
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const createdItem = {
      _id: 'm_' + Date.now(),
      businessId: vendorData._id,
      name: newItemName,
      description: 'Fresh specialty dish.',
      price: Number(newItemPrice),
      category: newItemCategory,
      isVeg: newItemVeg,
      spiceLevel: 'MEDIUM' as const,
      rating: 4.9,
      image: newItemImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
      stock: 25,
      isBestseller: true
    };
    addMenuItem(createdItem);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    setShowAddItem(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'location', label: 'Live Location', icon: Navigation },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'promotions', label: 'Promotions', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white space-y-6">
      {/* 2. Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Top Header Selector & Live Status Switch (Matching Image 2 Panel 4) */}
        <header className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#252A34] px-4 py-2 rounded-2xl border border-[#2A2F3D]">
              <Truck className="w-4 h-4 text-[#FF7A00]" />
              <span className="font-extrabold text-xs text-white">Ramesh Burger Truck</span>
            </div>

            {/* Live Status Indicator Badge */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
              <span>{isLive ? '+ LIVE' : 'OFFLINE'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customer/home"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] hover:bg-[#FF7A00]/20 text-xs font-extrabold transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Customer Profile</span>
            </Link>
            <button className="p-2.5 rounded-2xl bg-[#252A34] border border-[#2A2F3D] text-gray-300 hover:text-white relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#252A34] border border-[#2A2F3D]">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"} className="w-6 h-6 rounded-full object-cover border border-[#FF7A00]" alt="User Avatar" />
              <span className="text-xs font-bold text-white">{user?.name?.split(' ')[0] || 'Ramesh'}</span>
            </div>
          </div>
        </header>

        {/* Greeting Hero Banner */}
        <section className="bg-white dark:bg-gradient-to-r dark:from-[#181C23] dark:to-[#252A34] border border-gray-200 dark:border-[#2A2F3D] rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Good Morning, {user?.name ? user.name.split(' ')[0] : 'Ramesh'}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Here's your business performance today.</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400&auto=format&fit=crop"
              alt="Food Truck Banner"
              className="w-32 h-20 sm:w-44 sm:h-24 rounded-2xl object-cover border border-gray-200 dark:border-[#2A2F3D] shadow-lg shrink-0"
            />
          </div>
        </section>

        {/* 4 Dynamic KPI Performance Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/vendor/analytics" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-5 rounded-3xl shadow-xl space-y-2 hover:border-[#FF7A00] transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-[#FF7A00] transition-colors">Today's Revenue</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-gray-900 dark:text-white">₹8,450</span>
              <span className="text-[11px] font-extrabold text-[#2CC55E] flex items-center gap-0.5">▲ +12%</span>
            </div>
          </Link>

          <Link href="/vendor/orders" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-5 rounded-3xl shadow-xl space-y-2 hover:border-[#FF7A00] transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-[#FF7A00] transition-colors">Orders</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-gray-900 dark:text-white">{orders.length} Active</span>
              <span className="text-[11px] font-extrabold text-[#2CC55E] flex items-center gap-0.5">▲ +18%</span>
            </div>
          </Link>

          <Link href="/vendor/menu" className="bg-white dark:bg-[#181C23] border border-[#FF7A00]/40 p-5 rounded-3xl shadow-xl space-y-2 hover:border-[#FF7A00] transition-all group">
            <p className="text-[10px] text-[#FF7A00] font-extrabold uppercase tracking-wider flex items-center justify-between">
              <span>Menu Catalog</span>
              <span className="text-[9px] bg-[#FF7A00]/10 px-1.5 py-0.5 rounded">Manage →</span>
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-gray-900 dark:text-white">{items.length} Dishes</span>
              <span className="text-[11px] font-extrabold text-amber-400">In Stock</span>
            </div>
          </Link>

          <Link href="/vendor/reviews" className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-5 rounded-3xl shadow-xl space-y-2 hover:border-[#FF7A00] transition-all group">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider group-hover:text-[#FF7A00] transition-colors">Rating & Reviews</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400 flex items-center gap-1">4.8 <Star className="w-4 h-4 fill-amber-400" /></span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">(520 reviews)</span>
            </div>
          </Link>
        </section>

        {/* Middle Row: Live Location Card & Today's Orders Queue */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Location Card with Interactive Leaflet MapView */}
          <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white tracking-wide uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF7A00]" /> Live Location Map
              </h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                GPS Active
              </span>
            </div>

            {/* Interactive Satellite Live Map View */}
            <div className="relative h-60 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2A2F3D] shadow-inner">
              <MapView
                businesses={[vendorData]}
                selectedBusiness={vendorData}
                onSelectBusiness={() => {}}
                filterType="ALL"
              />
            </div>

            {/* Sharing Live Location Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-[#2A2F3D]">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sharing live location</span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  isLive ? 'bg-[#FF7A00]' : 'bg-gray-300 dark:bg-[#252A34]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isLive ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Today's Orders Queue Card */}
          <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF7A00]" /> Today's Orders
              </h3>
              <button className="text-xs font-extrabold text-[#FF7A00] hover:underline">View All →</button>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-[#252A34] border border-[#2A2F3D] p-3.5 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-sm">{ord.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${ord.statusColor}`}>
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-gray-400 font-semibold">{ord.time}</span>
                  <span className="font-black text-white text-sm">{ord.total}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Metric Chips Row (Matching Image 2 Panel 4) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00] flex items-center justify-center font-extrabold text-sm">
              8
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Current Queue</p>
              <p className="text-xs font-black text-white">8 People Waiting</p>
            </div>
          </div>

          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold text-sm">
              12
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Crowd Nearby</p>
              <p className="text-xs font-black text-white">12 Footfalls/Min</p>
            </div>
          </div>

          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-sm">
              3
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Low Stock Items</p>
              <p className="text-xs font-black text-amber-400">3 Items Reorder</p>
            </div>
          </div>

          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#2CC55E] flex items-center justify-center font-extrabold text-sm">
              ⏰
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Today's Route</p>
              <p className="text-xs font-black text-white">6 PM - 11 PM</p>
            </div>
          </div>
        </section>

        {/* 5. Food Menu & Reels Manager interactive tools */}
        <section className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF7A00]" /> Food Menu & Pricing Manager
            </h3>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="px-3.5 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-extrabold flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" /> Add Food Item
            </button>
          </div>

          {showAddItem && (
            <form onSubmit={handleAddNewItem} className="bg-[#252A34] p-4 rounded-2xl border border-[#2A2F3D] space-y-3">
              <h4 className="text-xs font-bold text-white">Add New Item to Vendor Menu</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Dish Name (e.g. Special Roll)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="p-2 rounded-xl bg-[#181C23] border border-[#2A2F3D] text-xs text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Price in ₹ (e.g. 150)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="p-2 rounded-xl bg-[#181C23] border border-[#2A2F3D] text-xs text-white"
                />
              </div>
              <input
                type="url"
                placeholder="Food Image URL"
                value={newItemImage}
                onChange={(e) => setNewItemImage(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#181C23] border border-[#2A2F3D] text-xs text-white"
              />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-300 font-bold">
                  <input type="checkbox" checked={newItemVeg} onChange={(e) => setNewItemVeg(e.target.checked)} />
                  <span>Is Vegetarian?</span>
                </label>
                <button type="submit" className="px-4 py-1.5 bg-[#2CC55E] text-white font-bold rounded-xl text-xs">
                  Save Item
                </button>
              </div>
            </form>
          )}

          {items.length === 0 ? (
            <div className="bg-[#252A34]/50 border border-dashed border-[#2A2F3D] p-8 rounded-2xl text-center space-y-3">
              <Package className="w-10 h-10 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Food Items in Your Menu Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                As a new mobile vendor, you can manually add your signature dishes, prices, photos, and stock levels to start taking orders.
              </p>
              <button
                onClick={() => setShowAddItem(true)}
                className="px-4 py-2 rounded-xl bg-[#FF7A00] text-white font-extrabold text-xs shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                + Add Your First Dish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div key={item._id} className="bg-[#252A34] border border-[#2A2F3D] p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{item.name}</h5>
                      <p className="text-xs font-black text-[#FF7A00]">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#2CC55E] bg-[#2CC55E]/20 px-2 py-0.5 rounded">
                      {item.stock} in stock
                    </span>
                    <button
                      onClick={() => updateItemStock(item._id, Math.max(0, item.stock - 1))}
                      className="px-2 py-1 bg-[#181C23] border border-[#2A2F3D] text-xs font-bold text-white rounded-lg"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateItemStock(item._id, item.stock + 5)}
                      className="px-2 py-1 bg-[#181C23] border border-[#2A2F3D] text-xs font-bold text-white rounded-lg"
                    >
                      +5
                    </button>
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
