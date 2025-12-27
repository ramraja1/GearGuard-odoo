import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateRequest() {
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    equipmentId: "",
    type: "Corrective",
  });

  useEffect(() => {
    api.get("/equipment").then(res => setEquipment(res.data));
  }, []);

  const submit = async () => {
    if (!form.subject || !form.equipmentId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/requests", form);
      alert("Maintenance request created successfully");
      navigate("/"); // back to dashboard
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* TOP NAV */}
      <div className="flex gap-6 text-sm font-medium text-gray-600 mb-6">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-black"
        >
          Dashboard
        </span>
        <span className="text-black font-semibold">New Request</span>
        <span
          onClick={() => navigate("/kanban")}
          className="cursor-pointer hover:text-black"
        >
          Kanban
        </span>
      </div>

      {/* FORM CARD */}
      <div className="max-w-xl bg-white rounded-lg shadow p-6">

        <h1 className="text-xl font-bold mb-6 text-gray-800">
          Create Maintenance Request
        </h1>

        {/* SUBJECT */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Issue / Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Printer not working"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EQUIPMENT */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Equipment <span className="text-red-500">*</span>
          </label>
          <select
            value={form.equipmentId}
            onChange={e => setForm({ ...form, equipmentId: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Equipment</option>
            {equipment.map(e => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* TYPE */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Maintenance Type
          </label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Corrective">Corrective (Breakdown)</option>
            <option value="Preventive">Preventive (Scheduled)</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
        </div>

      </div>
    </div>
  );
}
