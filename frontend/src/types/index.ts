export type UserRole = 'CUSTOMER' | 'MOBILE_VENDOR' | 'RESTAURANT';
export type BusinessType = 'MOBILE_VENDOR' | 'RESTAURANT' | 'CAFE' | 'BAKERY' | 'HOTEL' | 'FOOD_TRUCK' | 'DESSERT_SHOP';
export type VehicleType = 'BURGER_TRUCK' | 'COFFEE_VAN' | 'PIZZA_TRUCK' | 'ICE_CREAM_TRUCK' | 'FOOD_CART' | 'TEA_CART' | 'JUICE_CART' | 'AUTO_FOOD_CART';
export type CrowdLevel = 'QUIET' | 'MODERATE' | 'VERY_BUSY';
export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type OrderType = 'PICKUP' | 'DINE_IN' | 'TAKEAWAY';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  foodiePassport?: {
    stamps: string[];
    points: number;
  };
  referralCode?: string;
  favorites?: string[];
}

export interface RouteStop {
  stopName: string;
  lat: number;
  lng: number;
  timeSlot: string;
  isCurrent?: boolean;
}

export interface TableItem {
  id: string;
  tableNumber: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
}

export interface Business {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  businessType: BusinessType;
  vehicleType?: VehicleType;
  ownerId?: string;
  logo: string;
  coverImage: string;
  categories: string[];
  rating: {
    average: number;
    count: number;
  };
  address: string;
  city: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  liveLocation?: {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    isLive: boolean;
    lastUpdated: string;
  };
  route?: RouteStop[];
  etaText?: string;
  queue?: {
    count: number;
    waitMinutes: number;
  };
  crowdLevel: CrowdLevel;
  openingHours?: {
    openTime: string;
    closeTime: string;
    holidays: string[];
    isOpenNow: boolean;
  };
  tables?: TableItem[];
  waitTimeMinutes?: number;
  ambienceImages?: string[];
  amenities?: string[];
  verification: {
    isVerified: boolean;
    fssaiLicense: string;
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  };
  followersCount: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  registeredDaysAgo?: number;
  trendingRank?: number;
  recentOrdersCount?: number;
  headingTo?: string;
  etaMinutes?: number;
  expectedArrival?: string;
  detourMinutes?: number;
}

export type SpecialStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'SOLD_OUT';

export interface TodaysSpecialRecord {
  id: string;
  businessId: string;
  businessName: string;
  businessType: 'MOBILE_VENDOR' | 'RESTAURANT' | 'CAFE';
  menuItemId: string;
  foodName: string;
  specialLabel: 'Today\'s Pick' | 'Chef Special' | 'Limited Time' | 'Best Seller Today' | 'Special Offer' | string;
  originalPrice: number;
  specialPrice: number;
  discountPercentage: number;
  description: string;
  image: string;
  startAt: string;
  endAt: string;
  quantity: number;
  remainingQuantity: number;
  status: SpecialStatus;
  createdAt: string;
  updatedAt: string;
  views: number;
  clicks: number;
  ordersCount: number;
  revenue: number;
}

export interface MenuItem {
  _id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY' | 'EXTRA_SPICY';
  rating: number;
  image: string;
  model3DUrl?: string;
  stock: number;
  isLowStock?: boolean;
  isSoldOut?: boolean;
  isBestseller?: boolean;
  isTodaysSpecial?: boolean;
  specialPrice?: number;
  discountPercentage?: number;
  specialLabel?: string;
  specialEndTime?: string;
  availableUntil?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    extraOptions: string[];
    spiceLevel?: string;
    specialInstructions?: string;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  businessId: string;
  businessName: string;
  businessType: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: OrderType;
  status: OrderStatus;
  isGroupOrder?: boolean;
  groupOrderMembers?: string[];
  estimatedTimeMinutes: number;
  pickupOtp?: string;
  createdAt: string;
}

export interface Reservation {
  _id: string;
  restaurantId: string;
  restaurantName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  seatingPreference: 'INDOOR' | 'OUTDOOR' | 'ANY';
  specialRequests?: string;
  status: ReservationStatus;
  tableNumber?: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  foodRating: number;
  serviceRating: number;
  hygieneRating: number;
  ambienceRating?: number;
  comment: string;
  media?: string[];
  likes: number;
  createdAt: string;
}

export interface VideoReel {
  _id: string;
  businessId: string;
  businessName: string;
  businessType: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  foodName: string;
  price: number;
  distanceText: string;
  views: number;
  likes: number;
  commentsCount: number;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  rewardPoints: number;
  badgeName: string;
  category: string;
  requiredCount: number;
  icon: string;
}
