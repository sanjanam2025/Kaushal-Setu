import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Brand } from '../components/Brand';

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lower', label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', label: 'One number', test: (value: string) => /[0-9]/.test(value) },
];

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { register, isSubmitting } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !password) {
      setFormError('Please fill in your name, email and password.');
      return;
    }

    if (RULES.some((rule) => !rule.test(password))) {
      setFormError('Your password does not meet all the requirements yet.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('The two passwords do not match.');
      return;
    }

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/dashboard', { replace: true });
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
              'radial-gradient(ellipse 70% 55% at 80% 100%, rgba(232,114,12,0.18), transparent 60%)',
          }}
        />
        <Brand variant="light" />
        <div className="relative z-10 max-w-md">
          <h2 className="type-display font-semibold text-[#f7f4ee]">
            Every bridge starts with a single plank.
          </h2>
          <p className="type-lead mt-4 text-[rgba(247,244,238,0.7)]">
            Create your account, add the skills you already have, and let the
            platform map the rest of the crossing.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[rgba(247,244,238,0.75)]">
            {['Free to start, forever', 'Your data stays yours', 'Built for Indian skill seekers'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#f0a35c]" />
                  {item}
                </li>
              ),
            )}
          </ul>
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#5b7169]">
            One profile for skills, learning, and jobs.
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
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#0e2420]">
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="field-input pl-10"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Choose a strong password"
                  className="field-input pl-10"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {RULES.map((rule) => {
                  const passes = rule.test(password);
                  return (
                    <span
                      key={rule.id}
                      className={`flex items-center gap-1.5 text-xs ${passes ? 'text-[#2e7d5b]' : 'text-[#5b7169]'}`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          passes ? 'bg-[#2e7d5b] text-white' : 'bg-[rgba(14,36,32,0.1)] text-transparent'
                        }`}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                      </span>
                      {rule.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-[#0e2420]">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  className="field-input pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {isSubmitting ? 'Creating account…' : 'Create account'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5b7169]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#c25a04] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
