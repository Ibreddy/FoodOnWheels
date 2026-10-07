'use client';

import React, { useState } from 'react';
import { Video, Plus, Trash2, Eye, Heart, Sparkles, Film, CheckCircle2 } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useOwnerContext } from '../../../context/OwnerContext';
import { VideoReel } from '../../../types';

export default function VendorVideosPage() {
  const { siteContent, addOrUpdateStory, updateStories } = useOwnerContext();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Vendor's videos (from Ramesh Burger Truck - b1)
  const vendorStories = siteContent.stories.filter(
    (s) => s.businessId === 'v1' || s.businessName.includes('Ramesh')
  );

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !foodName) return;

    const newReel: VideoReel = {
      _id: 'r_' + Date.now(),
      businessId: 'v1',
      businessName: 'Ramesh Burger Truck',
      businessType: 'MOBILE_VENDOR',
      title: title,
      foodName: foodName,
      price: Number(price) || 129,
      distanceText: '0.3 km',
      videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-42686-large.mp4',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
      views: 120,
      likes: 18,
      commentsCount: 3,
    };

    addOrUpdateStory(newReel);
    setTitle('');
    setFoodName('');
    setPrice('');
    setVideoUrl('');
    setThumbnailUrl('');
    setShowAdd(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this food reel?')) {
      const updated = siteContent.stories.filter((s) => s._id !== id);
      updateStories(updated);
    }
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>Food Stories & Short Video Reels</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Video className="w-6 h-6 text-purple-400" /> Daily Food Video Reels
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Post behind-the-scenes food preparation reels. Published reels appear live on Customer Home.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showAdd ? 'Close Form' : 'Upload New Food Reel'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-bold shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Reel published live to Customer Home Food Stories!</span>
          </div>
        )}

        {/* Upload Reel Modal / Form */}
        {showAdd && (
          <form onSubmit={handlePublish} className="bg-[#181C23] border border-purple-500/40 p-6 rounded-3xl space-y-4 text-xs shadow-2xl">
            <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-[#2A2F3D] pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" /> Add New Video Reel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Reel Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Sizzling Double Cheese Patty on Flame 🔥"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Featured Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Double Cheese Burger"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Special Price (₹)</label>
                <input
                  type="number"
                  placeholder="129"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Thumbnail Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-xl transition-all text-xs"
            >
              Publish Reel Live to Customer Home
            </button>
          </form>
        )}

        {/* Existing Vendor Reels */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Your Active Video Reels</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {vendorStories.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendorStories.map((reel) => (
              <div key={reel._id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="relative h-48 bg-black">
                  <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black text-purple-400 flex items-center gap-1 border border-purple-500/30">
                    <Video className="w-3 h-3" /> LIVE REEL
                  </div>
                  <button
                    onClick={() => handleDelete(reel._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 transition-colors hover:text-white"
                    title="Delete Reel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-extrabold text-sm text-white line-clamp-2">{reel.title}</h3>
                    <p className="text-gray-400 font-semibold mt-1">Dish: {reel.foodName} • ₹{reel.price}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2A2F3D] text-[11px] text-gray-400 font-extrabold">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-blue-400" /> {reel.views} views</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {reel.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
