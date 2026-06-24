import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import {
  getCandidates,
  deleteCandidate,
  getResumeViewUrl,
} from '../services/api';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import { TextInput } from '../components/ui/Input';
import { TableRowSkeleton } from '../components/ui/Loading';

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
      setCandidatesData(data || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteCandidate(id);
      setCandidatesData((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const filtered = candidatesData.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const summary = {
    all: candidatesData.length,
    shortlisted: candidatesData.filter((c) => c.status === 'Shortlisted').length,
    pending: candidatesData.filter((c) => c.status === 'Pending').length,
    rejected: candidatesData.filter((c) => c.status === 'Rejected').length,
  };

  return (
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <PageHeader
        title="Candidates"
        subtitle={`${summary.all} candidate${summary.all === 1 ? '' : 's'} in your pipeline`}
        icon={Users}
        action={
          <Button variant="secondary" size="md" icon={RefreshCw} onClick={loadCandidates}>
            Refresh
          </Button>
        }
      />

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChip label="All" count={summary.all} active={filter === 'All'} onClick={() => setFilter('All')} color="brand" />
        <FilterChip label="Shortlisted" count={summary.shortlisted} active={filter === 'Shortlisted'} onClick={() => setFilter('Shortlisted')} color="success" />
        <FilterChip label="Pending" count={summary.pending} active={filter === 'Pending'} onClick={() => setFilter('Pending')} color="warning" />
        <FilterChip label="Rejected" count={summary.rejected} active={filter === 'Rejected'} onClick={() => setFilter('Rejected')} color="danger" />
      </div>

      {/* Search bar */}
      <Card className="mb-4" padding="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <TextInput
              placeholder="Search by candidate name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="p-0">
        {loading ? (
          <div className="p-4">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-xs uppercase tracking-wider border-b"
                  style={{ borderColor: 'rgba(139,92,246,0.20)', color: '#7c6db5' }}
                >
                  <th className="px-4 py-3 font-semibold">Candidate</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Resume</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search || filter !== 'All' ? 'No matches found' : 'No candidates yet'}
            description={
              search || filter !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Upload a resume to get AI-powered screening results.'
            }
            action={
              !search && filter === 'All' && (
                <Button variant="primary" onClick={() => navigate('/upload')}>
                  Upload a resume
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-xs uppercase tracking-wider border-b"
                  style={{ borderColor: 'rgba(139,92,246,0.20)', color: '#7c6db5', background: 'rgba(15,10,46,0.40)' }}
                >
                  <th className="px-4 py-3 font-semibold">Candidate</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Resume</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.10)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <span className="font-semibold text-white text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-purple-300">{c.role || '—'}</td>
                    <td className="px-4 py-3">
                      <ScoreCell score={c.score} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      {c.has_resume ? (
                        <div className="flex items-center gap-3 text-sm">
                          <a
                            href={getResumeViewUrl(c.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium"
                            style={{ color: '#a78bfa' }}
                          >
                            <Eye size={14} /> View
                          </a>
                          <a
                            href={getResumeViewUrl(c.id)}
                            download={c.resume_filename}
                            className="inline-flex items-center gap-1 font-medium"
                            style={{ color: '#22c55e' }}
                          >
                            <Download size={14} /> Download
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-purple-400">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          icon={BarChart3}
                          label="Report"
                          color="brand"
                          onClick={() => navigate(`/report/${c.id}`)}
                        />
                        <ActionButton
                          icon={MessageSquare}
                          label="Interview"
                          color="success"
                          onClick={() => navigate(`/interview/${c.id}`)}
                        />
                        <ActionButton
                          icon={Trash2}
                          label="Delete"
                          color="danger"
                          onClick={() => handleDelete(c.id, c.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function FilterChip({ label, count, active, onClick, color }) {
  const colorMap = {
    brand:   { activeBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', activeBorder: 'rgba(139,92,246,0.40)', dot: '#a78bfa' },
    success: { activeBg: 'linear-gradient(135deg, #22c55e, #16a34a)', activeBorder: 'rgba(34,197,94,0.40)', dot: '#22c55e' },
    warning: { activeBg: 'linear-gradient(135deg, #eab308, #ca8a04)', activeBorder: 'rgba(234,179,8,0.40)', dot: '#eab308' },
    danger:  { activeBg: 'linear-gradient(135deg, #ef4444, #dc2626)', activeBorder: 'rgba(239,68,68,0.40)', dot: '#ef4444' },
  };
  const c = colorMap[color] || colorMap.brand;
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
      ].join(' ')}
      style={
        active
          ? { background: c.activeBg, color: '#ffffff', borderColor: c.activeBorder }
          : { background: 'rgba(26,16,64,0.60)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.25)' }
      }
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: active ? 'rgba(255,255,255,0.85)' : c.dot }}
      />
      {label}
      <span
        className="px-1.5 py-0.5 rounded-md text-[10px]"
        style={{ background: active ? 'rgba(255,255,255,0.20)' : 'rgba(139,92,246,0.15)' }}
      >
        {count}
      </span>
    </button>
  );
}

function ScoreCell({ score }) {
  const s = Number(score) || 0;
  const color =
    s >= 75 ? '#22c55e' : s >= 50 ? '#eab308' : '#ef4444';
  return (
    <div className="flex items-center gap-2 min-w-[130px]">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(139,92,246,0.20)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${s}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold w-10 text-right text-purple-300">{s}/100</span>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick }) {
  const colorMap = {
    brand:   { color: '#a78bfa', hoverBg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.30)' },
    success: { color: '#22c55e', hoverBg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.30)' },
    danger:  { color: '#ef4444', hoverBg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.30)' },
  };
  const c = colorMap[color] || colorMap.brand;
  return (
    <button
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors"
      style={{
        background: 'rgba(15,10,46,0.40)',
        color: c.color,
        borderColor: c.border,
      }}
      onMouseEnter={e => e.currentTarget.style.background = c.hoverBg}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,10,46,0.40)'}
    >
      <Icon size={12} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export default Candidates;
