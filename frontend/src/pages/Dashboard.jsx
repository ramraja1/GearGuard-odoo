import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    critical: 0,
    utilization: 0,
    open: 0,
    overdue: 0,
  });

  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const [eqRes, reqRes] = await Promise.all([
        api.get("/equipment"),
        api.get("/requests"),
      ]);

      const allRequests = reqRes.data;

      const openReq = allRequests.filter(
        r => r.status !== "Repaired" && r.status !== "Scrap"
      );
      const overdueReq = allRequests.filter(r => r.status === "New");

      setRequests(allRequests);
      setStats({
        critical: openReq.length,
        utilization: Math.min(openReq.length * 10, 100),
        open: openReq.length,
        overdue: overdueReq.length,
      });
    };

    load();
  }, []);

  const filteredRequests = requests.filter(r =>
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* TOP NAVIGATION */}
      <div className="flex gap-6 text-sm font-medium text-gray-600 mb-6">
        <Link to="/" className="text-black font-semibold">Dashboard</Link>
        <Link to="/equipment" className="hover:text-black">Equipment</Link>
        <Link to="/kanban" className="hover:text-black">Kanban</Link>
        <span className="text-gray-400 cursor-not-allowed">Reporting</span>
        <span className="text-gray-400 cursor-not-allowed">Teams</span>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/request")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          New
        </button>

        <input
          placeholder="Search by subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-72"
        />
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Critical Equipment"
          main={`${stats.critical} Units`}
          sub="Health < 30%"
          color="red"
        />

        <StatCard
          title="Technician Load"
          main={`${stats.utilization}% Utilized`}
          sub="Assign Carefully"
          color="blue"
        />

        <StatCard
          title="Open Requests"
          main={`${stats.open} Pending`}
          sub={`${stats.overdue} Overdue`}
          color="green"
        />
      </div>

      {/* REQUESTS TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500 bg-gray-50">
            <tr>
              <th className="p-3 text-left">Subject</th>
              <th>Employee</th>
              <th>Technician</th>
              <th>Category</th>
              <th>Stage</th>
              <th>Company</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No matching requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map(r => (
                <tr key={r._id} 
  onClick={() => navigate(`/requests/${r._id}`)}
  className="border-b hover:bg-gray-50 cursor-pointer"
>

                  <td className="p-3">{r.subject}</td>
                  <td>—</td>
                  <td>{r.team?.name || "-"}</td>
                  <td>{r.type}</td>
                  <td className="text-blue-600 font-medium">
                    {r.status}
                  </td>
                  <td>My Company</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ===================== */
/* REUSABLE STAT CARD    */
/* ===================== */
function StatCard({ title, main, sub, color }) {
  const colors = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className={`p-5 rounded-lg ${colors[color]}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xl font-bold mt-2">{main}</p>
      <p className="text-xs mt-1">{sub}</p>
    </div>
  );
}
