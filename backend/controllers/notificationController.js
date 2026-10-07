const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching notifications',
      error: err.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    return res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating notification',
      error: err.message
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });
    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error marking all notifications read',
      error: err.message
    });
  }
};
