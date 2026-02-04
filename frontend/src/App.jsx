import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ResearchInput from './components/ResearchInput';
import ResultsView from './components/ResultsView';
import HeroSection from './components/HeroSection';

function App() {
  const [researchState, setResearchState] = useState({
    status: 'idle', // idle, loading, complete, error
    topic: '',
    data: null,
    progress: ''
  });

  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [researchState.status]); // Refresh history when status changes (e.g. after search)

  const handleResearchStart = async (topic) => {
    setResearchState({ status: 'loading', topic, data: null, progress: 'Initializing...' });

    try {
      const response = await fetch('http://localhost:8000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedData = { documents: [], summary: '', graph_data: { nodes: [], links: [] } };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep the incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const msg = JSON.parse(jsonStr);

              if (msg.type === 'status') {
                setResearchState(prev => ({ ...prev, progress: msg.message }));
              } else if (msg.type === 'documents') {
                accumulatedData.documents = msg.data;
              } else if (msg.type === 'result') {
                accumulatedData.summary = msg.summary;
                accumulatedData.graph_data = msg.graph_data;
              } else if (msg.type === 'complete') {
                setResearchState(prev => ({ ...prev, status: 'complete', data: accumulatedData }));
              }
            } catch (e) {
              console.error("Error parsing stream:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setResearchState({ status: 'error', topic, data: null, progress: '' });
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
      <Sidebar history={history} />

      <main className="flex-1 flex flex-col relative z-10 h-full">

        {/* Only show the small header if we are NOT in idle mode */}
        {researchState.status !== 'idle' && (
          <header className="px-8 py-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FactFinder</h1>
                <p className="text-xs text-slate-500">Research & Analysis</p>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto relative scroll-smooth">
          {researchState.status === 'idle' && (
            <HeroSection onSearch={handleResearchStart} />
          )}

          {researchState.status === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-t-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-medium text-white">Researching "{researchState.topic}"...</p>
                <p className="text-sm text-slate-400 animate-pulse">{researchState.progress}</p>
              </div>
            </div>
          )}

          {researchState.status === 'complete' && (
            <div className="p-8">
              <ResultsView data={researchState.data} onNewSearch={() => setResearchState({ ...researchState, status: 'idle' })} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
