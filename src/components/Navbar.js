import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">AI Recruiter</h1>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-300">Dashboard</Link>
        <Link to="/upload" className="hover:text-blue-300">Upload Resumes</Link>
        <Link to="/candidates" className="hover:text-blue-300">Candidates</Link>
        {user && (
          <span className="text-blue-200 text-sm border-l border-blue-700 pl-6">
            {user.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;