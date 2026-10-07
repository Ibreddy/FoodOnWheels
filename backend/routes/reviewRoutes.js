const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/business/:businessId', reviewController.getReviewsByBusiness);

router.post('/', authMiddleware, reviewController.createReview);
router.post('/:id/like', authMiddleware, reviewController.likeReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
