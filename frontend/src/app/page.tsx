'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RootPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'MOBILE_VENDOR' 
        ? '/vendor/dashboard' 
        : user.role === 'RESTAURANT' 
        ? '/restaurant/dashboard' 
        : '/customer/home';

      if (pathname !== dest) {
        router.replace(dest);
      }
    } else {
      if (pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, user?.role, router, pathname]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-gray-300">Redirecting to your role workspace...</p>
      </div>
    </div>
  );
}
