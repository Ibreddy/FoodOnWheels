const Business = require('../models/Business');

// Get All Businesses with Filters & Search
exports.getAllBusinesses = async (req, res) => {
  try {
    const { type, category, city, minRating, featured, available, lat, lng, distance } = req.query;

    let query = {};

    if (type) query.businessType = type;
    if (category) query.categories = { $in: [category] };
    if (city) query.city = new RegExp(city, 'i');
    if (minRating) query['rating.average'] = { $gte: parseFloat(minRating) };
    if (featured === 'true') query.isFeatured = true;
    if (available === 'true') query.isAvailable = true;

    // Geolocation filter ($near within distance in meters, default 10km)
    if (lat && lng) {
      const maxDistance = distance ? parseInt(distance) : 10000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      };
    }

    const businesses = await Business.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (err) {
    console.error('Error fetching businesses:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching businesses',
      error: err.message
    });
  }
};

// Get Single Business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    return res.json({
      success: true,
      data: business
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching business',
      error: err.message
    });
  }
};

// Create New Business
exports.createBusiness = async (req, res) => {
  try {
    const businessData = {
      ...req.body,
      ownerId: req.user.userId
    };

    if (req.body.lng && req.body.lat) {
      businessData.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
      businessData.liveLocation = {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng),
        speed: 0,
        heading: 0,
        isLive: true,
        lastUpdated: new Date()
      };
    }

    const newBusiness = await Business.create(businessData);

    return res.status(201).json({
      success: true,
      data: newBusiness
    });
  } catch (err) {
    console.error('Error creating business:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error creating business',
      error: err.message
    });
  }
};

// Update Business
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Ownership check (owner or admin)
    if (business.ownerId && business.ownerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this business'
      });
    }

    const updates = { ...req.body };
    if (req.body.lng && req.body.lat) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
    }

    business = await Business.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    return res.json({
      success: true,
      data: business
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating business',
      error: err.message
    });
  }
};

// Delete Business
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    if (business.ownerId && business.ownerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this business'
      });
    }

    await business.deleteOne();

    return res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting business',
      error: err.message
    });
  }
};
