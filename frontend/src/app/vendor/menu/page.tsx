'use client';

import React, { useState } from 'react';
import { ListOrdered, Plus, Edit2, Check, Trash2, Sparkles } from 'lucide-react';
import { useOwnerContext } from '@/context/OwnerContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TodaysSpecialManager } from '@/components/common/TodaysSpecialManager';

export default function VendorMenuPage() {
  const { siteContent, addMenuItem, updateMenuItem, deleteMenuItem, setTodaysSpecial } = useOwnerContext();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Burgers');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  // Filter vendor's items (businessId: 'v1' or 'v2')
  const vendorBusinessId = 'v1';
  const vendorBusiness = siteContent.businesses.find((b) => b._id === vendorBusinessId) || siteContent.businesses[0];
  const menuItems = siteContent.menuItems.filter((i) => i.businessId === vendorBusinessId || !i.businessId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const newItem = {
      _id: 'm_' + Date.now(),
      businessId: vendorBusinessId,
      name,
      description: 'Fresh vendor signature creation.',
      price: Number(price),
      category: category || 'Burgers',
      isVeg: true,
      spiceLevel: 'MEDIUM' as const,
      rating: 4.9,
      image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
      stock: 30,
      isBestseller: true,
    };
    addMenuItem(newItem);
    setName('');
    setPrice('');
    setImage('');
    setShowAdd(false);
  };

  const handleSavePrice = (id: string) => {
    if (!editPrice || isNaN(Number(editPrice))) return;
    updateMenuItem(id, { price: Number(editPrice) });
    setEditingId(null);
  };

  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Dedicated Today's Special Manager for Vendor */}
        <TodaysSpecialManager
          businessId={vendorBusinessId}
          businessName={vendorBusiness?.name || 'Ramesh Burger Truck'}
          businessType="MOBILE_VENDOR"
          allowedRole="MOBILE_VENDOR"
        />

        {/* Regular Menu Management */}
        <div className="space-y-4 pt-4 border-t border-dark-border">
          <div className="bg-dark-card border border-dark-border p-6 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-brand-orange" /> Complete Food Menu & Pricing
              </h2>
              <p className="text-xs text-gray-400">
                Update regular menu prices, stock levels & add new dishes.
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-extrabold text-xs rounded-xl shadow-glow-orange flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add Food Item
            </button>
          </div>

          {showAdd && (
            <form onSubmit={handleAdd} className="bg-dark-card border border-dark-border p-5 rounded-3xl space-y-3 text-xs shadow-xl animate-fade-in">
              <h3 className="font-extrabold text-white text-sm">Add New Food Dish</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Dish Name (e.g. Double Cheese Burger)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-brand-orange focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-brand-orange focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Image URL (Optional)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="p-2.5 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors">
                ✓ Save to Live Customer Menu
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-dark-card border border-dark-border p-4 rounded-3xl space-y-3 shadow-md hover:border-brand-orange/40 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover border border-dark-border" />
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{item.name}</h4>
                      {editingId === item._id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-20 px-2 py-0.5 bg-dark-bg border border-brand-orange text-xs text-white rounded"
                          />
                          <button onClick={() => handleSavePrice(item._id)} className="p-1 bg-emerald-500 text-white rounded">
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-brand-orange">₹{item.price}</span>
                          <button
                            onClick={() => {
                              setEditingId(item._id);
                              setEditPrice(String(item.price));
                            }}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Edit Price
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => deleteMenuItem(item._id)} className="text-gray-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-dark-border text-[11px] gap-2">
                  <span className="text-gray-400 font-semibold">{item.category}</span>
                  <button
                    onClick={() => updateMenuItem(item._id, { stock: item.stock === 0 ? 30 : 0 })}
                    className={`px-2.5 py-1 rounded-full font-bold transition-colors ${
                      item.stock === 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.stock === 0 ? '🔴 Sold Out' : `🟢 Stock: ${item.stock}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
