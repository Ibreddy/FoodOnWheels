import { Business, MenuItem, VideoReel, Review, Challenge } from '../types';

export const mockBusinesses: Business[] = [
  {
    _id: 'b1',
    name: 'Ramesh Burger Truck',
    tagline: 'Fresh & cheesy! Double patty love ❤️',
    description: 'Bengaluru’s favorite mobile gourmet burger truck. Flame-grilled double cheese patties, peri-peri fries, and iced brews on wheels!',
    businessType: 'MOBILE_VENDOR',
    vehicleType: 'BURGER_TRUCK',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
    categories: ['Burger', 'Fast Food', 'Beverages'],
    rating: { average: 4.8, count: 250 },
    address: 'MG Road, near Metro Station',
    city: 'Bengaluru',
    location: { type: 'Point', coordinates: [77.607, 12.9716] },
    liveLocation: {
      lat: 12.9716,
      lng: 77.607,
      speed: 14,
      heading: 90,
      isLive: true,
      lastUpdated: new Date().toISOString()
    },
    route: [
      { stopName: 'MG Road Metro', lat: 12.9716, lng: 77.607, timeSlot: '6 PM - 9 PM', isCurrent: true },
      { stopName: 'Indiranagar 100ft Rd', lat: 12.9784, lng: 77.6408, timeSlot: '9 PM - 11 PM' },
      { stopName: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245, timeSlot: '11 PM - 1 AM' }
    ],
    etaText: '03 mins ETA',
    queue: { count: 5, waitMinutes: 15 },
    crowdLevel: 'MODERATE',
    verification: { isVerified: true, fssaiLicense: '11223344000645', kycStatus: 'VERIFIED' },
    followersCount: 1420,
    isFeatured: true,
    trendingRank: 1,
    recentOrdersCount: 47,
    headingTo: 'Indiranagar 100ft Rd',
    etaMinutes: 18,
    expectedArrival: '6:30 PM',
    registeredDaysAgo: 3
  },
  {
    _id: 'b2',
    name: 'Chai Tapri Mobile',
    tagline: 'Kulhad Ginger Masala Tea & Hot Samosas ☕',
    description: 'Piping hot kulhad chai brewed with fresh ginger & cardamom, accompanied by crunchy pakodas.',
    businessType: 'MOBILE_VENDOR',
    vehicleType: 'TEA_CART',
    logo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1000&auto=format&fit=crop',
    categories: ['Tea', 'Snacks', 'Beverages'],
    rating: { average: 4.6, count: 180 },
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    location: { type: 'Point', coordinates: [77.6408, 12.9784] },
    liveLocation: {
      lat: 12.9784,
      lng: 77.6408,
      speed: 0,
      heading: 0,
      isLive: true,
      lastUpdated: new Date().toISOString()
    },
    route: [
      { stopName: 'Indiranagar Metro', lat: 12.9784, lng: 77.6408, timeSlot: '7 AM - 12 PM', isCurrent: true },
      { stopName: 'Domlur Flyover', lat: 12.9609, lng: 77.6387, timeSlot: '4 PM - 10 PM' }
    ],
    etaText: '05 mins ETA',
    queue: { count: 3, waitMinutes: 8 },
    crowdLevel: 'QUIET',
    verification: { isVerified: true, fssaiLicense: '22334455000789', kycStatus: 'VERIFIED' },
    followersCount: 890,
    headingTo: 'Domlur Flyover',
    etaMinutes: 25,
    expectedArrival: '7:00 PM',
    registeredDaysAgo: 14
  },
  {
    _id: 'b3',
    name: 'Ice Cream Truck Delight',
    tagline: 'Artisan Gelato & Sundae Wheels 🍦',
    description: 'Handcrafted natural gelato sundaes, belgian chocolate cones, and waffle sticks from a neon truck.',
    businessType: 'MOBILE_VENDOR',
    vehicleType: 'ICE_CREAM_TRUCK',
    logo: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1000&auto=format&fit=crop',
    categories: ['Ice Cream', 'Desserts'],
    rating: { average: 4.9, count: 310 },
    address: 'Koramangala 4th Block Park',
    city: 'Bengaluru',
    location: { type: 'Point', coordinates: [77.6245, 12.9352] },
    liveLocation: {
      lat: 12.9352,
      lng: 77.6245,
      speed: 10,
      heading: 180,
      isLive: true,
      lastUpdated: new Date().toISOString()
    },
    etaText: '02 mins ETA',
    queue: { count: 8, waitMinutes: 20 },
    crowdLevel: 'VERY_BUSY',
    verification: { isVerified: true, fssaiLicense: '33445566000123', kycStatus: 'VERIFIED' },
    followersCount: 2100,
    isFeatured: true,
    registeredDaysAgo: 5
  },
  {
    _id: 'b4',
    name: 'Spice Garden Restaurant',
    tagline: 'Authentic South & North Indian Fine Dining 🍛',
    description: 'Elegant landmark dining featuring Tandoori clay oven specialties, Chettinad gravies, and slow-cooked Dum Biryanis.',
    businessType: 'RESTAURANT',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop',
    categories: ['South Indian', 'North Indian', 'Biryani', 'Chinese'],
    rating: { average: 4.7, count: 1250 },
    address: 'Church Street, Off MG Road',
    city: 'Bengaluru',
    location: { type: 'Point', coordinates: [77.6045, 12.9745] },
    openingHours: { openTime: '11:00 AM', closeTime: '11:30 PM', holidays: [], isOpenNow: true },
    tables: [
      { id: 't1', tableNumber: 1, seats: 2, status: 'AVAILABLE' },
      { id: 't2', tableNumber: 2, seats: 4, status: 'OCCUPIED' },
      { id: 't3', tableNumber: 3, seats: 4, status: 'RESERVED' },
      { id: 't4', tableNumber: 4, seats: 6, status: 'AVAILABLE' },
      { id: 't5', tableNumber: 5, seats: 8, status: 'CLEANING' }
    ],
    waitTimeMinutes: 25,
    ambienceImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop'
    ],
    amenities: ['AC', 'Free Wi-Fi', 'Valet Parking', 'Outdoor Seating', 'Wheelchair Accessible'],
    crowdLevel: 'VERY_BUSY',
    verification: { isVerified: true, fssaiLicense: '44556677000999', kycStatus: 'VERIFIED' },
    followersCount: 3500,
    isFeatured: true,
    trendingRank: 2,
    recentOrdersCount: 38
  },
  {
    _id: 'b5',
    name: 'Coffee Culture Cafe',
    tagline: 'Specialty Espresso & Artisan Pastries ☕🥐',
    description: 'Cozy modern cafe with single-origin espresso drinks, avocado toast, and fresh almond croissants.',
    businessType: 'CAFE',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop',
    categories: ['Coffee', 'Bakery', 'Desserts'],
    rating: { average: 4.8, count: 620 },
    address: '12th Main Road, Indiranagar',
    city: 'Bengaluru',
    location: { type: 'Point', coordinates: [77.642, 12.975] },
    openingHours: { openTime: '08:00 AM', closeTime: '10:30 PM', holidays: [], isOpenNow: true },
    waitTimeMinutes: 10,
    amenities: ['AC', 'Free Wi-Fi', 'Pet Friendly', 'Outdoor Garden'],
    crowdLevel: 'MODERATE',
    verification: { isVerified: true, fssaiLicense: '55667788000111', kycStatus: 'VERIFIED' },
    followersCount: 1980,
    isFeatured: true,
    trendingRank: 3,
    recentOrdersCount: 29,
    registeredDaysAgo: 5
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    _id: 'm1',
    businessId: 'b1',
    name: 'Double Cheese Burger',
    description: 'Double flame-grilled patty loaded with molten cheddar & secret truck sauce.',
    price: 160,
    category: 'Burgers',
    isVeg: false,
    spiceLevel: 'MEDIUM',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
    stock: 12,
    isBestseller: true,
    isTodaysSpecial: true,
    specialPrice: 112,
    discountPercentage: 30,
    specialLabel: '30% OFF TODAY',
    availableUntil: '11:00 PM'
  },
  {
    _id: 'm-special-1',
    businessId: 'b4',
    name: 'Chicken Dum Biryani',
    description: 'Slow-cooked aromatic basmati rice layered with juicy marinated chicken & saffron.',
    price: 180,
    category: 'Biryani',
    isVeg: false,
    spiceLevel: 'SPICY',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
    stock: 25,
    isBestseller: true,
    isTodaysSpecial: true,
    specialPrice: 149,
    discountPercentage: 17,
    specialLabel: 'CHEF SPECIAL',
    availableUntil: '10:00 PM'
  },
  {
    _id: 'm-special-2',
    businessId: 'b2',
    name: 'Tandoori Paneer Tikka Platter',
    description: 'Fresh cottage cheese cubes marinated in spiced yogurt and charred in clay tandoor.',
    price: 220,
    category: 'Snacks',
    isVeg: true,
    spiceLevel: 'MEDIUM',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop',
    stock: 15,
    isBestseller: false,
    isTodaysSpecial: true,
    specialPrice: 189,
    discountPercentage: 14,
    specialLabel: 'CHEF SPECIAL',
    availableUntil: '09:30 PM'
  },
  {
    _id: 'm2',
    businessId: 'b1',
    name: 'French Fries',
    description: 'Crispy golden potato fries sprinkled with signature peri-peri seasoning.',
    price: 80,
    category: 'Sides',
    isVeg: true,
    spiceLevel: 'MILD',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop',
    stock: 30,
    isLowStock: false,
    isSoldOut: false,
    isBestseller: false
  },
  {
    _id: 'm3',
    businessId: 'b5',
    name: 'Hazelnut Iced Latte & Croissant',
    description: 'Creamy cold brew espresso with real hazelnut syrup and flaky butter croissant.',
    price: 240,
    category: 'Coffee',
    isVeg: true,
    spiceLevel: 'MILD',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop',
    stock: 10,
    isBestseller: true,
    isTodaysSpecial: true,
    specialPrice: 190,
    discountPercentage: 20,
    specialLabel: '20% OFF',
    availableUntil: '10:00 PM'
  }
];

