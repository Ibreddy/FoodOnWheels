'use client';

import React, { useState } from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { MenuItem } from '@/types';
import {
  Flame,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Tag,
  Clock,
  DollarSign,
  Sparkles,
  Check
} from 'lucide-react';

export default function OwnerTodaysSpecialPage() {
  const { siteContent, updateTodaysSpecials } = useOwnerContext();
  const [specials, setSpecials] = useState<MenuItem[]>(siteContent.todaysSpecials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Special Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 10,
    specialPrice: 5,
    specialLabel: 'Chef\'s Special',
    specialEndTime: '04:30:00',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    isVeg: false,
    rating: 4.8,
  });

  const handleSaveAll = (updated: MenuItem[]) => {
    setSpecials(updated);
    updateTodaysSpecials(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      _id: 'ts_' + Date.now(),
      businessId: 'b1',
      name: formData.name || 'Delicious Special Dish',
      description: formData.description || 'Specially crafted for today by our head chef.',
      price: Number(formData.price) || 12,
      specialPrice: Number(formData.specialPrice) || 6,
      category: 'Specials',
      isVeg: Boolean(formData.isVeg),
      spiceLevel: 'MEDIUM',
      rating: 4.9,
      image: formData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
      stock: 25,
      isBestseller: true,
      isTodaysSpecial: true,
      specialLabel: formData.specialLabel || 'Chef\'s Special',
      specialEndTime: formData.specialEndTime || '04:00:00',
      discountPercentage: Math.round(((Number(formData.price) - Number(formData.specialPrice)) / Number(formData.price)) * 100),
    };

    const updated = [newItem, ...specials];
    handleSaveAll(updated);
    setIsAdding(false);
    setFormData({
      name: '',
      description: '',
      price: 10,
      specialPrice: 5,
      specialLabel: 'Chef\'s Special',
      specialEndTime: '04:30:00',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
      isVeg: false,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this Today\'s Special item?')) {
      const updated = specials.filter(s => s._id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Customer Deal Highlight</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Today's Specials Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Control the featured dishes displayed in the "Today's Special" section on the customer home page. Update discount prices, badges, and countdown timers.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Today's Special</span>
        </button>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Today's Specials successfully updated and published to the customer homepage!</span>
        </div>
      )}

      {/* Modal / Inline Add Form */}
      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Add New Today's Special Dish</span>
            </h2>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateNew} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Dish Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Flame Grilled Double Cheese Burger"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Tag / Badge Label</label>
              <input
                type="text"
                value={formData.specialLabel}
                onChange={(e) => setFormData({ ...formData, specialLabel: e.target.value })}
                placeholder="e.g. Chef's Special, 50% OFF, Limited"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Original Price ($)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="12.00"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Special Discounted Price ($)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.specialPrice}
                onChange={(e) => setFormData({ ...formData, specialPrice: Number(e.target.value) })}
                placeholder="6.00"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Countdown End Time (HH:MM:SS)</label>
              <input
                type="text"
                value={formData.specialEndTime}
                onChange={(e) => setFormData({ ...formData, specialEndTime: e.target.value })}
                placeholder="04:30:00"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-amber-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl shadow-md"
              >
                Save Today's Special
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Specials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specials.map((item) => (
          <div
            key={item._id}
            className="bg-[#14171F] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative h-44 w-full bg-gray-900">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />

              {/* Tag Badge */}
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-lg">
                {item.specialLabel || 'Today\'s Special'}
              </span>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg transition-all"
                title="Remove Special"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">{item.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black text-amber-400">
                    ${item.specialPrice || item.price}
                  </span>
                  {item.price > (item.specialPrice || item.price) && (
                    <span className="text-xs text-gray-500 line-through font-semibold">
                      ${item.price}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">{item.specialEndTime || '04:00:00'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
