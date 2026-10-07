'use client';

import React, { useState } from 'react';
import { useOwnerContext, ThemeSettings } from '@/context/OwnerContext';
import { Sliders, Save, RotateCcw, Check, Palette, Key, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

const COLOR_OPTIONS = [
  { name: 'Classic Orange', hex: '#FF7A00' },
  { name: 'Deep Amber', hex: '#E65100' },
  { name: 'Emerald Mint', hex: '#10B981' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Neon Pink', hex: '#EC4899' },
];

export default function OwnerSettingsPage() {
  const { siteContent, updateThemeSettings, resetAllToDefault, ownerLogout } = useOwnerContext();
  const [theme, setTheme] = useState<ThemeSettings>(siteContent.themeSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeSettings(theme);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FF7A00] font-semibold text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Theme & Branding Controls</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Owner Control Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Customize branding text, accent colors, default navigation sidebar behavior, and manage credentials.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Theme and site settings saved & published!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding Options */}
        <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <span>Website Branding & Tagline</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Platform Title</label>
              <input
                type="text"
                required
                value={theme.brandName}
                onChange={(e) => setTheme({ ...theme, brandName: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-white px-3 py-2.5 rounded-xl outline-none font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Hero Subtitle / Tagline</label>
              <input
                type="text"
                required
                value={theme.brandTagline}
                onChange={(e) => setTheme({ ...theme, brandTagline: e.target.value })}
                className="w-full bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-white px-3 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#FF7A00]" />
            <span>Primary Brand Accent Color</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setTheme({ ...theme, primaryColor: c.hex })}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  theme.primaryColor === c.hex
                    ? 'bg-gray-800 text-white border-white shadow-lg'
                    : 'bg-[#0F1115] text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Preference */}
        <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF7A00]" />
            <span>Default Navigation Behavior</span>
          </h2>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Permanent Navigation Sidebar</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Keep sidebar open by default across customer and role pages</p>
            </div>
            <button
              type="button"
              onClick={() => setTheme({ ...theme, defaultSidebarOpen: !theme.defaultSidebarOpen })}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                theme.defaultSidebarOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {theme.defaultSidebarOpen ? 'ALWAYS OPEN' : 'AUTO COLLAPSE'}
            </button>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all content and section overrides back to default?')) {
                resetAllToDefault();
                alert('All owner data overrides reset to initial default values.');
              }
            }}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Site Data to Default</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#FF7A00] hover:bg-[#E65100] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Theme Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
