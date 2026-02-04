import React from 'react';
import { motion } from 'framer-motion';
import ResearchInput from './ResearchInput';

const HeroSection = ({ onSearch }) => {
    return (
        <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-emerald-500/10 rounded-full blur-[80px] mix-blend-screen" />
            </div>

            <div className="z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center space-y-12">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-4 backdrop-blur-md shadow-lg shadow-black/20">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        AI-Powered Research Assistant
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-300 drop-shadow-2xl">
                        FactFinder
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Explore deep knowledge with our advanced automated research engine.
                        <span className="block mt-2">Just ask a question, and let the agents do the work.</span>
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-2xl"
                >
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-3xl shadow-2xl border border-white/10">
                        <div className="bg-slate-950/50 rounded-[22px] p-6 backdrop-blur-sm">
                            <ResearchInput onSearch={onSearch} />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4 text-center text-slate-500 text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <span>Deep Analysis</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span>Real-time Data</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>Verified Sources</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative footer/gradient */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
    );
};

export default HeroSection;
