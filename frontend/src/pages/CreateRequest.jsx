import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateRequest() {
  const navigate = useNavigate();

  // ===== DATA =====
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);

  // ===== FORM =====
  const [form, setForm] = useState({
    subject: "",
    equipmentId: "",
    type: "Corrective",
  });

  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ===== MODALS =====
  const [showCreateEq, setShowCreateEq] = useState(false);
  const [newEqName, setNewEqName] = useState("");
  const [creatingEq, setCreatingEq] = useState(false);

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  // ===== LOAD DATA =====
  useEffect(() => {
    api.get("/equipment").then(res => setEquipment(res.data));
    api.get("/teams").then(res => setTeams(res.data));
  }, []);

  // ===== VALIDATION =====
  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = "Problem description required";
    if (!form.equipmentId) e.equipmentId = "Select equipment";
    if (!teamId) e.teamId = "Select maintenance team";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ===== SUBMIT =====
  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/requests", {
        ...form,
        teamId,
      });
      alert("Request created successfully");
      navigate(-1);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-2xl font-bold mb-6">Create Maintenance Request</h1>

        {/* TEAM */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">
            Maintenance Team *
          </label>
          <div className="flex gap-2">
            <select
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
            >
              <option value="">Select team</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="border px-3 rounded"
            >
              + Add
            </button>
          </div>
          {errors.teamId && <p className="text-red-500 text-sm">{errors.teamId}</p>}
        </div>

        {/* SUBJECT */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">
            Problem *
          </label>
          <textarea
            rows={3}
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
        </div>

        {/* EQUIPMENT */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">
            Equipment *
          </label>
          <select
            value={form.equipmentId}
            onChange={e => {
              if (e.target.value === "__create__") setShowCreateEq(true);
              else setForm({ ...form, equipmentId: e.target.value });
            }}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select equipment</option>
            {equipment.map(e => (
              <option key={e._id} value={e._id}>{e.name}</option>
            ))}
            <option value="__create__">➕ Create equipment</option>
          </select>
          {errors.equipmentId && (
            <p className="text-red-500 text-sm">{errors.equipmentId}</p>
          )}
        </div>

        {/* TYPE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Maintenance Type
          </label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Corrective">Corrective</option>
            <option value="Preventive">Preventive</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* CREATE EQUIPMENT MODAL */}
      {showCreateEq && (
        <Modal title="Create Equipment" onClose={() => setShowCreateEq(false)}>
          <input
            value={newEqName}
            onChange={e => setNewEqName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="Equipment name"
          />
          <button
            onClick={async () => {
              if (!newEqName) return;
              setCreatingEq(true);
              const res = await api.post("/equipment", {
                name: newEqName,
                maintenanceTeam: teamId,
              });
              setEquipment([...equipment, res.data]);
              setForm({ ...form, equipmentId: res.data._id });
              setNewEqName("");
              setShowCreateEq(false);
              setCreatingEq(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </Modal>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateTeam && (
        <Modal title="Create Team" onClose={() => setShowCreateTeam(false)}>
          <input
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="Team name"
          />
          <button
            onClick={async () => {
              if (!newTeamName) return;
              const res = await api.post("/teams", { name: newTeamName });
              setTeams([...teams, res.data]);
              setTeamId(res.data._id);
              setNewTeamName("");
              setShowCreateTeam(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </Modal>
      )}
    </div>
  );
}

// ===== SIMPLE MODAL =====
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
        <div className="mt-4 text-right">
          <button onClick={onClose} className="text-sm text-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
