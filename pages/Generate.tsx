
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { generateSyntheticData } from '../services/geminiService';
import { GeneratedDataset } from '../types';
import { convertToCSV } from '../services/mathUtils';

const Generate: React.FC = () => {
  // Consolidate context usage at the top level to avoid Invalid Hook Call errors
  const { models, addGenerated, generatedData } = useContext(AppContext)!;
  
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastGeneratedId, setLastGeneratedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    const model = models.find(m => m.id === selectedModelId);
    if (!model) return;

    setIsGenerating(true);
    setProgress(0);
    setLastGeneratedId(null);

    try {
        const syntheticRows = await generateSyntheticData(model, rowCount, (current) => {
            setProgress(Math.round((current / rowCount) * 100));
        });

        const newId = crypto.randomUUID();
        const newGen: GeneratedDataset = {
            id: newId,
            modelId: model.id,
            rows: syntheticRows,
            createdAt: new Date().toISOString()
        };

        addGenerated(newGen);
        setLastGeneratedId(newId);

    } catch (e) {
        alert("Generation failed");
    } finally {
        setIsGenerating(false);
    }
  };

  const downloadFile = (format: 'csv' | 'json') => {
      // Use generatedData from component scope, valid since context was read at top level
      const dataset = generatedData.find(g => g.id === lastGeneratedId);
      if (!dataset) return;

      let content = '';
      let type = '';
      let name = `synthetic_${dataset.id.slice(0,6)}`;

      if (format === 'csv') {
          content = convertToCSV(dataset.rows);
          type = 'text/csv';
          name += '.csv';
      } else {
          content = JSON.stringify(dataset.rows, null, 2);
          type = 'application/json';
          name += '.json';
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const generatedSet = lastGeneratedId ? generatedData.find(g => g.id === lastGeneratedId) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white">Generate Data</h2>
      
      <div className="bg-dark-card p-8 rounded-xl border border-slate-700 shadow-xl">
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Trained Model</label>
                <select 
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-chimera-500 transition-all"
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                >
                    <option value="">-- Choose Model --</option>
                    {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                    ))}
                </select>
            </div>

            <div className="pb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-300">Number of Rows</label>
                    <span className="text-chimera-400 font-mono text-sm font-bold bg-slate-800/80 px-2 py-1 rounded border border-slate-600">{rowCount}</span>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="10" 
                        max="500" 
                        step="10"
                        value={rowCount}
                        onChange={(e) => setRowCount(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-chimera-500 hover:accent-chimera-400"
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2">Note: For demo purposes, generation is capped at 500 rows/batch via API.</p>
            </div>

            {isGenerating && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     {/* Thicker Progress Bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-4 overflow-hidden border border-slate-700">
                        <div 
                            className="bg-chimera-500 h-full rounded-full transition-all duration-300 ease-out relative" 
                            style={{ width: `${Math.max(5, progress)}%` }}
                        >
                             <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-b from-white/10 to-transparent"></div>
                        </div>
                    </div>
                    <p className="text-center text-sm font-bold text-chimera-400 animate-pulse">
                        {progress}% Complete
                    </p>
                </div>
            )}

            <button 
                disabled={!selectedModelId || isGenerating}
                onClick={handleGenerate}
                className={`w-full font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg
                    ${isGenerating 
                        ? 'bg-chimera-800/50 text-chimera-200 cursor-wait border border-chimera-700/50' 
                        : 'bg-gradient-to-r from-chimera-600 to-teal-600 hover:from-chimera-500 hover:to-teal-500 text-white shadow-chimera-900/50 hover:shadow-chimera-900/80 transform hover:-translate-y-0.5'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                `}
            >
                {isGenerating ? (
                    <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-chimera-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Synthesizing...
                    </span>
                ) : 'Generate Synthetic Data'}
            </button>

            {generatedSet && !isGenerating && (
                <div className="pt-6 border-t border-slate-700 flex gap-4 animate-in fade-in duration-500">
                    <button 
                        onClick={() => downloadFile('csv')}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download CSV
                    </button>
                    <button 
                        onClick={() => downloadFile('json')}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        Download JSON
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
