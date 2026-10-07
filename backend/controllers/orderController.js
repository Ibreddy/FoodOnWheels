const Order = require('../models/Order');
const Business = require('../models/Business');
const User = require('../models/User');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { businessId, items, orderType, estimatedTimeMinutes } = req.body;

    if (!businessId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Business ID and order items are required'
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // 1. Food Truck / Mobile Vendor Restriction
    if (business.businessType === 'MOBILE_VENDOR' || business.businessType === 'FOOD_TRUCK') {
      return res.status(400).json({
        success: false,
        message: 'Orders cannot be placed for food trucks. Online ordering is strictly reserved for restaurants within a 10 km radius.'
      });
    }

    // 2. 10 Kilometers Distance Restriction
    const customerLocation = req.body.customerLocation || {};
    const userLat = customerLocation.lat || req.body.userLat || 12.9716;
    const userLng = customerLocation.lng || req.body.userLng || 77.607;

    const bizLat = business.liveLocation?.lat || (business.location?.coordinates ? business.location.coordinates[1] : 12.9716);
    const bizLng = business.liveLocation?.lng || (business.location?.coordinates ? business.location.coordinates[0] : 77.607);

    // Haversine formula calculation (distance in kilometers)
    const R = 6371;
    const dLat = ((bizLat - userLat) * Math.PI) / 180;
    const dLon = ((bizLng - userLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((bizLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    if (distanceKm > 10) {
      return res.status(400).json({
        success: false,
        message: `This restaurant is located ${distanceKm.toFixed(1)} km away. Online orders are strictly accepted for restaurants within a 10 km radius only.`
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer user not found'
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = await Order.create({
      customerId: user._id,
      customerName: user.name,
      customerPhone: user.phone || '',
      businessId: business._id,
      businessName: business.name,
      businessType: business.businessType,
      items,
      totalAmount,
      orderType: orderType || 'PICKUP',
      estimatedTimeMinutes: estimatedTimeMinutes || 20,
      status: 'PLACED'
    });

    // Reward points (+10 per order)
    if (user.foodiePassport) {
      user.foodiePassport.points += 10;
      await user.save();
    }

    // Broadcast Socket.IO event to business room
    if (req.io) {
      req.io.to(`business:${business._id}`).emit('order:created', newOrder);
    }

    return res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: err.message
    });
  }
};

// Get Orders for Current User / Business
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'CUSTOMER') {
      query.customerId = req.user.userId;
    } else if (req.user.role === 'MOBILE_VENDOR' || req.user.role === 'RESTAURANT') {
      // Find businesses owned by this user
      const ownedBusinesses = await Business.find({ ownerId: req.user.userId }).select('_id');
      const businessIds = ownedBusinesses.map(b => b._id);
      query.businessId = { $in: businessIds };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching orders',
      error: err.message
    });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: err.message
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    // Broadcast status change via Socket.IO
    if (req.io) {
      req.io.to(`order:${order._id}`).emit('order:status:update', {
        orderId: order._id,
        status: order.status
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: err.message
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed order'
      });
    }

    order.status = 'CANCELLED';
    await order.save();

    if (req.io) {
      req.io.to(`order:${order._id}`).emit('order:status:update', {
        orderId: order._id,
        status: 'CANCELLED'
      });
    }

    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error cancelling order',
      error: err.message
    });
  }
};
