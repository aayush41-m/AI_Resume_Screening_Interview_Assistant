import React from 'react';

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Stat Cards */}
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total Candidates</p>
          <h3 className="text-3xl font-bold text-blue-600">24</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Shortlisted</p>
          <h3 className="text-3xl font-bold text-green-500">10</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Rejected</p>
          <h3 className="text-3xl font-bold text-red-500">8</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-500">6</h3>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Recent Candidates</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Rahul Sharma</td>
              <td className="py-2">85/100</td>
              <td className="py-2"><span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">Shortlisted</span></td>
              <td className="py-2">18 Jun 2026</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Priya Singh</td>
              <td className="py-2">72/100</td>
              <td className="py-2"><span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">Pending</span></td>
              <td className="py-2">17 Jun 2026</td>
            </tr>
            <tr>
              <td className="py-2">Amit Kumar</td>
              <td className="py-2">45/100</td>
              <td className="py-2"><span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">Rejected</span></td>
              <td className="py-2">16 Jun 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Dashboard;