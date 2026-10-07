'use client';

import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-[#FF7A00]" />
        <h1 className="text-3xl font-black">Careers at FoodOnWheels</h1>
      </div>
      <p className="text-xs text-gray-400">Join our team building India's premier food discovery network</p>

      <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">Shape the Future of Street Food & Dining</h2>
        <p>We are constantly seeking talented developers, product designers, growth marketers, and food community managers to innovate on GPS food tracking and restaurant tech.</p>

        <div className="pt-2">
          <a
            href="mailto:reddyinduri3@gmail.com?subject=Career%20Inquiry%20at%20FoodOnWheels"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] text-white font-bold text-xs shadow-md shadow-[#FF7A00]/20"
          >
            <span>Send Resume & Portfolio</span>
          </a>
        </div>
      </div>
    </div>
  );
}
