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
      {loggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Signup />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path="/interview/:id" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;