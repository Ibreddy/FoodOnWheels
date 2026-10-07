'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, Megaphone, Sparkles, Percent } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useOwnerContext, DealItem } from '../../../context/OwnerContext';

export default function VendorPromotionsPage() {
  const { siteContent, addOrUpdateDeal, updateDeals } = useOwnerContext();
  const [showAdd, setShowAdd] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Vendor's deals
  const vendorDeals = siteContent.deals.filter(
    (d) => d.businessName.includes('Ramesh') || d.code.startsWith('BURGER') || d.code.startsWith('TRUCK')
  );

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    const newDeal: DealItem = {
      id: 'd_' + Date.now(),
      code: code.toUpperCase(),
      title: title,
      description: description || 'Special discount offer on pickup & delivery orders.',
      discountPercentage: Number(discountPercentage) || 20,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop',
      businessName: 'Ramesh Burger Truck',
      expiryDate: 'Limited Time',
      isActive: true,
    };

    addOrUpdateDeal(newDeal);
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountPercentage('');
    setBannerImage('');
    setShowAdd(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm('Delete this deal / promo coupon?')) {
      const updated = siteContent.deals.filter((d) => d.id !== id);
      updateDeals(updated);
    }
  };

  const handleToggleDeal = (id: string) => {
    const updated = siteContent.deals.map((d) =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    );
    updateDeals(updated);
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              <span>Promotional Deals & Coupons</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Tag className="w-6 h-6 text-rose-400" /> Vendor Discounts & Combo Deals
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Create promotional discount codes & combo offers. Appears live on Customer Home Deals Near You.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showAdd ? 'Close Form' : 'Create New Deal'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-bold shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Deal published live to Customer Home Deals Near You!</span>
          </div>
        )}

        {/* Add Deal Form */}
        {showAdd && (
          <form onSubmit={handleCreateDeal} className="bg-[#181C23] border border-rose-500/40 p-6 rounded-3xl space-y-4 text-xs shadow-2xl">
            <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-[#2A2F3D] pb-3">
              <Sparkles className="w-4 h-4 text-rose-400" /> Create Vendor Coupon / Deal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Promo Code</label>
                <input
                  type="text"
                  placeholder="e.g. BURGER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono uppercase font-extrabold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Deal Title</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF Gourmet Burgers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  placeholder="20"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">Description / Rules</label>
                <input
                  type="text"
                  placeholder="e.g. Valid on all orders above ₹300 at Ramesh Burger Truck."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-xl transition-all text-xs"
            >
              Publish Deal Live to Customer Home
            </button>
          </form>
        )}

        {/* Existing Vendor Deals */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Your Active Deals & Promotions</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {vendorDeals.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {vendorDeals.map((deal) => (
              <div key={deal.id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl p-5 shadow-xl space-y-3 relative flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {deal.discountPercentage}% OFF
                    </span>
                    <h3 className="font-extrabold text-base text-white">{deal.title}</h3>
                    <p className="text-xs text-gray-400">{deal.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDeal(deal.id)}
                    className="p-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 transition-colors hover:text-white shrink-0"
                    title="Delete Deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#2A2F3D]">
                  <div className="bg-[#0F1115] border border-[#2A2F3D] px-3 py-1.5 rounded-xl font-mono text-xs font-black text-rose-400">
                    CODE: {deal.code}
                  </div>
                  <button
                    onClick={() => handleToggleDeal(deal.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                      deal.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {deal.isActive ? 'ACTIVE ● LIVE' : 'PAUSED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
