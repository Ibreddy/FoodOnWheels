'use client';

import React, { useState } from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { Challenge } from '@/types';
import { Target, Plus, Trash2, Check, X, Award } from 'lucide-react';

export default function OwnerChallengesPage() {
  const { siteContent, updateChallenges } = useOwnerContext();
  const [challenges, setChallenges] = useState<Challenge[]>(siteContent.challenges);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<Challenge>>({
    title: 'Street Food Explorer',
    description: 'Visit 3 different mobile food trucks in a single week',
    rewardPoints: 250,
    badgeName: 'Truck Explorer',
    category: 'Exploration',
    requiredCount: 3,
    icon: '🚚',
  });

  const handleSaveAll = (updated: Challenge[]) => {
    setChallenges(updated);
    updateChallenges(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newChallenge: Challenge = {
      _id: 'c_' + Date.now(),
      title: formData.title || 'New Challenge',
      description: formData.description || 'Complete tasks to earn reward points',
      rewardPoints: Number(formData.rewardPoints) || 100,
      badgeName: formData.badgeName || 'Foodie Badge',
      category: formData.category || 'General',
      requiredCount: Number(formData.requiredCount) || 1,
      icon: formData.icon || '🎯',
    };

    const updated = [newChallenge, ...challenges];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this challenge task?')) {
      const updated = challenges.filter(c => c._id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Gamification & Rewards</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Daily Foodie Challenges Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Configure daily gamification tasks, reward points, and completion badges displayed in the "Today's Challenge" section.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Challenge</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Challenges updated!</span>
        </div>
      )}

      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-rose-500/40 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Create New Challenge</h2>
            <button onClick={() => setIsAdding(false)} className="p-1 rounded-xl bg-gray-800 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Challenge Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Reward Points</label>
              <input
                type="number"
                required
                value={formData.rewardPoints}
                onChange={(e) => setFormData({ ...formData, rewardPoints: Number(e.target.value) })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-semibold">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-md">Save Challenge</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((ch) => (
          <div key={ch._id} className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{ch.icon || '🎯'}</span>
              <button onClick={() => handleDelete(ch._id)} className="p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{ch.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{ch.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
              <span className="text-[#FF7A00] font-bold">+{ch.rewardPoints} Foodie Points</span>
              <span className="text-gray-500 font-mono text-[11px]">{ch.badgeName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
