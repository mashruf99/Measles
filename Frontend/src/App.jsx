//src/App.jsx

import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddChild from './pages/AddChild';
import SymptomCheck from './pages/SymptomChecker';

const MOCK_CHILDREN = [
  { 
    id: "1", 
    name: 'Zayan Ahmed', 
    dateOfBirth: '2025-01-10', 
    guardianPhone: '01712345678',
    vaccinationDate: '2025-01-15'
  },
  { 
    id: "2", 
    name: 'Safa Karim', 
    dateOfBirth: '2024-03-22', 
    guardianPhone: '01811223344',
    vaccinationDate: ''
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [children, setChildren] = useState(MOCK_CHILDREN);

  // নতুন বাচ্চা যোগ করার ফাংশন
  const handleAddChild = (newChild) => {
    setChildren((prev) => [newChild, ...prev]);
    setActiveTab('dashboard'); // লিস্টে ফিরিয়ে নিয়ে যাবে
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard childrenData={children} />;
      case 'add-child': 
        return <AddChild onAdd={handleAddChild} />;
      case 'symptoms': 
        return <SymptomCheck />;
      default: 
        return <Dashboard childrenData={children} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;