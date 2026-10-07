'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VideoReel, Business } from '../../types';
import { Heart, MessageCircle, Share2, ShoppingBag, MapPin, ExternalLink, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { mockBusinesses, mockMenuItems, mockReviews, mockVideos } from '../../utils/mockData';
import { BottomSheet } from './BottomSheet';

interface VideoReelsProps {
  videos: VideoReel[];
}

export const VideoReels: React.FC<VideoReelsProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(true);
  const [inspectBusiness, setInspectBusiness] = useState<Business | null>(null);
  const { addToCart } = useCart();
  const touchStartY = useRef<number | null>(null);

  const currentVid = videos[currentIndex] || videos[0];
  const targetBusiness = mockBusinesses.find((b) => b._id === currentVid.businessId) || mockBusinesses[0];

  const handleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOrder = () => {
    const item = mockMenuItems.find((m) => m.name === currentVid.foodName) || mockMenuItems[0];
    addToCart(item, targetBusiness);
    alert(`Added ${currentVid.foodName} to cart!`);
  };

  const nextReel = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation (Up/Down Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') nextReel();
      if (e.key === 'ArrowUp') prevReel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  // Touch Swipe Handler (Swipe Up -> Next, Swipe Down -> Prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    if (diffY > 50) {
      // Swiped Up
      nextReel();
    } else if (diffY < -50) {
      // Swiped Down
      prevReel();
    }
    touchStartY.current = null;
  };

  // Mouse Wheel Scroll Handler
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) {
      nextReel();
    } else if (e.deltaY < -30) {
      prevReel();
    }
  };

  return (
    <div className="max-w-md mx-auto h-[82vh] rounded-3xl overflow-hidden bg-black relative border border-dark-border shadow-2xl flex flex-col select-none">
      {/* Swipeable Video Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative flex-1 bg-black overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <video
          key={currentVid._id}
          src={currentVid.videoUrl}
          poster={currentVid.thumbnailUrl}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Top Overlay Badge & Sound Toggle */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-dark-bg/80 backdrop-blur px-3 py-1 rounded-full border border-dark-border flex items-center gap-1.5 text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold">Reels ({currentIndex + 1}/{videos.length})</span>
          </div>

          <button
            onClick={() => setMuted(!muted)}
            className="pointer-events-auto p-2 rounded-full bg-dark-bg/80 backdrop-blur border border-dark-border text-white hover:scale-110 transition-transform"
            title="Toggle Mute"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Vertical Swipe Arrows Floating */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {currentIndex > 0 && (
            <button
              onClick={prevReel}
              className="p-2 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-brand-orange shadow-lg transition-transform hover:scale-110"
              title="Swipe Up for Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {currentIndex < videos.length - 1 && (
            <button
              onClick={nextReel}
              className="p-2 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-brand-orange shadow-lg transition-transform hover:scale-110 animate-bounce"
              title="Swipe Down for Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Social Action Column */}
        <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
          <button
            onClick={() => handleLike(currentVid._id)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className={`p-3 rounded-full bg-dark-bg/60 backdrop-blur border border-dark-border transition-transform group-hover:scale-110 ${liked[currentVid._id] ? 'text-rose-500' : 'text-white'}`}>
              <Heart className={`w-6 h-6 ${liked[currentVid._id] ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-bold">{currentVid.likes + (liked[currentVid._id] ? 1 : 0)}</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white group">
            <div className="p-3 rounded-full bg-dark-bg/60 backdrop-blur border border-dark-border transition-transform group-hover:scale-110">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">{currentVid.commentsCount}</span>
          </button>

          <button
            onClick={() => alert('Reel video link copied to clipboard!')}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className="p-3 rounded-full bg-dark-bg/60 backdrop-blur border border-dark-border transition-transform group-hover:scale-110">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold">Share</span>
          </button>
        </div>

        {/* Bottom Details Overlay & Profile Link */}
        <div className="absolute bottom-4 left-4 right-16 z-20 bg-dark-bg/90 backdrop-blur p-4 rounded-2xl border border-dark-border space-y-2">
          {/* Clickable Profile Badge */}
          <button
            onClick={() => setInspectBusiness(targetBusiness)}
            className="w-full text-left flex items-center justify-between group hover:bg-white/5 p-1 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <img src={targetBusiness.logo || targetBusiness.coverImage} alt={targetBusiness.name} className="w-8 h-8 rounded-full object-cover border border-brand-orange" />
              <div>
                <h3 className="font-extrabold text-xs text-white group-hover:text-brand-orange flex items-center gap-1">
                  {currentVid.businessName} <ExternalLink className="w-3 h-3 text-brand-orange" />
                </h3>
                <span className="text-[10px] text-amber-400 font-bold">⭐ {targetBusiness.rating.average} • {targetBusiness.address}</span>
              </div>
            </div>
          </button>

          <p className="text-xs text-gray-300 line-clamp-1">{currentVid.title}</p>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Featured Dish</p>
              <p className="text-sm font-extrabold text-white">{currentVid.foodName} • <span className="text-brand-orange">₹{currentVid.price}</span></p>
            </div>
            <button
              onClick={handleOrder}
              className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5 hover:scale-105 transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Touch Swipe Hint Footer */}
      <div className="bg-dark-card border-t border-dark-border p-2.5 text-center text-[10px] font-bold text-gray-400 flex items-center justify-between px-4">
        <span>Swipe Up/Down or use ↑ ↓ keys to scroll reels</span>
        <span className="text-brand-orange">Instagram Reels Mode</span>
      </div>

      {/* Inspect Business & Live GPS Map Modal */}
      <BottomSheet
        business={inspectBusiness}
        menuItems={mockMenuItems}
        reviews={mockReviews}
        videos={mockVideos}
        onClose={() => setInspectBusiness(null)}
      />
    </div>
  );
};
