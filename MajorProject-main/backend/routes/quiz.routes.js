const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, quizController.createQuiz);
router.get('/', auth, quizController.getAllQuizzes);
router.get('/:id', auth, quizController.getQuizById);
router.delete('/:id', auth, quizController.deleteQuiz);

module.exports = router;
