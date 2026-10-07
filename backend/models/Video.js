const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business'
    },
    businessName: {
      type: String,
      default: 'Foodie Truck'
    },
    businessType: {
      type: String,
      default: 'MOBILE_VENDOR'
    },
    title: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop'
    },
    foodName: {
      type: String,
      default: 'Special Samosa'
    },
    price: {
      type: Number,
      default: 99
    },
    distanceText: {
      type: String,
      default: '1.2 km away'
    },
    views: {
      type: Number,
      default: 120
    },
    likes: {
      type: Number,
      default: 15
    },
    commentsCount: {
      type: Number,
      default: 4
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Video', videoSchema);
