import React from 'react';
import { Link } from 'react-router-dom';

interface BrandProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
}

const SIZES = {
  sm: { mark: 26, name: 'text-base' },
  md: { mark: 34, name: 'text-xl' },
  lg: { mark: 44, name: 'text-2xl' },
} as const;

/** The Kaushal Setu bridge mark: an arc with a crossing path. */
export const BridgeMark: React.FC<{ size?: number; className?: string }> = ({
  size = 34,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 36C10 16 38 16 44 36"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path d="M6 38h36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M17 36v-9.5M31 36v-9.5M24 36V25"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.65"
    />
    <circle cx="24" cy="20" r="3.4" fill="currentColor" />
  </svg>
);

export const Brand: React.FC<BrandProps> = ({
  variant = 'dark',
  size = 'md',
  withTagline = false,
}) => {
  const s = SIZES[size];
  const colorClass = variant === 'dark' ? 'text-[#0e2420]' : 'text-[#f7f4ee]';
  const accentClass = variant === 'dark' ? 'text-[#e8720c]' : 'text-[#f0a35c]';

  return (
    <span className={`inline-flex items-center gap-2.5 ${colorClass}`}>
      <BridgeMark size={s.mark} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-tight ${s.name}`}>
          Kaushal <span className={accentClass}>Setu</span>
        </span>
        {withTagline && (
          <span className="mt-1 text-[11px] font-medium tracking-wide opacity-60">
            Skills · Learning · Opportunity
          </span>
        )}
      </span>
    </span>
  );
};

interface BrandLinkProps extends BrandProps {
  to?: string;
}

export const BrandLink: React.FC<BrandLinkProps> = ({ to = '/', ...props }) => (
  <Link to={to} aria-label="Kaushal Setu home" className="shrink-0">
    <Brand {...props} />
  </Link>
);

export default Brand;
