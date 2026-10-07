'use client';

import React from 'react';
import { MapPin, Search, ShoppingBag, Utensils, Star, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black">How FoodOnWheels Works</h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Whether you are hunting for street food trucks or booking a table at a local restaurant, we make discovering food simple and fun.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3 relative">
          <span className="text-3xl font-black text-[#FF7A00]">01</span>
          <h3 className="text-base font-bold">Discover & Track</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Open the live GPS map to locate nearby food trucks on their routes or browse verified restaurants within 10 km.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3 relative">
          <span className="text-3xl font-black text-[#FF7A00]">02</span>
          <h3 className="text-base font-bold">Order or Reserve</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Order online from restaurants within 10 km or reserve a dining table with live seat selection.
          </p>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-3 relative">
          <span className="text-3xl font-black text-[#FF7A00]">03</span>
          <h3 className="text-base font-bold">Enjoy & Earn Rewards</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Pickup your meal or enjoy dine-in while earning Foodie Passport points and unlocking badges.
          </p>
        </div>
      </div>
    </div>
  );
}
