import React from 'react';

const variants = {
  primary:
    'text-white shadow-soft hover:shadow-float',
  secondary:
    'border text-brand-300 hover:text-white',
  ghost: 'text-purple-300 hover:text-white',
  danger: 'text-white shadow-soft',
  success: 'text-white shadow-soft',
  accent: 'text-white shadow-soft hover:shadow-float',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const variantStyle = {
  primary: { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  secondary: { background: 'rgba(139,92,246,0.10)', borderColor: 'rgba(139,92,246,0.30)' },
  ghost: { background: 'transparent' },
  danger: { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  success: { background: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  accent: { background: 'linear-gradient(135deg, #ec4899, #be185d)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  style = {},
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-lg',
        'transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      style={{ ...variantStyle[variant], ...style }}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
}
