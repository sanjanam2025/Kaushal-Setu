import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  ClipboardCheck,
  Briefcase,
  Sparkles,
  TrendingUp,
  BookOpen,
  LogIn,
  UserPlus,
  Server,
  Layers,
  Landmark,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/config';
import BridgeLogo from './BridgeLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Portal Home',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Skills Portfolio',
    path: '/skills',
    icon: Award,
  },
  {
    title: 'Skill Assessment',
    path: '/assessment',
    icon: ClipboardCheck,
    badge: 'Validate',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    title: 'Job Directory',
    path: '/jobs',
    icon: Briefcase,
  },
  {
    title: 'Job Matching',
    path: '/job-matching',
    icon: Sparkles,
    badge: 'AI Engine',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    title: 'Labour Market',
    path: '/labour-market',
    icon: TrendingUp,
  },
  {
    title: 'Training & Curriculum',
    path: '/curriculum',
    icon: BookOpen,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Drawer / Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header inside drawer */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <BridgeLogo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <div className="mb-2 px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          </div>

          <nav className="space-y-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 transition-colors" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.badgeColor || 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {!isAuthenticated && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="mb-2 px-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Account
                </span>
              </div>
              <div className="space-y-1">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register Account</span>
                </NavLink>
              </div>
            </div>
          )}

          {/* Architecture info card */}
          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-3.5 text-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>KaushalSetu Frontend</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Communicates exclusively with your Flask backend via REST API.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-600 bg-white p-2 rounded-xl border border-blue-100/80">
                <Server className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{config.apiBaseUrl}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
