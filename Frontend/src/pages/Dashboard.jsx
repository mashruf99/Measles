// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildCard from '../components/ChildCard';
import ScheduleModal from '../components/ScheduleModal';
import { supabase, getUserId } from "../utils/supabase";
import { Link } from 'react-router-dom';

import {
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineBell,
  HiPlusCircle
} from 'react-icons/hi';

const Dashboard = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChildrenData(data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const getChildStatus = (dob) => {
    if (!dob) return 'on-track';
    const birthDate = new Date(dob);
    const today = new Date();
    const diffMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

    if (diffMonths >= 9) return 'overdue';
    if (diffMonths >= 8) return 'upcoming';
    return 'on-track';
  };

  const handleUpdateVaccine = async (id, updatedVaccines) => {
    const { error } = await supabase
      .from('children')
      .update({ prev_vaccines: updatedVaccines })
      .eq('id', id);

    if (error) {
      alert("Update failed!");
    } else {
      fetchChildren();
      setSelectedChild(null);
    }
  };

  const handleDeleteChild = async (id) => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিত যে আপনি এই তথ্যটি মুছে ফেলতে চান?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Delete failed!");
    } else {
      setChildrenData(prev => prev.filter(c => c.id !== id));
      setSelectedChild(null);
    }
  };

  const stats = [
    { label: 'Total Children', val: childrenData.length, icon: HiOutlineUserGroup, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Overdue Vaccines', val: childrenData.filter(c => getChildStatus(c.date_of_birth) === 'overdue').length, icon: HiOutlineClock, bg: 'bg-rose-50', color: 'text-rose-600' },
    { label: 'Upcoming (30d)', val: childrenData.filter(c => getChildStatus(c.date_of_birth) === 'upcoming').length, icon: HiOutlineBell, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl text-2xl`}>
              <s.icon />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-gray-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Child Registry</h3>
          {childrenData.length > 0 && (
            <button
              onClick={() => navigate('/add-child')}
              className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline"
            >
              <HiPlusCircle className="text-xl" /> Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childrenData.length === 0 ? (
            <Link
              to="/add-child"
              className="group cursor-pointer border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all min-h-[250px] no-underline"
            >
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-all">
                <HiPlusCircle className="text-4xl text-gray-300 group-hover:text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-500 group-hover:text-emerald-700 uppercase tracking-tight">
                  No Child Registered
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                  Click here to add your first child
                </p>
              </div>
            </Link>
          ) : (
            childrenData.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                status={getChildStatus(child.date_of_birth)}
                onClick={() => setSelectedChild(child)}
              />
            ))
          )}
        </div>
      </div>

      {selectedChild && (
        <ScheduleModal
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onUpdate={handleUpdateVaccine}
          onDelete={handleDeleteChild}
        />
      )}
    </div>
  );
};

export default Dashboard;
