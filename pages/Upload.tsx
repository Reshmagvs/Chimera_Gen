
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { parseCSV, profileData } from '../services/mathUtils';
import { Dataset } from '../types';
import { useNavigate } from 'react-router-dom';

const Upload: React.FC = () => {
  const { addDataset } = useContext(AppContext)!;
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [processing, setProcessing] = useState(false);

  const processFile = async (file: File) => {
    setProcessing(true);
    setStep(1);
    
    // Step 1: Reading File
    const text = await file.text();
    
    // Transition to Step 2: Profiling
    setTimeout(() => {
        setStep(2);
        
        setTimeout(() => {
            const rows = parseCSV(text);
            if (rows.length === 0) {
                alert("No data found or invalid CSV");
                setProcessing(false);
                setStep(1);
                return;
            }

            const columns = Object.keys(rows[0]);
            const profile = profileData(rows, columns);

            // Transition to Step 3: Ready
            setTimeout(() => {
                setStep(3);
                const newDataset: Dataset = {
                    id: crypto.randomUUID(),
                    name: file.name.replace('.csv', ''),
                    rows,
                    columns,
                    profile,
                    createdAt: new Date().toISOString()
                };

                addDataset(newDataset);
                setProcessing(false);
                
                // Auto-redirect or show success option
                // For now, we stay on step 3 to let user see "Ready"
            }, 1500);
        }, 1500);
    }, 1000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (step !== 1 && step !== 3) return; // Prevent drag during processing
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const resetUpload = () => {
      setStep(1);
      setProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white">Upload Dataset</h2>
      <p className="text-slate-400">Upload a CSV file (approx. 500 rows) to begin profiling. Supported formats: CSV.</p>

      {/* Unified Container */}
      <div className="bg-dark-card p-8 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
          
          {/* Progress Bar Background */}
          {processing && (
             <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-chimera-500 to-purple-500 transition-all duration-300" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
          )}

          <div 
            className={`relative h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 mb-8 ${
                dragActive ? 'border-chimera-500 bg-chimera-900/20' : 
                step === 3 ? 'border-green-500 bg-green-900/10' :
                'border-slate-600 bg-slate-800/50 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center p-6">
                {processing ? (
                     <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-4 border-chimera-500 border-t-transparent animate-spin mb-4"></div>
                        <p className="text-lg text-white animate-pulse">
                            {step === 1 ? 'Reading CSV...' : 'Profiling Statistics...'}
                        </p>
                     </div>
                ) : step === 3 ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-xl text-white font-bold mb-2">Dataset Ready!</p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => navigate('/train')} className="bg-chimera-600 hover:bg-chimera-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Proceed to Train
                            </button>
                            <button onClick={resetUpload} className="text-slate-400 hover:text-white px-4 py-2 transition-colors">
                                Upload Another
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <svg className="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xl text-slate-300 mb-2">Drag and drop your CSV here</p>
                        <p className="text-sm text-slate-500 mb-6">or</p>
                        <label className="bg-chimera-600 hover:bg-chimera-500 text-white font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors">
                            Browse Files
                            <input type="file" className="hidden" accept=".csv" onChange={handleChange} />
                        </label>
                    </>
                )}
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg border transition-all duration-300 ${step >= 1 ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800/50 border-slate-700 opacity-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</div>
                      <h4 className={`font-semibold ${step >= 1 ? 'text-white' : 'text-slate-400'}`}>Upload</h4>
                  </div>
                  <p className="text-xs text-slate-400 ml-11">Raw tabular data ingestion.</p>
              </div>
              
              <div className={`p-4 rounded-lg border transition-all duration-300 ${step >= 2 ? 'bg-purple-500/10 border-purple-500/50' : 'bg-slate-800/50 border-slate-700 opacity-50'}`}>
                   <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</div>
                      <h4 className={`font-semibold ${step >= 2 ? 'text-white' : 'text-slate-400'}`}>Profile</h4>
                  </div>
                  <p className="text-xs text-slate-400 ml-11">Statistical analysis & typing.</p>
              </div>
              
              <div className={`p-4 rounded-lg border transition-all duration-300 ${step === 3 ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-800/50 border-slate-700 opacity-50'}`}>
                   <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'}`}>3</div>
                      <h4 className={`font-semibold ${step === 3 ? 'text-white' : 'text-slate-400'}`}>Ready</h4>
                  </div>
                  <p className="text-xs text-slate-400 ml-11">Prepared for model training.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Upload;
