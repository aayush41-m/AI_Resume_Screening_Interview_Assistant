import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  Users,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Job Postings', icon: Briefcase },
  { to: '/upload', label: 'Upload Resumes', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
];

export default function Navbar() {
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
    <header className="sticky top-0 z-30 border-b border-purple-900/50 shadow-lg"
      style={{
        background: 'rgba(15, 10, 46, 0.90)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Logo size={36} />
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'text-white shadow-inner'
                    : 'text-purple-300 hover:text-white',
                ].join(' ')}
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(139,92,246,0.30), rgba(124,58,237,0.20))',
                border: '1px solid rgba(139,92,246,0.40)',
              } : {}}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 pl-3 pr-2 py-1 rounded-full border border-purple-700/40"
              style={{ background: 'rgba(139,92,246,0.10)' }}
            >
              <Avatar name={user.name || user.email || 'User'} size="sm" />
              <div className="leading-tight pr-1">
                <p className="text-xs font-semibold text-white">{user.name || 'User'}</p>
                <p className="text-[10px] text-purple-300 truncate max-w-[120px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'text-white'
                  : 'text-purple-300 hover:text-white',
              ].join(' ')}
            style={({ isActive }) => isActive ? {
              background: 'rgba(139,92,246,0.25)',
              border: '1px solid rgba(139,92,246,0.30)',
            } : {}}
          >
            <item.icon size={14} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}