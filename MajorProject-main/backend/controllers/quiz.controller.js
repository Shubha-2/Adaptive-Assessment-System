const { Quiz, MCQ, User, Attempt } = require('../models');

// @route   POST api/quiz
// @desc    Create a new quiz
// @access  Private
exports.createQuiz = async (req, res) => {
    const { title, type, mcqIds, timePerQuestion, totalTime } = req.body;

    try {
        // If type is global, ensure user is a teacher
        if (type === 'global' && req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Only teachers can create global quizzes' });
        }

        // Generate a random 6-character access code
        const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const quiz = await Quiz.create({
            title,
            createdBy: req.user.id,
            type,
            mcqIds, // Saves as JSON string automatically by Sequelize
            timePerQuestion: timePerQuestion || 60,
            totalTime: totalTime || 30,
            accessCode,
            password: req.body.password || null
        });

        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/quiz
// @desc    Get all quizzes
// @access  Private
exports.getAllQuizzes = async (req, res) => {
    try {
        const { Op } = require('sequelize');

        // If student, return global quizzes + their own local quizzes
        // If teacher, return all global quizzes + their own created quizzes

        // Actually, if student creates a local quiz, they should see it.
        // Teacher sees global quizzes and their own.
        // The logic is simply: type=global OR createdBy=me.

        const { search } = req.query;
        let whereClause = {
            [Op.or]: [
                { type: 'global' },
                { createdBy: req.user.id }
            ]
        };

        if (search) {
            whereClause = {
                [Op.and]: [
                    whereClause,
                    {
                        [Op.or]: [
                            { title: { [Op.like]: `%${search}%` } },
                            { accessCode: search.toUpperCase() }
                        ]
                    }
                ]
            };
        }

        const query = {
            where: whereClause,
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
        };

        const quizzes = await Quiz.findAll(query);

        // Fetch attempts for this user
        const attempts = await Attempt.findAll({
            where: { userId: req.user.id },
            attributes: ['quizId', 'score', 'id']
        });

        // Create a map of quizId -> attempt details
        const attemptMap = {};
        attempts.forEach(att => {
            attemptMap[att.quizId] = att;
        });

        // Add attempt info to each quiz
        const quizzesWithAttempts = quizzes.map(q => {
            const quiz = q.get({ plain: true });
            if (attemptMap[quiz.id]) {
                quiz.attempted = true;
                quiz.score = attemptMap[quiz.id].score;
                quiz.attemptId = attemptMap[quiz.id].id;
            } else {
                quiz.attempted = false;
            }
            return quiz;
        });

        res.json(quizzesWithAttempts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/quiz/:id
// @desc    Get quiz by ID
// @access  Private
// @route   GET api/quiz/:id
// @desc    Get quiz by ID (with optional password check)
// @access  Private
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const { password } = req.query; // Or req.body if POST, but this is GET. 
        // Note: Sending password in query params is not ideal for high security, but acceptable for this scope.
        // Alternatively, use a POST /unlock endpoint. For now, strictly query.

        let isLocked = false;
        if (quiz.password && quiz.password !== password) {
            isLocked = true;
        }

        // Fetch MCQs manually
        let mcqs = [];
        let mcqIds = quiz.mcqIds;

        // SQLite/Sequelize sometimes returns JSON as a string
        if (typeof mcqIds === 'string') {
            try {
                mcqIds = JSON.parse(mcqIds);
            } catch (e) {
                console.error("Failed to parse mcqIds:", e);
                mcqIds = [];
            }
        }

        if (!isLocked && mcqIds && Array.isArray(mcqIds) && mcqIds.length > 0) {
            mcqs = await MCQ.findAll({
                where: {
                    id: mcqIds
                }
            });
        }

        // Combine quiz data with mcqs
        const quizData = quiz.get({ plain: true });
        quizData.mcqs = isLocked ? [] : mcqs;
        quizData.isLocked = isLocked;
        // Don't send the actual password to the client!
        delete quizData.password;

        // Check if user has already attempted this global quiz
        if (quiz.type === 'global') {
            const { Attempt } = require('../models');
            const attempt = await Attempt.findOne({
                where: {
                    quizId: quiz.id,
                    userId: req.user.id
                }
            });

            if (attempt) {
                quizData.attempted = true;
                quizData.attemptId = attempt.id;
            }
        }

        res.json(quizData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   DELETE api/quiz/:id
// @desc    Delete a quiz
// @access  Private
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        // Check user
        if (quiz.createdBy !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await quiz.destroy();
        res.json({ msg: 'Quiz removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
