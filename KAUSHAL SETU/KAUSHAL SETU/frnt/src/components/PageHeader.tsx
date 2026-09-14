import React from 'react';
import Reveal from './Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
}) => (
  <Reveal className="border-b border-[rgba(14,36,32,0.1)] pb-8">
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#e8720c]">
          {eyebrow}
        </span>
        <h1 className="type-display mt-2 font-semibold text-[#0e2420]">{title}</h1>
        {description && (
          <p className="type-lead mt-3 text-[#5b7169]">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  </Reveal>
);

export default PageHeader;
