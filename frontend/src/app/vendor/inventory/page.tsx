'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { mockMenuItems } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function VendorInventoryPage() {
  const [items, setItems] = useState(mockMenuItems);

  const updateStock = (id: string, delta: number) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i)));
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-orange" /> Real-time Inventory & Stock
            </h1>
            <p className="text-xs text-gray-400">Update stock counts, trigger low stock alerts, and mark sold-out items.</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="bg-dark-card border border-dark-border p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-extrabold text-white">{item.name}</h4>
                  <p className="text-brand-orange font-bold">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-lg">
                  {item.stock} in stock
                </span>
                <button onClick={() => updateStock(item._id, -1)} className="px-3 py-1 bg-dark-bg border border-dark-border text-white font-bold rounded-lg">-1</button>
                <button onClick={() => updateStock(item._id, 5)} className="px-3 py-1 bg-dark-bg border border-dark-border text-white font-bold rounded-lg">+5</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
