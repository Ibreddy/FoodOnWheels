'use client';

import React from 'react';
import { Users, Heart, MessageSquare, Share2 } from 'lucide-react';
import { mockReviews } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerCommunityPage() {
  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-orange" /> Foodie Community Feed
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">See what food lovers are sharing around your city in real time.</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <div key={rev._id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-5 rounded-3xl space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <img src={rev.customerAvatar} alt={rev.customerName} className="w-10 h-10 rounded-full object-cover border border-brand-orange" />
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">{rev.customerName}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Reviewed Ramesh Burger Truck • ⭐ {rev.rating}</p>
                </div>
              </div>

              <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-semibold">{rev.comment}</p>

              {rev.media && rev.media.length > 0 && (
                <img src={rev.media[0]} alt="Food review" className="w-full h-48 rounded-2xl object-cover" />
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-dark-border">
                <button className="flex items-center gap-1 hover:text-rose-500 font-bold">
                  <Heart className="w-4 h-4" /> {rev.likes} Likes
                </button>
                <button className="flex items-center gap-1 hover:text-brand-orange font-bold">
                  <MessageSquare className="w-4 h-4" /> Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
