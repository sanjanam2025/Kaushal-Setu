import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Landmark,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  Server,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/config';
import BridgeLogo from './BridgeLogo';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout, setDemoUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showGovModal, setShowGovModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const currentPath = location.pathname;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/skills', label: 'Skills & Profile' },
    { name: 'How It Works', path: '/assessment', label: 'Assessment' },
    { name: 'Training', path: '/curriculum', label: 'Bridge Curriculum' },
    { name: 'Opportunities', path: '/jobs', label: 'Jobs & Matching' },
    { name: 'For Citizens', path: '/job-matching', label: 'AI Matching' },
    { name: 'For Government', path: '/labour-market', label: 'Labour Market' },
    { name: 'Contact', path: '/#contact', isExternal: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo matching reference */}
          <Link to="/" className="shrink-0 group">
            <BridgeLogo size="md" />
          </Link>

          {/* Center Navigation Links matching reference */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive ? 'font-semibold text-blue-600' : 'text-slate-600'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[3px] rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls matching reference */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Government Portal CTA Button */}
            <button
              type="button"
              onClick={() => setShowGovModal(true)}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#0043a8] transition-all hover:shadow-md"
            >
              <Landmark className="h-4 w-4" />
              <span>Government Portal</span>
            </button>

            {/* Profile Chip matching reference ('NR Niranjan Roy') */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/50 p-1.5 pr-3 text-sm font-semibold text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0052cc] text-xs font-bold text-white shadow-xs">
                  {user ? (user.name ? user.name.slice(0, 2).toUpperCase() : 'NR') : 'NR'}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-900 hidden md:inline">
                  {user ? user.name : 'Niranjan Roy'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="border-b border-slate-100 pb-2.5 px-2">
                    <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user ? user.name : 'Niranjan Roy'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user ? user.email : 'niranjan.roy@engineering.ac.in'}
                    </p>
                    <span className="mt-1.5 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      Engineering Candidate
                    </span>
                  </div>

                  <div className="py-2 text-xs space-y-1">
                    <Link
                      to="/skills"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span>My Skills & Portfolio</span>
                    </Link>
                    <Link
                      to="/assessment"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      <span>My Assessments</span>
                    </Link>
                    <Link
                      to="/labour-market"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5 text-amber-600" />
                      <span>Labour Market Data</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex flex-col gap-1">
                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => {
                          setDemoUser();
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors text-left"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Toggle Demo Mode</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{isAuthenticated ? 'Sign Out' : 'Switch Account / Login'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 xl:hidden"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileNavOpen(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    currentPath === link.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowGovModal(true);
                  setMobileNavOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] py-2 text-xs font-semibold text-white"
              >
                <Landmark className="h-4 w-4" />
                <span>Government Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Government Portal Information Modal */}
      {showGovModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">National Government Portal</h3>
                  <p className="text-xs text-slate-500">Ministry of Skill Development & AICTE Synergy</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGovModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                KaushalSetu integrates with National Skill India Mission schemes, PMKVY certifications,
                and state technical education councils to provide certified credentials and sponsored apprentice stipends.
              </p>
              <div className="rounded-xl bg-blue-50/60 p-3.5 border border-blue-100 text-blue-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-blue-700" />
                  <span>Flask Backend API Endpoint:</span>
                </div>
                <code className="block font-mono text-[11px] bg-white p-1.5 rounded-md border border-blue-200/60">
                  GET {config.apiBaseUrl}/market/government-schemes
                </code>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGovModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                to="/labour-market"
                onClick={() => setShowGovModal(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Explore Market Schemes
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
