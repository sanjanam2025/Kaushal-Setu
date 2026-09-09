import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BridgeLogo from './components/BridgeLogo';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Skills from './pages/Skills';
import Jobs from './pages/Jobs';
import JobMatching from './pages/JobMatching';
import LabourMarket from './pages/LabourMarket';
import Curriculum from './pages/Curriculum';

/**
 * Main application layout matching the reference KaushalSetu design.
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar with exact reference branding and action buttons */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Slide-out Navigation Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Full-width Responsive Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Subtle Brand Footer */}
      {!isAuthPage && (
        <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-500 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <BridgeLogo size="sm" />
            <p className="text-center sm:text-right text-[11px] text-slate-400">
              © {new Date().getFullYear()} KaushalSetu • National Engineering Skills & Opportunity Bridge.
              <span className="block sm:inline sm:ml-2">Frontend Application Connected to Flask REST API.</span>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Core application routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job-matching" element={<JobMatching />} />
            <Route path="/matching" element={<Navigate to="/job-matching" replace />} />
            <Route path="/labour-market" element={<LabourMarket />} />
            <Route path="/curriculum" element={<Curriculum />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
