'use client';

import React from 'react';
import { useOwnerContext } from '@/context/OwnerContext';
import { MapPin, Navigation, Clock, Truck, Check } from 'lucide-react';

export default function OwnerRoutesPage() {
  const { siteContent } = useOwnerContext();
  const vendors = siteContent.businesses.filter(b => b.businessType === 'MOBILE_VENDOR' || b.vehicleType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-[#14171F] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>GPS Tracking & Live Stops</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Moving Vendor Routes & Stops
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Monitor and manage live GPS broadcasts, route stops, and arrival times for all active food trucks in transit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="bg-[#14171F] p-5 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={vendor.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-700" />
                <div>
                  <h3 className="font-bold text-white text-sm">{vendor.name}</h3>
                  <p className="text-xs text-cyan-400 font-medium">Heading to {vendor.headingTo || 'Next Stop'}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded-full uppercase">
                {vendor.etaText || 'Live GPS'}
              </span>
            </div>

            <div className="space-y-2 border-t border-gray-800 pt-3 text-xs">
              <p className="text-xs font-semibold text-gray-400">Scheduled Route Stops:</p>
              {vendor.route && vendor.route.length > 0 ? (
                vendor.route.map((stop, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    stop.isCurrent ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-[#0F1115] border-gray-800 text-gray-400'
                  }`}>
                    <span className="font-semibold flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      {stop.stopName}
                    </span>
                    <span className="font-mono text-[11px]">{stop.timeSlot}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs italic">No scheduled stops assigned</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
