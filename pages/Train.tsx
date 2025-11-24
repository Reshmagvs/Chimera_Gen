import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Dataset, ModelType, TrainingParams } from '../types';
import { trainModel } from '../services/geminiService';

const Train: React.FC = () => {
  const { datasets, addModel } = useContext(AppContext)!;
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [modelType, setModelType] = useState<ModelType>(ModelType.CTGAN);
  const [epochs, setEpochs] = useState<number>(300);
  const [batchSize, setBatchSize] = useState<number>(64);
  const [isTraining, setIsTraining] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleTrain = async () => {
    const dataset = datasets.find(d => d.id === selectedDatasetId);
    if (!dataset) return;

    setIsTraining(true);
    setLogs(prev => [...prev, `Initializing ${modelType} architecture...`]);

    const params: TrainingParams = { epochs, batchSize, modelType };
    
    // Simulate steps
    setLogs(prev => [...prev, "Profiling columns for privacy constraints..."]);
    
    try {
        const model = await trainModel(dataset, params, `${dataset.name}_${modelType}_v1`);
        setLogs(prev => [...prev, "Generative patterns analyzed by Gemini Engine."]);
        addModel(model);
        setLogs(prev => [...prev, "Training Complete. Model artifact saved."]);
    } catch (e) {
        setLogs(prev => [...prev, "Error: Training failed."]);
    } finally {
        setIsTraining(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Train Model</h2>
        
        <div className="bg-dark-card p-6 rounded-xl border border-slate-700 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Dataset</label>
                <select 
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-chimera-500"
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                >
                    <option value="">-- Choose Dataset --</option>
                    {datasets.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.rows.length} rows)</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Model Architecture</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setModelType(ModelType.CTGAN)}
                        className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${modelType === ModelType.CTGAN ? 'bg-chimera-900/50 border-chimera-500 text-chimera-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                    >
                        CTGAN
                        <span className="block text-xs font-normal mt-1 opacity-70">Best for tabular columns</span>
                    </button>
                    <button 
                         onClick={() => setModelType(ModelType.VAE)}
                         className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${modelType === ModelType.VAE ? 'bg-purple-900/50 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                    >
                        Variational Autoencoder
                        <span className="block text-xs font-normal mt-1 opacity-70">Latent space sampling</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Epochs</label>
                    <input 
                        type="number" 
                        value={epochs}
                        onChange={(e) => setEpochs(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Batch Size</label>
                    <input 
                        type="number" 
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none" 
                    />
                </div>
            </div>

            <div className="pt-4">
                 <button 
                    disabled={!selectedDatasetId || isTraining}
                    onClick={handleTrain}
                    className="w-full bg-chimera-600 hover:bg-chimera-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-chimera-900/50 transition-all"
                >
                    {isTraining ? 'Training in Progress...' : 'Start Training'}
                </button>
            </div>
        </div>
      </div>

      <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Training Console</h3>
          <div className="bg-black/50 p-4 rounded-xl border border-slate-700 h-96 overflow-y-auto font-mono text-sm">
             {logs.length === 0 && <span className="text-slate-600">Waiting for job...</span>}
             {logs.map((log, i) => (
                 <div key={i} className="mb-2">
                     <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-green-400">{log}</span>
                 </div>
             ))}
             {isTraining && (
                 <div className="animate-pulse text-chimera-500">_</div>
             )}
          </div>
      </div>
    </div>
  );
};

export default Train;