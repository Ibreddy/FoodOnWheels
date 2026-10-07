'use client';

import React from 'react';
import { Eye } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <Eye className="w-8 h-8 text-[#FF7A00]" />
        <h1 className="text-3xl font-black">Accessibility Commitment</h1>
      </div>
      <p className="text-xs text-gray-400">Inclusive Design & WCAG Compliance</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">1. Screen Readers & Keyboard Navigation</h2>
        <p>FoodOnWheels includes semantic HTML tags, ARIA labels, clear focus outlines, and keyboard shortcuts across all public pages and menus.</p>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white">2. High Contrast Theme Support</h2>
        <p>Our platform supports high-contrast Light and Dark mode options to accommodate visual preferences and low-light environments.</p>
      </div>
    </div>
  );
}
