'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated || !user) {
      if (pathname !== '/login') {
        router.replace('/login');
      }
      return;
    }

    const effectiveAllowed = allowedRoles?.includes('CUSTOMER')
      ? ['CUSTOMER', 'MOBILE_VENDOR', 'RESTAURANT']
      : allowedRoles;

    if (effectiveAllowed && effectiveAllowed.length > 0 && !effectiveAllowed.includes(user.role)) {
      const dest = user.role === 'CUSTOMER'
        ? '/customer/home'
        : user.role === 'MOBILE_VENDOR'
        ? '/vendor/dashboard'
        : user.role === 'RESTAURANT'
        ? '/restaurant/dashboard'
        : '/login';

      if (pathname !== dest) {
        router.replace(dest);
      }
    }
  }, [user?.role, isAuthenticated, isLoaded, allowedRoles, router, pathname]);

  if (!isLoaded || !isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] bg-white dark:bg-[#0F1115] flex items-center justify-center p-6 text-center rounded-3xl border border-gray-200 dark:border-[#2A2F3D] my-4 shadow-xl">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-extrabold text-gray-900 dark:text-white">Verifying session permissions...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Redirecting to your authorized workspace portal...</p>
        </div>
      </div>
    );
  }

  const effectiveAllowed = allowedRoles?.includes('CUSTOMER')
    ? ['CUSTOMER', 'MOBILE_VENDOR', 'RESTAURANT']
    : allowedRoles;

  if (effectiveAllowed && effectiveAllowed.length > 0 && !effectiveAllowed.includes(user.role)) {
    return (
      <div className="min-h-[60vh] bg-white dark:bg-[#0F1115] flex items-center justify-center p-6 text-center rounded-3xl border border-gray-200 dark:border-[#2A2F3D] my-4 shadow-xl">
        <div className="bg-gray-50 dark:bg-[#181C23] border border-gray-200 dark:border-[#2A2F3D] p-8 rounded-3xl max-w-sm space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20 font-black text-lg">!</div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Access Restricted</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Your account ({user.role}) does not have permission to view this workspace.</p>
          <button
            onClick={() => router.replace(user.role === 'MOBILE_VENDOR' ? '/vendor/dashboard' : user.role === 'RESTAURANT' ? '/restaurant/dashboard' : '/customer/home')}
            className="w-full py-2.5 rounded-xl bg-[#FF7A00] text-white font-extrabold text-xs shadow-md"
          >
            Return to My Workspace
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
