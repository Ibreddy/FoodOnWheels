const Video = require('../models/Video');

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching videos',
      error: err.message
    });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    return res.status(201).json({
      success: true,
      data: video
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating video reel',
      error: err.message
    });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video reel not found'
      });
    }
    video.likes += 1;
    await video.save();
    return res.json({
      success: true,
      data: video
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error liking video reel',
      error: err.message
    });
  }
};
