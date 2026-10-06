import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../services/quizService';
import MCQCard from '../components/MCQCard';

const Result = () => {
    const { id } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const data = await quizService.getAttemptById(id);
                setAttempt(data);
            } catch (error) {
                console.error("Failed to load attempt:", error);
                setError(true);
            }
        };
        fetchAttempt();
    }, [id]);


    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Results</h2>
                <p className="text-slate-400 mb-6">Unable to retrieve mission data.</p>
                <Link to="/quizzes" className="btn-secondary">Return to Base</Link>
            </div>
        </div>
    );

    if (!attempt) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                <div className="text-cyan-400 font-mono text-sm animate-pulse">ANALYZING_PERFORMANCE...</div>
            </div>
        </div>
    );

    const quiz = attempt.Quiz || { title: 'Unknown Mission' };
    const score = attempt.score;
    const total = attempt.answers.length;
    const accuracy = Math.round((score / total) * 100);

    // Circular Progress Calculation
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (accuracy / 100) * circumference;

    const getColor = (val) => {
        if (val >= 80) return 'text-emerald-400 stroke-emerald-500';
        if (val >= 50) return 'text-yellow-400 stroke-yellow-500';
        return 'text-red-400 stroke-red-500';
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-12 ">

            {/* Mission Header */}
            <div className="text-center mb-12">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-4 uppercase tracking-widest">
                    MISSION DEBRIEF
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-['Space_Grotesk']">
                    {quiz.title}
                </h1>
                <p className="text-slate-400 text-sm">
                    Completed on {new Date(attempt.createdAt).toLocaleDateString()}
                </p>
                {quiz.type === 'global' && (
                    <Link
                        to={`/leaderboard/${attempt.quizId}`}
                        className="inline-flex items-center gap-2 mt-4 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                    >
                        <span>View Global Standings</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </Link>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                {/* Score Circle Card */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                    <div className="relative w-48 h-48 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                className="text-slate-800"
                                strokeWidth="12"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="96"
                                cy="96"
                            />
                            <circle
                                className={`${getColor(accuracy)} transition-all duration-1000 ease-out`}
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx="96"
                                cy="96"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className={`text-5xl font-bold ${getColor(accuracy).split(' ')[0]} font-['Space_Grotesk']`}>
                                {accuracy}%
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-slate-400 text-sm uppercase tracking-widest mb-1">ACCURACY RATING</div>
                        <div className="text-white font-bold text-lg">{score} / {total} Correct</div>
                    </div>
                </div>

                {/* Secondary Stats & Feedback */}
                <div className="flex flex-col gap-6">
                    {/* Time Stat */}
                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">TOTAL DURATION</div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {Math.floor(attempt.timeTaken / 60)}<span className="text-sm text-slate-500 mx-1">m</span>
                                {attempt.timeTaken % 60}<span className="text-sm text-slate-500 mx-1">s</span>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>

                    {/* Feedback Card */}
                    <div className={`glass-panel p-6 rounded-2xl flex-1 border ${accuracy >= 80 ? 'border-emerald-500/30 bg-emerald-500/5' : accuracy >= 50 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <h3 className={`font-bold mb-2 flex items-center gap-2 ${getColor(accuracy).split(' ')[0]}`}>
                            {accuracy >= 80 ? 'EXCELLENT PERFORMANCE' : accuracy >= 50 ? 'MISSION ACCOMPLISHED' : 'MISSION CRITICAL'}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {accuracy >= 80
                                ? "Superior command of subject matter detected. Recommend advancing to higher complexity simulations."
                                : accuracy >= 50
                                    ? "Competence established. Review tactical errors in the breakdown below to optimize future performance."
                                    : "Performance below optimal parameters. Immediate review of core concepts and re-initialization recommended."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Breakdown Header */}
            <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Tactical Breakdown</h2>
                <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            {/* Question List */}
            <div className="space-y-6">
                {attempt.answers.map((ans, index) => (
                    <div key={index} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${ans.correctAnswer === ans.selectedOption ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-medium text-white mb-4">{ans.questionText || 'Question Data Unavailable'}</h4>

                                <div className="space-y-2 mb-4">
                                    <div className={`p-3 rounded-xl text-sm border ${ans.correctAnswer === ans.selectedOption ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                                        <span className="opacity-70 text-xs uppercase tracking-wider block mb-1">Your Selection</span>
                                        {ans.selectedOption}
                                    </div>
                                    {ans.correctAnswer !== ans.selectedOption && (
                                        <div className="p-3 rounded-xl text-sm bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                                            <span className="opacity-70 text-xs uppercase tracking-wider block mb-1">Correct Answer</span>
                                            {ans.correctAnswer}
                                        </div>
                                    )}
                                </div>

                                {ans.explanation && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-slate-400 text-sm">
                                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-wider mr-2">Intel:</span>
                                            {ans.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link to="/quizzes" className="btn-secondary inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Return to Base
                </Link>
            </div>
        </div>
    );
};

export default Result;
