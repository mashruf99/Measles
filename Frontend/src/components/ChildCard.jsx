// components/ChildCard.jsx
import React from "react";

const ChildCard = ({ child, status, onClick }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "overdue": return "bg-rose-50 text-rose-600 border-rose-100";
      case "upcoming": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) : "??";

  const dob = child.date_of_birth || child.dateOfBirth;
  const phone = child.guardian_phone || child.guardianPhone || 'N/A';

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          {getInitials(child.name)}
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{child.name}</h4>
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${getStatusStyle()}`}>
            {status || 'On Track'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-5">
        <div className="flex justify-between border-b border-gray-50 pb-1">
          <span className="text-gray-400">DOB:</span>
          <span className="font-medium">{dob ? new Date(dob).toLocaleDateString('bn-BD') : 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-50 pb-1">
          <span className="text-gray-400">Phone:</span>
          <span className="font-medium">{phone}</span>
        </div>
      </div>

      <button
        onClick={onClick}
        className="w-full py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-gray-100"
      >
        View Schedule
      </button>
    </div>
  );
};

export default ChildCard;
