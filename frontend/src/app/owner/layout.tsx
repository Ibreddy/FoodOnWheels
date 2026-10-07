'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { OwnerProvider } from '@/context/OwnerContext';
import { OwnerGuard } from '@/components/owner/OwnerGuard';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { OwnerHeader } from '@/components/owner/OwnerHeader';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/owner/login';

  return (
    <OwnerProvider>
      <OwnerGuard>
        {isLoginPage ? (
          <div className="min-h-screen bg-[#0F1115] text-white">
            {children}
          </div>
        ) : (
          <div className="flex h-screen bg-[#0F1115] text-white overflow-hidden font-sans">
            <OwnerSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <OwnerHeader />
              <main className="flex-1 overflow-y-auto p-6 bg-[#0F1115]">
                {children}
              </main>
            </div>
          </div>
        )}
      </OwnerGuard>
    </OwnerProvider>
  );
}
