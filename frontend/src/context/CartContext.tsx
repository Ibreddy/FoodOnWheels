'use client';

import React, { createContext, useContext, useState } from 'react';
import { MenuItem, Business } from '../types';
import { checkOrderEligibility } from '../utils/distance';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: {
    extraOptions: string[];
    spiceLevel?: string;
    specialInstructions?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  business: Business | null;
  addToCart: (item: MenuItem, bus: Business, customization?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: number;
  isGroupOrder: boolean;
  groupMembers: string[];
  toggleGroupOrder: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isGroupOrder, setIsGroupOrder] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<string[]>(['You (Rahul)', 'Priya', 'Karthik']);

  const addToCart = (menuItem: MenuItem, bus: Business, customization?: any) => {
    // Restrict ordering: Restaurants only & 10 km limit
    const eligibility = checkOrderEligibility(bus);
    if (!eligibility.canOrder) {
      alert(`⚠️ Order Restriction:\n${eligibility.reason}`);
      return;
    }

    if (business && business._id !== bus._id) {
      if (!confirm(`Your cart contains items from ${business.name}. Clear cart and add from ${bus.name}?`)) {
        return;
      }
      setItems([]);
    }
    setBusiness(bus);

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItem._id === menuItem._id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { menuItem, quantity: 1, customization }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem._id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem._id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setBusiness(null);
  };

  const toggleGroupOrder = () => {
    setIsGroupOrder((prev) => !prev);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        business,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        isGroupOrder,
        groupMembers,
        toggleGroupOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
