import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={['flex flex-col items-center justify-center py-12 px-6 text-center', className].join(' ')}>
      {Icon && (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(139,92,246,0.20)', color: '#a78bfa' }}
        >
          <Icon size={32} />
        </div>
      )}
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      {description && <p className="text-sm text-purple-300 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
