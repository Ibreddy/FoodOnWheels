const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', dealController.getAllDeals);
router.get('/:id', dealController.getDealById);

router.post('/', authMiddleware, roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'), dealController.createDeal);
router.put('/:id', authMiddleware, roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'), dealController.updateDeal);
router.delete('/:id', authMiddleware, roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'), dealController.deleteDeal);

module.exports = router;
