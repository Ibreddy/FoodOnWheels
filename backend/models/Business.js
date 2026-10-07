const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    businessType: {
      type: String,
      enum: ['MOBILE_VENDOR', 'RESTAURANT', 'CAFE', 'BAKERY', 'HOTEL', 'FOOD_TRUCK', 'DESSERT_SHOP'],
      default: 'MOBILE_VENDOR'
    },
    vehicleType: {
      type: String,
      enum: ['BURGER_TRUCK', 'COFFEE_VAN', 'PIZZA_TRUCK', 'ICE_CREAM_TRUCK', 'FOOD_CART', 'TEA_CART', 'JUICE_CART', 'AUTO_FOOD_CART'],
      default: 'BURGER_TRUCK'
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop'
    },
    categories: {
      type: [String],
      default: ['Fast Food']
    },
    rating: {
      average: { type: Number, default: 4.5 },
      count: { type: Number, default: 10 }
    },
    address: {
      type: String,
      default: 'MG Road, Bengaluru'
    },
    city: {
      type: String,
      default: 'Bengaluru'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.607, 12.9716]
      }
    },
    liveLocation: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.607 },
      speed: { type: Number, default: 0 },
      heading: { type: Number, default: 0 },
      isLive: { type: Boolean, default: true },
      lastUpdated: { type: Date, default: Date.now }
    },
    route: [
      {
        stopName: String,
        lat: Number,
        lng: Number,
        timeSlot: String,
        isCurrent: Boolean
      }
    ],
    etaText: {
      type: String,
      default: '05 mins ETA'
    },
    queue: {
      count: { type: Number, default: 2 },
      waitMinutes: { type: Number, default: 10 }
    },
    crowdLevel: {
      type: String,
      enum: ['QUIET', 'MODERATE', 'VERY_BUSY'],
      default: 'MODERATE'
    },
    openingHours: {
      openTime: { type: String, default: '09:00 AM' },
      closeTime: { type: String, default: '11:00 PM' },
      holidays: [String],
      isOpenNow: { type: Boolean, default: true }
    },
    tables: [
      {
        tableNumber: Number,
        seats: Number,
        status: {
          type: String,
          enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'],
          default: 'AVAILABLE'
        }
      }
    ],
    waitTimeMinutes: {
      type: Number,
      default: 15
    },
    ambienceImages: [String],
    amenities: [String],
    verification: {
      isVerified: { type: Boolean, default: true },
      fssaiLicense: { type: String, default: '11223344000645' },
      kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'VERIFIED' }
    },
    followersCount: {
      type: Number,
      default: 100
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    registeredDaysAgo: {
      type: Number,
      default: 30
    },
    trendingRank: Number,
    recentOrdersCount: {
      type: Number,
      default: 25
    }
  },
  {
    timestamps: true
  }
);

// Create 2dsphere index for GeoJSON location searches
businessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Business', businessSchema);
