'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { CartDrawer } from '../customer/CartDrawer';
import { Footer } from './Footer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const autoHide = localStorage.getItem('fow_auto_hide_sidebar') === 'true';
      if (!autoHide) return; // Do not auto-close sidebar on scroll unless explicitly enabled in Settings

      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsSidebarOpen(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If on login route or owner route, render standalone page layout
  if (pathname?.includes('/login') || pathname?.startsWith('/owner')) {
    return <>{children}</>;
  }

  // Hide public footer on operational vendor & restaurant management dashboards
  const isDashboardRoute =
    pathname?.startsWith('/vendor/') ||
    pathname?.startsWith('/restaurant/') ||
    pathname?.startsWith('/owner');

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white">
      <Navbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className={`flex-1 p-4 sm:p-6 pb-20 md:pb-6 overflow-x-hidden transition-all duration-300 ${
            !isSidebarOpen ? 'w-full max-w-full' : ''
          }`}>
            {children}
          </main>

          {!isDashboardRoute && <Footer />}
        </div>
      </div>

      <BottomNav />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onPlaceOrder={(data) => console.log('Order Placed:', data)}
      />
    </div>
  );
};
