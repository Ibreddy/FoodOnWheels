const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: err.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.json({
      success: true,
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: err.message
    });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { businessId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.favorites.includes(businessId)) {
      user.favorites.push(businessId);
      await user.save();
    }

    return res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error adding favorite',
      error: err.message
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { businessId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.favorites = user.favorites.filter(f => f.toString() !== businessId);
    await user.save();

    return res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error removing favorite',
      error: err.message
    });
  }
};
