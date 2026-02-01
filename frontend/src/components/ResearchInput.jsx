import React, { useState } from 'react';

const ResearchInput = ({ onSearch, disabled }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            onSearch(topic);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-center">What would you like to research?</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Autonomous Vehicle Safety, Quantum Computing Advances..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:bg-blue-300"
                    disabled={disabled || !topic.trim()}
                >
                    Research
                </button>
            </form>
        </div>
    );
};

export default ResearchInput;
