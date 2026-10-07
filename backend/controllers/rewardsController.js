const User = require('../models/User');

exports.getPassport = async (req, res) => {
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
      data: {
        foodiePassport: user.foodiePassport || { stamps: ['MG Road', 'Indiranagar'], points: 250 },
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching foodie passport',
      error: err.message
    });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const amount = parseInt(pointsToRedeem);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid points count required to redeem'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.foodiePassport || user.foodiePassport.points < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient reward points'
      });
    }

    user.foodiePassport.points -= amount;
    await user.save();

    return res.json({
      success: true,
      message: `Redeemed ${amount} points successfully`,
      remainingPoints: user.foodiePassport.points
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error redeeming points',
      error: err.message
    });
  }
};
