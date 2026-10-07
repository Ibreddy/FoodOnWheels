'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Mail, Lock, User as UserIcon, Truck, Utensils, ArrowRight, Check, Phone, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, register, socialLogin, isAuthenticated, isLoaded, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoginView, setIsLoginView] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Business Details state for Vendor / Restaurant registration
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessType, setBusinessType] = useState('FOOD_TRUCK');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('MG Road');
  const [categories, setCategories] = useState('Fast Food, Street Food');

  const [authNotice, setAuthNotice] = useState<{ type: 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (selectedRole === 'MOBILE_VENDOR') setBusinessType('FOOD_TRUCK');
    else if (selectedRole === 'RESTAURANT') setBusinessType('RESTAURANT');
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthNotice(null);

    if (isLoginView) {
      const res = await login(email || 'customer@foodonwheels.com', password || 'password123', selectedRole);
      if (res.isNewUser) {
        setAuthNotice({
          type: 'info',
          message: res.message || 'No registered account found. Registration is compulsory before logging in!'
        });
        setIsLoginView(false);
        return;
      }
      if (!res.success) {
        setAuthNotice({ type: 'error', message: res.message || 'Login failed. Please check credentials or register.' });
        return;
      }
    } else {
      const bDetails = (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') ? {
        businessName: businessName || `${name || 'New Vendor'}'s Food Venture`,
        businessDescription: businessDescription || 'Offering fresh, authentic food dishes to foodies.',
        businessType,
        city,
        address,
        categories: categories.split(',').map(c => c.trim())
      } : undefined;

      const res = await register(
        name || 'New Foodie',
        email || 'user@gmail.com',
        password || 'password123',
        selectedRole,
        bDetails
      );

      if (!res.success) {
        setAuthNotice({ type: 'error', message: res.message || 'Registration failed.' });
        return;
      }
    }

    const dest = selectedRole === 'MOBILE_VENDOR' 
      ? '/vendor/dashboard' 
      : selectedRole === 'RESTAURANT' 
      ? '/restaurant/dashboard' 
      : '/customer/home';
    
    router.replace(dest);
  };

  const handleOAuth = async (provider: string) => {
    setAuthNotice(null);
    const prov = provider === 'Apple' ? 'Apple' : 'Google';

    const bDetails = (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') ? {
      businessName: businessName || `${name || prov + ' Partner'}'s Food Venture`,
      businessDescription: businessDescription || 'Offering fresh, authentic food dishes to foodies.',
      businessType,
      city,
      address,
      categories: categories.split(',').map(c => c.trim())
    } : undefined;

    const res = await socialLogin(prov, email || undefined, name || undefined, selectedRole, !isLoginView, bDetails);

    if (res.isNewUser) {
      setAuthNotice({
        type: 'info',
        message: res.message || 'Account not registered in database. Registration is compulsory. Please select your role and enter your details to complete registration!'
      });
      if (res.email) setEmail(res.email);
      if (res.name) setName(res.name);
      setIsLoginView(false);
      return;
    }

    if (!res.success) {
      setAuthNotice({ type: 'error', message: res.message || 'Social authentication failed.' });
      return;
    }

    const dest = selectedRole === 'MOBILE_VENDOR' 
      ? '/vendor/dashboard' 
      : selectedRole === 'RESTAURANT' 
      ? '/restaurant/dashboard' 
      : '/customer/home';
    
    router.replace(dest);
  };

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'CUSTOMER',
      title: 'Food Customer',
      desc: 'Discover street food & restaurants',
      icon: <UserIcon className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'MOBILE_VENDOR',
      title: 'Mobile Vendor',
      desc: 'Food truck / van / cart',
      icon: <Truck className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'RESTAURANT',
      title: 'Restaurant / Cafe',
      desc: 'Fine dining, cafe, bakery',
      icon: <Utensils className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=1600&auto=format&fit=crop"
          alt="Food Truck Background"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115]/95 via-[#0F1115]/80 to-[#0F1115]/95"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side Hero Tagline */}
        <div className="hidden lg:flex flex-col justify-between space-y-8 p-6">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="StreetBite Logo"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                className="w-12 h-12 object-contain"
              />
              <span className="font-black text-3xl text-white tracking-tight">
                Street<span className="text-[#FF7A00]">Bite</span>
              </span>
            </Link>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mt-6">
              Good Food <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF9900]">Brighter</span> <br />
              Journeys.
            </h1>

            <p className="text-sm text-gray-300 max-w-md leading-relaxed">
              Track real-time food trucks on live GPS, reserve restaurant tables, watch foodie reels & enjoy authentic local street food near you.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-black tracking-widest text-[#FF7A00] uppercase pt-8 border-t border-white/10">
            <span>TASTE</span>
            <span>•</span>
            <span>EXPLORE</span>
            <span>•</span>
            <span>CONNECT</span>
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="w-full max-w-md mx-auto bg-[#181C23]/90 backdrop-blur-xl border border-[#2A2F3D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-2">
              <img
                src="/logo.png"
                alt="FoodOnWheels"
                style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                className="w-9 h-9 object-contain"
              />
              <span className="font-black text-xl text-white">
                Food<span className="text-[#FF7A00]">on</span>Wheels
              </span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              {isLoginView ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-xs text-gray-400">
              {isLoginView ? 'Sign in to access your orders & foodie passport' : 'Compulsory registration: select your role and details to get started'}
            </p>
          </div>

          {authNotice && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold border ${
              authNotice.type === 'info'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {authNotice.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* WHAT ARE YOU? (SELECT ROLE) */}
            <div>
              <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 block">
                WHAT IS YOUR ROLE? (COMPULSORY)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      selectedRole === r.id
                        ? 'bg-[#FF7A00]/20 border-[#FF7A00] text-white scale-[1.02] shadow-lg'
                        : 'bg-[#252A34] border-[#2A2F3D] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div>{r.icon}</div>
                    <span className="text-[11px] font-extrabold line-clamp-1">{r.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {!isLoginView && (
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
            </div>

            {!isLoginView && (
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Business Details Section for Mobile Vendor or Restaurant during Registration */}
            {!isLoginView && (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') && (
              <div className="bg-[#101318] border border-[#FF7A00]/40 p-4 rounded-2xl space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-[#FF7A00] font-black text-xs uppercase tracking-wider">
                  {selectedRole === 'MOBILE_VENDOR' ? <Truck className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                  <span>{selectedRole === 'MOBILE_VENDOR' ? 'Mobile Vendor Business & Ideas' : 'Restaurant Business & Ideas'}</span>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={selectedRole === 'MOBILE_VENDOR' ? 'e.g. Taco Wheelz Express' : 'e.g. Spice Garden Restaurant'}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Food Business Idea & Menu Specialty *</label>
                  <textarea
                    required
                    rows={2}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe what food items & concept you are going to serve (e.g. Authentic Mexican tacos, wood-fired pizzas & fresh brews)..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">Establishment Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                    >
                      {selectedRole === 'MOBILE_VENDOR' ? (
                        <>
                          <option value="FOOD_TRUCK">Food Truck</option>
                          <option value="COFFEE_VAN">Coffee Van</option>
                          <option value="FOOD_CART">Food Cart</option>
                          <option value="ICE_CREAM_TRUCK">Ice Cream Truck</option>
                        </>
                      ) : (
                        <>
                          <option value="RESTAURANT">Restaurant / Fine Dining</option>
                          <option value="CAFE">Cafe / Coffee Shop</option>
                          <option value="BAKERY">Bakery & Confectionery</option>
                          <option value="HOTEL">Hotel Restaurant</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase mb-1 block">City / Operating Area</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-[#252A34] border-[#2A2F3D] text-[#FF7A00] focus:ring-0" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:text-[#FF7A00] transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform uppercase tracking-wider"
            >
              <span>{isLoginView ? `Login as ${selectedRole.replace('_', ' ')}` : `Register & Create ${selectedRole.replace('_', ' ')} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* OAuth Section */}
          <div className="pt-3 border-t border-[#2A2F3D] text-center space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR CONTINUE WITH</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('Google')}
                className="flex-1 py-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white font-bold hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <span>🌐 Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('Apple')}
                className="flex-1 py-2.5 rounded-xl bg-[#252A34] border border-[#2A2F3D] text-xs text-white font-bold hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <span> Apple</span>
              </button>
            </div>

            <p className="text-xs text-gray-400 pt-2">
              {isLoginView ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthNotice(null);
                  setIsLoginView(!isLoginView);
                }}
                className="text-[#FF7A00] font-extrabold hover:underline ml-1"
              >
                {isLoginView ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

