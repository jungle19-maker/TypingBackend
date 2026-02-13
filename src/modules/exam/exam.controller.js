const examService = require('./exam.service');

const createExam = async (req, res) => {
    try {
        const exam = await examService.createExam(req.body);
        res.status(201).json(exam);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Exam title/slug already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

const getExams = async (req, res) => {
    try {
        const exams = await examService.getExams();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExamBySlug = async (req, res) => {
    try {
        const exam = await examService.getExamBySlug(req.params.slug);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExamById = async (req, res) => {
    try {
        const exam = await examService.getExamById(req.params.id, req.user._id);
        res.json(exam);
    } catch (error) {
        if (error.message === 'Exam not found') return res.status(404).json({ message: error.message });
        if (error.message.includes('Upgrade required')) return res.status(403).json({ message: error.message });
        if (error.message.includes('Daily exam limit reached')) return res.status(403).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
};

const submitExamResult = async (req, res) => {
    try {
        const result = await examService.submitExamResult(req.user._id, req.params.id, req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Exam not found') return res.status(404).json({ message: error.message });
        res.status(500).json({ message: error.message });
    }
};

const getExamHistory = async (req, res) => {
    try {
        const history = await examService.getExamHistory(req.user._id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExam,
    getExams,
    getExamBySlug,
    getExamById,
    submitExamResult,
    getExamHistory
};
