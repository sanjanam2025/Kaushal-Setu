import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';

export const Footer: React.FC = () => (
  <footer className="border-t border-[rgba(14,36,32,0.1)] bg-[#f7f4ee]">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Brand withTagline />
          <p className="mt-4 text-sm leading-relaxed text-[#5b7169]">
            A digital bridge between a person's current skills and their future
            career — assessment, direction, learning, and employment in one
            connected journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:gap-16">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e2420]">
              Platform
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#5b7169]">
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/skills">Skill profile</Link></li>
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/assessment">Assessments</Link></li>
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/career">Career paths</Link></li>
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/learning">Learning</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0e2420]">
              Opportunity
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#5b7169]">
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/matching">Job matching</Link></li>
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/jobs">Open roles</Link></li>
              <li><Link className="transition-colors hover:text-[#e8720c]" to="/market">Labour market</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bridge-divider mt-10" />
      <p className="mt-6 text-center text-xs text-[#5b7169]">
        © {new Date().getFullYear()} Kaushal Setu · Empowering skills, enabling futures.
      </p>
    </div>
  </footer>
);

export default Footer;
