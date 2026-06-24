import React from 'react';

export function Spinner({ size = 16, className = '' }) {
  return (
    <span
      className={['inline-block border-2 border-current border-t-transparent rounded-full animate-spin', className].join(' ')}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Skeleton({ className = '' }) {
  return <div className={['skeleton', className].join(' ')} />;
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(26,16,64,0.80)',
        border: '1px solid rgba(139,92,246,0.20)',
      }}
    >
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
