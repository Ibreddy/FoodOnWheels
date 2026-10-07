const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    businessName: {
      type: String,
      default: 'StreetBite Deals'
    },
    expiryDate: {
      type: String,
      default: '2026-12-31'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Deal', dealSchema);
