'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Business } from '../../types';
import { X, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';

interface ReservationModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ business, isOpen, onClose }) => {
  const [date, setDate] = useState('2026-08-26');
  const [timeSlot, setTimeSlot] = useState('07:30 PM');
  const [guests, setGuests] = useState(4);
  const [seating, setSeating] = useState<'INDOOR' | 'OUTDOOR' | 'ANY'>('INDOOR');
  const [confirmed, setConfirmed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !business) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, business, onClose]);

  if (!isOpen || !business || !isMounted) return null;

  const timeSlots = ['06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99995] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-dark-bg border border-dark-border rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-dark-border pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">Reserve Table</h3>
            <p className="text-xs text-gray-400">{business.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!confirmed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-dark-card border border-dark-border text-xs text-white"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      timeSlot === slot
                        ? 'bg-brand-purple text-white border-brand-purple shadow-glow-purple'
                        : 'bg-dark-card border-dark-border text-gray-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Count */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Number of Guests</label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      guests === num
                        ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange'
                        : 'bg-dark-card border-dark-border text-gray-400'
                    }`}
                  >
                    {num} Guests
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Seating Area</label>
              <div className="grid grid-cols-3 gap-2">
                {(['INDOOR', 'OUTDOOR', 'ANY'] as const).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSeating(area)}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      seating === area ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-dark-card border-dark-border text-gray-400'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-extrabold text-xs shadow-glow-purple hover:scale-[1.02] transition-transform"
            >
              Confirm Reservation Table
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-extrabold text-white">Table Reserved Successfully! 🎉</h4>
            <p className="text-xs text-gray-300">
              Reserved for <span className="font-bold text-white">{guests} guests</span> at <span className="font-bold text-white">{business.name}</span> on <span className="text-amber-400 font-bold">{date}</span> at <span className="text-amber-400 font-bold">{timeSlot}</span> ({seating} Seating).
            </p>
            <div className="bg-dark-card border border-dark-border p-3 rounded-xl text-xs font-mono text-gray-400">
              Reservation ID: RES-IND-7789
            </div>
            <button
              onClick={() => {
                setConfirmed(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-brand-orange text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
