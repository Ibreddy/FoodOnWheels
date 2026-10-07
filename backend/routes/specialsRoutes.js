const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/today', menuController.getTodaysSpecials);

module.exports = router;
