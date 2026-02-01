import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ResearchInput from './components/ResearchInput';
import ResultsView from './components/ResultsView';

function App() {
  const [researchState, setResearchState] = useState({
    status: 'idle', // idle, loading, complete, error
    topic: '',
    data: null
  });

  const handleResearchStart = async (topic) => {
    setResearchState({ status: 'loading', topic, data: null });
    try {
      const response = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const result = await response.json();
      setResearchState({ status: 'complete', topic, data: result });
    } catch (error) {
      console.error(error);
      setResearchState({ status: 'error', topic, data: null });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar history={[]} /> {/* History placeholder */}

      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">FactFinder</h1>
          <p className="text-slate-500">Automated Research Explorer powered by LangChain</p>
        </header>

        <div className="flex-1 overflow-y-auto">
          {researchState.status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full">
              <ResearchInput onSearch={handleResearchStart} disabled={false} />
            </div>
          )}

          {researchState.status === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-lg text-slate-600">Researching "{researchState.topic}"...</p>
              <p className="text-sm text-slate-400">Retrieving documents &bull; Processing &bull; Generating Graph</p>
            </div>
          )}

          {researchState.status === 'complete' && (
            <ResultsView data={researchState.data} onNewSearch={() => setResearchState({ ...researchState, status: 'idle' })} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
