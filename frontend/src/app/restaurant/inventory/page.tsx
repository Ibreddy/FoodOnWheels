'use client';

import React, { useState } from 'react';
import { Layers, Plus, Trash2, AlertTriangle, CheckCircle2, Search, Sparkles, RefreshCw, Scale } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export interface IngredientItem {
  id: string;
  name: string;
  category: 'Grains' | 'Dairy' | 'Meat' | 'Vegetables' | 'Spices' | 'Oils & Sauces' | 'Beverages';
  quantity: number;
  unit: 'kg' | 'liters' | 'packets' | 'units' | 'cans';
  minThreshold: number;
  costPerUnit: number;
  lastRestocked: string;
}

const DEFAULT_INGREDIENTS: IngredientItem[] = [
  { id: 'i1', name: 'Premium Basmati Rice', category: 'Grains', quantity: 45, unit: 'kg', minThreshold: 15, costPerUnit: 90, lastRestocked: '2 days ago' },
  { id: 'i2', name: 'Fresh Paneer (Cottage Cheese)', category: 'Dairy', quantity: 6, unit: 'kg', minThreshold: 10, costPerUnit: 340, lastRestocked: 'Yesterday' },
  { id: 'i3', name: 'Fresh Chicken Breast', category: 'Meat', quantity: 18, unit: 'kg', minThreshold: 12, costPerUnit: 260, lastRestocked: 'Today 8 AM' },
  { id: 'i4', name: 'Shredded Mozzarella Cheese', category: 'Dairy', quantity: 4, unit: 'kg', minThreshold: 8, costPerUnit: 480, lastRestocked: '3 days ago' },
  { id: 'i5', name: 'Whole Wheat Atta / Flour', category: 'Grains', quantity: 50, unit: 'kg', minThreshold: 20, costPerUnit: 45, lastRestocked: '4 days ago' },
  { id: 'i6', name: 'Organic Ripe Tomatoes', category: 'Vegetables', quantity: 14, unit: 'kg', minThreshold: 10, costPerUnit: 35, lastRestocked: 'Today 6 AM' },
  { id: 'i7', name: 'Refined Sunflower Cooking Oil', category: 'Oils & Sauces', quantity: 24, unit: 'liters', minThreshold: 15, costPerUnit: 140, lastRestocked: '5 days ago' },
  { id: 'i8', name: 'Authentic Chef Garam Masala', category: 'Spices', quantity: 2, unit: 'packets', minThreshold: 5, costPerUnit: 180, lastRestocked: '1 week ago' },
];

