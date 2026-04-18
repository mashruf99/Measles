//pages/SymptomChecker.jsx
import React, { useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineShieldCheck } from 'react-icons/hi';

const SymptomChecker = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [metadata, setMetadata] = useState({
    fever: "no",
    cough: false,
    runnyNose: false,
    redEyes: false,
    koplikSpots: false,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setMetadata(prev => ({ ...prev, [name]: checked }));
  };

  const handleFever = (e) => {
    setMetadata(prev => ({ ...prev, fever: e.target.value }));
  };

  const analyzeSymptoms = async (e) => {
    e.preventDefault();
    if (!image) { alert("Please upload an image first!"); return; }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    const toBangla = (val) => val ? "হ্যাঁ" : "না";
    const feverMap = {
      "no": "না",
      "mild": "মৃদু",
      "high": "তীব্র"
    };

    formData.append("fever",       feverMap[metadata.fever]);
    formData.append("cough",       toBangla(metadata.cough));
    formData.append("runnyNose",   toBangla(metadata.runnyNose));
    formData.append("redEyes",     toBangla(metadata.redEyes));
    formData.append("koplikSpots", toBangla(metadata.koplikSpots));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok || data.error) {
        alert(data?.error || "Server error");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("AI server সংযোগ ব্যর্থ! Backend চালু আছে কিনা দেখুন।");
    }

    setLoading(false);
  };

  const formatText = (text) => {
    const labels = {
      cough: "কাশি",
      runnyNose: "সর্দি",
      redEyes: "চোখ লাল",
      koplikSpots: "মুখের ভেতরে সাদা দানা"
    };
    return labels[text] || text;
  };

  const statusStyle = {
    red:    "bg-red-50 border-red-300 text-red-800",
    orange: "bg-orange-50 border-orange-300 text-orange-800",
    green:  "bg-emerald-50 border-emerald-300 text-emerald-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-2 shadow-sm">
            <HiOutlineShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Measles <span className="text-emerald-600">AI Evaluator</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            ছবি এবং লক্ষণ দিয়ে AI-powered হাম সনাক্তকরণ।
          </p>
        </div>

        <div className="bg-white shadow-2xl border border-gray-100 overflow-hidden rounded-2xl">
          <form onSubmit={analyzeSymptoms} className="flex flex-col lg:flex-row w-full">

            <div className="lg:w-1/2 p-8 bg-gray-50 flex flex-col gap-4 border-r border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">রোগীর ছবি</h3>

              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-emerald-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-emerald-50 transition-all duration-200">
                  <HiOutlineCloudUpload className="w-14 h-14 text-emerald-500 mb-3" />
                  <p className="text-sm text-gray-500">
                    <span className="text-emerald-600 font-bold">ছবি আপলোড করুন</span>
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative">
                  <img src={preview} alt="preview" className="rounded-xl h-64 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setImage(null); setResult(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs text-red-500 shadow"
                  >
                    ✕ সরান
                  </button>
                </div>
              )}

              {result && (
                <div className={`mt-2 p-5 rounded-xl border-2 ${statusStyle[result.status_color]}`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold">{result.prediction}</h3>
                  </div>
                  
                  <p className="text-sm mt-2">{result.recommendation}</p>

                  {result.precautions && (
                    <ul className="mt-4 text-sm list-disc list-inside space-y-1">
                      {result.precautions.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="lg:w-1/2 p-8 bg-white">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">লক্ষণ নির্বাচন</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">জ্বর</label>
                  <select
                    name="fever"
                    onChange={handleFever}
                    value={metadata.fever} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  >
                    <option value="no">নেই</option>
                    <option value="mild">মৃদু</option>
                    <option value="high">তীব্র</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">অন্যান্য লক্ষণ</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["cough", "runnyNose", "redEyes", "koplikSpots"].map(symptom => (
                      <label
                        key={symptom}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-emerald-50 transition-all text-sm"
                      >
                        <input
                          type="checkbox"
                          name={symptom}
                          checked={metadata[symptom]} 
                          onChange={handleCheckbox}
                          className="accent-emerald-500 w-4 h-4"
                        />
                        {formatText(symptom)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !image}
                  className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all duration-200 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      বিশ্লেষণ হচ্ছে...
                    </span>
                  ) : "AI দিয়ে বিশ্লেষণ করুন"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  * এটি শুধুমাত্র প্রাথমিক ধারণা দেওয়ার জন্য। চিকিৎসকের পরামর্শ নিন।
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
