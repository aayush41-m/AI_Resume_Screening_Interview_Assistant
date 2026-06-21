import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Candidates from './pages/Candidates';
import Interview from './pages/Interview';
import Report from './pages/Report';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateJob from './pages/CreateJob';
import Apply from './pages/Apply';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const loggedIn = isLoggedIn();

  return (
    <Router>
      <Routes>
        {/* Public route - no Navbar, no login required */}
        <Route path="/apply/:jobId" element={<Apply />} />

        <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Signup />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/candidates" element={<Candidates />} />
                  <Route path="/interview/:id" element={<Interview />} />
                  <Route path="/report/:id" element={<Report />} />
                  <Route path="/jobs" element={<CreateJob />} />
                </Routes>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;