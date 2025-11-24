import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const Login: React.FC = () => {
  const { login } = useContext(AppContext)!;
  const navigate = useNavigate();

  const handleLogin = () => {
    login('admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-chimera-600/20 blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px]"></div>

      <div className="bg-dark-card border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-chimera-400 to-purple-500 bg-clip-text text-transparent mb-2">
            ChimeraGen
          </h1>
          <p className="text-slate-400">Secure Synthetic Data Platform</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-chimera-500 outline-none"
              placeholder="admin@chimeragen.ai"
              defaultValue="admin@chimeragen.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-chimera-500 outline-none"
              defaultValue="password"
            />
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-chimera-600 hover:bg-chimera-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-chimera-900/50"
          >
            Sign In
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Powered by Gemini 2.5 Flash</p>
          <p>Mock Credentials Active</p>
        </div>
      </div>
    </div>
  );
};

export default Login;