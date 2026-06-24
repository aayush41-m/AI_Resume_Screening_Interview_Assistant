import React from 'react';

export default function Logo({ size = 32, showText = true, className = '', textClassName = '' }) {
  return (
    <div className={['flex items-center gap-2.5', className].join(' ')}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="logoSparkGrad" x1="20" y1="14" x2="44" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#logoBgGrad)" />
        <path
          d="M32 14l3.5 9.5L45 27l-9.5 3.5L32 40l-3.5-9.5L19 27l9.5-3.5L32 14z"
          fill="url(#logoSparkGrad)"
        />
        <circle cx="32" cy="46" r="4" fill="#ffffff" />
        <path d="M24 56c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#ffffff" />
      </svg>
      {showText && (
        <div className={['flex flex-col leading-none', textClassName].join(' ')}>
          <span className="font-bold tracking-tight text-base text-white">AI Recruiter</span>
          <span className="text-[10px] font-medium text-purple-300 uppercase tracking-wider">
            Smart Hiring
          </span>
        </div>
      )}
    </div>
  );
}
