import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/config';
import BridgeLogo from '../components/BridgeLogo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to authenticate with Flask backend.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    setDemoUser();
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center flex flex-col items-center">
            <BridgeLogo size="md" />
            <h1 className="mt-4 text-xl font-bold tracking-tight text-[#0A2540]">
              Sign In to KaushalSetu
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Access your engineering portfolio, skill assessments, and AI matching
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="niranjan.roy@engineering.ac.in"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] font-medium text-[#0052cc] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#0043a8] focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting to Flask API...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In via Flask API</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Helper for local frontend preview */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-2 px-3 text-xs font-semibold text-[#0052cc] hover:bg-blue-100/60 transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#0052cc]" />
              <span>Use Candidate Demo Session (Niranjan Roy)</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#0052cc] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Backend Endpoint Reference Box */}
        <div className="mt-4 rounded-xl bg-slate-100/80 p-3 text-[11px] text-slate-600">
          <p className="font-semibold text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0052cc]" />
            Flask REST API Endpoint:
          </p>
          <code className="mt-1 block font-mono text-[10px] text-slate-800">
            POST {config.apiBaseUrl}/auth/login
          </code>
        </div>
      </div>
    </div>
  );
};

export default Login;
