'use client';

import React, { useState } from 'react';
import { useOwnerContext, HomepageSectionConfig } from '@/context/OwnerContext';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  Layers,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function OwnerHomepageManagerPage() {
  const { siteContent, updateHomepageSections } = useOwnerContext();
  const [sections, setSections] = useState<HomepageSectionConfig[]>(siteContent.homepageSections);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleToggle = (id: string) => {
    setSections(prev =>
      prev.map(sec => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newArr = [...sections];
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
    // Re-index order property
    const reordered = newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newArr = [...sections];
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
    // Re-index order property
    const reordered = newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(reordered);
  };

  const handleTextChange = (id: string, field: 'title' | 'subtitle' | 'limit', value: string | number) => {
    setSections(prev =>
      prev.map(sec => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleSave = () => {
    updateHomepageSections(sections);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setSections(siteContent.homepageSections);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FF7A00] font-semibold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Customer Discovery Flow</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Homepage Section Manager
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Reorder the 14 discovery sections, turn sections ON/OFF, customize titles, and control item limits. Your changes immediately update the customer homepage!
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 border border-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Unsaved</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#E65100] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all flex items-center space-x-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Sync Site</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Control Table & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Section List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              All 14 Homepage Discovery Sections
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              {sections.filter(s => s.enabled).length} Enabled / {sections.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 rounded-2xl border transition-all ${
                  section.enabled
                    ? 'bg-[#14171F] border-gray-800'
                    : 'bg-[#14171F]/40 border-gray-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Reorder controls & Index */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="w-7 h-7 rounded-xl bg-gray-800 text-gray-400 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>

                    <div className="flex flex-col space-y-0.5">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 transition-all"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 transition-all"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle: Section Name & Controls */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm tracking-tight truncate">
                        {section.name}
                      </span>
                      {section.enabled ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-800 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                          DISABLED
                        </span>
                      )}
                    </div>

                    {/* Title & Subtitle inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleTextChange(section.id, 'title', e.target.value)}
                        placeholder="Section Title"
                        className="bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-white px-3 py-1.5 rounded-xl outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={section.subtitle}
                        onChange={(e) => handleTextChange(section.id, 'subtitle', e.target.value)}
                        placeholder="Section Subtitle"
                        className="bg-[#0F1115] border border-gray-800 focus:border-[#FF7A00] text-gray-400 px-3 py-1.5 rounded-xl outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Right: Limit & Toggle switch */}
                  <div className="flex items-center space-x-3 shrink-0">
                    {section.id !== 'hero' && section.id !== 'footer' && section.id !== 'foodie_passport' && section.id !== 'todays_challenge' && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[11px] text-gray-500 hidden sm:inline">Limit:</span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={section.limit}
                          onChange={(e) => handleTextChange(section.id, 'limit', parseInt(e.target.value) || 4)}
                          className="w-12 bg-[#0F1115] border border-gray-800 text-center text-white font-bold text-xs py-1.5 rounded-xl outline-none"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => handleToggle(section.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        section.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {section.enabled ? (
                        <>
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span className="hidden sm:inline">ON</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-400" />
                          <span className="hidden sm:inline">OFF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Layout Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14171F] p-5 rounded-3xl border border-gray-800 sticky top-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                <span>Live Homepage Stack</span>
              </h2>

              <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    previewDevice === 'desktop' ? 'bg-[#FF7A00] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    previewDevice === 'mobile' ? 'bg-[#FF7A00] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Below is the exact sequence customers will see on the home page:
            </p>

            <div className={`space-y-2 max-h-[600px] overflow-y-auto p-2 bg-[#0F1115] rounded-2xl border border-gray-800 ${
              previewDevice === 'mobile' ? 'max-w-xs mx-auto border-2 border-gray-700 rounded-[32px] p-4' : ''
            }`}>
              {sections
                .filter(s => s.enabled)
                .map((sec, i) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-[#14171F] rounded-xl border border-gray-800 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-5 h-5 rounded-lg bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{sec.title}</p>
                        <p className="text-[10px] text-gray-500 truncate">{sec.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono shrink-0">
                      ON
                    </span>
                  </div>
                ))}

              {sections.filter(s => s.enabled).length === 0 && (
                <div className="p-6 text-center text-gray-500 text-xs">
                  All sections are currently disabled. Turn at least one section ON.
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#FF7A00] hover:bg-[#E65100] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#FF7A00]/25 transition-all"
            >
              Apply Sequence to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
