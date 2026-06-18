import React, { useState } from 'react';

const candidatesData = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', score: 85, status: 'Shortlisted' },
  { id: 2, name: 'Priya Singh', email: 'priya@email.com', score: 72, status: 'Pending' },
  { id: 3, name: 'Amit Kumar', email: 'amit@email.com', score: 45, status: 'Rejected' },
  { id: 4, name: 'Neha Gupta', email: 'neha@email.com', score: 91, status: 'Shortlisted' },
  { id: 5, name: 'Ravi Verma', email: 'ravi@email.com', score: 60, status: 'Pending' },
];

function Candidates() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = candidatesData.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status) => {
    if (status === 'Shortlisted') return 'bg-green-100 text-green-600';
    if (status === 'Rejected') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">All Candidates</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="border rounded-lg px-4 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Shortlisted</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{c.name}</td>
                <td className="py-3 text-gray-500">{c.email}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <span>{c.score}/100</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                    View Report
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                    Interview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Candidates;