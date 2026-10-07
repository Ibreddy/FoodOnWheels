const Deal = require('../models/Deal');

exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: deals.length,
      data: deals
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching deals',
      error: err.message
    });
  }
};

exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    return res.json({
      success: true,
      data: deal
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching deal',
      error: err.message
    });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    return res.status(201).json({
      success: true,
      data: deal
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating deal',
      error: err.message
    });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    return res.json({
      success: true,
      data: deal
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating deal',
      error: err.message
    });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }
    return res.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting deal',
      error: err.message
    });
  }
};
