import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Train from './pages/Train';
import Generate from './pages/Generate';
import Validate from './pages/Validate';
import Monitor from './pages/Monitor';
import Settings from './pages/Settings';
import { Dataset, ModelArtifact, GeneratedDataset } from './types';

// Simple Context-like state handling for the demo
export interface AppState {
  user: string | null;
  datasets: Dataset[];
  models: ModelArtifact[];
  generatedData: GeneratedDataset[];
  login: (u: string) => void;
  addDataset: (d: Dataset) => void;
  addModel: (m: ModelArtifact) => void;
  addGenerated: (g: GeneratedDataset) => void;
}

export const AppContext = React.createContext<AppState | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [models, setModels] = useState<ModelArtifact[]>([]);
  const [generatedData, setGeneratedData] = useState<GeneratedDataset[]>([]);

  const state: AppState = {
    user,
    datasets,
    models,
    generatedData,
    login: setUser,
    addDataset: (d) => setDatasets(prev => [...prev, d]),
    addModel: (m) => setModels(prev => [...prev, m]),
    addGenerated: (g) => setGeneratedData(prev => [...prev, g])
  };

  return (
    <AppContext.Provider value={state}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/train" element={<Train />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/validate" element={<Validate />} />
                    <Route path="/monitor" element={<Monitor />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;