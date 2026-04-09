import React, { useState } from 'react';
import ChildCard from '../components/ChildCard';
import ScheduleModal from '../components/ScheduleModal';
import { HiOutlineUserGroup, HiOutlineClock, HiOutlineBell } from 'react-icons/hi';

const Dashboard = ({ childrenData }) => {
  const [selectedChild, setSelectedChild] = useState(null);

  const getChildStatus = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const diffMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    
    if (diffMonths >= 9) return 'overdue';
    if (diffMonths >= 8) return 'upcoming';
    return 'on-track';
  };

  const stats = [
    { label: 'Total Children', val: childrenData.length, icon: HiOutlineUserGroup, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Overdue Vaccines', val: childrenData.filter(c => getChildStatus(c.dateOfBirth) === 'overdue').length, icon: HiOutlineClock, bg: 'bg-rose-50', color: 'text-rose-600' },
    { label: 'Upcoming (30d)', val: childrenData.filter(c => getChildStatus(c.dateOfBirth) === 'upcoming').length, icon: HiOutlineBell, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-10">
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`p-4 ${s.bg} ${s.color} rounded-xl text-2xl`}>
              <s.icon />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black text-gray-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Children Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Child Registry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childrenData.map(child => (
            <ChildCard
              key={child.id || child._id}
              child={child}
              status={getChildStatus(child.dateOfBirth)}
              onClick={() => setSelectedChild(child)} // এই onClick-ই ChildCard এ যাবে
            />
          ))}
        </div>
      </div>

      {selectedChild && (
        <ScheduleModal
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onUpdate={(id, schedule) => {
            console.log("Saving data for child:", id, schedule);
            setSelectedChild(null);
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;