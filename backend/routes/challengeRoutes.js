const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', challengeController.getAllChallenges);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), challengeController.createChallenge);

module.exports = router;
