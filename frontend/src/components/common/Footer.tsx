'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isRestaurant = user?.role === 'RESTAURANT';
  const isVendor = user?.role === 'MOBILE_VENDOR';

  const businessDashboardHref = isRestaurant ? '/restaurant/dashboard' : isVendor ? '/vendor/dashboard' : '/vendor/login';
  const manageMenuHref = isRestaurant ? '/restaurant/menu' : isVendor ? '/vendor/menu' : '/vendor/login';
  const manageSpecialsHref = isRestaurant ? '/restaurant/promotions' : isVendor ? '/vendor/promotions' : '/vendor/login';
  const manageOrdersHref = isRestaurant ? '/restaurant/orders' : isVendor ? '/vendor/orders' : '/vendor/login';
  const managePromotionsHref = isRestaurant ? '/restaurant/promotions' : isVendor ? '/vendor/promotions' : '/vendor/login';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await api.post('/newsletter/subscribe', { email: email.trim() });
      if (response.data && response.data.success) {
        setStatus('success');
        setMessage(response.data.message || '🎉 Welcome to the FoodOnWheels food loop!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(response.data?.message || 'Subscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Newsletter subscribe error:', err);
      const errMsg = err.response?.data?.message || 'Unable to subscribe right now. Please try again later.';
      setStatus('error');
      setMessage(errMsg);
    }
  };

  return (
    <footer
      aria-label="Site Footer"
      className="bg-[#F8FAFC] dark:bg-[#0F1115] text-[#0F172A] dark:text-[#F8FAFC] border-t border-gray-200 dark:border-[#2A3341] font-sans transition-colors duration-200"
    >
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group no-underline">
              <img
                src="/logo.png"
                alt="FoodOnWheels Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-black text-2xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  FoodOn<span className="text-[#FF7A00]">Wheels</span>
                </span>
                <p className="text-[10px] font-bold text-gray-500 dark:text-[#94A3B8] tracking-wider uppercase m-0">
                  Discover food. Follow the journey.
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#94A3B8] leading-relaxed max-w-sm m-0">
              Find nearby food trucks, restaurants, today's specials, live locations, exclusive deals, and food stories — all in one place.
            </p>

            {/* Social Media Links */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-[#94A3B8] m-0">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow FoodOnWheels on Instagram"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A3341] flex items-center justify-center text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all duration-200 no-underline"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow FoodOnWheels on Facebook"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A3341] flex items-center justify-center text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all duration-200 no-underline"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to FoodOnWheels on YouTube"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A3341] flex items-center justify-center text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all duration-200 no-underline"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow FoodOnWheels on X"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A3341] flex items-center justify-center text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all duration-200 no-underline"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with FoodOnWheels on LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#181C23] border border-gray-200 dark:border-[#2A3341] flex items-center justify-center text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 transition-all duration-200 no-underline"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Explore (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] m-0">
              Explore
            </h3>
            <nav aria-label="Explore Navigation">
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs text-gray-600 dark:text-[#94A3B8]">
                <li>
                  <Link href="/customer/explore" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Explore Food
                  </Link>
                </li>
                <li>
                  <Link href="/customer/map" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Live Map
                  </Link>
                </li>
                <li>
                  <Link href="/customer/todays-special" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Today's Special
                  </Link>
                </li>
                <li>
                  <Link href="/customer/vendors" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Food Trucks
                  </Link>
                </li>
                <li>
                  <Link href="/customer/restaurants" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Restaurants & Cafes
                  </Link>
                </li>
                <li>
                  <Link href="/customer/reels" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Food Stories
                  </Link>
                </li>
                <li>
                  <Link href="/customer/explore?filter=deals" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Deals Near You
                  </Link>
                </li>
                <li>
                  <Link href="/customer/map" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Food Along Your Route
                  </Link>
                </li>
                <li>
                  <Link href="/customer/vendors" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Coming Today
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: For Businesses (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] m-0">
              For Businesses
            </h3>
            <nav aria-label="Businesses Navigation">
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs text-gray-600 dark:text-[#94A3B8]">
                <li>
                  <Link href="/login" className="no-underline font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Join FoodOnWheels
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/login" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Become a Food Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/restaurant/login" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Register Restaurant
                  </Link>
                </li>
                <li>
                  <Link href={businessDashboardHref} className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Business Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={manageMenuHref} className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Manage Menu
                  </Link>
                </li>
                <li>
                  <Link href={manageSpecialsHref} className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Manage Specials
                  </Link>
                </li>
                <li>
                  <Link href={manageOrdersHref} className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Manage Orders
                  </Link>
                </li>
                <li>
                  <Link href={managePromotionsHref} className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Manage Promotions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Business Support
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 4: Company (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] m-0">
              Company
            </h3>
            <nav aria-label="Company Navigation">
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs text-gray-600 dark:text-[#94A3B8]">
                <li>
                  <Link href="/" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    About FoodOnWheels
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/customer/community" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/customer/reels" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Blog / Food Stories
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="no-underline text-gray-600 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                    Partner With Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 5: Newsletter Section (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5 m-0">
                <span>Stay in the food loop</span> 🍔
              </h3>
              <p className="text-xs text-gray-600 dark:text-[#94A3B8] leading-relaxed m-0">
                Get nearby food discoveries, exclusive deals, new vendor arrivals, and updates straight to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2.5" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email Address for Newsletter
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="Enter your email"
                  disabled={status === 'loading'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181C23] border border-gray-300 dark:border-[#2A3341] text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] disabled:opacity-50 transition-all"
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#FF9D3D] text-white font-extrabold text-xs shadow-md shadow-[#FF7A00]/20 flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Status Notifications */}
              {status === 'success' && (
                <div className="p-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Dedicated Contact Information Bar */}
      <div className="border-t border-gray-200 dark:border-[#2A3341] bg-white dark:bg-[#181C23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            {/* Customer Support */}
            <a
              href="tel:+917093723363"
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F1115]/60 border border-gray-200 dark:border-[#2A3341] hover:border-[#FF7A00] transition-colors group no-underline"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wider m-0">
                  📞 Customer Support
                </p>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#FF7A00] transition-colors truncate m-0">
                  +91 7093723363
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:reddyinduri3@gmail.com"
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F1115]/60 border border-gray-200 dark:border-[#2A3341] hover:border-[#FF7A00] transition-colors group no-underline"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wider m-0">
                  ✉️ Email
                </p>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#FF7A00] transition-colors truncate m-0">
                  reddyinduri3@gmail.com
                </p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F1115]/60 border border-gray-200 dark:border-[#2A3341]">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wider m-0">
                  📍 Location
                </p>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate m-0">
                  India
                </p>
              </div>
            </div>

            {/* Support Hours */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F1115]/60 border border-gray-200 dark:border-[#2A3341]">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 dark:text-[#94A3B8] uppercase tracking-wider m-0">
                  🕐 Support Hours
                </p>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate m-0">
                  Mon–Sun • 9 AM–10 PM
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Legal & Copyright Bottom Row */}
      <div className="border-t border-gray-200 dark:border-[#2A3341] bg-[#F8FAFC] dark:bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-[#94A3B8]">
          <p className="text-center sm:text-left m-0">
            © 2026 FoodOnWheels. All Rights Reserved.
          </p>

          <nav aria-label="Legal Navigation">
            <ul className="list-none p-0 m-0 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
              <li>
                <Link href="/privacy" className="no-underline text-gray-500 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="no-underline text-gray-500 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="no-underline text-gray-500 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/safety" className="no-underline text-gray-500 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="no-underline text-gray-500 dark:text-[#94A3B8] hover:text-[#FF7A00] dark:hover:text-[#FF7A00] transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
