const { Attempt, Quiz, User, MCQ } = require('../models');

// @route   POST api/analytics/submit
// @desc    Submit a quiz attempt
// @access  Private
exports.submitAttempt = async (req, res) => {
    const { quizId, answers, timeTaken } = req.body;

    try {
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        // Fetch MCQs to check answers
        // Fetch MCQs to check answers
        let mcqIds = quiz.mcqIds;
        if (typeof mcqIds === 'string') {
            try {
                mcqIds = JSON.parse(mcqIds);
            } catch (e) {
                console.error("Failed to parse mcqIds:", e);
                mcqIds = [];
            }
        }

        const mcqs = await MCQ.findAll({
            where: {
                id: mcqIds
            }
        });

        let score = 0;
        const processedAnswers = answers.map(ans => {
            const question = mcqs.find(q => q.id === parseInt(ans.questionId));
            const isCorrect = question && question.correctAnswer === ans.selectedOption;
            if (isCorrect) score++;
            return {
                questionId: ans.questionId,
                selectedOption: ans.selectedOption,
                isCorrect
            };
        });

        // Calculate XP
        const XP_PER_QUESTION = 10;
        const PERFECT_SCORE_BONUS = 50;

        let earnedXp = score * XP_PER_QUESTION;
        if (score === mcqs.length && mcqs.length > 0) {
            earnedXp += PERFECT_SCORE_BONUS;
        }

        // Update User XP and Rank
        const user = await User.findByPk(req.user.id);
        user.xp += earnedXp;

        // Determine Rank
        if (user.xp >= 5000) user.rank = 'Legend';
        else if (user.xp >= 2500) user.rank = 'Admiral';
        else if (user.xp >= 1000) user.rank = 'Commander';
        else if (user.xp >= 200) user.rank = 'Officer';
        else user.rank = 'Cadet';

        await user.save();

        const attempt = await Attempt.create({
            quizId,
            userId: req.user.id,
            answers: processedAnswers, // Stores as JSON string via Sequelize
            score,
            timeTaken
        });

        // Return updated user stats along with attempt
        res.json({ attempt, userStats: { xp: user.xp, rank: user.rank, earnedXp } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/analytics/attempt/:id
// @desc    Get specific attempt details
// @access  Private
exports.getAttemptById = async (req, res) => {
    try {
        const attempt = await Attempt.findByPk(req.params.id, {
            include: [
                { model: Quiz, attributes: ['title', 'type'] },
                { model: User, attributes: ['name', 'xp', 'rank'] }
            ]
        });

        if (!attempt) {
            return res.status(404).json({ msg: 'Attempt not found' });
        }

        // Authorization check
        if (attempt.userId !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // We also want to attach question details to the answers for review
        // attempt.answers is a JSON array: [{questionId, selectedOption, isCorrect}, ...]
        let answers = attempt.answers;
        if (typeof answers === 'string') {
            try {
                answers = JSON.parse(answers);
            } catch (e) {
                console.error("Failed to parse answers:", e);
                answers = [];
            }
        }
        attempt.answers = answers; // Update the attempt object

        const questionIds = answers.map(ans => ans.questionId);
        const mcqs = await MCQ.findAll({
            where: {
                id: questionIds
            }
        });

        const attemptData = attempt.get({ plain: true });

        // Enhance answers with question text/explanation if needed for review
        attemptData.answers = attemptData.answers.map(ans => {
            const q = mcqs.find(m => m.id === parseInt(ans.questionId));
            return {
                ...ans,
                questionText: q ? q.question : 'Question removed',
                options: q ? q.options : [],
                correctAnswer: q ? q.correctAnswer : 'N/A',
                explanation: q ? q.explanation : 'N/A'
            };
        });

        res.json(attemptData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/analytics/leaderboard/:quizId
// @desc    Get leaderboard for a global quiz
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            where: { quizId: req.params.quizId },
            include: [
                { model: User, attributes: ['name', 'xp', 'rank'] }
            ],
            order: [
                ['score', 'DESC'],
                ['timeTaken', 'ASC']
            ]
        });

        const leaderboard = attempts.map((attempt, index) => ({
            rank: index + 1,
            name: attempt.User ? attempt.User.name : 'Unknown User',
            playerRank: attempt.User ? attempt.User.rank : 'Cadet',
            xp: attempt.User ? attempt.User.xp : 0,
            score: attempt.score,
            timeTaken: attempt.timeTaken
        }));

        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/analytics/user-attempts
// @desc    Get all attempts for the authenticated user
// @access  Private
exports.getUserAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Quiz, attributes: ['title', 'type'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(attempts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
