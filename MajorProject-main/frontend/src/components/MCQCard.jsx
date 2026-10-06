import React from 'react';

const MCQCard = ({ mcq, index, showAnswer = false, selectedOption, onSelect }) => {
    const getOptionClass = (option) => {
        let baseClass = "p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-3 relative overflow-hidden group ";

        if (showAnswer) {
            if (option === mcq.correctAnswer) {
                return baseClass + "bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]";
            }
            if (selectedOption === option && option !== mcq.correctAnswer) {
                return baseClass + "bg-red-500/20 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]";
            }
            return baseClass + "bg-slate-800/50 border-white/5 text-slate-500 opacity-50";
        } else {
            if (selectedOption === option) {
                return baseClass + "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400";
            }
            return baseClass + "bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-700/60 hover:border-cyan-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]";
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/5 shadow-lg hover:shadow-cyan-900/20 transition-all duration-500 group">
            <div className="mb-6 border-b border-white/10 pb-4">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20 hidden sm:inline-block font-mono">
                        Query_Sequence_{index + 1}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${mcq.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : mcq.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {mcq.difficulty.toUpperCase()}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white leading-relaxed font-['Space_Grotesk']">
                    {mcq.question}
                </h3>
            </div>

            <div className="space-y-3">
                {mcq.options.map((option, i) => (
                    <div
                        key={i}
                        onClick={() => !showAnswer && onSelect && onSelect(option)}
                        className={getOptionClass(option)}
                    >
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${selectedOption === option ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'}`}>
                            {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-medium">{option}</span>
                    </div>
                ))}
            </div>

            {showAnswer && (
                <div className="mt-6 p-5 bg-blue-900/20 border border-blue-500/30 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Intel / Explanation
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{mcq.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default MCQCard;