export const mockDeals = [
  {
    id: 'd1',
    businessName: 'Ramesh Burger Truck',
    foodName: 'Cheese Burger Combo + Peri Peri Fries',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop',
    offerText: '20% OFF',
    originalPrice: 250,
    discountedPrice: 199,
    distanceText: '350 m away',
    endsInSeconds: 5072 // 01:24:32
  },
  {
    id: 'd2',
    businessName: 'Spice Garden Restaurant',
    foodName: 'Family Biryani Feast + Free Drinks',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
    offerText: '30% OFF',
    originalPrice: 650,
    discountedPrice: 455,
    distanceText: '1.2 km away',
    endsInSeconds: 8110 // 02:15:10
  },
  {
    id: 'd3',
    businessName: 'Chai Tapri Mobile',
    foodName: 'Buy 1 Get 1 Kulhad Ginger Masala Tea',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop',
    offerText: 'BUY 1 GET 1',
    originalPrice: 80,
    discountedPrice: 40,
    distanceText: '500 m away',
    endsInSeconds: 2700 // 00:45:00
  }
];

export const mockCustomerChoiceWinners = [
  {
    categoryTitle: 'Best Burger',
    emoji: '🏆',
    winnerBusiness: 'Ramesh Burger Truck',
    dishName: 'Double Cheese Burger',
    rating: 4.8,
    votesCount: '1,240 votes',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop'
  },
  {
    categoryTitle: 'Best Biryani',
    emoji: '🏆',
    winnerBusiness: 'Spice Garden Restaurant',
    dishName: 'Chicken Dum Biryani',
    rating: 4.8,
    votesCount: '1,890 votes',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop'
  },
  {
    categoryTitle: 'Best Cafe',
    emoji: '🏆',
    winnerBusiness: 'Coffee Culture Cafe',
    dishName: 'Hazelnut Iced Latte',
    rating: 4.9,
    votesCount: '980 votes',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop'
  }
];

