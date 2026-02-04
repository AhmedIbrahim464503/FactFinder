import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { FileText, Share2, Globe, Layout } from 'lucide-react';

const ResultsView = ({ data, onNewSearch }) => {
    const [activeTab, setActiveTab] = useState('summary');

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex space-x-1 glass-panel p-1 rounded-xl">
                    {[
                        { id: 'summary', icon: FileText, label: 'Summary' },
                        { id: 'graph', icon: Share2, label: 'Knowledge Graph' },
                        { id: 'sources', icon: Globe, label: 'Sources' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onNewSearch}
                    className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                >
                    New Research
                </button>
            </div>

            <div className="flex-1 glass-panel rounded-2xl p-6 overflow-y-auto relative min-h-0">
                {activeTab === 'summary' && (
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Research Summary
                        </h3>
                        <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-lg">
                            {data.summary || "No summary available."}
                        </div>
                    </div>
                )}

                {activeTab === 'graph' && (
                    <div className="flex flex-col h-full bg-black/20 rounded-xl overflow-hidden border border-white/5 relative group">
                        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-slate-400 pointer-events-none">
                            Interactive Graph
                        </div>
                        {data.graph_data && data.graph_data.nodes && data.graph_data.nodes.length > 0 ? (
                            <ForceGraph2D
                                graphData={data.graph_data}
                                nodeLabel="id"
                                nodeAutoColorBy="group"
                                linkDirectionalParticles={2}
                                linkDirectionalParticleSpeed={0.005}
                                width={800} // Ideally interactive/responsive (parent container size)
                                height={600}
                                backgroundColor="rgba(0,0,0,0)"
                                nodeRelSize={6}
                                linkColor={() => "rgba(255,255,255,0.2)"}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <Share2 size={48} className="mb-4 opacity-20" />
                                <p>No graph relationships found.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sources' && (
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-white">Referenced Documents</h3>
                        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            {data.documents && data.documents.map((doc, idx) => (
                                <li key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 group-hover:text-blue-300">
                                            <FileText size={14} />
                                        </div>
                                        <div className="font-semibold text-sm text-blue-300 truncate flex-1">
                                            {doc.metadata?.source || "Unknown Source"}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                                        {doc.page_content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsView;
