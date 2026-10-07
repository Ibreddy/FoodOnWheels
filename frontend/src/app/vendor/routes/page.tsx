'use client';

import React, { useState } from 'react';
import { Map, MapPin, Clock, Plus, Edit2, Check } from 'lucide-react';
import { useOwnerContext } from '@/context/OwnerContext';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function VendorRoutesPage() {
  const { siteContent, updateBusinessData } = useOwnerContext();
  const vendorBusiness = siteContent.businesses[0];
  const [showAdd, setShowAdd] = useState(false);
  const [stopName, setStopName] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const routeStops = vendorBusiness?.route || [
    { stopName: 'MG Road Metro Station', timeSlot: '11:00 AM - 02:00 PM', isCurrent: true, lat: 12.9716, lng: 77.5946 },
    { stopName: 'Indiranagar 100ft Road', timeSlot: '04:00 PM - 07:00 PM', isCurrent: false, lat: 12.9784, lng: 77.6408 },
    { stopName: 'Koramangala 5th Block', timeSlot: '08:00 PM - 11:30 PM', isCurrent: false, lat: 12.9352, lng: 77.6245 }
  ];

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stopName || !timeSlot) return;
    const newStop = {
      stopName,
      timeSlot,
      isCurrent: false,
      lat: 12.9716,
      lng: 77.5946
    };
    const updatedRoute = [...routeStops, newStop];
    updateBusinessData(vendorBusiness._id, { route: updatedRoute });
    setStopName('');
    setTimeSlot('');
    setShowAdd(false);
  };

  const setAsCurrentStop = (index: number) => {
    const updatedRoute = routeStops.map((stop, idx) => ({
      ...stop,
      isCurrent: idx === index
    }));
    updateBusinessData(vendorBusiness._id, {
      route: updatedRoute,
      address: updatedRoute[index].stopName + ', Bengaluru'
    });
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Map className="w-6 h-6 text-blue-400" /> Daily Route & Schedule Manager
            </h1>
            <p className="text-xs text-gray-400">
              Updates your food truck schedule on Customer Home "Coming Today" and Vendor Details in real time.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-glow-blue flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Route Stop
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddStop} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 text-xs shadow-xl">
            <h3 className="font-extrabold text-white text-sm">Add New Route Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Stop Location (e.g. HSR Layout Sector 1)"
                value={stopName}
                onChange={(e) => setStopName(e.target.value)}
                className="p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Time Slot (e.g. 6:00 PM - 9:00 PM)"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-extrabold rounded-xl">
              ✓ Save Route Schedule
            </button>
          </form>
        )}

        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl space-y-4 shadow-xl">
          {routeStops.map((stop, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-2xl gap-3">
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${stop.isCurrent ? 'text-brand-orange animate-bounce' : 'text-gray-400'}`} />
                <div>
                  <h4 className="font-extrabold text-sm text-white">{stop.stopName}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {stop.timeSlot}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {stop.isCurrent ? (
                  <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-xs font-extrabold rounded-full">
                    CURRENT LIVE STOP
                  </span>
                ) : (
                  <button
                    onClick={() => setAsCurrentStop(i)}
                    className="px-3 py-1 bg-dark-card hover:bg-gray-800 text-gray-300 text-xs font-bold rounded-full border border-dark-border"
                  >
                    Set Active
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
