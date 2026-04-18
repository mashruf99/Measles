//src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import SymptomCheck from './pages/SymptomChecker';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/symptoms" element={<SymptomCheck />} />
      </Routes>
    </Layout>
  );
}

export default App;
