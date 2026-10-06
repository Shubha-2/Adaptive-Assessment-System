import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import quizService from '../services/quizService';
import MCQCard from '../components/MCQCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateMCQ = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [generationMode, setGenerationMode] = useState('topic'); // 'topic' | 'text'
    const [topic, setTopic] = useState('');
    const [sourceText, setSourceText] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [difficulty, setDifficulty] = useState('Medium');
    const [count, setCount] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    // Generated Data State
    const [generatedMCQs, setGeneratedMCQs] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [quizType, setQuizType] = useState(location.state?.type || 'local');
    const [timePerQuestion, setTimePerQuestion] = useState(60);
    const [password, setPassword] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let data;
            // If topic is empty in text mode, use a placeholder or first few words
            const effectiveTopic = generationMode === 'topic' ? topic : (pdfFile ? pdfFile.name : (sourceText.substring(0, 30) + '...'));

            if (generationMode === 'text' && pdfFile) {
                // PDF Upload Mode
                const formData = new FormData();
                formData.append('pdfFile', pdfFile);
                formData.append('difficulty', difficulty);
                formData.append('count', count);
                formData.append('topic', effectiveTopic);
                if (sourceText) formData.append('sourceText', sourceText);

                data = await quizService.generateMCQsFromPDF(formData);
            } else {
                // Standard Text/Topic Mode
                data = await quizService.generateMCQs(effectiveTopic, difficulty, count, sourceText);
            }

            setGeneratedMCQs(data);
            toast.success('Mission Data Generated!');
        } catch (error) {
            toast.error('Generation Failed.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuiz = async () => {
        if (!quizTitle.trim()) {
            toast.error('Mission Title Required');
            return;
        }

        if (quizType === 'global' && user.role !== 'teacher') {
            toast.error('Unauthorized: Teacher Clearance Required');
            return;
        }

        try {
            const mcqIds = generatedMCQs.map(mcq => mcq.id);
            const calculatedTotalTime = Math.ceil((generatedMCQs.length * timePerQuestion) / 60);
            const savedQuiz = await quizService.createQuiz(quizTitle, quizType, mcqIds, timePerQuestion, calculatedTotalTime, password);
            toast.success('Mission Initialized!');
            navigate(`/quiz/${savedQuiz.id}`);
        } catch (error) {
            toast.error('Initialization Failed.');
            console.error(error);
        }
    };

    return (
        <div className="pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto ">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Space_Grotesk']">
                    AI Mission <span className="text-cyan-400">Generator</span>
                </h1>
                <p className="text-slate-400">Initialize a new quiz sequence using advanced generative AI.</p>
            </div>

            {!generatedMCQs.length ? (
                <div className="glass-panel p-1 rounded-3xl relative overflow-hidden max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
                    <div className="bg-slate-900/90 relative rounded-[22px] p-8 backdrop-blur-xl">
                        <form onSubmit={handleGenerate} className="space-y-8">
                            {/* Mode Selection */}
                            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setGenerationMode('topic')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${generationMode === 'topic' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    TOPIC BASED
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGenerationMode('text')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${generationMode === 'text' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    CUSTOM TEXT
                                </button>
                            </div>

                            {/* Conditional Inputs */}
                            {generationMode === 'topic' ? (
                                <div>
                                    <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Target Subject</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                        <input
                                            type="text"
                                            required={generationMode === 'topic'}
                                            placeholder="Enter topic (e.g., Quantum Physics)..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="relative input-field w-full px-5 py-4 bg-slate-900 text-lg border-transparent focus:border-cyan-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Study Material (Text)</label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                            <textarea
                                                placeholder="Paste your notes, article, or text here..."
                                                value={sourceText}
                                                onChange={(e) => setSourceText(e.target.value)}
                                                rows="4"
                                                className="relative input-field w-full px-5 py-4 bg-slate-900 text-sm border-transparent focus:border-purple-500 resize-none font-mono"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-700"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-slate-900 px-2 text-slate-500">OR UPLOAD PDF</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">Upload Document</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setPdfFile(e.target.files[0])}
                                            className="block w-full text-sm text-slate-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-pink-500/10 file:text-pink-400
                                                hover:file:bg-pink-500/20
                                                cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Complexity</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="input-field w-full px-5 py-4 bg-slate-900 appearance-none border-slate-700 focus:border-purple-500"
                                    >
                                        <option value="Easy">Novice</option>
                                        <option value="Medium">Intermediate</option>
                                        <option value="Hard">Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Data Points</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={count}
                                        onChange={(e) => setCount(e.target.value)}
                                        className="input-field w-full px-5 py-4 bg-slate-900 border-slate-700 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 relative overflow-hidden group ${isLoading ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'btn-cosmic'}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                        </span>
                                        <span className="font-mono">PROCESSING_DATA...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                        INITIALIZE GENERATION
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in-up space-y-8">
                    <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div>
                            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Mission Preview</h2>
                            <p className="text-slate-400 text-sm">Review generated data before finalization.</p>
                        </div>
                        <button
                            onClick={() => setGeneratedMCQs([])}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors"
                        >
                            Abort & Retry
                        </button>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <h3 className="text-lg font-bold text-cyan-400 mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 mb-2">MISSION TITLE</label>
                                <input
                                    type="text"
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                    placeholder="Enter mission designation..."
                                    className="input-field w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">VISIBILITY</label>
                                <select
                                    value={quizType}
                                    onChange={(e) => setQuizType(e.target.value)}
                                    className="input-field w-full bg-slate-900"
                                >
                                    <option value="local">Personal Simulation</option>
                                    {user.role === 'teacher' && <option value="global">Global Challenge</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">TIMER (SEC)</label>
                                <input
                                    type="number"
                                    value={timePerQuestion}
                                    onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
                                    className="input-field w-full"
                                />
                            </div>
                            {quizType === 'global' && (
                                <div>
                                    <label className="block text-xs font-bold text-red-400 mb-2">ACCESS PASSWORD (OPTIONAL)</label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Secure contest..."
                                        className="input-field w-full border-red-500/30 focus:border-red-500"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSaveQuiz}
                                className="btn-cosmic px-8 py-3 w-full md:w-auto"
                            >
                                Confirm & Launch
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {generatedMCQs.map((mcq, index) => (
                            <MCQCard key={index} mcq={mcq} index={index} showAnswer={false} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateMCQ;
