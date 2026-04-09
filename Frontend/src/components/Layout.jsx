import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const titles = {
    dashboard: { main: 'Dashboard', sub: 'Monitor vaccination status and upcoming appointments.' },
    'add-child': { main: 'Add Child', sub: 'Register a new profile to start tracking immunization.' },
    symptoms: { main: 'AI Symptom Check', sub: 'Use our neural engine to analyze skin conditions.' }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 md:ml-72 min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800">{titles[activeTab].main}</h2>
            <p className="text-xs text-gray-500 font-medium">{titles[activeTab].sub}</p>
          </div>
          
        </header>

        <section className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;