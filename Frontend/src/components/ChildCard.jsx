import React from "react";

// Dashboard থেকে 'onClick' পাঠানো হয়েছে, তাই এখানে 'onClick' রিসিভ করতে হবে
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

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500">
          {getInitials(child.name)}
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{child.name}</h4>
          <span className={`text-xs px-2 py-1 rounded-md border ${getStatusStyle()}`}>
            {status || 'On Track'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-5">
        {/* Mock ডাটাতে 'dob' আছে আর Form-এ 'dateOfBirth', তাই দুটিই চেক করা ভালো */}
        <p>📅 DOB: {new Date(child.dateOfBirth || child.dob).toLocaleDateString()}</p>
        <p>📞 Phone: {child.phone || child.guardianPhone || 'N/A'}</p>
      </div>

      <button
        onClick={onClick} // এখানে onClick কল হবে
        className="w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
      >
        View Schedule
      </button>
    </div>
  );
};

export default ChildCard;