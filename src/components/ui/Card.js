import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'p-6',
  hover = false,
  as: Tag = 'div',
  ...rest
}) {
  return (
    <Tag
      className={[
        'rounded-2xl',
        padding,
        hover ? 'transition-all duration-200 hover:shadow-float hover:-translate-y-0.5' : '',
        className,
      ].join(' ')}
      style={{
        background: 'rgba(26,16,64,0.80)',
        border: '1px solid rgba(139,92,246,0.20)',
        boxShadow: '0 4px 20px rgba(139,92,246,0.10)',
        backdropFilter: 'blur(12px)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={['flex items-start justify-between mb-4', className].join(' ')}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.20)', color: '#a78bfa' }}
          >
            <Icon size={20} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-purple-300 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
