import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLink } from './Brand';

const PUBLIC_LINKS = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#bridge', label: 'The bridge' },
  { to: '/#impact', label: 'Why it matters' },
];

const APP_LINKS = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/skills', label: 'Skills' },
  { to: '/assessment', label: 'Assessments' },
  { to: '/career', label: 'Career' },
  { to: '/learning', label: 'Learning' },
  { to: '/matching', label: 'Job Matches' },
  { to: '/jobs', label: 'Jobs' },
];

const NAV_BASE =
  'relative px-3 py-2 text-sm font-medium transition-colors rounded-lg';
const NAV_ACTIVE = 'text-[#0e2420] bg-black/[0.06]';
const NAV_IDLE = 'text-[#5b7169] hover:text-[#0e2420] hover:bg-black/[0.04]';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = isAuthenticated ? APP_LINKS : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(14,36,32,0.1)] bg-[rgba(247,244,238,0.86)] backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <BrandLink />

        {isAuthenticated ? (
          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) =>
                  `${NAV_BASE} ${isActive ? NAV_ACTIVE : NAV_IDLE}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="hidden items-center gap-1 md:flex">
            {PUBLIC_LINKS.map((link) => (
              <a key={link.to} href={link.to} className={`${NAV_BASE} ${NAV_IDLE}`}>
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e2420] text-sm font-semibold text-[#f7f4ee]"
                title={user?.email}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(14,36,32,0.28)] px-4 py-2 text-sm font-semibold text-[#0e2420] transition-colors hover:bg-black/[0.05]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#0e2420] transition-colors hover:bg-black/[0.05]"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#0e2420] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-[rgba(14,36,32,0.1)] bg-[#f7f4ee] px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {APP_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-black/[0.06] text-[#0e2420]' : 'text-[#5b7169]'
                      }`
                    }
                  >
                    <LayoutDashboard className="h-4 w-4 opacity-60" />
                    {link.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0e2420]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                {PUBLIC_LINKS.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#5b7169]"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-3 flex flex-col gap-2">
                  <Link to="/login" className="btn-ghost justify-center text-sm" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-primary justify-center text-sm" onClick={() => setMobileOpen(false)}>
                    Get started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
