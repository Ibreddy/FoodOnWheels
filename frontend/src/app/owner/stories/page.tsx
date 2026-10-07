'use client';

import React, { useState } from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { VideoReel } from '@/types';
import { Film, Plus, Trash2, Check, X, Heart, Eye } from 'lucide-react';

export default function OwnerStoriesPage() {
  const { siteContent, updateStories } = useOwnerContext();
  const [stories, setStories] = useState<VideoReel[]>(siteContent.stories);
  const [isAdding, setIsAdding] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<VideoReel>>({
    title: 'Flame Sizzling Double Cheeseburger Prep 🔥',
    foodName: 'Double Cheeseburger',
    price: 8.99,
    businessName: 'Ramesh Burger Truck',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-42686-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    likes: 1240,
    views: 4500,
  });

  const handleSaveAll = (updated: VideoReel[]) => {
    setStories(updated);
    updateStories(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newReel: VideoReel = {
      _id: 'r_' + Date.now(),
      businessId: 'b1',
      businessName: formData.businessName || 'Ramesh Burger Truck',
      businessType: 'MOBILE_VENDOR',
      title: formData.title || 'Street Food Reel',
      foodName: formData.foodName || 'Special Food',
      price: Number(formData.price) || 7,
      distanceText: '0.4 km',
      videoUrl: formData.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-42686-large.mp4',
      thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
      views: Number(formData.views) || 500,
      likes: Number(formData.likes) || 120,
      commentsCount: 24,
    };

    const updated = [newReel, ...stories];
    handleSaveAll(updated);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this video story reel?')) {
      const updated = stories.filter(s => s._id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Film className="w-4 h-4" />
            <span>Food Stories & Short Clips</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Video Stories & Reels Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Manage video reels displayed in the "Food Stories" section on the customer home page.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Video Reel</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Video reels updated!</span>
        </div>
      )}

      {isAdding && (
        <div className="bg-[#14171F] p-6 rounded-3xl border border-pink-500/40 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Add New Food Reel</h2>
            <button onClick={() => setIsAdding(false)} className="p-1 rounded-xl bg-gray-800 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateNew} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Reel Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Thumbnail URL</label>
              <input
                type="text"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Video URL</label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 text-white px-3 py-2 rounded-xl"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-pink-600 text-white font-bold rounded-xl shadow-md">Save Reel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((reel) => (
          <div key={reel._id} className="bg-[#14171F] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between">
            <div className="relative h-64 w-full bg-gray-900">
              <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14171F] via-transparent to-transparent" />
              <button onClick={() => handleDelete(reel._id)} className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white shadow-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 space-y-2 text-xs">
              <h3 className="font-bold text-white truncate">{reel.title}</h3>
              <p className="text-[11px] text-gray-400">{reel.businessName}</p>
              <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-gray-800">
                <span className="flex items-center gap-1 text-pink-400 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-pink-400" /> {reel.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {reel.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
