import React from 'react';
import { Layers, FileText, Database } from 'lucide-react'; // Placeholder icons

const Sidebar = ({ history }) => {
    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
            <div className="p-6">
                <div className="flex items-center space-x-2 font-bold text-xl">
                    <Database className="text-blue-400" />
                    <span>FactBinder</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">History</div>
                {history.length === 0 ? (
                    <div className="text-sm text-slate-600 italic px-2">No recent research</div>
                ) : (
                    history.map((item, idx) => (
                        <div key={idx} className="p-2 hover:bg-slate-800 rounded cursor-pointer text-sm truncate">
                            {item.topic}
                        </div>
                    ))
                )}
            </nav>

            <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    System Operational
                </div>
                v1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;
