import React, { useState } from "react";
import { addMonths, isPast } from "../utils/helpers";
import { HiOutlinePencilAlt, HiCheck, HiOutlineTrash } from "react-icons/hi";
import Swal from "sweetalert2";

const VACCINES_CONFIG = [
  { id: "bcg_opv0", name: "BCG + OPV-0", months: 0 },
  { id: "penta1", name: "Pentavalent-1", months: 1.5 },
  { id: "penta2", name: "Pentavalent-2", months: 2.5 },
  { id: "penta3", name: "Pentavalent-3", months: 3.5 },
  { id: "mr1", name: "MR Dose 1 (হাম)", months: 9 },
  { id: "mr2", name: "MR Dose 2 (হাম)", months: 15 },
];

const ScheduleModal = ({ child, onClose, onUpdate, onDelete }) => {

  const [schedule, setSchedule] = useState(() => {
    const savedVaccines = child.prev_vaccines || {};

    return VACCINES_CONFIG.map((v) => {
      const dateFromDB = savedVaccines[v.id];
      return {
        id: v.id,
        name: v.name,
        due: addMonths(child.date_of_birth, v.months),
        done: !!dateFromDB,
        givenDate: dateFromDB || "",
      };
    });
  });

  const toggleDone = (index) => {
    const updated = [...schedule];
    updated[index].done = !updated[index].done;
    updated[index].givenDate = updated[index].done
      ? new Date().toISOString().split("T")[0]
      : "";
    setSchedule(updated);
  };

  const handleGivenDateChange = (index, newDate) => {
    const updated = [...schedule];
    updated[index].givenDate = newDate;
    updated[index].done = !!newDate;
    setSchedule(updated);
  };

  const handleSave = () => {
    const vaccinesToSave = {};
    schedule.forEach((v) => {
      if (v.givenDate) vaccinesToSave[v.id] = v.givenDate;
    });

    onUpdate(child.id, vaccinesToSave);

    // ✅ Success alert for update
    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Vaccination schedule updated.",
      confirmButtonColor: "#10b981",
    });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await onDelete(child.id);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Child record removed successfully.",
          confirmButtonColor: "#10b981",
        });

        onClose();
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Could not delete record.",
        });
      }
    }
  };

  const progress = Math.round(
    (schedule.filter((v) => v.done).length / schedule.length) * 100
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl relative">

        <button
          onClick={handleDelete}
          className="absolute top-6 left-6 text-rose-300 hover:text-rose-600 transition-all flex items-center gap-1 text-xs font-bold"
        >
          <HiOutlineTrash /> DELETE RECORD
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-300 hover:text-black text-3xl"
        >
          &times;
        </button>

        <div className="text-center mt-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Vaccine Manager</h2>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">
            {child.name}
          </p>
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded-2xl">
          <div className="flex justify-between text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {schedule.map((v, i) => {
            const overdue = isPast(v.due) && !v.done;

            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border transition-all ${
                  v.done
                    ? "bg-emerald-50 border-emerald-100"
                    : overdue
                    ? "bg-rose-50 border-rose-100"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-700 text-sm">
                      {v.name}
                    </h4>

                    <p className="text-[10px] text-gray-400 font-bold">
                      Expected: {new Date(v.due).toLocaleDateString()}
                    </p>

                    <div className="mt-2">
                      <input
                        type="date"
                        value={v.givenDate}
                        onChange={(e) =>
                          handleGivenDateChange(i, e.target.value)
                        }
                        className={`text-[11px] p-1 rounded border-b bg-transparent outline-none ${
                          v.done
                            ? "border-emerald-200 text-emerald-700"
                            : "border-gray-200 text-gray-500"
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDone(i)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      v.done
                        ? "bg-emerald-600 text-white"
                        : overdue
                        ? "bg-rose-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {v.done ? <HiCheck className="text-lg" /> : "Mark Done"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
