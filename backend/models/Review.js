const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    foodRating: { type: Number, default: 5 },
    serviceRating: { type: Number, default: 5 },
    hygieneRating: { type: Number, default: 5 },
    ambienceRating: { type: Number, default: 5 },
    comment: {
      type: String,
      required: true
    },
    media: [String],
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Review', reviewSchema);
