import React from 'react';

export default function PageHeader({ title, subtitle, icon: Icon, action, breadcrumb }) {
  return (
    <div className="mb-6 animate-fade-in">
      {breadcrumb && (
        <div className="text-xs text-purple-300 mb-2">{breadcrumb}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="w-12 h-12 rounded-xl text-white flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                boxShadow: '0 4px 15px rgba(139,92,246,0.40)',
              }}
            >
              <Icon size={22} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-purple-300 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
