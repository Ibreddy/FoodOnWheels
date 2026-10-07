'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Utensils, ArrowRight } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black">Partner With FoodOnWheels</h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Expand your food business reach with live GPS location tracking, table reservations, and 10 km customer delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">For Mobile Vendors & Food Trucks</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Broadcast your live GPS route, notify followers when you arrive at stops, share video reels, and grow your local street food fanbase.
          </p>
          <Link
            href="/vendor/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20"
          >
            <span>Vendor Registration / Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">For Restaurants & Fine Dining</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Accept online orders from customers within 10 km, manage table inventory, run promotions, and offer live table reservations.
          </p>
          <Link
            href="/restaurant/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/20"
          >
            <span>Restaurant Registration / Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
