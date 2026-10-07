'use client';

import React from 'react';
import { Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <Cookie className="w-8 h-8 text-[#FF7A00]" />
        <h1 className="text-3xl font-black">Cookie Policy</h1>
      </div>
      <p className="text-xs text-gray-400">Last updated: October 2026</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Use of Cookies & Local Storage</h2>
        <p>FoodOnWheels uses local storage and cookies to remember authentication tokens, theme preferences (Light/Dark), and active food cart items across sessions.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. Essential Cookies</h2>
        <p>Essential session tokens (`fow_token`) allow safe sign-in to your FoodOnWheels customer, vendor, or restaurant portal.</p>
      </div>
    </div>
  );
}
