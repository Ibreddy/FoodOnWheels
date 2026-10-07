'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Utensils, Compass, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 font-sans text-gray-900 dark:text-white">
      {/* Hero Header */}
      <section className="relative rounded-3xl bg-canva-vignette border border-[#800020]/40 p-8 sm:p-12 overflow-hidden shadow-canva-red text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800020]/40 border border-[#FFB800]/50 text-[#FFB800] text-xs font-black shadow-canva-gold">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>ABOUT FOODONWHEELS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Discover Food. <span className="text-canva-gold-gradient">Follow The Journey.</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
          FoodOnWheels bridges foodies with local gourmet food trucks, vibrant tea carts, and fine-dining restaurants through real-time GPS tracking, table reservations, and food stories.
        </p>
      </section>

      {/* Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Live GPS Food Trucks</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Track moving gourmet trucks, coffee vans, and street food stops live on an interactive satellite map with real-time ETA updates.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">10 km Restaurant Dining</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Order online or reserve tables at top verified restaurants within a 10 km radius for fresh, timely culinary experiences.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Culinary Community</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Share food reels, rate dishes, complete weekly foodie challenges, and collect Foodie Passport rewards across India.
          </p>
        </div>
      </div>
    </div>
  );
}
