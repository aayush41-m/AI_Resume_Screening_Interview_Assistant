import React from 'react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = 'brand', // brand | success | danger | warning
  trend,
  className = '',
}) {
  const colorMap = {
    brand:   { iconBg: 'rgba(139,92,246,0.20)', iconText: '#a78bfa' },
    success: { iconBg: 'rgba(34,197,94,0.15)',  iconText: '#22c55e' },
    danger:  { iconBg: 'rgba(239,68,68,0.15)',  iconText: '#ef4444' },
    warning: { iconBg: 'rgba(234,179,8,0.15)',  iconText: '#eab308' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div
      className={[
        'rounded-2xl p-5 flex items-start justify-between',
        'transition-all duration-200 hover:scale-105',
        className,
      ].join(' ')}
      style={{
        background: 'rgba(26,16,64,0.80)',
        border: '1px solid rgba(139,92,246,0.20)',
        boxShadow: '0 4px 20px rgba(139,92,246,0.10)',
      }}
    >
      <div className="flex-1">
        <p className="text-sm text-purple-300">{label}</p>
        <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        {trend && <p className="text-xs text-purple-400 mt-1">{trend}</p>}
      </div>
      {Icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: c.iconBg, color: c.iconText }}
        >
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
