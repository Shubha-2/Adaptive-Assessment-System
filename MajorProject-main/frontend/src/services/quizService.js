import api from './api';

const generateMCQs = async (topic, difficulty, count, sourceText = '') => {
    const response = await api.post('/mcq/generate', { topic, difficulty, count, sourceText });
    return response.data;
};

const generateMCQsFromPDF = async (formData) => {
    const response = await api.post('/mcq/generate', formData);
    return response.data;
};

const createQuiz = async (title, type, mcqIds, timePerQuestion, totalTime, password = null) => {
    const response = await api.post('/quiz', { title, type, mcqIds, timePerQuestion, totalTime, password });
    return response.data;
};

const getAllQuizzes = async (search = '') => {
    const response = await api.get(`/quiz?search=${search}`);
    return response.data;
};

const deleteQuiz = async (id) => {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
};

const getQuizById = async (id, password = null) => {
    let url = `/quiz/${id}`;
    if (password) {
        url += `?password=${encodeURIComponent(password)}`;
    }
    const response = await api.get(url);
    return response.data;
};

const submitAttempt = async (quizId, answers, timeTaken) => {
    const response = await api.post('/analytics/submit', { quizId, answers, timeTaken });
    return response.data;
};

const getLeaderboard = async (quizId) => {
    const response = await api.get(`/analytics/leaderboard/${quizId}`);
    return response.data;
};

const getAttemptById = async (id) => {
    const response = await api.get(`/analytics/attempt/${id}`);
    return response.data;
};

const getUserAttempts = async () => {
    const response = await api.get('/analytics/user-attempts');
    return response.data;
};

export default {
    generateMCQs,
    generateMCQsFromPDF,
    createQuiz,
    getAllQuizzes,
    getQuizById,
    submitAttempt,
    getLeaderboard,
    getAttemptById,
    getUserAttempts,
    deleteQuiz
};
