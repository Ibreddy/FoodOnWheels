'use client';

import React, { useState } from 'react';
import { Search, Flame, MapPin, Star, ShieldCheck } from 'lucide-react';
import { mockBusinesses } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const tags = ['ALL', 'Burger', 'Chai', 'Biryani', 'Pizza', 'South Indian', 'Desserts', 'Coffee'];

  const filtered = mockBusinesses.filter((b) => {
    if (selectedTag !== 'ALL' && !b.categories.includes(selectedTag)) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-xl">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-brand-orange" /> Explore Food & Vendors
          </h1>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food item, vendor name, or street location..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedTag === t ? 'bg-brand-orange text-white' : 'bg-dark-bg border border-dark-border text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div key={b._id} className="bg-dark-card border border-dark-border rounded-3xl p-4 space-y-3 shadow-lg">
              <img src={b.coverImage || b.logo} alt={b.name} className="w-full h-36 rounded-2xl object-cover" />
              <div>
                <h3 className="font-bold text-sm text-white">{b.name}</h3>
                <p className="text-xs text-gray-400">{b.tagline}</p>
                <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-dark-border text-gray-300 font-bold">
                  <span>⭐ {b.rating.average}</span>
                  <span className="text-brand-orange">{b.address.split(',')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
