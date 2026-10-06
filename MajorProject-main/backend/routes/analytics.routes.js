const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const auth = require('../middleware/auth.middleware');

router.post('/submit', auth, analyticsController.submitAttempt);
router.get('/attempt/:id', auth, analyticsController.getAttemptById);
router.get('/user-attempts', auth, analyticsController.getUserAttempts);
router.get('/leaderboard/:quizId', auth, analyticsController.getLeaderboard);

module.exports = router;
