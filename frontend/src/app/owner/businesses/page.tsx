'use client';

import React, { useState } from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { Business } from '@/types';
import {
  Truck,
  Plus,
  Trash2,
  Check,
  X,
  Star,
  ShieldCheck,
  Sparkles,
  MapPin,
  Utensils
} from 'lucide-react';

export default function OwnerBusinessesPage() {
  const { siteContent, updateBusinesses } = useOwnerContext();
  const [businesses, setBusinesses] = useState<Business[]>(siteContent.businesses);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<Business>>({
    name: 'Bangalore Tacos Truck',
    tagline: 'Authentic Mexican Tacos & Nachos on Wheels 🌮',
    businessType: 'MOBILE_VENDOR',
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    isFeatured: true,
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
  });

  const handleSaveAll = (updated: Business[]) => {
    setBusinesses(updated);
    updateBusinesses(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: Business = {
      _id: 'b_' + Date.now(),
      name: formData.name || 'New Gourmet Truck',
      tagline: formData.tagline || 'Fresh street food near you',
      description: 'Serving delicious artisanal meals daily.',
      businessType: formData.businessType || 'MOBILE_VENDOR',
      logo: formData.logo || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop',
      categories: ['Street Food', 'Fast Food'],
      rating: { average: 4.8, count: 42 },
      address: formData.address || 'MG Road',
      city: 'Bengaluru',
      location: { type: 'Point', coordinates: [77.607, 12.9716] },
      crowdLevel: 'MODERATE',
      verification: { isVerified: true, fssaiLicense: '11223344556677', kycStatus: 'VERIFIED' },
      followersCount: 120,
      isFeatured: Boolean(formData.isFeatured),
    };

    const updated = [newBiz, ...businesses];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this vendor / restaurant profile?')) {
      const updated = businesses.filter(b => b._id !== id);
      handleSaveAll(updated);
    }
  };

  const handleToggleFeatured = (id: string) => {
    const updated = businesses.map(b => (b._id === id ? { ...b, isFeatured: !b.isFeatured } : b));
    handleSaveAll(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Vendors & Restaurants</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Businesses & Partners Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Control all food trucks, mobile vans, and fine dining restaurants listed on the platform. Toggle featured badges and verification status.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Business</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Businesses updated and synchronized live!</span>
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-blue-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Add New Vendor Truck or Restaurant</span>
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
              <label className="block text-gray-400 mb-1 font-semibold">Business Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Burger Truck"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-blue-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-blue-400 text-white px-3 py-2 rounded-xl outline-none"
              >
                <option value="MOBILE_VENDOR">Mobile Vendor / Food Truck</option>
                <option value="RESTAURANT">Fine Dining Restaurant</option>
                <option value="CAFE">Cafe & Bakery</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Fresh flame-grilled double patties"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-blue-400 text-white px-3 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Address / Main Stop</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. MG Road Metro Station"
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-blue-400 text-white px-3 py-2 rounded-xl outline-none"
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
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
              >
                Save Business
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((biz) => (
          <div
            key={biz._id}
            className="bg-[#14171F] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-40 w-full bg-gray-900">
              <img
                src={biz.coverImage}
                alt={biz.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  {biz.businessType === 'MOBILE_VENDOR' ? 'Food Truck' : 'Restaurant'}
                </span>
                {biz.isFeatured && (
                  <span className="bg-[#FF7A00] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                    ★ Featured
                  </span>
                )}
              </div>

              <button
                onClick={() => handleDelete(biz._id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg"
                title="Delete Business"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <img src={biz.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-700" />
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{biz.name}</span>
                    {biz.verification?.isVerified && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                  </h3>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {biz.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {biz.rating.average} ({biz.rating.count} reviews)
                </span>

                <button
                  onClick={() => handleToggleFeatured(biz._id)}
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] transition-all ${
                    biz.isFeatured
                      ? 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {biz.isFeatured ? 'Featured ON' : 'Make Featured'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
