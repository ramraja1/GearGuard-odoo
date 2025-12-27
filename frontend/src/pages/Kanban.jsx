import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const stages = [
  { key: "New", color: "bg-gray-100", btn: "Start" },
  { key: "In Progress", color: "bg-blue-100", btn: "Repair" },
  { key: "Repaired", color: "bg-green-100", btn: null },
  { key: "Scrap", color: "bg-red-100", btn: null },
];

export default function Kanban() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get("/requests");
    setRequests(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    await api.patch(`/requests/${id}/status`, { status });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Maintenance Kanban</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-600"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map(stage => (
          <div key={stage.key} className="bg-white rounded-lg shadow p-4">

            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              {stage.key}
            </h3>

            <div className="space-y-3">
              {requests
                .filter(r => r.status === stage.key)
                .map(r => (
                  <div
                    key={r._id}
                    onClick={() => navigate(`/requests/${r._id}`)}
                    className={`p-3 rounded-md cursor-pointer shadow-sm hover:shadow transition ${stage.color}`}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {r.subject}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {r.equipment?.name || "No equipment"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Team: {r.team?.name || "-"}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 mt-3">
                      {stage.key === "New" && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            update(r._id, "In Progress");
                          }}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                        >
                          Start
                        </button>
                      )}

                      {stage.key === "In Progress" && (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              update(r._id, "Repaired");
                            }}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded"
                          >
                            Repaired
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              update(r._id, "Scrap");
                            }}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Scrap
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

              {/* EMPTY STATE */}
              {requests.filter(r => r.status === stage.key).length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No requests
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
