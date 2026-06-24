import React from 'react';

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || '?';

  // Deterministic gradient based on name length/char
  const gradients = [
    'from-brand-500 to-brand-700',
    'from-accent-500 to-accent-700',
    'from-success-500 to-success-700',
    'from-warning-500 to-warning-700',
    'from-pink-500 to-rose-700',
  ];
  const idx = (name.charCodeAt(0) || 0) % gradients.length;

  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br shadow-soft flex-shrink-0',
        sizes[size],
        gradients[idx],
        className,
      ].join(' ')}
    >
      {initials}
    </div>
  );
}