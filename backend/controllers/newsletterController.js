const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already subscribed to the FoodOnWheels food loop!'
      });
    }

    await Newsletter.create({ email: normalizedEmail });

    return res.status(201).json({
      success: true,
      message: '🎉 Welcome to the FoodOnWheels family! Check your inbox for updates.'
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error processing newsletter subscription.',
      error: err.message
    });
  }
};
