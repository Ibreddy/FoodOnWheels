'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { mockReviews } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantReviewsPage() {
  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Dining Reviews & Ratings
            </h1>
            <p className="text-xs text-gray-400">View customer reviews for food, hygiene & ambience.</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <div key={rev._id} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-2 shadow-md text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white">{rev.customerName}</span>
                <span className="text-amber-400 font-bold">⭐ {rev.rating} / 5</span>
              </div>
              <p className="text-gray-300">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
