const Reservation = require('../models/Reservation');
const Business = require('../models/Business');
const User = require('../models/User');

// Create Reservation
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId, date, timeSlot, guestCount, seatingPreference, specialRequests } = req.body;

    if (!restaurantId || !date || !timeSlot || !guestCount) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID, date, timeSlot and guestCount are required'
      });
    }

    const restaurant = await Business.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer user not found'
      });
    }

    const reservation = await Reservation.create({
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      customerId: user._id,
      customerName: user.name,
      customerPhone: user.phone || req.body.customerPhone || '9876543210',
      customerEmail: user.email,
      date,
      timeSlot,
      guestCount: parseInt(guestCount),
      seatingPreference: seatingPreference || 'ANY',
      specialRequests: specialRequests || '',
      status: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating reservation',
      error: err.message
    });
  }
};

// Get All Reservations for User or Restaurant
exports.getAllReservations = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user.userId;
    } else if (req.user.role === 'RESTAURANT' || req.user.role === 'MOBILE_VENDOR') {
      const owned = await Business.find({ ownerId: req.user.userId }).select('_id');
      const ids = owned.map(b => b._id);
      query.restaurantId = { $in: ids };
    }

    const reservations = await Reservation.find(query).sort({ date: 1, timeSlot: 1 });

    return res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reservations',
      error: err.message
    });
  }
};

// Get Reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    return res.json({
      success: true,
      data: reservation
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reservation',
      error: err.message
    });
  }
};

// Update Reservation Status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, tableNumber } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (status) reservation.status = status;
    if (tableNumber !== undefined) reservation.tableNumber = tableNumber;

    await reservation.save();

    return res.json({
      success: true,
      data: reservation
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating reservation',
      error: err.message
    });
  }
};

// Delete / Cancel Reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    await reservation.deleteOne();

    return res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting reservation',
      error: err.message
    });
  }
};
