import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">AI Recruiter</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-300">Dashboard</Link>
        <Link to="/upload" className="hover:text-blue-300">Upload Resumes</Link>
        <Link to="/candidates" className="hover:text-blue-300">Candidates</Link>
      </div>
    </nav>
  )
}

export default Navbar;