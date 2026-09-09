import React from 'react';

interface BridgeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BridgeLogo: React.FC<BridgeLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Suspension Bridge Icon Matching Reference Design */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 48 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-blue-600 drop-shadow-xs"
        >
          {/* Main Road Deck */}
          <path
            d="M2 25H46"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bridge Pylon Towers */}
          <path
            d="M15 6V25M33 6V25"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Tower Caps */}
          <path
            d="M13 6H17M31 6H35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Main Parabolic Suspension Cable */}
          <path
            d="M2 24C8 18 13 8 15 6C17 14 31 14 33 6C35 8 40 18 46 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Vertical Hangers / Suspenders */}
          <path
            d="M8 25V20.5M20 25V13M24 25V14M28 25V13M40 25V20.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Lower Support Arch / River Line */}
          <path
            d="M10 30C15 26 33 26 38 30"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M5 33H43"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#0A2540] leading-none ${titleSizes[size]}`}
        >
          Kaushal<span className="text-blue-600">Setu</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-medium tracking-wide text-slate-500 mt-1 whitespace-nowrap">
            Skills • Learning • Opportunities
          </span>
        )}
      </div>
    </div>
  );
};

export default BridgeLogo;
