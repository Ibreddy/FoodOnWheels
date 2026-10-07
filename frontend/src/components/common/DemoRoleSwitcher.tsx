'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { User, Truck, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DemoRoleSwitcher: React.FC = () => {
  const { user, login } = useAuth();
  const router = useRouter();

  const handleSwitch = async (r: UserRole) => {
    const demoEmail = r === 'MOBILE_VENDOR' ? 'vendor@foodonwheels.com' : r === 'RESTAURANT' ? 'restaurant@foodonwheels.com' : 'customer@foodonwheels.com';
    await login(demoEmail, 'pass123', r);
    if (r === 'MOBILE_VENDOR') router.push('/vendor/dashboard');
    else if (r === 'RESTAURANT') router.push('/restaurant/dashboard');
    else router.push('/customer/home');
  };

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'CUSTOMER', label: 'Customer', icon: <User className="w-3.5 h-3.5" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { role: 'MOBILE_VENDOR', label: 'Vendor App', icon: <Truck className="w-3.5 h-3.5" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { role: 'RESTAURANT', label: 'Restaurant App', icon: <Utensils className="w-3.5 h-3.5" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-dark-card/90 backdrop-blur border border-dark-border rounded-full shadow-lg">
      <span className="text-[10px] font-semibold text-gray-400 px-2 uppercase tracking-wider hidden sm:inline">Account:</span>
      {roles.map((r) => {
        const isActive = user?.role === r.role;
        return (
          <button
            key={r.role}
            onClick={() => handleSwitch(r.role)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isActive
                ? `${r.color} border shadow-sm font-semibold scale-105`
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
