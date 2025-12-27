import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateRequest() {
  const navigate = useNavigate();
  
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    equipmentId: "",
    type: "Corrective",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get("/equipment").then(res => setEquipment(res.data));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.subject.trim()) newErrors.subject = "Please describe the problem";
    if (!form.equipmentId) newErrors.equipmentId = "Please select equipment";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    
    try {
      setLoading(true);
      await api.post("/requests", form);
      alert("Request created successfully!");
      navigate(-1); // Go back to dashboard
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ subject: "", equipmentId: "", type: "Corrective" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4">
            New Maintenance Request
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Report equipment issues quickly and get them fixed faster
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10">
          {/* PROBLEM DESCRIPTION */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Problem Description *
            </label>
            <textarea
              rows={4}
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Motor making unusual noise, hydraulic leak, overheating, vibration..."
              className={`w-full px-5 py-4 border-2 rounded-2xl text-lg resize-vertical focus:outline-none focus:ring-4 transition-all duration-300 backdrop-blur-sm ${
                errors.subject
                  ? "border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-400"
                  : "border-gray-200 bg-white/50 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:shadow-md"
              }`}
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.subject}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* EQUIPMENT SELECT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Equipment *
              </label>
              <div className="relative">
                <select
                  value={form.equipmentId}
                  onChange={e => setForm({ ...form, equipmentId: e.target.value })}
                  className={`w-full appearance-none px-5 py-4 border-2 bg-white/50 rounded-2xl text-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.equipmentId
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:shadow-md"
                  }`}
                >
                  <option value="">Choose equipment...</option>
                  {equipment.map(e => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.equipmentId && (
                <p className="mt-2 text-sm text-red-600">{errors.equipmentId}</p>
              )}
            </div>

            {/* REQUEST TYPE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Request Type
              </label>
              <div className="space-y-2">
                {["Corrective", "Preventive"].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, type })}
                    className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-semibold transition-all duration-300 group hover:shadow-md ${
                      form.type === type
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg hover:from-blue-600 hover:to-blue-700"
                        : "bg-white/50 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                      form.type === type 
                        ? "bg-white border-white scale-110" 
                        : "border-gray-400 group-hover:border-blue-400"
                    }`} />
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Create Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* TIP */}
        <div className="mt-8 p-6 bg-blue-50/80 border border-blue-100 rounded-2xl text-center">
          <p className="text-blue-800 font-medium">
            💡 <strong>Tip:</strong> Include specific details like "Motor #3 bearing noise" for faster diagnosis
          </p>
        </div>
      </div>
    </div>
  );
}
