import React from 'react';

export function TextInput({ label, error, icon: Icon, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-white mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none"
          />
        )}
        <input
          className={[
            'w-full rounded-lg text-white placeholder-purple-400/60',
            'transition-all duration-150',
            'focus:ring-2 focus:outline-none',
            Icon ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5',
            error
              ? 'border border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
              : 'border border-purple-700/40 focus:border-brand-400 focus:ring-brand-500/20',
            className,
          ].join(' ')}
          style={{ background: 'rgba(15,10,46,0.60)' }}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-white mb-1.5">{label}</label>
      )}
      <textarea
        className={[
          'w-full rounded-lg text-white px-3 py-2.5 placeholder-purple-400/60',
          'transition-all duration-150',
          'focus:ring-2 focus:outline-none',
          error
            ? 'border border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
            : 'border border-purple-700/40 focus:border-brand-400 focus:ring-brand-500/20',
          className,
        ].join(' ')}
        style={{ background: 'rgba(15,10,46,0.60)' }}
        {...rest}
      />
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, error, icon: Icon, children, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-white mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none" />
        )}
        <select
          className={[
            'w-full rounded-lg text-white appearance-none',
            'transition-all duration-150',
            'focus:ring-2 focus:outline-none',
            Icon ? 'pl-10 pr-10 py-2.5' : 'px-3 py-2.5 pr-10',
            error
              ? 'border border-danger-500'
              : 'border border-purple-700/40 focus:border-brand-400 focus:ring-brand-500/20',
            className,
          ].join(' ')}
          style={{ background: 'rgba(15,10,46,0.60)' }}
          {...rest}
        >
          {children}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}
