const MCQ = require('../models/MCQ');
const { generateMCQs } = require('../utils/aiGenerator');

const pdfParse = require('pdf-parse');

// @route   POST api/mcq/generate
// @desc    Generate MCQs using AI (Topic or Text/PDF)
// @access  Private
exports.generateAndSaveMCQs = async (req, res) => {
    let { topic, difficulty, count, sourceText } = req.body;
    const numQuestions = count > 50 ? 50 : count;

    try {
        console.log("Received generate request. Body:", req.body);
        console.log("File:", req.file ? "Present" : "Missing");

        // Handle PDF Upload
        if (req.file) {
            console.log("Parsing PDF...");
            try {
                const pdfData = await pdfParse(req.file.buffer);
                sourceText = pdfData.text;
                console.log("PDF Parsed. Text length:", sourceText.length);
                topic = topic || "Custom PDF Content";
            } catch (pdfError) {
                console.error("PDF Parse Error:", pdfError);
                return res.status(400).json({ msg: 'Failed to parse PDF file' });
            }
        }

        console.log("Calling AI Generator with topic:", topic);
        const generatedData = await generateMCQs(topic, difficulty, numQuestions, sourceText);
        console.log("AI Generation successful. Count:", generatedData.length);

        // Map to match Sequelize model
        const mcqsToSave = generatedData.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer || q.correctAnswer,
            explanation: q.explanation,
            topic: q.topic || topic,
            difficulty: q.difficulty || difficulty
        }));

        const savedMCQs = await MCQ.bulkCreate(mcqsToSave);
        console.log("MCQs saved to DB");
        res.json(savedMCQs);
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).send('Server error during MCQ generation: ' + err.message);
    }
};

// @route   GET api/mcq
// @desc    Get all MCQs (optional filter by topic/difficulty)
// @access  Private
exports.getMCQs = async (req, res) => {
    try {
        const mcqs = await MCQ.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(mcqs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
