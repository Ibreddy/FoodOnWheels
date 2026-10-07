'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, Users, Share2, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

import { checkOrderEligibility } from '../../utils/distance';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onPlaceOrder }) => {
  const { items, business, updateQuantity, removeFromCart, totalAmount, isGroupOrder, toggleGroupOrder, groupMembers, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH'>('UPI');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  const handleCheckout = () => {
    if (!items.length) return;

    // Final check for order eligibility (Restaurants only & 10 km limit)
    const eligibility = checkOrderEligibility(business, userPos);
    if (!eligibility.canOrder) {
      alert(`⚠️ Cannot Place Order:\n${eligibility.reason}`);
      return;
    }

    const orderData = {
      businessId: business?._id,
      businessName: business?.name,
      items,
      totalAmount,
      paymentMethod,
      isGroupOrder,
      customerLocation: userPos || { lat: 12.9716, lng: 77.607 }
    };
    onPlaceOrder(orderData);
    setOrderPlaced(true);
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Dim Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-dark-bg border-l border-dark-border h-full flex flex-col shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Your Food Basket</h2>
            {items.length > 0 && (
              <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} items
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!orderPlaced ? (
          <>
            {/* Vendor info */}
            {business && (
              <div className="bg-dark-card border border-dark-border p-3.5 rounded-2xl my-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Ordering from</p>
                  <h4 className="text-sm font-bold text-white">{business.name}</h4>
                </div>
                <button
                  onClick={toggleGroupOrder}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isGroupOrder ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{isGroupOrder ? 'Group Order Active' : 'Group Order'}</span>
                </button>
              </div>
            )}

            {/* Group order banner */}
            {isGroupOrder && (
              <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-2xl mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                  <span>Group Link Shared ({groupMembers.length} Members)</span>
                  <button onClick={() => alert('Link copied to clipboard!')} className="flex items-center gap-1 text-[11px] underline">
                    <Share2 className="w-3 h-3" /> Share Link
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {groupMembers.map((m, i) => (
                    <span key={i} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-3xl">
                  🛒
                </div>
                <p className="text-sm font-bold text-white">Your cart is currently empty</p>
                <p className="text-xs text-gray-400">Discover delicious food trucks & restaurants on the map!</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.menuItem._id} className="bg-dark-card border border-dark-border p-3 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.menuItem.image} alt={item.menuItem.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.menuItem.name}</h4>
                        <p className="text-xs font-extrabold text-brand-orange">₹{item.menuItem.price * item.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-dark-bg px-2 py-1 rounded-xl border border-dark-border">
                      <button onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)} className="text-gray-400 hover:text-white p-0.5">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)} className="text-gray-400 hover:text-white p-0.5">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment & Total Footer */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-dark-border space-y-4">
                {/* Payment Option */}
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Select Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'CARD', 'CASH'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          paymentMethod === method
                            ? 'bg-brand-orange/20 text-brand-orange border-brand-orange'
                            : 'bg-dark-card border-dark-border text-gray-400'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform & Taxes</span>
                    <span>₹20</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-dark-border">
                    <span>Total Pay</span>
                    <span className="text-brand-orange">₹{totalAmount + 20}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-extrabold text-sm shadow-glow-orange flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <span>Pay ₹{totalAmount + 20} & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Order Confirmation State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-extrabold text-white">Order Confirmed! 🎉</h3>
            <p className="text-xs text-gray-300">Order #FOW-{Math.floor(100000 + Math.random() * 900000)} sent to {business?.name}.</p>
            <div className="bg-dark-card border border-dark-border p-4 rounded-2xl text-left w-full space-y-1 text-xs">
              <p className="text-gray-400 font-bold">ETA: 12-15 Minutes</p>
              <p className="text-gray-400 font-bold">Pickup OTP: 4829</p>
            </div>
            <button
              onClick={() => {
                setOrderPlaced(false);
                clearCart();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-brand-orange text-white font-bold text-xs"
            >
              Track Order Live
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
