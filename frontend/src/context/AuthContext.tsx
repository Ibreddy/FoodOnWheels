'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AccountRecord {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface BusinessDetails {
  businessName?: string;
  businessDescription?: string;
  businessType?: string;
  vehicleType?: string;
  city?: string;
  address?: string;
  categories?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; isNewUser?: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, role: UserRole, businessDetails?: BusinessDetails) => Promise<{ success: boolean; message?: string }>;
  socialLogin: (
    provider: 'Google' | 'Apple',
    email?: string,
    name?: string,
    role?: UserRole,
    isRegistrationMode?: boolean,
    businessDetails?: BusinessDetails
  ) => Promise<{ success: boolean; isNewUser?: boolean; email?: string; name?: string; message?: string }>;
  updateProfile: (updatedData: { name?: string; email?: string; phone?: string; avatar?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fow_token');
    const savedUser = localStorage.getItem('fow_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoaded(true);
  }, []);

  const getAccounts = (): AccountRecord[] => {
    try {
      const accs = localStorage.getItem('fow_accounts');
      if (accs) return JSON.parse(accs);
    } catch (e) {}
    return [
      { email: 'customer@streetbite.com', name: 'Rahul Sharma', role: 'CUSTOMER' },
      { email: 'vendor@streetbite.com', name: 'Ramesh Kumar', role: 'MOBILE_VENDOR' },
      { email: 'restaurant@streetbite.com', name: 'Spice Garden', role: 'RESTAURANT' },
    ];
  };

  const login = async (email: string, pass: string, role?: UserRole): Promise<{ success: boolean; isNewUser?: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data && res.data.token && res.data.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('fow_token', res.data.token);
        localStorage.setItem('fow_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      if (res.data && res.data.isNewUser) {
        return { success: false, isNewUser: true, message: res.data.message };
      }
    } catch (err: any) {
      if (err?.response?.data?.isNewUser) {
        return { success: false, isNewUser: true, message: err.response.data.message };
      }
      console.warn('Backend API login notice, using local session fallback:', err);
    }

    const accounts = getAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

    const finalRole: UserRole = existing
      ? existing.role
      : role
      ? role
      : email.includes('vendor')
      ? 'MOBILE_VENDOR'
      : email.includes('restaurant')
      ? 'RESTAURANT'
      : 'CUSTOMER';

    if (!existing) {
      accounts.push({ email, name: email.split('@')[0], role: finalRole });
      localStorage.setItem('fow_accounts', JSON.stringify(accounts));
    }

    createSession(email, finalRole);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    businessDetails?: BusinessDetails
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password: pass,
        role,
        ...(businessDetails || {})
      });
      if (res.data && res.data.token && res.data.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('fow_token', res.data.token);
        localStorage.setItem('fow_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed';
      console.warn('Backend API register notice:', msg);
      if (err?.response?.data?.message) {
        return { success: false, message: msg };
      }
    }

    const accounts = getAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      createSession(email, existing.role);
      return { success: true };
    }

    accounts.push({ email, name, role });
    localStorage.setItem('fow_accounts', JSON.stringify(accounts));
    createSession(email, role, name);
    return { success: true };
  };

  const socialLogin = async (
    provider: 'Google' | 'Apple',
    email?: string,
    name?: string,
    role?: UserRole,
    isRegistrationMode?: boolean,
    businessDetails?: BusinessDetails
  ): Promise<{ success: boolean; isNewUser?: boolean; email?: string; name?: string; message?: string }> => {
    const defaultEmail = email || (provider === 'Google' ? 'google.user@gmail.com' : 'apple.user@apple.com');
    const defaultName = name || (provider === 'Google' ? 'Google User' : 'Apple User');
    const targetRole = role || 'CUSTOMER';

    try {
      const res = await api.post('/auth/social', {
        provider,
        email: defaultEmail,
        name: defaultName,
        role: targetRole,
        isRegistrationMode,
        ...(businessDetails || {})
      });
      if (res.data && res.data.isNewUser) {
        return {
          success: false,
          isNewUser: true,
          email: res.data.email || defaultEmail,
          name: res.data.name || defaultName,
          message: res.data.message
        };
      }
      if (res.data && res.data.token && res.data.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('fow_token', res.data.token);
        localStorage.setItem('fow_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend API social auth notice, using local session fallback:', err);
    }

    const accounts = getAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === defaultEmail.toLowerCase());

    if (!existing && !isRegistrationMode) {
      return {
        success: false,
        isNewUser: true,
        email: defaultEmail,
        name: defaultName,
        message: 'Account not found in system. Registration is compulsory.'
      };
    }

    if (!existing) {
      accounts.push({ email: defaultEmail, name: defaultName, role: targetRole });
      localStorage.setItem('fow_accounts', JSON.stringify(accounts));
    }

    createSession(defaultEmail, targetRole, defaultName);
    return { success: true };
  };

  const createSession = (email: string, role: UserRole, customName?: string) => {
    let sessionUser: User;
    if (role === 'MOBILE_VENDOR') {
      sessionUser = {
        id: 'v1',
        name: customName || 'Ramesh Kumar (Vendor)',
        email: email,
        phone: '+91 9811223344',
        role: 'MOBILE_VENDOR',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop'
      };
    } else if (role === 'RESTAURANT') {
      sessionUser = {
        id: 'r1',
        name: customName || 'Spice Garden (Priya)',
        email: email,
        phone: '+91 9844556677',
        role: 'RESTAURANT',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop'
      };
    } else {
      sessionUser = {
        id: 'c1',
        name: customName || 'Rahul Sharma',
        email: email,
        phone: '+91 9876543210',
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
        foodiePassport: { stamps: ['MG Road', 'Indiranagar', 'Koramangala'], points: 450 },
        referralCode: 'RAHUL100'
      };
    }

    setUser(sessionUser);
    setToken('token-' + email);
    localStorage.setItem('fow_token', 'token-' + email);
    localStorage.setItem('fow_user', JSON.stringify(sessionUser));
  };

  const updateProfile = (updatedData: { name?: string; email?: string; phone?: string; avatar?: string }) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextUser = {
        ...prev,
        name: updatedData.name ?? prev.name,
        email: updatedData.email ?? prev.email,
        phone: updatedData.phone ?? prev.phone,
        avatar: updatedData.avatar ?? prev.avatar,
      };
      localStorage.setItem('fow_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fow_token');
    localStorage.removeItem('fow_user');
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoaded, login, register, socialLogin, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
