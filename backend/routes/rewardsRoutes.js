const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/passport', rewardsController.getPassport);
router.post('/redeem', rewardsController.redeemPoints);

module.exports = router;
