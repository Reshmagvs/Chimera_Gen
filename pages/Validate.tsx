import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { calculateKS, calculateMatrix, calculatePrivacyMetrics } from '../services/mathUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, CartesianGrid } from 'recharts';

const Validate: React.FC = () => {
  const { datasets, generatedData, models } = useContext(AppContext)!;
  const [selectedGenId, setSelectedGenId] = useState<string>('');

  const selectedGen = generatedData.find(g => g.id === selectedGenId);
  const parentModel = selectedGen ? models.find(m => m.id === selectedGen.modelId) : null;
  const originalDataset = parentModel ? datasets.find(d => d.id === parentModel.datasetId) : null;

  const comparisons = useMemo(() => {
    if (!selectedGen || !originalDataset) return null;

    // 1. Column Distributions (First Numeric Col)
    const numCols = originalDataset.profile.filter(p => p.type === 'numeric').map(p => p.name);
    const numCol = numCols[0];
    let distData: any[] = [];
    let ksScore = 0;
    
    if (numCol) {
        const realVals = originalDataset.rows.map(r => Number(r[numCol])).filter(n => !isNaN(n));
        const synVals = selectedGen.rows.map(r => Number(r[numCol])).filter(n => !isNaN(n));
        
        // Simple histogram binning
        const min = Math.min(...realVals);
        const max = Math.max(...realVals);
        const bins = 10;
        const step = (max - min) / bins;
        
        for(let i=0; i<bins; i++) {
            const lower = min + (i * step);
            const upper = min + ((i+1) * step);
            const realCount = realVals.filter(v => v >= lower && v < upper).length;
            const synCount = synVals.filter(v => v >= lower && v < upper).length;
            distData.push({
                bin: lower.toFixed(1),
                Real: realCount,
                Synthetic: synCount
            });
        }
        
        ksScore = calculateKS(realVals, synVals);
    }

    // 2. Correlation Matrices
    const realMatrix = calculateMatrix(originalDataset.rows, originalDataset.columns);
    
    // 3. Privacy Metrics
    const privacy = calculatePrivacyMetrics(originalDataset.rows, selectedGen.rows, numCols);

    return { distData, ksScore, realMatrix, numCol, privacy };
  }, [selectedGen, originalDataset]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Validation Report</h2>
            <select 
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none"
                value={selectedGenId}
                onChange={(e) => setSelectedGenId(e.target.value)}
            >
                <option value="">-- Select Generated Set --</option>
                {generatedData.map(g => (
                    <option key={g.id} value={g.id}>Gen: {g.id.slice(0,8)}... ({g.rows.length} rows)</option>
                ))}
            </select>
       </div>

       {!selectedGen ? (
           <div className="text-center py-20 bg-dark-card border border-slate-700 rounded-xl">
               <p className="text-slate-400">Select a generated dataset to view validation metrics.</p>
           </div>
       ) : comparisons ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* Score Cards */}
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-dark-card p-4 rounded-xl border border-slate-700">
                       <h4 className="text-sm text-slate-400">KS Statistic (Quality)</h4>
                       <p className={`text-2xl font-bold ${comparisons.ksScore < 0.1 ? 'text-green-400' : 'text-yellow-400'}`}>
                           {comparisons.ksScore.toFixed(4)}
                       </p>
                       <p className="text-xs text-slate-500 mt-1">Target: &lt; 0.05 (Lower is better)</p>
                   </div>
                   <div className="bg-dark-card p-4 rounded-xl border border-slate-700">
                       <h4 className="text-sm text-slate-400">Privacy (DCR Score)</h4>
                       <p className={`text-2xl font-bold ${comparisons.privacy.minDistance > 0.05 ? 'text-blue-400' : 'text-red-400'}`}>
                           {comparisons.privacy.minDistance.toFixed(4)}
                       </p>
                       <p className="text-xs text-slate-500 mt-1">Dist. to Closest Record (Higher is safer)</p>
                   </div>
                   <div className="bg-dark-card p-4 rounded-xl border border-slate-700">
                       <h4 className="text-sm text-slate-400">Exact Leaks</h4>
                       <p className={`text-2xl font-bold ${comparisons.privacy.duplicates === 0 ? 'text-chimera-400' : 'text-red-500'}`}>
                           {comparisons.privacy.duplicates}
                       </p>
                       <p className="text-xs text-slate-500 mt-1">Exact copies of real data</p>
                   </div>
               </div>

               {/* Distribution Chart */}
               <div className="bg-dark-card p-6 rounded-xl border border-slate-700 h-80">
                   <h3 className="text-lg font-semibold text-white mb-4">Distribution Overlay: {comparisons.numCol}</h3>
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={comparisons.distData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                           <XAxis dataKey="bin" stroke="#94a3b8" />
                           <YAxis stroke="#94a3b8" />
                           <ReTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                           <Legend />
                           <Bar dataKey="Real" fill="#3b82f6" fillOpacity={0.6} />
                           <Bar dataKey="Synthetic" fill="#14b8a6" fillOpacity={0.6} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>

               {/* Correlation Heatmap (Simplified as scatter for demo) */}
               <div className="bg-dark-card p-6 rounded-xl border border-slate-700 h-80">
                   <h3 className="text-lg font-semibold text-white mb-4">Real Data Correlations</h3>
                   <ResponsiveContainer width="100%" height="100%">
                       <ScatterChart>
                           <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                           <XAxis type="category" dataKey="x" name="Column 1" stroke="#94a3b8" allowDuplicatedCategory={false} />
                           <YAxis type="category" dataKey="y" name="Column 2" stroke="#94a3b8" allowDuplicatedCategory={false} />
                           <ZAxis type="number" dataKey="value" range={[0, 500]} name="Correlation" />
                           <ReTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                           <Scatter name="Correlation" data={comparisons.realMatrix} fill="#8884d8" shape="circle" />
                       </ScatterChart>
                   </ResponsiveContainer>
               </div>
               
               <div className="lg:col-span-2 bg-dark-card p-6 rounded-xl border border-slate-700">
                   <h3 className="text-lg font-semibold text-white mb-4">Data Preview (Synthetic)</h3>
                   <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm text-slate-400">
                           <thead className="bg-slate-800 text-slate-200">
                               <tr>
                                   {Object.keys(selectedGen.rows[0] || {}).map(k => (
                                       <th key={k} className="p-3 font-medium">{k}</th>
                                   ))}
                               </tr>
                           </thead>
                           <tbody>
                               {selectedGen.rows.slice(0, 5).map((row, i) => (
                                   <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
                                       {Object.values(row).map((val: any, j) => (
                                           <td key={j} className="p-3">{String(val)}</td>
                                       ))}
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           </div>
       ) : null}
    </div>
  );
};

export default Validate;