export default function RestaurantInventoryPage() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>(DEFAULT_INGREDIENTS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW_STOCK' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IngredientItem['category']>('Grains');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<IngredientItem['unit']>('kg');
  const [minThreshold, setMinThreshold] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');

  const handleUpdateQty = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleQuickRestock = (id: string, amount = 20) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount, lastRestocked: 'Just Now' } : item
      )
    );
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) return;

    const newItem: IngredientItem = {
      id: 'i_' + Date.now(),
      name,
      category,
      quantity: Number(quantity) || 10,
      unit,
      minThreshold: Number(minThreshold) || 5,
      costPerUnit: Number(costPerUnit) || 100,
      lastRestocked: 'Just Now',
    };

    setIngredients([newItem, ...ingredients]);
    setName('');
    setQuantity('');
    setMinThreshold('');
    setCostPerUnit('');
    setShowAddForm(false);
  };

  const handleDeleteIngredient = (id: string) => {
    if (confirm('Delete ingredient item from kitchen inventory?')) {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // Filtered List
  const filtered = ingredients.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const isLow = item.quantity > 0 && item.quantity <= item.minThreshold;
    const isOut = item.quantity === 0;
    const isIn = item.quantity > item.minThreshold;

    if (!matchesSearch) return false;
    if (activeTab === 'LOW_STOCK') return isLow;
    if (activeTab === 'OUT_OF_STOCK') return isOut;
    if (activeTab === 'IN_STOCK') return isIn;
    return true;
  });

  // Stats
  const totalCount = ingredients.length;
  const lowStockCount = ingredients.filter((i) => i.quantity > 0 && i.quantity <= i.minThreshold).length;
  const outOfStockCount = ingredients.filter((i) => i.quantity === 0).length;
  const totalStockValue = ingredients.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0);

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Kitchen Inventory Control</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Kitchen Inventory & Raw Ingredients Stock
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Track kitchen raw ingredients, stock levels, low-stock warnings & automated restock alerts.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showAddForm ? 'Close Form' : 'Add New Ingredient'}</span>
          </button>
        </div>

        {/* 4 KPI Performance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Total Ingredients</p>
            <p className="text-2xl font-black text-white">{totalCount}</p>
          </div>
          <div className="bg-[#181C23] border border-amber-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-amber-400 font-extrabold uppercase">Low Stock Warnings</p>
            <p className="text-2xl font-black text-amber-400">{lowStockCount}</p>
          </div>
          <div className="bg-[#181C23] border border-rose-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-rose-400 font-extrabold uppercase">Out of Stock</p>
            <p className="text-2xl font-black text-rose-400">{outOfStockCount}</p>
          </div>
          <div className="bg-[#181C23] border border-emerald-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-emerald-400 font-extrabold uppercase">Estimated Stock Value</p>
            <p className="text-2xl font-black text-emerald-400">₹{totalStockValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Ingredient Form Modal */}
        {showAddForm && (
          <form onSubmit={handleAddIngredient} className="bg-[#181C23] border border-purple-500/40 p-6 rounded-3xl space-y-4 text-xs shadow-2xl">
            <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-[#2A2F3D] pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" /> Add Raw Ingredient to Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Ingredient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Basmati Rice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                >
                  <option value="Grains">Grains & Flour</option>
                  <option value="Dairy">Dairy & Cheese</option>
                  <option value="Meat">Meat & Poultry</option>
                  <option value="Vegetables">Fresh Vegetables</option>
                  <option value="Spices">Spices & Seasonings</option>
                  <option value="Oils & Sauces">Oils & Sauces</option>
                  <option value="Beverages">Beverages & Tea</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Unit Type</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters (l)</option>
                  <option value="packets">Packets</option>
                  <option value="units">Units / Pieces</option>
                  <option value="cans">Cans / Tins</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Current Stock Quantity</label>
                <input
                  type="number"
                  placeholder="25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Low Stock Threshold Level</label>
                <input
                  type="number"
                  placeholder="5"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Cost Per Unit (₹)</label>
                <input
                  type="number"
                  placeholder="120"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-xl transition-all text-xs"
            >
              Save Ingredient to Kitchen Inventory
            </button>
          </form>
        )}

        {/* Filter Controls & Search */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-2xl font-black transition-all ${
                activeTab === 'ALL'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#252A34] text-gray-400 hover:text-white'
              }`}
            >
              All Items ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('LOW_STOCK')}
              className={`px-3.5 py-2 rounded-2xl font-black transition-all ${
                activeTab === 'LOW_STOCK'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-[#252A34] text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              Low Stock Warnings ({lowStockCount})
            </button>
            <button
              onClick={() => setActiveTab('OUT_OF_STOCK')}
              className={`px-3.5 py-2 rounded-2xl font-black transition-all ${
                activeTab === 'OUT_OF_STOCK'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-[#252A34] text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#2A2F3D] text-white pl-9 pr-3 py-2 rounded-2xl outline-none font-bold text-xs"
            />
          </div>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isLow = item.quantity > 0 && item.quantity <= item.minThreshold;
            const isOut = item.quantity === 0;

            return (
              <div key={item.id} className="bg-[#181C23] border border-[#2A2F3D] p-5 rounded-3xl space-y-4 shadow-xl text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {item.category}
                      </span>
                      <h3 className="font-extrabold text-base text-white mt-1">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteIngredient(item.id)}
                      className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#2A2F3D]">
                    <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase">Current Stock</p>
                      <p className="text-xl font-black text-white">
                        {item.quantity} <span className="text-xs font-bold text-gray-400">{item.unit}</span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      isOut
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isLow
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isOut ? '🔴 OUT OF STOCK' : isLow ? '⚠️ LOW STOCK' : '🟢 IN STOCK'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold">
                    <span>Min Alert: {item.minThreshold} {item.unit}</span>
                    <span>₹{item.costPerUnit}/{item.unit}</span>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="space-y-2 pt-3 border-t border-[#2A2F3D]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="flex-1 py-2 bg-[#252A34] hover:bg-[#2A2F3D] text-white font-extrabold rounded-xl border border-[#2A2F3D] text-xs"
                    >
                      - 1 {item.unit}
                    </button>
                    <button
                      onClick={() => handleUpdateQty(item.id, 5)}
                      className="flex-1 py-2 bg-[#252A34] hover:bg-[#2A2F3D] text-white font-extrabold rounded-xl border border-[#2A2F3D] text-xs"
                    >
                      + 5 {item.unit}
                    </button>
                  </div>

                  <button
                    onClick={() => handleQuickRestock(item.id, 25)}
                    className="w-full py-2 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-300 hover:text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Quick Restock (+25 {item.unit})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
