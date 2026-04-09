//src/pages/AddChild.jsx

import React, { useState } from "react";
import { getUserId  } from "../utils/user";
const AddChild = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    guardianPhone: "",
    bcg_opv0: "",
    penta1: "",
    penta2: "",
    penta3: "",
    mr1: "",
    mr2: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const userId = getUserId();
    console.log(userId);
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.dateOfBirth || !form.guardianPhone) {
      alert("Please fill in Name, DOB and Phone!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newChild = {
        _id: Date.now().toString(),
        name: form.name,
        dateOfBirth: form.dateOfBirth,
        guardianPhone: form.guardianPhone,
        prevVaccines: {
          bcg_opv0: form.bcg_opv0,
          penta1: form.penta1,
          penta2: form.penta2,
          penta3: form.penta3,
          mr1: form.mr1,
          mr2: form.mr2,
        }
      };

      onAdd(newChild);
      setLoading(false);
      
      setForm({
        name: "", dateOfBirth: "", guardianPhone: "",
        bcg_opv0: "", penta1: "", penta2: "", penta3: "", mr1: "", mr2: ""
      });
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mb-10">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-emerald-600 p-8 text-white">
          <h3 className="text-2xl font-bold">Child Registration</h3>
          <p className="text-sm opacity-80">একাধিক ভ্যাকসিনের তারিখ জানা থাকলে দিয়ে দিন (ঐচ্ছিক)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input required name="name" type="text" value={form.name} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-emerald-500 outline-none transition-all" placeholder="Zayan Ahmed" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input required name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Guardian Phone</label>
              <input required name="guardianPhone" type="tel" value={form.guardianPhone} onChange={handleChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-emerald-500 outline-none transition-all" placeholder="017xxxxxxxx" />
            </div>
          </div>

          <hr className="border-gray-100" />
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700">Vaccination History (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">BCG + OPV-0(যক্ষ্মা)</label>
                <input name="bcg_opv0" type="date" value={form.bcg_opv0} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">Pentavalent-1 (ডিপথেরিয়া, হুপিং কাশি, ধনুষ্টঙ্কার, হেপাটাইটিস-বি এবং হিমোফাইলাস ইনফ্লুয়েঞ্জা-বি)</label>
                <input name="penta1" type="date" value={form.penta1} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">Pentavalent-2 (ডিপথেরিয়া, হুপিং কাশি, ধনুষ্টঙ্কার, হেপাটাইটিস-বি এবং হিমোফাইলাস ইনফ্লুয়েঞ্জা-বি)</label>
                <input name="penta2" type="date" value={form.penta2} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">Pentavalent-3 (ডিপথেরিয়া, হুপিং কাশি, ধনুষ্টঙ্কার, হেপাটাইটিস-বি এবং হিমোফাইলাস ইনফ্লুয়েঞ্জা-বি)</label>
                <input name="penta3" type="date" value={form.penta3} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">MR Dose 1 (হাম)</label>
                <input name="mr1" type="date" value={form.mr1} onChange={handleChange} className="w-full px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">MR Dose 2 (হাম)</label>
                <input name="mr2" type="date" value={form.mr2} onChange={handleChange} className="w-full px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-sm" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-100">
            {loading ? "Processing..." : "Register & Generate Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChild;