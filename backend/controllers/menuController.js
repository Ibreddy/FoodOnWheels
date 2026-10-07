const MenuItem = require('../models/MenuItem');
const Business = require('../models/Business');

// Get All Menu Items
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, isVeg, isTodaysSpecial } = req.query;

    let query = {};
    if (category) query.category = category;
    if (isVeg === 'true') query.isVeg = true;
    if (isTodaysSpecial === 'true') query.isTodaysSpecial = true;

    const items = await MenuItem.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching menu items',
      error: err.message
    });
  }
};

// Get Menu Items for a Specific Business
exports.getMenuByBusiness = async (req, res) => {
  try {
    const items = await MenuItem.find({ businessId: req.params.businessId }).sort({ category: 1, name: 1 });

    return res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching business menu',
      error: err.message
    });
  }
};

// Get Today's Specials across all businesses
exports.getTodaysSpecials = async (req, res) => {
  try {
    const specials = await MenuItem.find({ isTodaysSpecial: true }).populate('businessId', 'name businessType logo city');

    return res.json({
      success: true,
      count: specials.length,
      data: specials
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching today specials',
      error: err.message
    });
  }
};

// Create New Menu Item
exports.createMenuItem = async (req, res) => {
  try {
    const { businessId } = req.body;
    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: 'Business ID is required'
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Associated business not found'
      });
    }

    // Verify ownership
    if (business.ownerId && business.ownerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add menu items to this business'
      });
    }

    const newItem = await MenuItem.create(req.body);

    return res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating menu item',
      error: err.message
    });
  }
};

// Update Menu Item
exports.updateMenuItem = async (req, res) => {
  try {
    let item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const business = await Business.findById(item.businessId);
    if (business && business.ownerId && business.ownerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this menu item'
      });
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    return res.json({
      success: true,
      data: item
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating menu item',
      error: err.message
    });
  }
};

// Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const business = await Business.findById(item.businessId);
    if (business && business.ownerId && business.ownerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this menu item'
      });
    }

    await item.deleteOne();

    return res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting menu item',
      error: err.message
    });
  }
};
