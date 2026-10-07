'use client';

import React, { useState } from 'react';
import { Navigation, Play, Pause, MapPin, Radio } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { MapView } from '../../../components/map/MapView';
import { useOwnerContext } from '../../../context/OwnerContext';

export default function VendorLiveLocationPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const { siteContent } = useOwnerContext();
  const vendorData = siteContent.businesses[0];

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-6 h-6 text-emerald-500" /> GPS Live Location Broadcast
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Control real-time location streaming to nearby foodies on the map.</p>
          </div>
          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all ${
              isBroadcasting ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white shadow-glow-emerald'
            }`}
          >
            {isBroadcasting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isBroadcasting ? 'Stop GPS Broadcast' : 'Start Live GPS'}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isBroadcasting ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></div>
              <div>
                <p className="font-extrabold text-gray-900 dark:text-white">Status: {isBroadcasting ? 'BROADCASTING LIVE' : 'OFFLINE'}</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Current Coordinates: 12.9716° N, 77.6070° E (MG Road, Bengaluru)</p>
              </div>
            </div>
            <span className="text-emerald-500 font-extrabold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              GPS Speed: 16 km/h
            </span>
          </div>

          {/* Interactive Satellite Live Map */}
          <div className="h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-inner">
            <MapView
              businesses={vendorData ? [vendorData] : []}
              selectedBusiness={vendorData || null}
              onSelectBusiness={() => {}}
              filterType="ALL"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
