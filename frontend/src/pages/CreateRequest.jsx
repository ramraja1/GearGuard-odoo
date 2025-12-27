import { useEffect, useState } from "react";
import api from "../api";

export default function CreateRequest() {
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    equipmentId: "",
    type: "Corrective",
  });

  useEffect(() => {
    api.get("/equipment").then(res => setEquipment(res.data));
  }, []);

  const submit = async () => {
    if (!form.subject || !form.equipmentId) return alert("Fill all fields");
    await api.post("/requests", form);
    alert("Request Created");
  };

  return (
    <div>
      <h2>Create Request</h2>

      <input
        placeholder="Problem"
        onChange={e => setForm({ ...form, subject: e.target.value })}
      />

      <select
        onChange={e => setForm({ ...form, equipmentId: e.target.value })}
      >
        <option value="">Select Equipment</option>
        {equipment.map(e => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>

      <select
        onChange={e => setForm({ ...form, type: e.target.value })}
      >
        <option value="Corrective">Corrective</option>
        <option value="Preventive">Preventive</option>
      </select>

      <button onClick={submit}>Create</button>
    </div>
  );
}
