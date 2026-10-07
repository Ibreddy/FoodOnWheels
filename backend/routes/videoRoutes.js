const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', videoController.getAllVideos);
router.post('/', authMiddleware, roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'), videoController.createVideo);
router.post('/:id/like', videoController.likeVideo);

module.exports = router;
