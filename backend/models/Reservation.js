const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    restaurantName: {
      type: String,
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
    customerPhone: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1
    },
    seatingPreference: {
      type: String,
      enum: ['INDOOR', 'OUTDOOR', 'ANY'],
      default: 'ANY'
    },
    specialRequests: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
      default: 'PENDING'
    },
    tableNumber: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
