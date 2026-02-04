import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const ResearchInput = ({ onSearch, disabled }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) onSearch(topic);
    };

    return (
        <form onSubmit={handleSubmit} className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center glass-panel rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
                <div className="pl-4 text-slate-400">
                    <Search size={22} />
                </div>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={disabled}
                    placeholder="Ask about anything..."
                    className="w-full bg-transparent border-none text-lg text-white placeholder-slate-400 focus:ring-0 px-4 py-3 outline-none"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={disabled || !topic.trim()}
                    className="ml-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105 active:scale-95"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
            {!topic && (
                <div className="absolute top-full mt-4 flex gap-2 justify-center w-full">
                    {["Quantum Physics", "Mars Colonization", "CRISPR"].map(suggestion => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => setTopic(suggestion)}
                            className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </form>
    );
};

export default ResearchInput;
