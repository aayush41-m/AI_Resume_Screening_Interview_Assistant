import React, { useState, useEffect } from 'react';
import { getDashboardStats, getCandidates } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, rejected: 0, pending: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const statsData = await getDashboardStats();
    const candidatesData = await getCandidates();
    setStats(statsData);
    setRecentCandidates(candidatesData.slice(0, 5));
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    if (status === 'Shortlisted') return 'bg-green-100 text-green-600';
    if (status === 'Rejected') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Dashboard</h2>
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Candidates</p>
          <h3 className="text-3xl font-bold text-blue-600">{stats.total}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Shortlisted</p>
          <h3 className="text-3xl font-bold text-green-500">{stats.shortlisted}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Rejected</p>
          <h3 className="text-3xl font-bold text-red-500">{stats.rejected}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-500">{stats.pending}</h3>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Recent Candidates</h3>
        {loading ? (
          <p className="text-center text-gray-400 py-6">Loading...</p>
        ) : recentCandidates.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No candidates yet. Upload a resume to get started!</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCandidates.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.score}/100</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

export default Dashboard;