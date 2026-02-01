import React, { useState } from 'react';

const ResultsView = ({ data, onNewSearch }) => {
    const [activeTab, setActiveTab] = useState('summary');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex space-x-4 bg-white p-1 rounded-lg border border-gray-200">
                    {['summary', 'graph', 'sources'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md capitalize font-medium transition ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button onClick={onNewSearch} className="text-sm text-blue-600 hover:underline">
                    New Research
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
                {activeTab === 'summary' && (
                    <div className="prose max-w-none">
                        <h3 className="text-xl font-bold mb-4">Research Summary</h3>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {data.summary || "No summary available."}
                        </div>
                    </div>
                )}

                {activeTab === 'graph' && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Knowledge Graph Visualization would render here using react-force-graph.</p>
                        {/* Integration point for Knowledge Graph */}
                    </div>
                )}

                {activeTab === 'sources' && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Sources</h3>
                        <ul className="space-y-3">
                            {data.documents && data.documents.map((doc, idx) => (
                                <li key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="font-semibold text-sm text-blue-600">
                                        {doc.metadata?.source || "Unknown Source"}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
