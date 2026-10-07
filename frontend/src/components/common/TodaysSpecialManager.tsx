'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Edit2, Play, Pause, Trash2, Tag, Clock, Eye, ShoppingBag, DollarSign, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';
import { useOwnerContext } from '@/context/OwnerContext';
import { TodaysSpecialRecord, SpecialStatus } from '@/types';

interface TodaysSpecialManagerProps {
  businessId: string;
  businessName: string;
  businessType: 'MOBILE_VENDOR' | 'RESTAURANT' | 'CAFE';
  allowedRole: 'MOBILE_VENDOR' | 'RESTAURANT';
}

export const TodaysSpecialManager: React.FC<TodaysSpecialManagerProps> = ({
  businessId,
  businessName,
  businessType,
  allowedRole,
}) => {
  const { siteContent, saveTodaysSpecialRecord, updateSpecialRecordStatus, deleteSpecialRecord } = useOwnerContext();
  const [activeTab, setActiveTab] = useState<SpecialStatus | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<TodaysSpecialRecord | null>(null);

  // Filter business's menu items for selection
  const businessMenuItems = siteContent.menuItems.filter((i) => i.businessId === businessId || !i.businessId);

  // Filter business's specials
  const allSpecials = (siteContent.todaysSpecialRecords || []).filter((r) => r.businessId === businessId || !r.businessId);
  const filteredSpecials = activeTab === 'ALL' ? allSpecials : allSpecials.filter((s) => s.status === activeTab);

  // Form State
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(businessMenuItems[0]?._id || '');
  const [specialPrice, setSpecialPrice] = useState('');
  const [specialLabel, setSpecialLabel] = useState<string>('Today\'s Pick');
  const [quantity, setQuantity] = useState('25');
  const [startAt, setStartAt] = useState('12:00 PM');
  const [endAt, setEndAt] = useState('10:00 PM');
  const [description, setDescription] = useState('');
  const [customImage, setCustomImage] = useState('');

  const selectedFood = businessMenuItems.find((m) => m._id === selectedMenuItemId) || businessMenuItems[0];
  const origPrice = selectedFood?.price || 160;
  const specPriceNum = Number(specialPrice) || Math.round(origPrice * 0.8);
  const calculatedDiscount = Math.max(0, Math.round(((origPrice - specPriceNum) / origPrice) * 100));

  const handleOpenForm = (special?: TodaysSpecialRecord) => {
    if (special) {
      setEditingSpecial(special);
      setSelectedMenuItemId(special.menuItemId);
      setSpecialPrice(String(special.specialPrice));
      setSpecialLabel(special.specialLabel);
      setQuantity(String(special.quantity));
      setStartAt(special.startAt);
      setEndAt(special.endAt);
      setDescription(special.description);
      setCustomImage(special.image);
    } else {
      setEditingSpecial(null);
      setSelectedMenuItemId(businessMenuItems[0]?._id || '');
      setSpecialPrice(String(Math.round(origPrice * 0.8)));
      setSpecialLabel(businessType === 'MOBILE_VENDOR' ? "Today's Pick" : 'Chef Special');
      setQuantity('25');
      setStartAt('12:00 PM');
      setEndAt('10:00 PM');
      setDescription('');
      setCustomImage('');
    }
    setShowAddForm(true);
  };

  const handleSave = (statusToSave: SpecialStatus) => {
    if (!selectedFood) return;

    const record: TodaysSpecialRecord = {
      id: editingSpecial ? editingSpecial.id : 'ts_' + Date.now(),
      businessId,
      businessName,
      businessType,
      menuItemId: selectedFood._id,
      foodName: selectedFood.name,
      specialLabel,
      originalPrice: origPrice,
      specialPrice: specPriceNum,
      discountPercentage: calculatedDiscount,
      description: description || selectedFood.description || 'Special offer available today!',
      image: customImage || selectedFood.image,
      startAt,
      endAt,
      quantity: Number(quantity) || 25,
      remainingQuantity: Number(quantity) || 25,
      status: statusToSave,
      createdAt: editingSpecial ? editingSpecial.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: editingSpecial ? editingSpecial.views : 0,
      clicks: editingSpecial ? editingSpecial.clicks : 0,
      ordersCount: editingSpecial ? editingSpecial.ordersCount : 0,
      revenue: editingSpecial ? editingSpecial.revenue : 0,
    };

    saveTodaysSpecialRecord(record);
    setShowAddForm(false);
  };

  // Analytics totals
  const totalViews = allSpecials.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalOrders = allSpecials.reduce((sum, s) => sum + (s.ordersCount || 0), 0);
  const totalRevenue = allSpecials.reduce((sum, s) => sum + (s.revenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {allowedRole === 'MOBILE_VENDOR' ? 'VENDOR CONTROL' : 'RESTAURANT CONTROL'}
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Today's Special Manager
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Create, publish & schedule special daily offers from your menu. Published specials appear directly on Customer Home.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Add Today's Special
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Special Views
          </span>
          <p className="text-xl font-black text-white">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Special Orders
          </span>
          <p className="text-xl font-black text-white">{totalOrders}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Revenue
          </span>
          <p className="text-xl font-black text-amber-400">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Active Specials
          </span>
          <p className="text-xl font-black text-white">{allSpecials.filter((s) => s.status === 'ACTIVE').length}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'ACTIVE', 'DRAFT', 'SCHEDULED', 'PAUSED', 'EXPIRED', 'SOLD_OUT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
              activeTab === tab
                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                : 'bg-dark-card border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showAddForm && (
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-2xl animate-fade-in border-amber-500/40">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {editingSpecial ? "Edit Today's Special" : "Create New Today's Special"}
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-gray-400 hover:text-white">✕ Close</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* 1. Select Food from Existing Menu */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-gray-300">Select Dish from Menu</label>
              <select
                value={selectedMenuItemId}
                onChange={(e) => {
                  setSelectedMenuItemId(e.target.value);
                  const selected = businessMenuItems.find((m) => m._id === e.target.value);
                  if (selected) setSpecialPrice(String(Math.round(selected.price * 0.8)));
                }}
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-amber-400 focus:outline-none"
              >
                {businessMenuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} — Normal Price: ₹{item.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Preview */}
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Original Menu Price</label>
              <input type="text" value={`₹${origPrice}`} disabled className="w-full p-2.5 bg-dark-bg/60 border border-dark-border rounded-xl text-gray-400 font-bold" />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300">Special Price (₹)</label>
              <input
                type="number"
                value={specialPrice}
                onChange={(e) => setSpecialPrice(e.target.value)}
                placeholder="e.g. 129"
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white font-bold focus:border-amber-400 focus:outline-none"
              />
              <span className="text-[10px] text-emerald-400 font-bold">Calculated Discount: {calculatedDiscount}% OFF</span>
            </div>

            {/* Special Label */}
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Special Label Badge</label>
              <select
                value={specialLabel}
                onChange={(e) => setSpecialLabel(e.target.value)}
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-amber-400 focus:outline-none font-bold"
              >
                <option value="Today's Pick">🔥 Today's Pick</option>
                <option value="Chef Special">⭐ Chef Special</option>
                <option value="Limited Time">⏰ Limited Time</option>
                <option value="Best Seller Today">👑 Best Seller Today</option>
                <option value="Special Offer">🏷️ Special Offer</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Available Special Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 25"
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Time Slot */}
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Start Time</label>
              <input
                type="text"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                placeholder="e.g. 12:00 PM"
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300">End Time (Auto Expires)</label>
              <input
                type="text"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                placeholder="e.g. 10:00 PM"
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-gray-300">Custom Image URL (Optional)</label>
              <input
                type="text"
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                placeholder="Leave blank to use default menu image"
                className="w-full p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-dark-border">
            <button
              onClick={() => handleSave('ACTIVE')}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors"
            >
              ✓ Publish Today's Special Now
            </button>
            <button
              onClick={() => handleSave('DRAFT')}
              className="px-4 py-2.5 bg-dark-bg border border-dark-border text-gray-300 hover:text-white font-bold text-xs rounded-xl"
            >
              Save Draft
            </button>
          </div>
        </div>
      )}

      {/* Specials Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filteredSpecials.map((spec) => (
          <div key={spec.id} className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-xl p-4 space-y-3 relative group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={spec.image} alt={spec.foodName} className="w-16 h-16 rounded-2xl object-cover border border-dark-border shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {spec.specialLabel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      spec.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : spec.status === 'PAUSED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      ● {spec.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white mt-1">{spec.foodName}</h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-black text-emerald-400">₹{spec.specialPrice}</span>
                    <span className="text-xs text-gray-500 line-through">₹{spec.originalPrice}</span>
                    <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      {spec.discountPercentage}% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenForm(spec)} className="p-1.5 text-gray-400 hover:text-white bg-dark-bg border border-dark-border rounded-lg">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteSpecialRecord(spec.id)} className="p-1.5 text-gray-400 hover:text-rose-400 bg-dark-bg border border-dark-border rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-dark-border">
              <span>⏰ Slot: <strong className="text-white">{spec.startAt} - {spec.endAt}</strong></span>
              <span>📦 Left: <strong className="text-amber-400">{spec.remainingQuantity}/{spec.quantity}</strong></span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <button
                onClick={() => updateSpecialRecordStatus(spec.id, spec.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  spec.status === 'ACTIVE'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {spec.status === 'ACTIVE' ? (
                  <><Pause className="w-3.5 h-3.5" /> Pause Special</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Publish / Activate</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
