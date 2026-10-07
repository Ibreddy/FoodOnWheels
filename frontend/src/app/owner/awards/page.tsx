'use client';

import React, { useState } from 'react';
import { useOwnerContext, CustomerChoiceAward } from '@/context/OwnerContext';
import { Trophy, Plus, Trash2, Check, X, Award, ThumbsUp } from 'lucide-react';

export default function OwnerAwardsPage() {
  const { siteContent, updateAwards } = useOwnerContext();
  const [awards, setAwards] = useState<CustomerChoiceAward[]>(siteContent.awards);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerChoiceAward>>({
    category: 'Best Mobile Taco Van',
    winnerName: 'Bangalore Tacos Truck',
    businessType: 'Food Truck',
    votes: 1250,
    badge: '🥇 1st Place',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop',
  });

  const handleSaveAll = (updated: CustomerChoiceAward[]) => {
    setAwards(updated);
    updateAwards(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newAward: CustomerChoiceAward = {
      id: 'a_' + Date.now(),
      category: formData.category || 'Best Food Spot',
      winnerName: formData.winnerName || 'Top Winner',
      businessType: formData.businessType || 'Food Truck',
      votes: Number(formData.votes) || 500,
      badge: formData.badge || '🏆 Winner',
      image: formData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop',
    };

    const updated = [newAward, ...awards];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this award nominee?')) {
      const updated = awards.filter(a => a.id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-yellow-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Customer Recognition & Voting</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Customer Choice Awards Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Configure award categories, winner badges, and vote leaderboards displayed in the Customer Choice section.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Award Winner</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Awards updated successfully!</span>
        </div>
      )}

      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-yellow-500/40 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Add Award Winner</h2>
            <button onClick={() => setIsAdding(false)} className="p-1 rounded-xl bg-gray-800 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Award Category Title</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Winner Business Name</label>
              <input
                type="text"
                required
                value={formData.winnerName}
                onChange={(e) => setFormData({ ...formData, winnerName: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Badge Label</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Total Votes</label>
              <input
                type="number"
                value={formData.votes}
                onChange={(e) => setFormData({ ...formData, votes: Number(e.target.value) })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-yellow-500 text-slate-950 font-black rounded-xl shadow-md">Save Award Winner</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {awards.map((award) => (
          <div key={award.id} className="bg-[#14171F] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between">
            <div className="relative h-40 w-full bg-gray-900">
              <img src={award.image} alt={award.winnerName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-yellow-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg">
                {award.badge}
              </span>
              <button onClick={() => handleDelete(award.id)} className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <span className="text-[10px] text-yellow-400 font-bold uppercase">{award.category}</span>
              <h3 className="font-bold text-white text-base">{award.winnerName}</h3>
              <p className="text-[#FF7A00] font-semibold flex items-center gap-1 text-xs">
                <ThumbsUp className="w-3.5 h-3.5" /> {award.votes} Verified Foodie Votes
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
