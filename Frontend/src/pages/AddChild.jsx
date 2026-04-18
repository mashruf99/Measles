// src/pages/AddChild.jsx
import React, { useState } from "react";
import { supabase, getUserId } from "../utils/supabase";
import Swal from "sweetalert2";

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: "Please wait...",
      text: "Saving child data...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const userId = getUserId();

    const vaccinesData = {
      bcg_opv0: form.bcg_opv0,
      penta1: form.penta1,
      penta2: form.penta2,
      penta3: form.penta3,
      mr1: form.mr1,
      mr2: form.mr2,
    };

    const { error } = await supabase
      .from("children")
      .insert([
        {
          user_id: userId,
          name: form.name,
          date_of_birth: form.dateOfBirth,
          guardian_phone: form.guardianPhone,
          prev_vaccines: vaccinesData,
        },
      ])
      .select();

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Child Added Successfully!",
        confirmButtonColor: "#10b981",
      }).then(() => {
        setForm({
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

        if (onAdd) onAdd();
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mb-10">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-emerald-600 p-8 text-white">
          <h3 className="text-2xl font-bold">Child Registration</h3>
          <p className="text-sm opacity-80">
            একাধিক ভ্যাকসিনের তারিখ জানা থাকলে দিয়ে দিন (ঐচ্ছিক)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                required
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-emerald-500 outline-none"
                placeholder="Zayan Ahmed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Date of Birth
              </label>
              <input
                required
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Guardian Phone
              </label>
              <input
                required
                name="guardianPhone"
                type="tel"
                value={form.guardianPhone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl"
                placeholder="017xxxxxxxx"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700">
              Vaccination History (Optional)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["bcg_opv0", "penta1", "penta2", "penta3", "mr1", "mr2"].map(
                (vaccine) => (
                  <div className="space-y-1" key={vaccine}>
                    <label className="text-[10px] font-bold text-black uppercase">
                      {vaccine.replace("_", " ")}
                    </label>
                    <input
                      name={vaccine}
                      type="date"
                      value={form[vaccine]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Register & Generate Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChild;
