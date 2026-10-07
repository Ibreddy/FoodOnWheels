'use client';

import React, { useState } from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { MenuItem } from '@/types';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  DollarSign,
  Leaf
} from 'lucide-react';

export default function OwnerMenuPage() {
  const { siteContent, updateMenuItems } = useOwnerContext();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(siteContent.menuItems);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: 'Peri Peri Loaded Fries',
    description: 'Crispy golden fries dusted with spicy African peri peri seasoning',
    price: 4.5,
    category: 'Fast Food',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop',
  });

  const handleSaveAll = (updated: MenuItem[]) => {
    setMenuItems(updated);
    updateMenuItems(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      _id: 'm_' + Date.now(),
      businessId: 'b1',
      name: formData.name || 'Artisanal Dish',
      description: formData.description || 'Prepared fresh upon order.',
      price: Number(formData.price) || 5,
      category: formData.category || 'General',
      isVeg: Boolean(formData.isVeg),
      spiceLevel: 'MEDIUM',
      rating: 4.7,
      image: formData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
      stock: 50,
    };

    const updated = [newItem, ...menuItems];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this menu item?')) {
      const updated = menuItems.filter(m => m._id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Food Items & Pricing</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Central Food & Menu Items Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Add new food items, update prices, change descriptions, and toggle vegetarian tags across all food trucks and restaurants.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Menu items updated and saved to site!</span>
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Create New Food Item</span>
            </h2>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-xl bg-gray-800 text-gray-400"
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
                placeholder="e.g. Peri Peri Loaded Fries"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-emerald-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Burger, Fast Food, Drinks"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-emerald-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Price ($)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="4.50"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-emerald-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Vegetarian / Non-Veg</label>
              <select
                value={formData.isVeg ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'true' })}
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-emerald-400 text-white px-3 py-2 rounded-xl outline-none"
              >
                <option value="true">Veg (Vegetarian 🌱)</option>
                <option value="false">Non-Veg 🍗</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-semibold">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Fresh ingredients, flame grilled..."
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-emerald-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
              >
                Save Menu Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-[#14171F] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-40 w-full bg-gray-900">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />

              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                item.isVeg ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {item.isVeg ? '🌱 VEG' : '🍗 NON-VEG'}
              </span>

              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg"
                title="Delete Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">{item.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
                <span className="text-[#FF7A00] font-black text-base">
                  ${item.price}
                </span>
                <span className="text-[10px] bg-gray-800 text-gray-400 font-semibold px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
