'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-[#FF7A00]" />
        <h1 className="text-3xl font-black">Privacy Policy</h1>
      </div>
      <p className="text-xs text-gray-400">Last updated: October 2026</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
        <p>FoodOnWheels collects basic account information (name, email, phone number) and live location data to show you nearby food trucks and restaurants within your 10 km radius.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. Geolocation Privacy</h2>
        <p>Live GPS location is accessed strictly to measure distance to vendors and display real-time route ETAs. Location data is never sold or shared with third parties.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">3. Data Security</h2>
        <p>We use JWT authentication, encrypted passwords (bcryptjs), and secure SSL connections to protect your account information.</p>
      </div>
    </div>
  );
}
