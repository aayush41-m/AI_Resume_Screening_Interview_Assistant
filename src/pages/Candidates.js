import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCandidates, deleteCandidate, getResumeViewUrl, getResumeDownloadUrl } from '../services/api';

function Candidates() {
  const [candidatesData, setCandidatesData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidatesData(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteCandidate(id);
      setCandidatesData((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const filtered = candidatesData.filter((c) => {
    const matchSearch = c.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === 'All' || c.status === filter;

    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status) => {
    if (status === 'Shortlisted') {
      return 'bg-green-100 text-green-600';
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-600';
    }

    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          All Candidates
        </h2>

        <button
          onClick={loadCandidates}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

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
          <option value="All">All</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p className="text-center text-gray-400 py-10">
            Loading candidates...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No candidates yet. Upload a resume to get started!
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Resume</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 font-medium">
                    {c.name}
                  </td>

                  <td className="py-3 text-gray-500">
                    {c.role}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${c.score}%`,
                          }}
                        />
                      </div>

                      <span>{c.score}/100</span>
                    </div>
                  </td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3">
                    {c.has_resume ? (
                      <div className="flex gap-3">
                        <a
                          href={getResumeViewUrl(c.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>

                        <a
                          href={getResumeViewUrl(c.id)}
                          download={c.resume_filename}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No file
                      </span>
                    )}
                  </td>

                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/report/${c.id}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Report
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/interview/${c.id}`)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                      >
                        Interview
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(c.id, c.name)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Candidates;