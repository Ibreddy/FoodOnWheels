'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, MenuItem, VideoReel, Challenge, TodaysSpecialRecord, SpecialStatus } from '@/types';
import { mockBusinesses, mockMenuItems, mockVideos, mockChallenges } from '@/utils/mockData';
import api from '@/services/api';

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle: string;
  limit: number;
}

export interface DealItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercentage: number;
  bannerImage: string;
  businessName: string;
  expiryDate: string;
  isActive: boolean;
}

export interface CustomerChoiceAward {
  id: string;
  category: string;
  winnerName: string;
  businessType: string;
  votes: number;
  image: string;
  badge: string;
}

export interface ThemeSettings {
  primaryColor: string;
  brandName: string;
  brandTagline: string;
  defaultSidebarOpen: boolean;
}

export interface OwnerContentPayload {
  homepageSections: HomepageSectionConfig[];
  todaysSpecials: MenuItem[];
  todaysSpecialRecords: TodaysSpecialRecord[];
  deals: DealItem[];
  businesses: Business[];
  menuItems: MenuItem[];
  stories: VideoReel[];
  challenges: Challenge[];
  awards: CustomerChoiceAward[];
  themeSettings: ThemeSettings;
}

const DEFAULT_SECTIONS: HomepageSectionConfig[] = [
  { id: 'hero', name: 'Hero Search & Banner', enabled: true, order: 1, title: 'Craving Street Food & Mobile Eats?', subtitle: 'Live GPS tracked food trucks & top fine-dining near you', limit: 1 },
  { id: 'live_near_you', name: 'Live Near You (Vendor Map & Cards)', enabled: true, order: 2, title: '⚡ Live Food Trucks Near You', subtitle: 'Broadcasting live GPS coordinates & real-time ETA', limit: 6 },
  { id: 'todays_special', name: 'Today\'s Special Dishes', enabled: true, order: 3, title: '🔥 Today\'s Special Deals & Chef Picks', subtitle: 'Exclusive daily discounts from top rated vendors', limit: 6 },
  { id: 'coming_near_you', name: 'Coming Near You (Moving Vehicles)', enabled: true, order: 4, title: '🚚 Moving Towards Your Area', subtitle: 'Live ETA countdowns for food trucks in transit', limit: 4 },
  { id: 'trending_near_you', name: 'Trending Near You', enabled: true, order: 5, title: '📈 Trending Street Eats Today', subtitle: 'Most ordered & highest customer rated food spots', limit: 6 },
  { id: 'restaurants_near_you', name: 'Restaurants & Fine Dining Near You', enabled: true, order: 6, title: '🍽 Fine Dining & Cafes Near You', subtitle: 'Reserve tables, check KDS speed & order dine-in', limit: 6 },
  { id: 'food_stories', name: 'Food Stories & Video Reels', enabled: true, order: 7, title: '🎬 Food Stories & Hot Reels', subtitle: 'Behind the scenes sizzles & street food clips', limit: 6 },
  { id: 'deals', name: 'Deals & Promotional Coupons', enabled: true, order: 8, title: '🏷️ Best Deals & Discount Coupons', subtitle: 'Save big with hot promo codes & combos', limit: 4 },
  { id: 'food_along_route', name: 'Food Along Your Route', enabled: true, order: 9, title: '🛣️ Food Along Your Daily Commute', subtitle: 'Grab hot coffee & meals on your way home', limit: 4 },
  { id: 'new_businesses', name: 'Newly Joined Businesses', enabled: true, order: 10, title: '✨ Newly Joined Food Trucks & Cafes', subtitle: 'Support fresh culinary ventures in your city', limit: 4 },
  { id: 'customer_choice', name: 'Customer Choice Awards', enabled: true, order: 11, title: '🏆 Customer Choice Winners', subtitle: 'Voted #1 by Bengaluru foodies', limit: 4 },
  { id: 'foodie_passport', name: 'Foodie Passport & Rewards', enabled: true, order: 12, title: '🎫 Foodie Passport & Loyalty Stamps', subtitle: 'Collect stamps at new trucks and unlock free meals', limit: 1 },
  { id: 'todays_challenge', name: 'Daily Foodie Challenge', enabled: true, order: 13, title: '🎯 Today\'s Foodie Challenge', subtitle: 'Complete quick tasks to earn extra bonus points', limit: 1 },
  { id: 'footer', name: 'Page Footer', enabled: true, order: 14, title: 'StreetBite', subtitle: 'Connecting food lovers with mobile vendors & restaurants', limit: 1 },
];

