const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    customization: {
      extraOptions: [String],
      spiceLevel: String,
      specialInstructions: String
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      default: function() {
        return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      }
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
    customerPhone: {
      type: String,
      default: ''
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    businessName: {
      type: String,
      required: true
    },
    businessType: {
      type: String,
      default: 'MOBILE_VENDOR'
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    orderType: {
      type: String,
      enum: ['PICKUP', 'DINE_IN', 'TAKEAWAY'],
      default: 'PICKUP'
    },
    status: {
      type: String,
      enum: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
      default: 'PLACED'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PAID'
    },
    estimatedTimeMinutes: {
      type: Number,
      default: 20
    },
    pickupOtp: {
      type: String,
      default: function() {
        return Math.floor(1000 + Math.random() * 9000).toString();
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
