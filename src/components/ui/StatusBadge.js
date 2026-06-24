import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const config = {
  Shortlisted: {
    label: 'Shortlisted',
    style: { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.30)' },
    icon: CheckCircle2,
  },
  Rejected: {
    label: 'Rejected',
    style: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.30)' },
    icon: XCircle,
  },
  Pending: {
    label: 'Pending',
    style: { background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.30)' },
    icon: Clock,
  },
  Failed: {
    label: 'Failed',
    style: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.30)' },
    icon: AlertCircle,
  },
};

export default function StatusBadge({ status, size = 'md', className = '' }) {
  const cfg = config[status] || config.Pending;
  const Icon = cfg.icon;
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-sm gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={['inline-flex items-center font-semibold rounded-full', sizeCls, className].join(' ')}
      style={cfg.style}
    >
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}
