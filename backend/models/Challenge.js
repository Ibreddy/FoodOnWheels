const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rewardPoints: {
      type: Number,
      default: 100
    },
    badgeName: {
      type: String,
      default: 'Foodie Explorer'
    },
    category: {
      type: String,
      default: 'Explorer'
    },
    requiredCount: {
      type: Number,
      default: 3
    },
    icon: {
      type: String,
      default: 'Truck'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
