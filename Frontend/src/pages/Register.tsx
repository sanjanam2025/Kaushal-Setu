import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldCheck,
  Check,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OnboardingIllustration from '../components/OnboardingIllustration';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('Niranjan Roy');
  const [dob, setDob] = useState('2002-05-14');
  const [gender, setGender] = useState('Male');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [email, setEmail] = useState('niranjan.roy@engineering.ac.in');
  const [password, setPassword] = useState('Pass@1234');
  const [confirmPassword, setConfirmPassword] = useState('Pass@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password validation metrics
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const stepsList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Education' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Experience' },
    { num: 5, label: 'Review' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword || !dob || !gender || !mobileNumber) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and try again.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register({ name: fullName, email, password, role: 'candidate' });
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 2-Column Responsive Layout matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ONBOARDING / INFORMATION PANEL                              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between rounded-3xl border border-[#d0e1f4] bg-[#edf4fc] p-6 sm:p-7 shadow-xs min-h-[640px]">
          <div>
            {/* Eyebrow */}
            <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] block">
              CREATE PROFILE
            </span>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1.5 tracking-tight leading-tight">
              Let’s get started!
            </h1>

            {/* Accent blue underline */}
            <div className="h-1 w-12 bg-[#0052cc] rounded-full mt-2 mb-3.5" />

            {/* Supporting description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create your account to access personalized skill analysis, training programs, job opportunities and government schemes.
            </p>

            {/* Visual Illustration */}
            <div className="my-5 flex justify-center">
              <OnboardingIllustration step={1} />
            </div>

            {/* Security reassurance card */}
            <div className="rounded-2xl border border-blue-100 bg-white p-4 flex items-start gap-3.5 shadow-2xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0A2540]">Your information is safe with us</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  We use industry-standard security to protect your data and privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mt-8 pt-5 border-t border-blue-200/60">
            <div className="flex items-center justify-between relative px-2">
              {/* Connecting line */}
              <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-200 -z-0" />
              {stepsList.map((step) => {
                const isActive = step.num === 1;
                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                        isActive
                          ? 'bg-[#0052cc] text-white ring-4 ring-blue-200'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {step.num}
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-semibold transition-colors ${
                        isActive ? 'text-[#0052cc] font-bold' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tagline */}
            <div className="mt-7 text-center">
              <p className="text-xs font-bold text-[#0052cc]">
                “Empowering Skills. Enabling Futures.”
              </p>
              <div className="h-0.5 w-12 bg-[#0052cc] mx-auto mt-2 rounded-full" />
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3">
              © 2025 KaushalSetu. All rights reserved.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: "CREATE YOUR ACCOUNT" REGISTRATION FORM                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-xs min-h-[640px]">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Step 1 of 5
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Please fill in your personal details to get started with KaushalSetu.
            </p>
          </div>

          {/* Error Alert if any */}
          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-700 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Full Name & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Gender & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:outline-none transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#0052cc] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <div className="flex items-center gap-1.5 bg-slate-50/80 px-3 border-r border-slate-200 text-xs font-bold text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{countryCode}</span>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    required
                    className="flex-1 py-2.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 rounded p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 rounded p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements Checklist Card */}
            <div className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                <ShieldCheck className="h-4 w-4 text-[#0052cc]" />
                <span>Password Requirements</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${hasMinLength ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {hasMinLength ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUpperCase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${hasUpperCase ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {hasUpperCase ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasLowerCase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${hasLowerCase ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {hasLowerCase ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <span>At least one lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {hasNumber ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <span>At least one number (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 sm:col-span-2 ${hasSpecialChar ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${hasSpecialChar ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {hasSpecialChar ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
                  </div>
                  <span>At least one special character (!@#$%^&*...)</span>
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                />
                <span className="leading-normal">
                  I agree to the{' '}
                  <a href="#terms" className="text-[#0052cc] font-semibold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-[#0052cc] font-semibold hover:underline">
                    Privacy Policy
                  </a>
                  , and consent to identity verification through the National Skill Registry.
                </span>
              </label>
            </div>

            {/* Bottom Row: Security / Privacy Message & Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>By submitting, you agree to our Terms & Conditions and Privacy Policy.</span>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#0052cc] hover:underline"
                >
                  Already registered?
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Register & Continue'}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
