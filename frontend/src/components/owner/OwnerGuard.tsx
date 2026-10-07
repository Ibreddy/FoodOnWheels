'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOwnerContext } from '@/context/OwnerContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const OwnerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOwnerAuthenticated } = useOwnerContext();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isLoginPage = pathname === '/owner/login';
    const isOwnerRoute = pathname.startsWith('/owner');

    if (isOwnerRoute && !isLoginPage && !isOwnerAuthenticated) {
      router.replace('/owner/login');
    }
  }, [pathname, isOwnerAuthenticated, mounted, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F1115] text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#FF7A00] animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Verifying Owner Session...</p>
      </div>
    );
  }

  const isLoginPage = pathname === '/owner/login';
  const isOwnerRoute = pathname.startsWith('/owner');

  if (isOwnerRoute && !isLoginPage && !isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F1115] text-white flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Owner Access Required</h2>
        <p className="text-gray-400 text-sm max-w-md">
          This portal is reserved strictly for the FoodOnWheels project owner. Redirecting to secret login...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
