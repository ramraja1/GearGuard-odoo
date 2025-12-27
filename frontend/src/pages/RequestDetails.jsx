import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    api.get(`/requests/${id}`).then(res => {
      setRequest(res.data);
      setStatus(res.data.status);
    });
  }, [id]);

  const updateStatus = async () => {
    await api.patch(`/requests/${id}/status`, { status });
    alert("Request updated");
    navigate("/kanban");
  };

  if (!request) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600"
        >
          ← Back
        </button>

        <span className="text-sm text-gray-500">
          Maintenance Requests
        </span>
      </div>

      {/* STATUS BAR */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          {request.subject}
        </h1>

        <div className="flex items-center gap-3">
          {["New", "In Progress", "Repaired", "Scrap"].map(s => (
            <span
              key={s}
              className={`px-3 py-1 rounded-full text-xs ${
                status === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* MAIN FORM */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="grid grid-cols-2 gap-6 text-sm">

          {/* LEFT */}
          <div className="space-y-3">
            <Field label="Created By" value="Mitchell Admin" />
            <Field label="Equipment" value={request.equipment?.name} />
            <Field label="Category" value="Computers" />
            <Field label="Request Date" value={new Date(request.createdAt).toLocaleDateString()} />

            <div>
              <p className="text-gray-500">Maintenance Type</p>
              <p className="font-medium">
                {request.type === "Corrective" ? "Corrective" : "Preventive"}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <Field label="Team" value="Internal Maintenance" />
            <Field label="Technician" value={request.team?.name} />
            <Field label="Scheduled Date" value="12/28/2025 14:30" />
            <Field label="Duration" value="00:00 hours" />
            <Field label="Company" value="My Company" />
          </div>
        </div>

        {/* STATUS SELECT */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Update Stage
          </label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Repaired</option>
            <option>Scrap</option>
          </select>
        </div>

        {/* NOTES */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Notes / Instructions
          </label>
          <textarea
            rows="3"
            placeholder="Internal notes..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* ACTION */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={updateStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
