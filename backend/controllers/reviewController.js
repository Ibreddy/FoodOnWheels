const Review = require('../models/Review');
const Business = require('../models/Business');
const User = require('../models/User');

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { businessId, rating, foodRating, serviceRating, hygieneRating, ambienceRating, comment, media } = req.body;

    if (!businessId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Business ID, rating and comment are required'
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const review = await Review.create({
      businessId,
      customerId: user._id,
      customerName: user.name,
      customerAvatar: user.avatar,
      rating: parseFloat(rating),
      foodRating: parseFloat(foodRating || rating),
      serviceRating: parseFloat(serviceRating || rating),
      hygieneRating: parseFloat(hygieneRating || rating),
      ambienceRating: parseFloat(ambienceRating || rating),
      comment,
      media: media || []
    });

    // Update Business Average Rating
    const allReviews = await Review.find({ businessId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    business.rating = {
      average: parseFloat(avgRating.toFixed(1)),
      count: allReviews.length
    };
    await business.save();

    return res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating review',
      error: err.message
    });
  }
};

// Get Reviews for Business
exports.getReviewsByBusiness = async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
      error: err.message
    });
  }
};

// Like Review
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.likes += 1;
    await review.save();

    return res.json({
      success: true,
      data: review
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error liking review',
      error: err.message
    });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.customerId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const businessId = review.businessId;
    await review.deleteOne();

    // Recalculate Business Rating
    const allReviews = await Review.find({ businessId });
    const business = await Business.findById(businessId);
    if (business) {
      const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 4.5;

      business.rating = {
        average: parseFloat(avgRating.toFixed(1)),
        count: allReviews.length
      };
      await business.save();
    }

    return res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: err.message
    });
  }
};
