//src/pages/SymptomChecker.jsx

import React, { useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineShieldCheck, HiOutlineExclamation } from 'react-icons/hi';

const SymptomChecker = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  
  const [metadata, setMetadata] = useState({
    fever: 'no',
    cough: false,
    runnyNose: false,
    redEyes: false,
    koplikSpots: false, 
    rashStartedAt: 'face', 
    duration: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const analyzeSymptoms = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    setTimeout(() => {
      setResult({
        probability: 85,
        suggestion: "The symptoms and image highly correlate with Measles. Please consult a doctor immediately.",
        precautions: ["Isolate the child", "Ensure hydration", "Monitor fever"]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-800">AI Symptom Evaluator</h2>
        <p className="text-gray-500">Upload a photo of the rash and answer a few questions for a detailed analysis.</p>
      </div>

      <form onSubmit={analyzeSymptoms} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-all text-center">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Rash Preview" className="rounded-2xl max-h-64 mx-auto shadow-md" />
                <button 
                  onClick={() => {setImage(null); setPreview(null);}}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg"
                >✕</button>
              </div>
            ) : (
              <label className="cursor-pointer block py-10">
                <HiOutlineCloudUpload className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-500">Upload Rash Photo</p>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>


          {result && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                <HiOutlineShieldCheck className="text-xl" /> AI Analysis Result
              </div>
              <p className="text-2xl font-black text-emerald-800 mb-2">{result.probability}% Match</p>
              <p className="text-sm text-emerald-700 leading-relaxed mb-4">{result.suggestion}</p>
              <div className="space-y-1">
                {result.precautions.map((p, i) => (
                  <p key={i} className="text-xs text-emerald-600 flex items-center gap-2">• {p}</p>
                ))}
              </div>
            </div>
          )}
        </div>


        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineExclamation className="text-amber-500" /> Clinical Indicators
          </h4>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">High Fever (101°F+)?</label>
              <select name="fever" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="no">No Fever</option>
                <option value="mild">Mild (99-100°F)</option>
                <option value="high">High (101°F+)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input type="checkbox" name="cough" onChange={handleInputChange} className="accent-emerald-500 w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">Dry Cough</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input type="checkbox" name="runnyNose" onChange={handleInputChange} className="accent-emerald-500 w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">Runny Nose</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input type="checkbox" name="redEyes" onChange={handleInputChange} className="accent-emerald-500 w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">Red/Watery Eyes</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input type="checkbox" name="koplikSpots" onChange={handleInputChange} className="accent-emerald-500 w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">White Spots inside mouth</span>
              </label>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Where did the rash start?</label>
              <select name="rashStartedAt" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="face">Face & Hairline</option>
                <option value="trunk">Chest / Back</option>
                <option value="arms">Arms / Legs</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !image}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:bg-gray-200"
          >
            {loading ? "AI is Analyzing..." : "Run AI Diagnostics"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SymptomChecker;