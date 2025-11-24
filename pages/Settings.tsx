import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white">Settings</h2>

      <div className="bg-dark-card p-6 rounded-xl border border-slate-700 space-y-8">
        
        {/* API Configuration */}
        <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Model Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Gemini Model Version</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none">
                        <option>Gemini 2.5 Flash (Recommended)</option>
                        <option>Gemini 1.5 Pro</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Max Token Output</label>
                    <input type="number" defaultValue={8192} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none" />
                </div>
            </div>
        </div>

        {/* Privacy Defaults */}
        <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Privacy Safety Rails</h3>
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Hashing Sensitive Columns</p>
                        <p className="text-xs text-slate-500">Automatically hash email, ssn, phone columns.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chimera-600"></div>
                    </label>
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Reject Overfit Models</p>
                        <p className="text-xs text-slate-500">Fail training if training loss &lt; 0.001 (Memoization check).</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chimera-600"></div>
                    </label>
                </div>
            </div>
        </div>

        {/* Retention */}
         <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Data Retention</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Delete Models After</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none">
                        <option>Never</option>
                        <option>30 Days</option>
                        <option>90 Days</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="pt-4 flex justify-end">
            <button className="bg-chimera-600 hover:bg-chimera-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Save Configuration
            </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;