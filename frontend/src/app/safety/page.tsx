'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-black">Food Safety & Quality</h1>
      </div>
      <p className="text-xs text-gray-400">FSSAI Certified Partners & Standards</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Verified FSSAI Licensing</h2>
        <p>All mobile food trucks and restaurants registered on FoodOnWheels display verified FSSAI licenses to ensure food hygiene and safety compliance.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. Live Hygiene Ratings</h2>
        <p>Customer reviews and hygiene badges are updated continuously to promote safe, clean food prep practices across street food hubs and restaurant kitchens.</p>
      </div>
    </div>
  );
}
