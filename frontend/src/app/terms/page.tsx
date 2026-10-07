'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-[#FF7A00]" />
        <h1 className="text-3xl font-black">Terms & Conditions</h1>
      </div>
      <p className="text-xs text-gray-400">Last updated: October 2026</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Service Usage</h2>
        <p>FoodOnWheels provides live GPS tracking for food trucks and online ordering/reservations for verified restaurants within a 10 km radius.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. Ordering Policy</h2>
        <p>Online food orders are strictly restricted to verified Restaurants within 10 km. Mobile vendors and food trucks support live GPS tracking and menu browsing only.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">3. Partner Accounts</h2>
        <p>Vendors and restaurants must maintain valid FSSAI food safety licenses and accurate business information.</p>
      </div>
    </div>
  );
}
