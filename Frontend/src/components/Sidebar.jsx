import { NavLink } from 'react-router-dom';
import { HiOutlineTemplate, HiOutlineUserAdd, HiOutlineBeaker, HiX } from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiOutlineTemplate },
    { name: 'Add Child', path: '/add-child', icon: HiOutlineUserAdd },
    { name: 'Symptom Check', path: '/symptoms', icon: HiOutlineBeaker },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed flex flex-col w-72 h-screen bg-white border-r border-gray-100 p-6 z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
    
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-700"
        >
          <HiX className="text-2xl" />
        </button>

        <h1 className="text-2xl font-black text-emerald-600 mb-10 px-4 tracking-tighter">
          Measles<span className="text-gray-800">Care</span> BD
        </h1>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'
                }`
              }
            >
              <item.icon className="text-xl" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
