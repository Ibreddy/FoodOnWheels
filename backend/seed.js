const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Business = require('./models/Business');
const MenuItem = require('./models/MenuItem');
const Review = require('./models/Review');
const Deal = require('./models/Deal');
const Challenge = require('./models/Challenge');
const Video = require('./models/Video');

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodonwheels';
    console.log(`🌱 Connecting to MongoDB for seeding at ${connStr}...`);
    await mongoose.connect(connStr);

    console.log('Clearing old database collections...');
    await User.deleteMany({});
    await Business.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Deal.deleteMany({});
    await Challenge.deleteMany({});
    await Video.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Users
    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@streetbite.com',
      password: hashedPassword,
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
      foodiePassport: { stamps: ['MG Road', 'Indiranagar', 'Koramangala'], points: 450 },
      referralCode: 'RAHUL100'
    });

    const vendor = await User.create({
      name: 'Ramesh Kumar',
      email: 'vendor@streetbite.com',
      password: hashedPassword,
      phone: '+91 9811223344',
      role: 'MOBILE_VENDOR',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop'
    });

    const restaurantUser = await User.create({
      name: 'Spice Garden (Priya)',
      email: 'restaurant@streetbite.com',
      password: hashedPassword,
      phone: '+91 9844556677',
      role: 'RESTAURANT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop'
    });

    console.log('✅ Users Seeded (customer, vendor, restaurant)');

    // 2. Businesses
    const b1 = await Business.create({
      name: 'Ramesh Burger Truck',
      tagline: 'Fresh & cheesy! Double patty love ❤️',
      description: 'Bengaluru’s favorite mobile gourmet burger truck. Flame-grilled double cheese patties, peri-peri fries, and iced brews on wheels!',
      businessType: 'MOBILE_VENDOR',
      vehicleType: 'BURGER_TRUCK',
      ownerId: vendor._id,
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
      categories: ['Burger', 'Fast Food', 'Beverages'],
      rating: { average: 4.8, count: 250 },
      address: 'MG Road, near Metro Station',
      city: 'Bengaluru',
      location: { type: 'Point', coordinates: [77.607, 12.9716] },
      liveLocation: { lat: 12.9716, lng: 77.607, speed: 14, heading: 90, isLive: true, lastUpdated: new Date() },
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
      headingTo: 'Indiranagar 100ft Rd'
    });

    const b2 = await Business.create({
      name: 'Spice Garden Restaurant',
      tagline: 'Authentic South Indian & Dum Biryani Delights 🍛',
      description: 'Award-winning traditional dining restaurant serving aromatic dum biryanis, chettinad curries, and tandoori grills.',
      businessType: 'RESTAURANT',
      ownerId: restaurantUser._id,
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop',
      categories: ['Biryani', 'South Indian', 'Tandoori'],
      rating: { average: 4.7, count: 420 },
      address: 'Koramangala 5th Block',
      city: 'Bengaluru',
      location: { type: 'Point', coordinates: [77.6245, 12.9352] },
      liveLocation: { lat: 12.9352, lng: 77.6245, speed: 0, heading: 0, isLive: false, lastUpdated: new Date() },
      tables: [
        { tableNumber: 1, seats: 2, status: 'AVAILABLE' },
        { tableNumber: 2, seats: 4, status: 'RESERVED' },
        { tableNumber: 3, seats: 6, status: 'OCCUPIED' },
        { tableNumber: 4, seats: 4, status: 'AVAILABLE' }
      ],
      waitTimeMinutes: 20,
      verification: { isVerified: true, fssaiLicense: '99887766000123', kycStatus: 'VERIFIED' },
      followersCount: 3200,
      isFeatured: true
    });

    console.log('✅ Businesses Seeded');

    // 3. Menu Items
    await MenuItem.create([
      {
        businessId: b1._id,
        name: 'Double Cheese Smash Burger',
        description: 'Double beef/chicken patty stacked with melted cheddar cheese & secret house sauce.',
        price: 199,
        category: 'Burgers',
        isVeg: false,
        spiceLevel: 'MEDIUM',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
        stock: 45,
        isBestseller: true,
        isTodaysSpecial: true,
        specialPrice: 159,
        discountPercentage: 20,
        specialLabel: "Today's Pick"
      },
      {
        businessId: b1._id,
        name: 'Peri Peri Crispy Fries',
        description: 'Golden crunchy fries tossed in tangy fiery peri peri seasoning.',
        price: 99,
        category: 'Sides',
        isVeg: true,
        spiceLevel: 'SPICY',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop',
        stock: 60,
        isBestseller: true
      },
      {
        businessId: b2._id,
        name: 'Hyderabadi Chicken Dum Biryani',
        description: 'Slow-cooked aromatic basmati rice infused with saffron, mint & tender chicken pieces.',
        price: 249,
        category: 'Biryani',
        isVeg: false,
        spiceLevel: 'SPICY',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
        stock: 50,
        isBestseller: true,
        isTodaysSpecial: true,
        specialPrice: 199,
        discountPercentage: 20,
        specialLabel: 'Chef Special'
      }
    ]);

    console.log('✅ Menu Items Seeded');

    // 4. Deals & Challenges
    await Deal.create({
      code: 'STREET50',
      title: 'Flat 50% Off First Order',
      description: 'Get 50% discount up to ₹100 on your first mobile vendor or restaurant pickup.',
      discountPercentage: 50,
      bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
      businessName: 'StreetBite Deals',
      expiryDate: '2026-12-31'
    });

    await Challenge.create([
      {
        title: 'Food Truck Explorer',
        description: 'Order from 3 different mobile food trucks this week.',
        rewardPoints: 200,
        badgeName: 'Truck Master',
        category: 'Explorer',
        requiredCount: 3,
        icon: 'Truck'
      }
    ]);

    console.log('🎉 Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
