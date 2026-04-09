import React, { useState } from "react";
import { addMonths, isPast } from "../utils/helpers";
import { HiOutlinePencilAlt, HiCheck } from "react-icons/hi"; // Icons

const VACCINES_CONFIG = [
  { id: "bcg_opv0", name: "BCG + OPV-0", months: 0 },
  { id: "penta1", name: "Pentavalent-1", months: 1.5 },
  { id: "penta2", name: "Pentavalent-2", months: 2.5 },
  { id: "penta3", name: "Pentavalent-3", months: 3.5 },
  { id: "mr1", name: "MR Dose 1 (হাম)", months: 9 },
  { id: "mr2", name: "MR Dose 2 (হাম)", months: 15 },
];

const ScheduleModal = ({ child, onClose, onUpdate }) => {
  const [schedule, setSchedule] = useState(() => {
    if (child.schedule && child.schedule.length > 0) return child.schedule;

    return VACCINES_CONFIG.map((v) => {
      const dateFromForm = child.prevVaccines ? child.prevVaccines[v.id] : "";
      return {
        id: v.id,
        name: v.name,
        due: addMonths(child.dateOfBirth, v.months), // ক্যালকুলেটেড ডিফল্ট
        done: !!dateFromForm,
        givenDate: dateFromForm || "", 
      };
    });
  });

  // ভ্যাকসিন দেওয়ার তারিখ বা শিডিউল ডেট পরিবর্তন করার স্টেট
  const [editingIdx, setEditingIdx] = useState(null);

  const toggleDone = (index) => {
    const updated = [...schedule];
    updated[index].done = !updated[index].done;
    updated[index].givenDate = updated[index].done ? new Date().toISOString().split("T")[0] : "";
    setSchedule(updated);
  };

  // Expected Due Date পরিবর্তন করার ফাংশন
  const handleDueDateChange = (index, newDate) => {
    const updated = [...schedule];
    updated[index].due = newDate;
    setSchedule(updated);
  };

  // Given Date (যেদিন টিকা দেওয়া হলো) পরিবর্তন
  const handleGivenDateChange = (index, newDate) => {
    const updated = [...schedule];
    updated[index].givenDate = newDate;
    setSchedule(updated);
  };

  const handleSave = () => {
    onUpdate(child._id || child.id, schedule);
    onClose();
  };

  const completed = schedule.filter((v) => v.done).length;
  const progress = Math.round((completed / schedule.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Vaccine Manager</h2>
            <p className="text-xs text-gray-400 font-bold uppercase">{child.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-black transition-all text-3xl">&times;</button>
        </div>

        {/* Progress */}
        <div className="mb-6 bg-gray-50 p-4 rounded-2xl">
          <div className="flex justify-between text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {schedule.map((v, i) => {
            const overdue = isPast(v.due) && !v.done;
            const isEditing = editingIdx === i;

            return (
              <div key={i} className={`p-4 rounded-2xl border transition-all ${v.done ? "bg-emerald-50 border-emerald-100" : overdue ? "bg-rose-50 border-rose-100" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-700 text-sm">{v.name}</h4>
                      {/* Edit Button */}
                      <button 
                        onClick={() => setEditingIdx(isEditing ? null : i)}
                        className="text-gray-400 hover:text-emerald-600 transition"
                      >
                        {isEditing ? <HiCheck className="text-lg text-emerald-600" /> : <HiOutlinePencilAlt />}
                      </button>
                    </div>

                    {/* Expected Date Display / Edit */}
                    <div className="mt-1">
                      {isEditing ? (
                        <div className="space-y-2 mt-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Reschedule Expected Date:</label>
                          <input 
                            type="date" 
                            value={new Date(v.due).toISOString().split('T')[0]} 
                            onChange={(e) => handleDueDateChange(i, e.target.value)}
                            className="block w-full text-xs p-2 border rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Expected: {new Date(v.due).toDateString()}
                        </p>
                      )}
                    </div>

                    {/* Given Date (When Done) */}
                    {v.done && (
                      <div className="mt-3 pt-2 border-t border-emerald-100">
                        <label className="text-[9px] font-black text-emerald-600 uppercase">Vaccination Date:</label>
                        <input 
                          type="date" 
                          value={v.givenDate} 
                          onChange={(e) => handleGivenDateChange(i, e.target.value)}
                          className="block w-full bg-transparent text-xs font-bold text-emerald-700 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleDone(i)}
                    className={`ml-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
                      v.done ? "bg-emerald-600 text-white" : overdue ? "bg-rose-600 text-white shadow-rose-100" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {v.done ? "Completed" : overdue ? "Overdue" : "Mark Done"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleSave} 
          className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
        >
          Update Record
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;