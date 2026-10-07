const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/favorites/:businessId', userController.addFavorite);
router.delete('/favorites/:businessId', userController.removeFavorite);

module.exports = router;
