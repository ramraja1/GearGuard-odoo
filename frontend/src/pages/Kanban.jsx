import { useEffect, useState } from "react";
import api from "../api";

const stages = ["New", "In Progress", "Repaired", "Scrap"];

export default function Kanban() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await api.get("/requests");
    setRequests(res.data);
  };

  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await api.patch(`/requests/${id}/status`, { status });
    load();
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {stages.map(stage => (
        <div key={stage}>
          <h3>{stage}</h3>
          {requests
            .filter(r => r.status === stage)
            .map(r => (
              <div key={r._id} style={{ border: "1px solid black", margin: 5 }}>
                <p>{r.subject}</p>
                <button onClick={() => update(r._id, "In Progress")}>Start</button>
                <button onClick={() => update(r._id, "Repaired")}>Done</button>
                <button onClick={() => update(r._id, "Scrap")}>Scrap</button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
