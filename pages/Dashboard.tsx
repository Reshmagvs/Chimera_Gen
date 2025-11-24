import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { datasets, models, generatedData } = useContext(AppContext)!;

  const stats = [
    { label: 'Total Datasets', value: datasets.length, color: 'text-blue-400' },
    { label: 'Trained Models', value: models.length, color: 'text-purple-400' },
    { label: 'Generated Sets', value: generatedData.length, color: 'text-chimera-400' },
    { label: 'Total Rows Synthesized', value: generatedData.reduce((acc, g) => acc + g.rows.length, 0), color: 'text-pink-400' },
  ];

  const data = [
    { name: 'Mon', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Tue', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Wed', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Thu', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Fri', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Sat', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Sun', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-dark-card p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</h3>
            <p className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-card p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Generation Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    itemStyle={{ color: '#5eead4' }}
                />
                <Area type="monotone" dataKey="uv" stroke="#0d9488" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-xl border border-slate-700">
           <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <span className="text-slate-400">API Latency</span>
                  <span className="text-green-400 font-mono">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-slate-400">GPU Workers</span>
                  <span className="text-blue-400 font-mono">Active (Simulated)</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-slate-400">Privacy Check</span>
                  <span className="text-chimera-400 font-mono">Enabled</span>
              </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gemini Model</span>
                  <span className="text-purple-400 font-mono">2.5 Flash</span>
              </div>
           </div>
           
           <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
             <h4 className="text-sm font-medium text-white mb-2">Recent Alert</h4>
             <p className="text-xs text-slate-400">Model "Finance_CTGAN_v1" finished training with 0.04 loss.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;