import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'add-child', label: 'Add Child' },
    { id: 'symptoms', label: 'AI Diagnosis' },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 flex-col fixed h-full transition-all duration-300">
      
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-emerald-500 px-3 py-2 rounded-xl shadow-lg shadow-emerald-200">
           
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">
            Immuno<span className="text-emerald-500">Track</span>
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {/* Optional dot indicator */}
              <div className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-emerald-500' : 'bg-gray-300'
              }`} />
              
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
          {/* Placeholder */}
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;