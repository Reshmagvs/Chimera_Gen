import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Train', path: '/train' },
    { name: 'Generate', path: '/generate' },
    { name: 'Validate', path: '/validate' },
    { name: 'Monitor', path: '/monitor' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-slate-700 flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-chimera-400 to-purple-500 bg-clip-text text-transparent">
            ChimeraGen
          </h1>
          <p className="text-xs text-slate-400 mt-1">Synthetic Data Ops</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-chimera-900/50 text-chimera-300 border border-chimera-700'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
             <div>
               <p className="text-sm font-medium text-white">Admin User</p>
               <p className="text-xs text-slate-500">Pro Plan</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
      
      {/* Mobile Nav Placeholder - Simplified for demo */}
      <div className="md:hidden fixed bottom-0 w-full bg-dark-card border-t border-slate-700 p-2 flex justify-around z-50 overflow-x-auto">
          {navItems.map(item => (
              <NavLink key={item.path} to={item.path} className="text-xs p-2 text-slate-400 whitespace-nowrap">{item.name}</NavLink>
          ))}
      </div>
    </div>
  );
};

export default Layout;