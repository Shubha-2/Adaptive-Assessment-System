import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../services/quizService';

const Performance = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const data = await quizService.getUserAttempts();
                setAttempts(data);
            } catch (error) {
                console.error("Error fetching performance data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    if (loading) return <div className="text-center py-10">Loading performance data...</div>;

    const totalQuizzes = attempts.length;
    const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = totalQuizzes > 0 ? (totalScore / totalQuizzes).toFixed(1) : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
            <h1 className="text-3xl font-bold text-white mb-8">Your Performance</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="glass-card p-6">
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Quizzes Taken</dt>
                    <dd className="mt-2 text-3xl font-bold text-white">{totalQuizzes}</dd>
                </div>
                <div className="glass-card p-6">
                    <dt className="text-sm font-medium text-slate-400 truncate">Average Score</dt>
                    <dd className="mt-2 text-3xl font-bold text-white">{avgScore}</dd>
                </div>
            </div>

            {/* Recent Attempts Implementation */}
            <h2 className="text-xl font-bold text-white mb-4">Initial History</h2>
            <div className="glass-panel rounded-2xl overflow-hidden">
                <ul className="divide-y divide-white/10">
                    {attempts.length > 0 ? (
                        attempts.map((attempt) => (
                            <li key={attempt.id} className="hover:bg-white/5 transition-colors duration-200">
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-lg font-semibold text-cyan-400 truncate mb-1">
                                                {attempt.Quiz ? attempt.Quiz.title : 'Unknown Quiz'}
                                            </p>
                                            <p className="flex items-center text-sm text-slate-400">
                                                {new Date(attempt.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${attempt.score >= 4 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                Score: {attempt.score}
                                            </div>
                                            <Link to={`/result/${attempt.id}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                                                View Details <span>&rarr;</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="px-6 py-8 text-center text-slate-400">No quizzes taken yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Performance;
