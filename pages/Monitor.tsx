import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Monitor: React.FC = () => {
  const [data, setData] = useState<{time: string, latency: number, requests: number}[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Initialize data
    const initData = Array.from({length: 20}, (_, i) => ({
        time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString(),
        latency: 20 + Math.random() * 30,
        requests: 50 + Math.random() * 100
    }));
    setData(initData);

    const interval = setInterval(() => {
        const now = new Date();
        const newPoint = {
            time: now.toLocaleTimeString(),
            latency: 20 + Math.random() * 50 + (Math.random() > 0.9 ? 100 : 0), // Occasional spike
            requests: 50 + Math.random() * 100
        };

        setData(prev => [...prev.slice(1), newPoint]);

        if (Math.random() > 0.6) {
            const types = ['Ingest', 'Val', 'Train'];
            const type = types[Math.floor(Math.random() * types.length)];
            const msg = type === 'Ingest' ? `Received batch #${Math.floor(Math.random()*1000)} (Size: ${Math.floor(Math.random()*50)}kb)` :
                        type === 'Val' ? `Drift detected: ${Math.random().toFixed(4)} (Safe)` :
                        `Model auto-tune triggered`;
            
            setLogs(prev => [`[${now.toLocaleTimeString()}] [${type}] ${msg}`, ...prev].slice(0, 10));
        }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Realtime Monitor</h2>
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 font-mono">SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700 h-80">
                <h3 className="text-lg font-semibold text-white mb-4">Ingestion Latency (ms)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" hide />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                        <Area type="monotone" dataKey="latency" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLat)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-dark-card p-6 rounded-xl border border-slate-700 h-64">
                <h3 className="text-lg font-semibold text-white mb-4">Request Throughput</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                         <defs>
                            <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                        <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReq)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-dark-card p-6 rounded-xl border border-slate-700 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Event Stream</h3>
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto space-y-2 font-mono text-xs">
                    {logs.map((log, i) => (
                        <div key={i} className={`p-2 rounded border-l-2 ${log.includes('Ingest') ? 'border-blue-500 bg-blue-500/10 text-blue-300' : log.includes('Val') ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-yellow-500 bg-yellow-500/10 text-yellow-300'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Active Nodes</span>
                    <span className="text-white">4</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Queue Depth</span>
                    <span className="text-white">12</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                    <span>Err Rate</span>
                    <span className="text-white">0.01%</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;