const DEFAULT_DEALS: DealItem[] = [
  {
    id: 'd1',
    code: 'BURGER50',
    title: '50% OFF Double Cheeseburgers',
    description: 'Get half price on all Ramesh Burger Truck double patties',
    discountPercentage: 50,
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    businessName: 'Ramesh Burger Truck',
    expiryDate: 'Ends in 4 hours',
    isActive: true,
  },
  {
    id: 'd2',
    code: 'CHAI10',
    title: 'Buy 2 Kulhad Chais Get 1 Free Samosa',
    description: 'Fresh ginger masala tea paired with hot crunch',
    discountPercentage: 25,
    bannerImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
    businessName: 'Chai Tapri Mobile',
    expiryDate: 'Valid till 10 PM',
    isActive: true,
  },
  {
    id: 'd3',
    code: 'PIZZA30',
    title: '30% OFF Woodfired Pizzas',
    description: 'Valid on all medium & large thin crust artisanal pizzas',
    discountPercentage: 30,
    bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop',
    businessName: 'Toscano Fine Italian',
    expiryDate: 'Limited Time',
    isActive: true,
  }
];

const DEFAULT_AWARDS: CustomerChoiceAward[] = [
  { id: 'a1', category: 'Best Gourmet Burger Truck', winnerName: 'Ramesh Burger Truck', businessType: 'Food Truck', votes: 1420, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop', badge: '🥇 1st Place' },
  { id: 'a2', category: 'Best Kulhad Chai & Snacks', winnerName: 'Chai Tapri Mobile', businessType: 'Tea Cart', votes: 1180, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop', badge: '🥇 1st Place' },
  { id: 'a3', category: 'Best Artisan Ice Cream', winnerName: 'Ice Cream Truck Delight', businessType: 'Ice Cream Van', votes: 950, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=400&auto=format&fit=crop', badge: '🥈 2nd Place' },
  { id: 'a4', category: 'Best Fine Dining Ambience', winnerName: 'Toscano Fine Italian', businessType: 'Restaurant', votes: 890, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop', badge: '🏆 People\'s Choice' }
];

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#FF7A00',
  brandName: 'StreetBite',
  brandTagline: 'Live GPS Food Trucks & Restaurant Discovery',
  defaultSidebarOpen: true,
};

interface OwnerContextType {
  isOwnerAuthenticated: boolean;
  siteContent: OwnerContentPayload;
  ownerLogin: (email: string, pass: string) => boolean;
  ownerLogout: () => void;
  updateHomepageSections: (sections: HomepageSectionConfig[]) => void;
  updateTodaysSpecials: (specials: MenuItem[]) => void;
  updateDeals: (deals: DealItem[]) => void;
  updateBusinesses: (businesses: Business[]) => void;
  updateMenuItems: (items: MenuItem[]) => void;
  updateStories: (stories: VideoReel[]) => void;
  updateChallenges: (challenges: Challenge[]) => void;
  updateAwards: (awards: CustomerChoiceAward[]) => void;
  updateThemeSettings: (theme: ThemeSettings) => void;
  resetAllToDefault: () => void;
  // Single Source of Truth Business/Vendor/Restaurant Helper Functions
  updateBusinessData: (businessId: string, updates: Partial<Business>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (menuItemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (menuItemId: string) => void;
  setTodaysSpecial: (menuItemId: string, isSpecial: boolean, specialLabel?: string, discountPercentage?: number, specialPrice?: number) => void;
  addOrUpdateDeal: (deal: DealItem) => void;
  addOrUpdateStory: (story: VideoReel) => void;
  updateTableStatus: (businessId: string, tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING') => void;
  addTableToBusiness: (businessId: string, newTable: { number: number; seats: number; section?: string }) => void;
  deleteTableFromBusiness: (businessId: string, tableId: string) => void;
  // Dedicated Today's Special Management Functions
  saveTodaysSpecialRecord: (record: TodaysSpecialRecord) => void;
  updateSpecialRecordStatus: (id: string, status: SpecialStatus) => void;
  deleteSpecialRecord: (id: string) => void;
}

const DEFAULT_TODAYS_SPECIAL_RECORDS: TodaysSpecialRecord[] = [
  {
    id: 'ts_v1',
    businessId: 'v1',
    businessName: 'Ramesh Burger Truck',
    businessType: 'MOBILE_VENDOR',
    menuItemId: 'm1',
    foodName: 'Double Cheese Burger',
    specialLabel: "Today's Pick",
    originalPrice: 160,
    specialPrice: 129,
    discountPercentage: 19,
    description: 'Double juicy patty stacked with cheddar cheese & secret sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    startAt: '12:00 PM',
    endAt: '10:00 PM',
    quantity: 25,
    remainingQuantity: 18,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 842,
    clicks: 140,
    ordersCount: 67,
    revenue: 8643,
  },
  {
    id: 'ts_r1',
    businessId: 'r1',
    businessName: 'Spice Garden Restaurant',
    businessType: 'RESTAURANT',
    menuItemId: 'm6',
    foodName: 'Chicken Dum Biryani',
    specialLabel: 'Chef Special',
    originalPrice: 220,
    specialPrice: 179,
    discountPercentage: 19,
    description: 'Authentic Hyderabadi dum biryani cooked with aromatic spices & succulent chicken.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    startAt: '12:00 PM',
    endAt: '10:00 PM',
    quantity: 50,
    remainingQuantity: 32,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 1240,
    clicks: 290,
    ordersCount: 182,
    revenue: 32478,
  }
];

const STORAGE_KEY = 'fow_owner_content';
const TOKEN_KEY = 'fow_owner_token';

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export const OwnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [siteContent, setSiteContent] = useState<OwnerContentPayload>(() => {
    const defaultTodaysSpecials = mockMenuItems.filter(item => item.isTodaysSpecial);
    return {
      homepageSections: DEFAULT_SECTIONS,
      todaysSpecials: defaultTodaysSpecials.length > 0 ? defaultTodaysSpecials : mockMenuItems.slice(0, 4),
      todaysSpecialRecords: DEFAULT_TODAYS_SPECIAL_RECORDS,
      deals: DEFAULT_DEALS,
      businesses: mockBusinesses,
      menuItems: mockMenuItems,
      stories: mockVideos,
      challenges: mockChallenges,
      awards: DEFAULT_AWARDS,
      themeSettings: DEFAULT_THEME,
    };
  });

  // Load state from localStorage & fetch backend API on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken === 'true') {
        setIsOwnerAuthenticated(true);
      }

      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setSiteContent(prev => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (e) {
      console.error('Failed to load owner storage content', e);
    }

    // Fetch live MongoDB data from backend API server
    const fetchBackendData = async () => {
      try {
        const [bizRes, menuRes] = await Promise.allSettled([
          api.get('/businesses'),
          api.get('/menu')
        ]);

        let fetchedBiz: Business[] = [];
        let fetchedMenu: MenuItem[] = [];

        if (bizRes.status === 'fulfilled' && bizRes.value.data && Array.isArray(bizRes.value.data.data)) {
          fetchedBiz = bizRes.value.data.data;
        } else if (bizRes.status === 'fulfilled' && Array.isArray(bizRes.value.data)) {
          fetchedBiz = bizRes.value.data;
        }

        if (menuRes.status === 'fulfilled' && menuRes.value.data && Array.isArray(menuRes.value.data.data)) {
          fetchedMenu = menuRes.value.data.data;
        } else if (menuRes.status === 'fulfilled' && Array.isArray(menuRes.value.data)) {
          fetchedMenu = menuRes.value.data;
        }

        if (fetchedBiz.length > 0 || fetchedMenu.length > 0) {
          setSiteContent((prev) => ({
            ...prev,
            businesses: fetchedBiz.length > 0 ? fetchedBiz : prev.businesses,
            menuItems: fetchedMenu.length > 0 ? fetchedMenu : prev.menuItems,
          }));
        }
      } catch (err) {
        console.warn('Backend API fetch notice (using cached/mock data):', err);
      }
    };

    fetchBackendData();
  }, []);

  // Save changes to localStorage whenever siteContent changes
  const saveContent = (newContent: OwnerContentPayload) => {
    setSiteContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Failed to persist owner content', e);
    }
  };

  const ownerLogin = (email: string, pass: string): boolean => {
    const validEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'owner@foodonwheels.com';
    const validPass = process.env.NEXT_PUBLIC_OWNER_PASSWORD || 'owner123';

    if (email.trim().toLowerCase() === validEmail.toLowerCase() && pass === validPass) {
      setIsOwnerAuthenticated(true);
      localStorage.setItem(TOKEN_KEY, 'true');
      return true;
    }
    return false;
  };

  const ownerLogout = () => {
    setIsOwnerAuthenticated(false);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateHomepageSections = (sections: HomepageSectionConfig[]) => {
    saveContent({ ...siteContent, homepageSections: sections });
  };

  const updateTodaysSpecials = (specials: MenuItem[]) => {
    saveContent({ ...siteContent, todaysSpecials: specials });
  };

  const updateDeals = (deals: DealItem[]) => {
    saveContent({ ...siteContent, deals });
  };

  const updateBusinesses = (businesses: Business[]) => {
    saveContent({ ...siteContent, businesses });
  };

  const updateMenuItems = (menuItems: MenuItem[]) => {
    saveContent({ ...siteContent, menuItems });
  };

  const updateStories = (stories: VideoReel[]) => {
    saveContent({ ...siteContent, stories });
  };

  const updateChallenges = (challenges: Challenge[]) => {
    saveContent({ ...siteContent, challenges });
  };

  const updateAwards = (awards: CustomerChoiceAward[]) => {
    saveContent({ ...siteContent, awards });
  };

  const updateThemeSettings = (themeSettings: ThemeSettings) => {
    saveContent({ ...siteContent, themeSettings });
  };

  // Helper implementations for Single Source of Truth updates by Vendor / Restaurant
  const updateBusinessData = (businessId: string, updates: Partial<Business>) => {
    const updatedBusinesses = siteContent.businesses.map((b) =>
      b._id === businessId ? { ...b, ...updates } : b
    );
    saveContent({ ...siteContent, businesses: updatedBusinesses });
  };

  const addMenuItem = (item: MenuItem) => {
    const updatedMenuItems = [item, ...siteContent.menuItems];
    saveContent({ ...siteContent, menuItems: updatedMenuItems });
  };

  const updateMenuItem = (menuItemId: string, updates: Partial<MenuItem>) => {
    const updatedMenuItems = siteContent.menuItems.map((item) => {
      if (item._id === menuItemId) {
        const updated = { ...item, ...updates };
        // Sync sold out status if stock is 0
        if (typeof updates.stock === 'number') {
          updated.isSoldOut = updates.stock === 0;
          updated.isLowStock = updates.stock > 0 && updates.stock <= 5;
        }
        return updated;
      }
      return item;
    });

    // Also update todaysSpecials if present
    const updatedSpecials = siteContent.todaysSpecials.map((s) =>
      s._id === menuItemId ? { ...s, ...updates } : s
    );

    saveContent({
      ...siteContent,
      menuItems: updatedMenuItems,
      todaysSpecials: updatedSpecials,
    });
  };

  const deleteMenuItem = (menuItemId: string) => {
    const updatedMenuItems = siteContent.menuItems.filter((i) => i._id !== menuItemId);
    const updatedSpecials = siteContent.todaysSpecials.filter((i) => i._id !== menuItemId);
    saveContent({
      ...siteContent,
      menuItems: updatedMenuItems,
      todaysSpecials: updatedSpecials,
    });
  };

  const setTodaysSpecial = (
    menuItemId: string,
    isSpecial: boolean,
    specialLabel?: string,
    discountPercentage?: number,
    specialPrice?: number
  ) => {
    let targetItem: MenuItem | undefined;

    const updatedMenuItems = siteContent.menuItems.map((item) => {
      if (item._id === menuItemId) {
        targetItem = {
          ...item,
          isTodaysSpecial: isSpecial,
          specialLabel: specialLabel || item.specialLabel || "TODAY'S SPECIAL",
          discountPercentage: discountPercentage ?? item.discountPercentage,
          specialPrice: specialPrice ?? (discountPercentage ? Math.round(item.price * (1 - discountPercentage / 100)) : item.price),
        };
        return targetItem;
      }
      return item;
    });

    const updatedSpecials = updatedMenuItems.filter((i) => i.isTodaysSpecial);

    saveContent({
      ...siteContent,
      menuItems: updatedMenuItems,
      todaysSpecials: updatedSpecials,
    });
  };

  const addOrUpdateDeal = (deal: DealItem) => {
    const exists = siteContent.deals.some((d) => d.id === deal.id);
    const updatedDeals = exists
      ? siteContent.deals.map((d) => (d.id === deal.id ? deal : d))
      : [deal, ...siteContent.deals];
    saveContent({ ...siteContent, deals: updatedDeals });
  };

  const addOrUpdateStory = (story: VideoReel) => {
    const exists = siteContent.stories.some((s) => s._id === story._id);
    const updatedStories = exists
      ? siteContent.stories.map((s) => (s._id === story._id ? story : s))
      : [story, ...siteContent.stories];
    saveContent({ ...siteContent, stories: updatedStories });
  };

  const updateTableStatus = (
    businessId: string,
    tableId: string,
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING'
  ) => {
    const updatedBusinesses = siteContent.businesses.map((b) => {
      if (b._id === businessId && b.tables) {
        const updatedTables = b.tables.map((t) =>
          t.id === tableId ? { ...t, status } : t
        );
        return { ...b, tables: updatedTables };
      }
      return b;
    });
    saveContent({ ...siteContent, businesses: updatedBusinesses });
  };

  const addTableToBusiness = (businessId: string, newTable: { number: number; seats: number; section?: string }) => {
    const tableObj = {
      id: 'tbl_' + Date.now(),
      tableNumber: newTable.number,
      seats: newTable.seats,
      status: 'AVAILABLE' as const
    };

    const updatedBusinesses = siteContent.businesses.map((b) => {
      if (b._id === businessId) {
        const existingTables = b.tables || [];
        return { ...b, tables: [...existingTables, tableObj] };
      }
      return b;
    });

    saveContent({ ...siteContent, businesses: updatedBusinesses });
    api.put(`/businesses/${businessId}`, { tables: updatedBusinesses.find(b => b._id === businessId)?.tables }).catch(() => {});
  };

  const deleteTableFromBusiness = (businessId: string, tableId: string) => {
    const updatedBusinesses = siteContent.businesses.map((b) => {
      if (b._id === businessId && b.tables) {
        return { ...b, tables: b.tables.filter((t) => t.id !== tableId) };
      }
      return b;
    });

    saveContent({ ...siteContent, businesses: updatedBusinesses });
    api.put(`/businesses/${businessId}`, { tables: updatedBusinesses.find(b => b._id === businessId)?.tables }).catch(() => {});
  };

  const saveTodaysSpecialRecord = (record: TodaysSpecialRecord) => {
    const records = siteContent.todaysSpecialRecords || DEFAULT_TODAYS_SPECIAL_RECORDS;
    const exists = records.some((r) => r.id === record.id);
    const updatedRecords = exists
      ? records.map((r) => (r.id === record.id ? record : r))
      : [record, ...records];

    saveContent({ ...siteContent, todaysSpecialRecords: updatedRecords });
  };

  const updateSpecialRecordStatus = (id: string, status: SpecialStatus) => {
    const records = siteContent.todaysSpecialRecords || DEFAULT_TODAYS_SPECIAL_RECORDS;
    const updatedRecords = records.map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );

    saveContent({ ...siteContent, todaysSpecialRecords: updatedRecords });
  };

  const deleteSpecialRecord = (id: string) => {
    const records = siteContent.todaysSpecialRecords || DEFAULT_TODAYS_SPECIAL_RECORDS;
    const updatedRecords = records.filter((r) => r.id !== id);
    saveContent({ ...siteContent, todaysSpecialRecords: updatedRecords });
  };

  const resetAllToDefault = () => {
    const defaultTodaysSpecials = mockMenuItems.filter(item => item.isTodaysSpecial);
    const defaults: OwnerContentPayload = {
      homepageSections: DEFAULT_SECTIONS,
      todaysSpecials: defaultTodaysSpecials.length > 0 ? defaultTodaysSpecials : mockMenuItems.slice(0, 4),
      todaysSpecialRecords: DEFAULT_TODAYS_SPECIAL_RECORDS,
      deals: DEFAULT_DEALS,
      businesses: mockBusinesses,
      menuItems: mockMenuItems,
      stories: mockVideos,
      challenges: mockChallenges,
      awards: DEFAULT_AWARDS,
      themeSettings: DEFAULT_THEME,
    };
    saveContent(defaults);
  };

  return (
    <OwnerContext.Provider
      value={{
        isOwnerAuthenticated,
        siteContent,
        ownerLogin,
        ownerLogout,
        updateHomepageSections,
        updateTodaysSpecials,
        updateDeals,
        updateBusinesses,
        updateMenuItems,
        updateStories,
        updateChallenges,
        updateAwards,
        updateThemeSettings,
        resetAllToDefault,
        updateBusinessData,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        setTodaysSpecial,
        addOrUpdateDeal,
        addOrUpdateStory,
        updateTableStatus,
        addTableToBusiness,
        deleteTableFromBusiness,
        saveTodaysSpecialRecord,
        updateSpecialRecordStatus,
        deleteSpecialRecord,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwnerContext = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwnerContext must be used within an OwnerProvider');
  }
  return context;
};
