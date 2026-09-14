import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Brand } from '../components/Brand';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { login, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both your email and password.');
      return;
    }

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Left: narrative panel */}
      <div className="ink-panel relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 20% 100%, rgba(232,114,12,0.18), transparent 60%)',
          }}
        />
        <Brand variant="light" />
        <div className="relative z-10 max-w-md">
          <h2 className="type-display font-semibold text-[#f7f4ee]">
            Welcome back to the bridge.
          </h2>
          <p className="type-lead mt-4 text-[rgba(247,244,238,0.7)]">
            Your verified skills, career direction, and job matches are exactly
            where you left them.
          </p>
        </div>
        <p className="relative z-10 text-xs text-[rgba(247,244,238,0.45)]">
          © {new Date().getFullYear()} Kaushal Setu
        </p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Brand />
          </div>
          <h1 className="type-title mt-8 font-semibold text-[#0e2420] lg:mt-0">
            Sign in to Kaushal Setu
          </h1>
          <p className="mt-2 text-sm text-[#5b7169]">
            Continue your journey from skills to employment.
          </p>

          {formError && (
            <div
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#f3c9ad] bg-[#fdeee2] px-4 py-3 text-sm text-[#9a4303]"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#0e2420]">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="field-input pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#0e2420]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="field-input pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5b7169]">
            New to Kaushal Setu?{' '}
            <Link to="/register" className="font-semibold text-[#c25a04] hover:underline">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