export const mockVideos: VideoReel[] = [
  {
    _id: 'v1',
    businessId: 'b1',
    businessName: 'Ramesh Burger Truck',
    businessType: 'MOBILE_VENDOR',
    title: 'Fresh & cheesy double patty love ❤️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-43033-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
    foodName: 'Cheese Burger',
    price: 120,
    distanceText: '350m away',
    views: 2450,
    likes: 420,
    commentsCount: 38
  },
  {
    _id: 'v2',
    businessId: 'b4',
    businessName: 'Spice Garden Restaurant',
    businessType: 'RESTAURANT',
    title: 'Slow Dum Biryani Unsealing Ceremony! 🥘✨',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-dish-being-cooked-43034-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
    foodName: 'Chicken Dum Biryani',
    price: 280,
    distanceText: '1.2km away',
    views: 5800,
    likes: 1120,
    commentsCount: 94
  }
];

export const mockReviews: Review[] = [
  {
    _id: 'r1',
    businessId: 'b1',
    customerId: 'c1',
    customerName: 'Rahul Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    hygieneRating: 4.8,
    comment: 'Hands down the best food truck burger in MG Road! Melted cheddar cheese was incredible.',
    likes: 28,
    createdAt: '2026-08-24T18:30:00Z'
  }
];

export const mockChallenges: Challenge[] = [
  {
    _id: 'ch1',
    title: 'Try a New Food Category Today!',
    description: 'Order or explore Asian/South Indian dishes from local vendors near you!',
    rewardPoints: 50,
    badgeName: 'Daily Explorer',
    category: 'EXPLORER',
    requiredCount: 1,
    icon: '🍜'
  },
  {
    _id: 'ch2',
    title: 'Biryani Master',
    description: 'Order biryani from 3 different top rated restaurants!',
    rewardPoints: 150,
    badgeName: 'Biryani Lover',
    category: 'FOODIE',
    requiredCount: 3,
    icon: '🥘'
  }
];
