'use client';

import React, { useState } from 'react';
import { useOwnerContext, DealItem } from '@/context/OwnerContext';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  Percent,
  Calendar,
  Building
} from 'lucide-react';

export default function OwnerDealsPage() {
  const { siteContent, updateDeals } = useOwnerContext();
  const [deals, setDeals] = useState<DealItem[]>(siteContent.deals);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<DealItem>>({
    code: 'SUPER50',
    title: '50% OFF Combo Feast',
    description: 'Get half price on all street food combos',
    discountPercentage: 50,
    bannerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop',
    businessName: 'Ramesh Burger Truck',
    expiryDate: 'Ends at midnight',
    isActive: true,
  });

  const handleSaveAll = (updated: DealItem[]) => {
    setDeals(updated);
    updateDeals(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: DealItem = {
      id: 'd_' + Date.now(),
      code: formData.code?.toUpperCase() || 'PROMO20',
      title: formData.title || 'Special Discount Banner',
      description: formData.description || 'Valid on all online food orders today',
      discountPercentage: Number(formData.discountPercentage) || 20,
      bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop',
      businessName: formData.businessName || 'FoodOnWheels Exclusive',
      expiryDate: formData.expiryDate || 'Limited Period Offer',
      isActive: true,
    };

    const updated = [newDeal, ...deals];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this deal coupon?')) {
      const updated = deals.filter(d => d.id !== id);
      handleSaveAll(updated);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = deals.map(d => (d.id === id ? { ...d, isActive: !d.isActive } : d));
    handleSaveAll(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" />
            <span>Promotions & Coupons</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Deals & Promo Coupons Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Configure the discount banners, coupon codes, and promotional offers displayed on the customer home page.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Promo Deal</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Deals and coupon codes updated successfully!</span>
        </div>
      )}

      {/* Add Deal Form */}
      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Create New Promotional Offer</span>
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
              <label className="block text-gray-400 mb-1 font-semibold">Coupon Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. STREET50"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Deal Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 50% OFF Double Cheeseburgers"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Discount Percentage (%)</label>
              <input
                type="number"
                required
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                placeholder="50"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Business / Vendor Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Ramesh Burger Truck"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Expiry Date / Time Text</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="e.g. Ends in 4 hours"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Banner Image URL</label>
              <input
                type="text"
                value={formData.bannerImage}
                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-purple-400 text-white px-3 py-2 rounded-xl outline-none"
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
                className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-md"
              >
                Save Deal Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className={`bg-[#14171F] rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
              deal.isActive ? 'border-gray-800' : 'border-gray-800/40 opacity-50'
            }`}
          >
            <div className="relative h-40 w-full bg-gray-900">
              <img
                src={deal.bannerImage}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />

              <span className="absolute top-3 left-3 bg-purple-600 text-white font-black text-xs font-mono px-3 py-1 rounded-xl shadow-lg border border-purple-400/40">
                {deal.code}
              </span>

              <button
                onClick={() => handleDelete(deal.id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg"
                title="Delete Deal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">{deal.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{deal.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  {deal.discountPercentage}% DISCOUNT
                </span>

                <button
                  onClick={() => handleToggleActive(deal.id)}
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase transition-all ${
                    deal.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {deal.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
