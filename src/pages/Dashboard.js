import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, UserCheck, UserX, UserMinus, FileSpreadsheet, ArrowRight, Upload, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getCandidates } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import PageHeader from '../components/PageHeader';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, rejected: 0, pending: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, candidatesData] = await Promise.all([
        getDashboardStats(),
        getCandidates(),
      ]);
      setStats(statsData || { total: 0, shortlisted: 0, rejected: 0, pending: 0 });
      setRecentCandidates((candidatesData || []).slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statCards = [
    { label: 'Total Candidates', value: stats.total, icon: Users, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: UserCheck, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    { label: 'Rejected', value: stats.rejected, icon: UserX, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    { label: 'Pending', value: stats.pending, icon: UserMinus, color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your candidate pipeline"
        icon={LayoutDashboard}
        action={
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-purple-300 hover:text-white transition-all"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.30)' }}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 flex items-center justify-between transition-all hover:scale-105"
            style={{
              background: 'rgba(26,16,64,0.80)',
              border: '1px solid rgba(139,92,246,0.20)',
              boxShadow: '0 4px 20px rgba(139,92,246,0.10)',
            }}
          >
            <div>
              <p className="text-sm text-purple-300 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '—' : card.value}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: card.bg }}
            >
              <card.icon size={22} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickAction
          icon={Upload}
          title="Upload Resumes"
          description="Screen single or bulk resumes with AI"
          onClick={() => navigate('/upload')}
          gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
          glow="rgba(139,92,246,0.30)"
        />
        <QuickAction
          icon={FileSpreadsheet}
          title="View Candidates"
          description="Browse and manage all candidates"
          onClick={() => navigate('/candidates')}
          gradient="linear-gradient(135deg, #22c55e, #15803d)"
          glow="rgba(34,197,94,0.30)"
        />
        <QuickAction
          icon={UserCheck}
          title="Job Postings"
          description="Create jobs & share apply links"
          onClick={() => navigate('/jobs')}
          gradient="linear-gradient(135deg, #ec4899, #be185d)"
          glow="rgba(236,72,153,0.30)"
        />
      </div>

      {/* Recent Candidates */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(26,16,64,0.80)',
          border: '1px solid rgba(139,92,246,0.20)',
          boxShadow: '0 4px 20px rgba(139,92,246,0.10)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.20)' }}
            >
              <Users size={18} color="#a78bfa" />
            </div>
            <div>
              <h3 className="font-bold text-white">Recent Candidates</h3>
              <p className="text-xs text-purple-300">Your latest screening results</p>
            </div>
          </div>
          {recentCandidates.length > 0 && (
            <button
              onClick={() => navigate('/candidates')}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 rounded-lg animate-pulse"
                style={{ background: 'rgba(139,92,246,0.10)' }} />
            ))}
          </div>
        ) : recentCandidates.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto mb-3 text-purple-600" />
            <p className="text-purple-300 font-medium">No candidates yet</p>
            <p className="text-purple-500 text-sm mt-1">Upload your first resume to get started</p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
            >
              Upload a resume
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider border-b"
                  style={{ borderColor: 'rgba(139,92,246,0.20)', color: '#7c6db5' }}
                >
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/report/${c.id}`)}
                    className="cursor-pointer transition-all"
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.10)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <div>
                          <p className="font-semibold text-white text-sm">{c.name}</p>
                          <p className="text-xs text-purple-500">{formatDate(c.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-purple-300">{c.role || '—'}</td>
                    <td className="py-3">
                      <ScoreBar score={c.score} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, onClick, gradient, glow }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1"
      style={{
        background: 'rgba(26,16,64,0.80)',
        border: '1px solid rgba(139,92,246,0.20)',
        boxShadow: '0 4px 20px rgba(139,92,246,0.10)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 30px ${glow}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.10)'}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-3"
        style={{ background: gradient }}
      >
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-purple-300">{description}</p>
    </button>
  );
}

function ScoreBar({ score }) {
  const s = Number(score) || 0;
  const color = s >= 75 ? '#22c55e' : s >= 50 ? '#eab308' : '#ef4444';
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(139,92,246,0.20)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${s}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold text-purple-400 w-12 text-right">
        {s}/100
      </span>
    </div>
  );
}

export default Dashboard;