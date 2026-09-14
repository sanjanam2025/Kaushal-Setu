import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { BridgeMark } from './components/Brand';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Assessment from './pages/Assessment';
import Career from './pages/Career';
import Learning from './pages/Learning';
import Jobs from './pages/Jobs';
import JobMatching from './pages/JobMatching';
import LabourMarket from './pages/LabourMarket';

/** Scrolls to the top on route change (hash links are handled natively). */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** Landing redirects signed-in users to their dashboard. */
function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Keep a console trace for debugging without exposing it to users.
    console.error('Kaushal Setu crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f7f4ee] px-4 text-center">
          <BridgeMark size={48} className="text-[#e8720c]" />
          <h1 className="font-display text-2xl font-semibold text-[#0e2420]">
            Something went wrong on the bridge.
          </h1>
          <p className="max-w-md text-sm text-[#5b7169]">
            An unexpected error occurred. Reloading the page usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reload Kaushal Setu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AUTH_PATHS = ['/login', '/register'];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f4ee]">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <PublicOnly>
                    <Login />
                  </PublicOnly>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnly>
                    <Register />
                  </PublicOnly>
                }
              />

              {/* Protected app */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/career"
                element={
                  <ProtectedRoute>
                    <Career />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning"
                element={
                  <ProtectedRoute>
                    <Learning />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matching"
                element={
                  <ProtectedRoute>
                    <JobMatching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/market"
                element={
                  <ProtectedRoute>
                    <LabourMarket />
                  </ProtectedRoute>
                }
              />

              {/* Fallbacks */}
              <Route path="/job-matching" element={<Navigate to="/matching" replace />} />
              <Route path="/labour-market" element={<Navigate to="/market" replace />} />
              <Route path="/curriculum" element={<Navigate to="/learning" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
