const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', businessController.getAllBusinesses);
router.get('/:id', businessController.getBusinessById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  businessController.createBusiness
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  businessController.updateBusiness
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  businessController.deleteBusiness
);

module.exports = router;
