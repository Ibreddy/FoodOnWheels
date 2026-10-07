'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 font-sans text-gray-900 dark:text-white">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black">Contact FoodOnWheels Support</h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          We are here to help customers, mobile vendors, and restaurant partners 7 days a week.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a
          href="tel:+917093723363"
          className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-[#FF7A00] transition-colors group"
        >
          <div className="p-3 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase text-gray-400">Customer Support</p>
            <h3 className="text-lg font-bold group-hover:text-[#FF7A00] transition-colors">+91 7093723363</h3>
            <p className="text-xs text-gray-500 mt-1">Tap to call our support hotline</p>
          </div>
        </a>

        <a
          href="mailto:reddyinduri3@gmail.com"
          className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-[#FF7A00] transition-colors group"
        >
          <div className="p-3 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase text-gray-400">Email Inquiry</p>
            <h3 className="text-lg font-bold group-hover:text-[#FF7A00] transition-colors">reddyinduri3@gmail.com</h3>
            <p className="text-xs text-gray-500 mt-1">Tap to send an email</p>
          </div>
        </a>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase text-gray-400">Location</p>
            <h3 className="text-lg font-bold">India</h3>
            <p className="text-xs text-gray-500 mt-1">Serving street food hubs across India</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181C23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase text-gray-400">Support Hours</p>
            <h3 className="text-lg font-bold">Mon–Sun • 9 AM–10 PM</h3>
            <p className="text-xs text-gray-500 mt-1">Live customer support available daily</p>
          </div>
        </div>
      </div>
    </div>
  );
}
