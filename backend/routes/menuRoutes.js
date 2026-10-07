const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', menuController.getAllMenuItems);
router.get('/business/:businessId', menuController.getMenuByBusiness);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  menuController.createMenuItem
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  menuController.updateMenuItem
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'),
  menuController.deleteMenuItem
);

module.exports = router;
