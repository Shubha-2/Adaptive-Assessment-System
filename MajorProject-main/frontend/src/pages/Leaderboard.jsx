import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../services/quizService';

const Leaderboard = () => {
    const { id } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await quizService.getLeaderboard(id);
                setLeaderboard(data);
            } catch (error) {
                console.error("Failed to load leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                <div className="text-cyan-400 font-mono text-sm animate-pulse">SYNCING_GLOBAL_DATA...</div>
            </div>
        </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto ">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 mb-4 animate-pulse">
                        LIVE RANKINGS
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Legends</span>
                    </h2>
                    <p className="text-slate-400 mt-2">Top performing agents for this mission provided by the network.</p>
                </div>

                <Link
                    to="/quizzes"
                    className="btn-secondary group flex items-center gap-2"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Return to Missions
                </Link>
            </div>

            {/* Leaderboard Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5 text-xs uppercase tracking-widest text-slate-400">
                                <th className="px-6 py-5 font-bold">Rank</th>
                                <th className="px-6 py-5 font-bold">Agent Name</th>
                                <th className="px-6 py-5 font-bold">Player Rank</th>
                                <th className="px-6 py-5 font-bold">Score</th>
                                <th className="px-6 py-5 font-bold">Time Taken</th>
                                <th className="px-6 py-5 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.length > 0 ? (
                                leaderboard.map((entry, index) => {
                                    let rankBadge;
                                    let rowClass = "hover:bg-white/5 transition-colors duration-200 group";

                                    if (index === 0) {
                                        rankBadge = <span className="text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">🥇</span>;
                                        rowClass += " bg-gradient-to-r from-amber-500/10 to-transparent";
                                    } else if (index === 1) {
                                        rankBadge = <span className="text-2xl drop-shadow-[0_0_10px_rgba(148,163,184,0.5)]">🥈</span>;
                                        rowClass += " bg-gradient-to-r from-slate-400/5 to-transparent";
                                    } else if (index === 2) {
                                        rankBadge = <span className="text-2xl drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]">🥉</span>;
                                        rowClass += " bg-gradient-to-r from-orange-700/5 to-transparent";
                                    } else {
                                        rankBadge = <span className="text-slate-500 font-mono">#{index + 1}</span>;
                                    }

                                    return (
                                        <tr key={index} className={rowClass}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center w-8 h-8">
                                                    {rankBadge}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white mr-3">
                                                        {entry.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-white group-hover:text-cyan-400 transition-colors font-['Space_Grotesk']">{entry.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">{entry.playerRank}</span>
                                                    <span className="text-xs text-slate-500">{entry.xp} XP</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-cyan-400 font-bold font-mono text-lg">{entry.score}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-sm">
                                                {Math.floor(entry.timeTaken / 60)}m {entry.timeTaken % 60}s
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    COMPLETED
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            <p>No data records found in the sector.</p>
                                            <p className="text-sm">Be the first to conquest this mission.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
