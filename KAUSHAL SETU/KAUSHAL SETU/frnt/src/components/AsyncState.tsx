import React from 'react';
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react';

export const Loading: React.FC<{ label?: string; rows?: number }> = ({
  label = 'Loading',
  rows = 3,
}) => (
  <div className="space-y-3" role="status" aria-live="polite" aria-label={label}>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="skeleton h-16 w-full" />
    ))}
    <span className="sr-only">{label}…</span>
  </div>
);

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = "We couldn't load this right now.",
  onRetry,
}) => (
  <div className="quiet-card flex flex-col items-center gap-4 px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdeee2] text-[#c25a04]">
      <AlertTriangle className="h-6 w-6" />
    </div>
    <div>
      <h3 className="font-display text-lg font-semibold text-[#0e2420]">
        Something interrupted the bridge
      </h3>
      <p className="mt-1 max-w-md text-sm text-[#5b7169]">{message}</p>
    </div>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-primary text-sm">
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="quiet-card flex flex-col items-center gap-4 px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(14,36,32,0.06)] text-[#5b7169]">
      <Inbox className="h-6 w-6" />
    </div>
    <div>
      <h3 className="font-display text-lg font-semibold text-[#0e2420]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[#5b7169]">{description}</p>
    </div>
    {action}
  </div>
);

/** Match score bar used by jobs, matching, and career pages. */
export const ScoreBar: React.FC<{ value: number; label?: string }> = ({
  value,
  label,
}) => (
  <div className="w-full">
    {label && (
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-[#5b7169]">{label}</span>
        <span className="font-bold text-[#0e2420]">{Math.round(value)}%</span>
      </div>
    )}
    <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(14,36,32,0.08)]">
      <div
        className="h-full rounded-full bg-[#e8720c] transition-[width] duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);
