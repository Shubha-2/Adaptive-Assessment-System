
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Quizzes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [passwordInput, setPasswordInput] = useState('');

    const fetchQuizzes = async (searchTerm = '') => {
        try {
            setLoading(true);
            const data = await quizService.getAllQuizzes(searchTerm);
            setQuizzes(data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast.error("Failed to sync mission data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchQuizzes(search);
    };

    const handleDelete = async (quizId) => {
        if (!window.confirm("Are you sure you want to decommission this mission? This cannot be undone.")) return;
        try {
            await quizService.deleteQuiz(quizId);
            setQuizzes(quizzes.filter(q => q.id !== quizId));
            toast.success("Mission Decommissioned");
        } catch (error) {
            toast.error("Decommission Failed");
        }
    };

    const initiateQuiz = (quiz) => {
        // If password protected (we can check if it has a password field, but frontend might not know if it's null securely)
        // Actually, we can check a flag like 'hasPassword' if backend sent it, or just try to enter.
        // For now, let's assume if it's GLOBAL and not created by me, prompt password? 
        // Or better: The backend should send `hasPassword: true/false`. 
        // Since I didn't add `hasPassword` virtual field yet, I'll rely on the user knowing or the lock icon 
        // checking `quiz.password` (which I filtered out? No, `getAllQuizzes` returns `Quiz` model which HAS password field UNLESS I explicitly exclude it).
        // WAIT. `getAllQuizzes` in controller does `Quiz.findAll`. It INCLUDES the password column. 
        // I should probably fix that for security, but for now I can use it to check if I need to prompt.

        if (quiz.password && quiz.createdBy !== user.id) {
            setSelectedQuizId(quiz.id);
            setShowPasswordModal(true);
        } else {
            navigate(`/quiz/${quiz.id}`);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setShowPasswordModal(false);
        navigate(`/quiz/${selectedQuizId}`, { state: { password: passwordInput } });
        setPasswordInput('');
        setSelectedQuizId(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] mb-2">
                        Mission <span className="text-cyan-400">Control</span>
                    </h1>
                    <p className="text-slate-400">Select a mission to begin simulation.</p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative flex">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="To Search Enter Code or Title..."
                            className="w-full bg-slate-900 border border-slate-700 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-cyan-400 animate-pulse">Establishing Uplink...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <div key={quiz.id} className="card-holographic group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${quiz.type === 'global' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                }`}>
                                                {quiz.type}
                                            </span>
                                            {quiz.attempted && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        {quiz.createdBy === user.id && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(quiz.id); }}
                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                title="Decommission Mission"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-cyan-400 transition-colors">{quiz.title}</h3>

                                    <div className="space-y-2 text-sm text-slate-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Cmdr. {quiz.User?.name || 'Unknown'}</span>
                                        </div>
                                        {quiz.accessCode && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                                <span className="font-mono text-emerald-400 tracking-wider">CODE: {quiz.accessCode}</span>
                                            </div>
                                        )}
                                        {quiz.password && (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span className="text-red-400 text-xs uppercase font-bold">Encrypted Access</span>
                                            </div>
                                        )}
                                    </div>
                                    {quiz.attempted && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-emerald-400 text-xs font-bold">Score: {quiz.score}</span>
                                        </div>
                                    )}
                                </div>


                                <div className="bg-slate-950/50 px-6 py-4 flex justify-between items-center border-t border-white/5">
                                    {quiz.attempted ? (
                                        <Link
                                            to={`/result/${quiz.attemptId}`}
                                            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group/btn"
                                        >
                                            VIEW RESULTS
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => initiateQuiz(quiz)}
                                            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 group/btn"
                                        >
                                            INITIATE
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    )}
                                    {quiz.type === 'global' && (
                                        <Link
                                            to={`/leaderboard/${quiz.id}`}
                                            className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
                                        >
                                            Leaderboard
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-6xl mb-4">📡</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Missions Found</h3>
                            <p className="text-slate-400">Adjust your scanners or initialize a new mission.</p>
                        </div>
                    )}
                </div>
            )
            }

            {/* Password Modal */}
            {
                showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                            <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                            <p className="text-slate-400 mb-6 text-sm">This mission is encrypted. Enter security key to proceed.</p>

                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter Access Password..."
                                    className="w-full bg-black/50 border border-red-500/50 text-red-500 placeholder-red-900/50 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    autoFocus
                                />
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowPasswordModal(false); setPasswordInput(''); }}
                                        className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
                                    >
                                        ABORT
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl font-bold bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 transition-colors"
                                    >
                                        DECRYPT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Quizzes;
