import React from 'react';
import { Layers, FileText, Database } from 'lucide-react'; // Placeholder icons

const Sidebar = ({ history }) => {
    return (
        <aside className="w-64 glass-sidebar text-white flex flex-col hidden md:flex h-full">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Database size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-wide">FactBinder</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
                <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Recent Research
                </div>

                {history.length === 0 ? (
                    <div className="px-3 py-8 text-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 mx-auto mb-3 flex items-center justify-center">
                            <Layers size={16} className="text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-500 italic">No history yet.</p>
                    </div>
                ) : (
                    history.map((item, idx) => (
                        <div
                            key={idx}
                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                        >
                            <FileText size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                            <div className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                                {item.topic}
                            </div>
                        </div>
                    ))
                )}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1.5 rounded-full w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    System Online
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
