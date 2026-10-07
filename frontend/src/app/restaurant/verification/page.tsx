'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText, Award, Download, AlertCircle, Sparkles } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantVerificationPage() {
  const [fssaiNo, setFssaiNo] = useState('11223344000998');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('TL-BLR-2025-9941');
  const [gstNo, setGstNo] = useState('29ABCDE1234F1Z5');
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Business Credentials</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Restaurant License & FSSAI Verification
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Official FSSAI food safety license, municipal trade license & health verification status.
            </p>
          </div>

          <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-lg shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>VERIFIED RESTAURANT ✓</span>
          </span>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-bold shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>License details submitted for re-verification audit!</span>
          </div>
        )}

        {/* Verification Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#181C23] border border-emerald-500/30 p-5 rounded-3xl space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">FSSAI Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-lg font-black text-white">Active & Approved</p>
            <p className="text-[11px] text-gray-400 font-mono">Lic: {fssaiNo}</p>
          </div>

          <div className="bg-[#181C23] border border-emerald-500/30 p-5 rounded-3xl space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Hygiene Rating</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-lg font-black text-amber-400">5 / 5 Star Gold Standard</p>
            <p className="text-[11px] text-gray-400 font-semibold">Inspected Aug 2025</p>
          </div>

          <div className="bg-[#181C23] border border-emerald-500/30 p-5 rounded-3xl space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">GST & Trade Lic</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-lg font-black text-white">Verified</p>
            <p className="text-[11px] text-gray-400 font-mono">GSTIN: {gstNo}</p>
          </div>
        </div>

        {/* Detailed License Information Card */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl space-y-6 shadow-xl text-xs">
          <div className="flex items-center justify-between border-b border-[#2A2F3D] pb-4">
            <div>
              <h2 className="text-lg font-black text-white">FSSAI & Regulatory Licenses</h2>
              <p className="text-gray-400 text-xs">Official documentation verified by Food Safety Authorities.</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-extrabold text-xs rounded-xl transition-all"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Credentials'}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#0F1115] rounded-2xl border border-[#2A2F3D] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2F3D]/60 pb-2">
                  <span className="text-gray-400 font-bold">FSSAI License Number:</span>
                  <span className="font-mono text-white font-black text-sm">{fssaiNo}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2F3D]/60 pb-2">
                  <span className="text-gray-400 font-bold">Municipal Trade License:</span>
                  <span className="font-mono text-white font-black">{tradeLicenseNo}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2F3D]/60 pb-2">
                  <span className="text-gray-400 font-bold">GSTIN Registration:</span>
                  <span className="font-mono text-white font-black">{gstNo}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-gray-400 font-bold">License Expiry Date:</span>
                  <span className="text-emerald-400 font-bold">Valid through 31 Dec 2028</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Downloading official FSSAI verification certificate PDF for ${fssaiNo}...`)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" /> Download FSSAI Certificate (PDF)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">FSSAI License Number</label>
                  <input
                    type="text"
                    value={fssaiNo}
                    onChange={(e) => setFssaiNo(e.target.value)}
                    className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">Trade License Number</label>
                  <input
                    type="text"
                    value={tradeLicenseNo}
                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                    className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-400 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-xl transition-all"
              >
                Submit Updated Credentials for Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
