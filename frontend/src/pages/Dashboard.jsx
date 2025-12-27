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
      try {
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
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    load();
  }, []);

  const filteredRequests = requests.filter(r =>
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      New: "bg-red-100 text-red-800 border-red-200",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Repaired: "bg-green-100 text-green-800 border-green-200",
      Scrap: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return badges[status] || badges.Scrap;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* TOP NAV */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-8 text-sm font-medium">
            <Link to="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Dashboard</Link>
            <Link to="/equipment" className="text-gray-700 hover:text-blue-600 transition-colors">Equipment</Link>
            <Link to="/kanban" className="text-gray-700 hover:text-blue-600 transition-colors">Kanban</Link>
            <span className="text-gray-400">Reporting</span>
            <span className="text-gray-400">Teams</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ACTION BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/request")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              New Request
            </button>
          </div>

          <div className="relative flex-1 lg:w-96">
            <input
              placeholder="Search requests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Critical Equipment"
            value={stats.critical}
            suffix="units"
            color="red"
            icon="⚠️"
          />
          <StatCard
            title="Open Requests"
            value={stats.open}
            suffix="pending"
            color="yellow"
            icon="📋"
          />
          <StatCard
            title="Utilization"
            value={stats.utilization}
            suffix="%"
            color="blue"
            icon="📈"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            color="orange"
            icon="⏰"
          />
        </div>

        {/* REQUESTS TABLE */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Recent Requests</h3>
            <p className="text-gray-600 mt-1">
              {filteredRequests.length} of {requests.length} requests
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="text-gray-500 space-y-2">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">No requests found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 truncate max-w-[300px]">
                          {r.subject}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">—</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {r.team?.name || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.type === "Corrective" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-900">My Company</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modern StatCard - Clean Colors
function StatCard({ title, value, suffix = "", color, icon }) {
  const colors = {
    red: "bg-red-50 border-red-100 text-red-700 ring-red-200/50",
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-700 ring-yellow-200/50",
    blue: "bg-blue-50 border-blue-100 text-blue-700 ring-blue-200/50",
    orange: "bg-orange-50 border-orange-100 text-orange-700 ring-orange-200/50"
  };

  return (
    <div className={`group relative p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm ${colors[color]}`}>
      <div className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">{title}</p>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-lg font-medium text-gray-500">{suffix}</p>
    </div>
  );
}
