import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 top-4 px-4 flex justify-center pointer-events-none">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-8 pointer-events-auto border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.1)] bg-slate-900/80 backdrop-blur-xl max-w-5xl w-full">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                            AI
                        </div>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                        Adaptive-Assess<span className="text-cyan-400">MCQ</span>
                    </span>
                </Link>
                

                {/* Navigation Links */}
                {user && (
                    <div className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1.5 rounded-full border border-white/5">
                        <NavLink to="/dashboard" label="Dashboard" icon="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        <NavLink to="/generate" label="Create" icon="M12 4v16m8-8H4" />
                        <NavLink to="/quizzes" label="Explore" icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </div>
                )}

                {/* User Profile / Auth */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex flex-col items-end leading-tight">
                                <span className="text-sm font-bold text-white font-['Space_Grotesk']">{user.name}</span>
                                <span className="text-xs text-cyan-400 uppercase tracking-wider">{user.rank || 'Cadet'} • {user.role}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Login</Link>
                            <Link to="/register" className="btn-cosmic-secondary text-sm py-2 px-4 shadow-none">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, label, icon }) => (
    <Link
        to={to}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
        {icon && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
        )}
        {label}
    </Link>
);

export default Navbar;
