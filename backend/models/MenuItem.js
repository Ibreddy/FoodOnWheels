const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required']
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    category: {
      type: String,
      default: 'General'
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    spiceLevel: {
      type: String,
      enum: ['MILD', 'MEDIUM', 'SPICY', 'EXTRA_SPICY'],
      default: 'MEDIUM'
    },
    rating: {
      type: Number,
      default: 4.5
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop'
    },
    stock: {
      type: Number,
      default: 50
    },
    isLowStock: {
      type: Boolean,
      default: false
    },
    isSoldOut: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false
    },
    specialPrice: {
      type: Number
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    specialLabel: {
      type: String,
      default: "Today's Pick"
    },
    availableUntil: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
