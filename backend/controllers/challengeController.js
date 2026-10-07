const Challenge = require('../models/Challenge');

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching challenges',
      error: err.message
    });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    return res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating challenge',
      error: err.message
    });
  }
};
