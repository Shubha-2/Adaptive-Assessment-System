import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // XP Logic
    const currentXP = user.xp || 0;
    const nextLevelXP = currentXP >= 5000 ? 5000 :
        currentXP >= 2500 ? 5000 :
            currentXP >= 1000 ? 2500 :
                currentXP >= 200 ? 1000 : 200;

    // Calculate progress percentage, handle Legend (max level) case
    const progress = currentXP >= 5000 ? 100 : Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

    const stats = [
        { label: 'Current Rank', value: user.rank || 'Cadet', color: 'text-cyan-400' },
        { label: 'Exp Points', value: `${currentXP} XP`, color: 'text-purple-400' },
        { label: 'Next Level', value: currentXP >= 5000 ? 'MAX' : `${nextLevelXP - currentXP} XP`, color: 'text-emerald-400' },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 font-['Space_Grotesk'] tracking-tight">
                        Dashboard <span className="text-cyan-500">.</span>
                    </h1>
                    <p className="text-slate-400 text-lg flex items-center gap-2">
                        Welcome back, <span className="text-white font-bold">{user.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-400 text-xs border border-cyan-500/30 uppercase tracking-wider">
                            {user.role}
                        </span>
                    </p>
                </div>

                {/* Quick Stats Row */}
                <div className="flex gap-4 md:gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className={`text-2xl md:text-3xl font-bold font-mono ${stat.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">
                    <span>Progress to Next Rank</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* Large Card: Create/Generate */}
                <div
                    onClick={() => navigate('/generate')}
                    className="card-holographic md:col-span-2 p-8 group cursor-pointer relative flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg className="w-24 h-24 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-4">
                            AI GENERATOR
                        </span>
                        <h3 className="text-3xl font-bold text-white mb-2 font-['Space_Grotesk']">Create New Mission</h3>
                        <p className="text-slate-400 max-w-sm">Generate advanced MCQs instantly from any text or topic using our AI engine.</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
                        Initialize <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                </div>

                {/* Vertical Card: Analytics */}
                <div
                    onClick={() => navigate('/performance')}
                    className="card-holographic md:row-span-2 p-8 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">Deep Analytics</h3>
                        <p className="text-slate-400 text-sm">Analyze your performance metrics and growth over time.</p>
                    </div>
                    <div className="mt-8">
                        {/* Fake Mini Chart */}
                        <div className="flex items-end gap-2 h-16 opacity-50 mb-4">
                            <div className="w-1/5 bg-purple-500/40 h-[40%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-purple-500/60 h-[70%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-purple-500/30 h-[30%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-purple-500/80 h-[90%] rounded-t-sm"></div>
                            <div className="w-1/5 bg-purple-500/50 h-[50%] rounded-t-sm"></div>
                        </div>
                        <span className="text-purple-400 text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                            View Report <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </div>
                </div>

                {/* Medium Card: Practice/Quizzes */}
                <div
                    onClick={() => navigate('/quizzes')}
                    className="card-holographic p-8 group cursor-pointer relative"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-4">
                                PRACTICE MODE
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-1 font-['Space_Grotesk']">Enter Simulation</h3>
                            <p className="text-slate-400 text-sm">Join global challenges or practice solo.</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Medium Card: Teacher Action (Conditional) */}
                {user.role === 'teacher' && (
                    <div
                        onClick={() => navigate('/generate', { state: { type: 'global' } })}
                        className="card-holographic p-8 group cursor-pointer relative border-amber-500/30 hover:border-amber-500/60"
                    >
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-amber-500 mb-1 font-['Space_Grotesk']">Deploy Global Challenge</h3>
                                <p className="text-slate-400 text-xs">Create a competitive quiz for the leaderboard.</p>
                            </div>
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
