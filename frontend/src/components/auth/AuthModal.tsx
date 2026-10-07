'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { X, Mail, Phone, Lock, User as UserIcon, Truck, Utensils, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, socialLogin } = useAuth();
  const router = useRouter();
  const [isLoginView, setIsLoginView] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Business details state
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessType, setBusinessType] = useState('FOOD_TRUCK');
  const [city, setCity] = useState('Bengaluru');

  const [notice, setNotice] = useState<{ type: 'error' | 'info'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (isLoginView) {
      const res = await login(email || 'customer@foodonwheels.com', password || 'password123', selectedRole);
      if (res.isNewUser) {
        setNotice({ type: 'info', message: res.message || 'Account not found. Registration is compulsory before logging in!' });
        setIsLoginView(false);
        return;
      }
      if (!res.success) {
        setNotice({ type: 'error', message: res.message || 'Login failed.' });
        return;
      }
    } else {
      const bDetails = (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') ? {
        businessName: businessName || `${name || 'New Vendor'}'s Food Venture`,
        businessDescription: businessDescription || 'Authentic food venture offering fresh dishes.',
        businessType: selectedRole === 'MOBILE_VENDOR' ? businessType : 'RESTAURANT',
        city: city || 'Bengaluru'
      } : undefined;

      const res = await register(
        name || 'New Foodie',
        email || 'user@gmail.com',
        password || 'password123',
        selectedRole,
        bDetails
      );

      if (!res.success) {
        setNotice({ type: 'error', message: res.message || 'Registration failed' });
        return;
      }
    }

    if (selectedRole === 'MOBILE_VENDOR') router.push('/vendor/dashboard');
    else if (selectedRole === 'RESTAURANT') router.push('/restaurant/dashboard');
    else router.push('/customer/home');
    onClose();
  };

  const handleOAuthClick = async (provider: 'Google' | 'Apple') => {
    setNotice(null);
    const bDetails = (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') ? {
      businessName: businessName || `${name || provider + ' Partner'}'s Food Venture`,
      businessDescription: businessDescription || 'Authentic food venture offering fresh dishes.',
      businessType: selectedRole === 'MOBILE_VENDOR' ? businessType : 'RESTAURANT',
      city: city || 'Bengaluru'
    } : undefined;

    const res = await socialLogin(provider, email || undefined, name || undefined, selectedRole, !isLoginView, bDetails);

    if (res.isNewUser) {
      setNotice({
        type: 'info',
        message: res.message || 'No account registered for this ID. Registration is compulsory. Please fill details below.'
      });
      if (res.email) setEmail(res.email);
      if (res.name) setName(res.name);
      setIsLoginView(false);
      return;
    }

    if (!res.success) {
      setNotice({ type: 'error', message: res.message || 'Social authentication failed' });
      return;
    }

    if (selectedRole === 'MOBILE_VENDOR') router.push('/vendor/dashboard');
    else if (selectedRole === 'RESTAURANT') router.push('/restaurant/dashboard');
    else router.push('/customer/home');
    onClose();
  };

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'CUSTOMER', title: 'Food Customer', desc: 'Discover street food, order & earn rewards', icon: <UserIcon className="w-5 h-5 text-emerald-400" /> },
    { id: 'MOBILE_VENDOR', title: 'Mobile Vendor', desc: 'Food truck / van live GPS tracking & menu', icon: <Truck className="w-5 h-5 text-amber-400" /> },
    { id: 'RESTAURANT', title: 'Restaurant / Cafe', desc: 'Fine dining, KDS, tables & reservations', icon: <Utensils className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-dark-bg border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div>
            <h2 className="text-2xl font-black text-white">{isLoginView ? 'Welcome Back!' : 'Join StreetBite'}</h2>
            <p className="text-xs text-gray-400">{isLoginView ? 'Sign in to access your orders & foodie passport' : 'Registration is compulsory: select role and enter details'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {notice && (
          <div className={`p-3 rounded-2xl text-xs font-bold border ${
            notice.type === 'info'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {notice.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Prompt */}
          <div>
            <label className="text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2 block">
              What is your role? (Compulsory)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    selectedRole === r.id
                      ? 'bg-brand-orange/20 border-brand-orange shadow-glow-orange text-white'
                      : 'bg-dark-card border-dark-border text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="mt-0.5">{r.icon}</div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1">
                      {r.title} {selectedRole === r.id && <Check className="w-3 h-3 text-brand-orange" />}
                    </h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!isLoginView && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Gmail / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          {!isLoginView && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Vendor / Restaurant Business Details & Ideas Section */}
          {!isLoginView && (selectedRole === 'MOBILE_VENDOR' || selectedRole === 'RESTAURANT') && (
            <div className="bg-[#101318] border border-brand-orange/40 p-3.5 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center gap-2 text-brand-orange font-black uppercase text-[11px]">
                {selectedRole === 'MOBILE_VENDOR' ? <Truck className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                <span>{selectedRole === 'MOBILE_VENDOR' ? 'Food Vendor Details & Ideas' : 'Restaurant Details & Ideas'}</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Taco Wheelz Express"
                  className="w-full px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Food Business Idea & Specialty *</label>
                <textarea
                  required
                  rows={2}
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your food menu & business idea concept..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-extrabold text-xs shadow-glow-orange flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span>{isLoginView ? `Login as ${selectedRole.replace('_', ' ')}` : `Register & Create ${selectedRole.replace('_', ' ')}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="pt-2 border-t border-dark-border text-center space-y-3">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Or Continue With</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleOAuthClick('Google')}
              className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-white font-bold hover:bg-white/10 flex items-center gap-2"
            >
              <span>🌐 Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthClick('Apple')}
              className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-xs text-white font-bold hover:bg-white/10 flex items-center gap-2"
            >
              <span> Apple</span>
            </button>
          </div>

          <p className="text-xs text-gray-400">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setIsLoginView(!isLoginView);
              }}
              className="text-brand-orange font-bold hover:underline ml-1"
            >
              {isLoginView ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

