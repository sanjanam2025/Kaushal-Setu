import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Target,
  ChevronDown,
  Layers,
  Server,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Zap,
  Settings,
  Laptop,
  Building2,
  Radio,
  Cpu,
  Car,
  BarChart3,
  FlaskConical,
  Monitor,
  Plane,
  Leaf,
  Mountain,
  Dna,
  Brain,
  LayoutGrid,
  X,
  Clock,
  UploadCloud,
  Search,
  CheckSquare,
  Users,
  MapPin,
  Building,
  FileText,
  Plus,
  Pencil,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/config';
import OnboardingIllustration from '../components/OnboardingIllustration';

// The 15 Engineering fields matching KaushalSetu national occupational standards
interface EngineeringField {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  openJobsCount: number;
}

const engineeringFieldsList: EngineeringField[] = [
  { id: 'ee', name: 'Electrical Engineering', icon: Zap, description: 'Power systems, electrical machines, microgrids, and high-voltage engineering.', openJobsCount: 1420 },
  { id: 'me', name: 'Mechanical Engineering', icon: Settings, description: 'Thermodynamics, robotics, CAD/CAM drafting, mechatronics, and thermal analysis.', openJobsCount: 1850 },
  { id: 'cse', name: 'Computer Science Engineering', icon: Laptop, description: 'Full-stack software engineering, algorithms, distributed systems, and cloud infrastructure.', openJobsCount: 4890 },
  { id: 'ce', name: 'Civil Engineering', icon: Building2, description: 'Structural engineering, transport infrastructure, geotechnical analysis, and BIM modeling.', openJobsCount: 1210 },
  { id: 'ece', name: 'Electronics & Communication Engineering', icon: Radio, description: 'Wireless communications, RF engineering, embedded firmware, and 5G signal processing.', openJobsCount: 1670 },
  { id: 'ee-tech', name: 'Electronics Engineering', icon: Cpu, description: 'VLSI chip design, microcontrollers, FPGA synthesis, and printed circuit board fabrication.', openJobsCount: 1380 },
  { id: 'ae', name: 'Automobile Engineering', icon: Car, description: 'Electric vehicle powertrain, automotive diagnostics, aerodynamics, and telemetry systems.', openJobsCount: 940 },
  { id: 'ie', name: 'Industrial Engineering', icon: BarChart3, description: 'Supply chain logistics, operations research, Six Sigma quality control, and lean manufacturing.', openJobsCount: 820 },
  { id: 'che', name: 'Chemical Engineering', icon: FlaskConical, description: 'Process design, petrochemical refining, pharmaceutical formulation, and fluid dynamics.', openJobsCount: 650 },
  { id: 'it', name: 'Information Technology', icon: Monitor, description: 'Cybersecurity, systems administration, database management, and cloud architecture.', openJobsCount: 3420 },
  { id: 'aero', name: 'Aerospace Engineering', icon: Plane, description: 'Avionics, propulsion aerodynamics, flight dynamics, and satellite orbital systems.', openJobsCount: 430 },
  { id: 'env', name: 'Environmental Engineering', icon: Leaf, description: 'Water treatment, renewable energy systems, environmental impact assessment, and carbon capture.', openJobsCount: 510 },
  { id: 'min', name: 'Mining Engineering', icon: Mountain, description: 'Mineral exploration, geomechanics, mine planning software, and ventilation safety.', openJobsCount: 290 },
  { id: 'bt', name: 'Biotechnology Engineering', icon: Dna, description: 'Bioinformatics, CRISPR gene editing, bioprocess engineering, and genomics analytics.', openJobsCount: 760 },
  { id: 'ai-ds', name: 'AI & Data Science Engineering', icon: Brain, description: 'Machine learning models, neural networks, predictive analytics, NLP, and computer vision.', openJobsCount: 5140 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab mode: 'onboarding' (active reference design) vs 'fields'
  const [activeTab, setActiveTab] = useState<'onboarding' | 'fields'>('onboarding');

  // Step 1 is set as the active initial view for the Create Profile flow
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ==========================================
  // Step 1 Form States (Personal Information)
  // ==========================================
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

  // Password validation metrics
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  // ==========================================
  // Step 2 Form States (Educational Information - 3rd phase.png)
  // ==========================================
  const [qualification, setQualification] = useState('Diploma');
  const [instituteName, setInstituteName] = useState('');
  const [universityBoard, setUniversityBoard] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [percentageCgpa, setPercentageCgpa] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Mechanical Engineering');
  const [searchBranchQuery, setSearchBranchQuery] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // ==========================================
  // Step 3-5 Auxiliary States (Skills & Review)
  // ==========================================
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Circuit Design',
    'Power Systems',
    'MATLAB',
    'AutoCAD',
    'PLC Programming',
    'Embedded Systems',
    'Electrical Machines',
    'Project Management',
    'Communication Skills',
    'Problem Solving',
  ]);
  const [searchSkillInput, setSearchSkillInput] = useState('');
  const [activeSuggestedCategory, setActiveSuggestedCategory] = useState<string | null>(null);

  // ==========================================
  // Step 4 Work Experience States (5th phase.png)
  // ==========================================
  const [currentRole, setCurrentRole] = useState('Electrical Technician (Fresher)');
  const [companyName, setCompanyName] = useState('');
  const [experienceDomain, setExperienceDomain] = useState('Electrical Engineering');
  const [industrySector, setIndustrySector] = useState('');
  const [workCity, setWorkCity] = useState('Bengaluru');
  const [workState, setWorkState] = useState('Karnataka');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [totalExperience, setTotalExperience] = useState('0 - 1 Year');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [experienceSkills, setExperienceSkills] = useState<string[]>([
    'Electrical Wiring',
    'PLC Basics',
    'Troubleshooting',
    'Industrial Safety',
  ]);
  const [experienceSkillInput, setExperienceSkillInput] = useState('');
  const [keyResponsibilities, setKeyResponsibilities] = useState('');
  const [isFresher, setIsFresher] = useState(false);
  const [extraExperiences, setExtraExperiences] = useState<{ role: string; company: string; duration: string }[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedFieldModal, setSelectedFieldModal] = useState<EngineeringField | null>(null);

  // Filter 15 branches by search query
  const filteredBranches = engineeringFieldsList.filter((b) =>
    b.name.toLowerCase().includes(searchBranchQuery.toLowerCase())
  );

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  // Step progression
  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 600);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepsList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Education' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Experience' },
    { num: 5, label: 'Review' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Utility Switcher: Profile Onboarding vs 15 Fields Directory */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('onboarding')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'onboarding'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Candidate Profile & Onboarding (Step {currentStep} of 5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'fields'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Explore 15 Engineering Fields
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span>Connected to Flask REST API:</span>
          <code className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
            {config.apiBaseUrl}
          </code>
        </div>
      </div>

      {activeTab === 'onboarding' ? (
        /* ========================================================================= */
        /* TWO-COLUMN DASHBOARD LAYOUT (Pixel-matched with Reference Image 3rd phase.png) */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: HERO MOTIVATION, ILLUSTRATION, SECURITY & STEPPER         */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 xl:col-span-4 rounded-3xl border border-[#d0e1f4] bg-[#edf4fc] p-6 sm:p-7 shadow-xs flex flex-col justify-between min-h-[640px]">
            <div>
              {/* Eyebrow */}
              <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] block">
                CREATE PROFILE
              </span>

              {/* Dynamic Heading based on current step */}
              {currentStep === 2 ? (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
                  Tell us about your{' '}
                  <span className="text-[#0052cc] block">education</span>
                </h1>
              ) : currentStep === 3 ? (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
                  Tell us about <br />
                  your <span className="text-[#0052cc]">skills</span>
                </h1>
              ) : currentStep === 4 ? (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
                  Tell us about your <br />
                  <span className="text-[#0052cc]">work experience</span>
                </h1>
              ) : currentStep === 5 ? (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
                  Review your <br />
                  <span className="text-[#0052cc]">information</span>
                </h1>
              ) : currentStep === 1 ? (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight">
                  Let’s get started!
                </h1>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight">
                  Review your <br />
                  <span className="text-[#0052cc]">profile</span>
                </h1>
              )}

              {/* Accent horizontal bar */}
              <div className="h-1 w-12 bg-[#0052cc] rounded-full mt-2.5 mb-4" />

              {/* Explanatory description */}
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                {currentStep === 5
                  ? 'Please review all the details before submitting your profile. You can edit any section if needed.'
                  : currentStep === 4
                  ? 'Add your work experience to help employers understand your background and match you with the right opportunities.'
                  : currentStep === 3
                  ? 'Add your skills to help us recommend the best training programs, certifications and job opportunities for you.'
                  : currentStep === 2
                  ? 'Your educational background helps us recommend the right training, certifications and job opportunities for you.'
                  : 'Create your account to access personalized skill analysis, training programs, certifications, job opportunities and government schemes across 15 engineering fields.'}
              </p>

              {/* Illustrated Visual with Slogan & Student with Laptop */}
              <div className="my-6">
                <OnboardingIllustration step={currentStep} />
              </div>

              {/* Reassurance Card */}
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

            {/* Stepper at bottom of left column */}
            <div className="mt-8 pt-5 border-t border-blue-200/60">
              <div className="flex items-center justify-between relative px-2">
                {/* Stepper connecting line */}
                <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-200 -z-0" />

                {stepsList.map((step) => {
                  const isActive = currentStep === step.num;
                  const isCompleted = currentStep > step.num;

                  return (
                    <div
                      key={step.num}
                      onClick={() => setCurrentStep(step.num)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                          isActive
                            ? 'bg-[#0052cc] text-white ring-4 ring-blue-200'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-blue-400'
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.num}
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-semibold transition-colors ${
                          isActive ? 'text-[#0052cc] font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Motivational Quote at bottom matching reference images */}
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

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: MAIN INTERACTIVE STEP CONTENT (6th phase.png for Step 5)  */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-8 xl:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-xs min-h-[640px]">
            {/* Header: Title + Notification Banner / Edit Profile Button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                  {currentStep === 5 ? (
                    'Profile Review'
                  ) : currentStep === 2 ? (
                    <>
                      Educational <span className="text-[#0052cc]">Information</span>
                    </>
                  ) : currentStep === 3 ? (
                    'Skills & Expertise'
                  ) : currentStep === 4 ? (
                    <>
                      Work <span className="text-[#0052cc]">Experience</span>
                    </>
                  ) : (
                    'Create Your Account'
                  )}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                  Step {currentStep} of 5
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentStep === 5
                    ? 'Please review all the details before submitting your profile.'
                    : currentStep === 4
                    ? 'Add your work experience to help us match you with relevant job opportunities.'
                    : currentStep === 3
                    ? 'Select the skills you have. You can add multiple skills from the list or type your own.'
                    : currentStep === 2
                    ? 'Fill in your educational details to help us understand your background better.'
                    : 'Please fill in your personal details to get started with KaushalSetu.'}
                </p>
              </div>

              {/* Right Side Header Action: Edit Profile Button on Step 5, or Info Banner on others */}
              {currentStep === 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 shadow-2xs transition-all cursor-pointer self-start lg:self-auto"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : currentStep === 1 ? null : (
                <div className="rounded-2xl border border-blue-100/90 bg-[#f0f6ff] p-3.5 sm:p-4 flex items-center gap-3.5 max-w-md shadow-2xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052cc] text-white shadow-xs">
                    {currentStep === 4 ? (
                      <Briefcase className="h-5 w-5" />
                    ) : currentStep === 3 ? (
                      <Lightbulb className="h-5 w-5" />
                    ) : (
                      <GraduationCap className="h-5 w-5" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    {currentStep === 4
                      ? 'Your work experience helps us provide better job matches, skill recommendations and career growth opportunities.'
                      : currentStep === 3
                      ? 'Your skills help us match you with the right training programs, certifications, job opportunities and government schemes.'
                      : 'Your education details help us provide personalized skill recommendations, relevant training programs and better job opportunities across 15 engineering fields.'}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* STEP 1: PERSONAL DETAILS (Matches Reference Image)                  */}
            {/* =================================================================== */}
            {currentStep === 1 && (
              <form onSubmit={handleNext} className="mt-6 space-y-4">
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
                        placeholder="Niranjan Roy"
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
                      I agree to the <a href="#terms" className="text-[#0052cc] font-semibold hover:underline">Terms of Service</a> and{' '}
                      <a href="#privacy" className="text-[#0052cc] font-semibold hover:underline">Privacy Policy</a>, and consent to identity verification through the National Skill Registry.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>By submitting, you agree to our Terms & Conditions and Privacy Policy.</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Register & Continue</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            )}

            {/* =================================================================== */}
            {/* STEP 2: EDUCATIONAL INFORMATION (Pixel-matched to 3rd phase.png)    */}
            {/* =================================================================== */}
            {currentStep === 2 && (
              <form onSubmit={handleNext} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Form Sub-column */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Highest Qualification */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Highest Qualification <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <select
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        >
                          <option value="Diploma">Diploma</option>
                          <option value="B.Tech / B.E.">B.Tech / B.E. (Bachelor of Engineering)</option>
                          <option value="M.Tech / M.E.">M.Tech / M.E. (Master of Engineering)</option>
                          <option value="B.Sc / BCA">B.Sc / BCA (Computer Applications)</option>
                          <option value="Polytechnic">Polytechnic Certification</option>
                          <option value="Ph.D.">Ph.D. / Research Fellowship</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Institute / College Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Institute / College Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={instituteName}
                          onChange={(e) => setInstituteName(e.target.value)}
                          placeholder="Enter institute or college name"
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* University / Board */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        University / Board <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <select
                          value={universityBoard}
                          onChange={(e) => setUniversityBoard(e.target.value)}
                          required
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        >
                          <option value="">Select university / board</option>
                          <option value="State Board of Technical Education">State Board of Technical Education</option>
                          <option value="AICTE Approved University">AICTE Approved University</option>
                          <option value="Anna University">Anna University</option>
                          <option value="Visvesvaraya Technological University (VTU)">Visvesvaraya Technological University (VTU)</option>
                          <option value="Jawaharlal Nehru Technological University (JNTU)">JNTU Hyderabad / Kakinada</option>
                          <option value="University of Mumbai">University of Mumbai</option>
                          <option value="Dr. A.P.J. Abdul Kalam Technical University (AKTU)">AKTU Lucknow</option>
                          <option value="Delhi Technological University">Delhi Technological University</option>
                          <option value="Autonomous Engineering Institution">Autonomous Engineering Institution</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Year of Passing & Duration of Course (Side-by-side) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Year of Passing */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          Year of Passing <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <select
                            value={passingYear}
                            onChange={(e) => setPassingYear(e.target.value)}
                            required
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          >
                            <option value="">Select year</option>
                            <option value="2027">2027</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Duration of Course */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          Duration of Course <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <select
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            required
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          >
                            <option value="">Select duration</option>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="5 Years (Integrated)">5 Years (Integrated)</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Percentage / CGPA */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Percentage / CGPA <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <BarChart3 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={percentageCgpa}
                          onChange={(e) => setPercentageCgpa(e.target.value)}
                          placeholder="Enter percentage or CGPA (e.g., 8.5 or 78%)"
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Additional Certification (Optional Upload Box) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Additional Certification <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setUploadedFileName(e.dataTransfer.files[0].name);
                          }
                        }}
                        className="rounded-2xl border-2 border-dashed border-blue-200 bg-white p-5 text-center cursor-pointer hover:bg-blue-50/40 hover:border-blue-400 transition-all flex items-center justify-center gap-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc]">
                          <UploadCloud className="h-6 w-6 stroke-[1.75]" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800">
                            {uploadedFileName ? (
                              <span className="text-[#0052cc] font-semibold">{uploadedFileName} (Attached)</span>
                            ) : (
                              'Click to upload or drag and drop'
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            PDF, JPG, PNG up to 5MB (e.g., certificates, diplomas)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Form Sub-column: Engineering Field / Branch Selector (Matches 3rd phase.png) */}
                  <div className="md:col-span-5 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Engineering Field / Branch <span className="text-rose-500">*</span>
                    </label>

                    {/* Selector Trigger */}
                    <div className="relative">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-800 font-semibold shadow-2xs">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-[#0052cc]" />
                          <span className="truncate">{selectedBranch || 'Select engineering field'}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Search Field inside dropdown panel */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={searchBranchQuery}
                          onChange={(e) => setSearchBranchQuery(e.target.value)}
                          placeholder="Search engineering field..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-[11px] text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* 15 Engineering Fields Scrollable list matching reference */}
                      <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
                        {filteredBranches.map((branch) => {
                          const isSelected = selectedBranch === branch.name;
                          return (
                            <div
                              key={branch.id}
                              onClick={() => setSelectedBranch(branch.name)}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 text-[#0052cc] font-bold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{branch.name}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#0052cc] stroke-[3]" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons: Previous (Left) + Save & Continue (Right) */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Save & Continue</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            )}

            {/* =================================================================== */}
            {/* STEP 3: SKILLS SELECTION (Pixel-matched to 4th phase.png)           */}
            {/* =================================================================== */}
            {currentStep === 3 && (
              <form onSubmit={handleNext} className="mt-6 space-y-6">
                {/* Field 1: Engineering Field (Read-only prefill from Step 2) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Engineering Field</label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs text-slate-800 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-800">{selectedBranch || 'Electrical Engineering'}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      (From your education details)
                    </span>
                  </div>
                </div>

                {/* Field 2: Search and Add Skills * */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Search and Add Skills <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchSkillInput}
                        onChange={(e) => setSearchSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (searchSkillInput.trim() && !selectedSkills.includes(searchSkillInput.trim())) {
                              setSelectedSkills([...selectedSkills, searchSkillInput.trim()]);
                              setSearchSkillInput('');
                            }
                          }
                        }}
                        placeholder="Search skills (e.g., AutoCAD, Circuit Design, Python, Project Management)"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (searchSkillInput.trim() && !selectedSkills.includes(searchSkillInput.trim())) {
                          setSelectedSkills([...selectedSkills, searchSkillInput.trim()]);
                          setSearchSkillInput('');
                        }
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Section: Your Selected Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold text-slate-800">Your Selected Skills</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedSkills.length} skills selected
                    </span>
                  </div>

                  {/* Removable Skill Pills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#0052cc] hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                          className="rounded-full p-0.5 hover:bg-blue-200/60 text-[#0052cc] transition-colors cursor-pointer"
                          title={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </span>
                    ))}

                    {selectedSkills.length === 0 && (
                      <p className="text-xs text-slate-400 italic py-1">
                        No skills selected. Add skills using the search bar or suggested categories below.
                      </p>
                    )}
                  </div>
                </div>

                {/* Section: Or choose from suggested skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800">Or choose from suggested skills</h3>
                    <button
                      type="button"
                      onClick={() => navigate('/skills')}
                      className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Skills</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* 8 Category Cards (2x4 grid matching 4th phase.png) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'tech', name: 'Technical Skills', icon: Settings, quick: 'Microcontroller Architecture' },
                      { id: 'tools', name: 'Software Tools', icon: Laptop, quick: 'Simulink' },
                      { id: 'domain', name: 'Domain Knowledge', icon: Lightbulb, quick: 'Renewable Energy' },
                      { id: 'soft', name: 'Soft Skills', icon: Users, quick: 'Team Leadership' },
                      { id: 'mgmt', name: 'Management Skills', icon: BarChart3, quick: 'Agile / Scrum' },
                      { id: 'research', name: 'Research & Innovation', icon: FlaskConical, quick: 'Prototyping' },
                      { id: 'readiness', name: 'Industry Readiness', icon: Briefcase, quick: 'Industrial Safety (OSHA)' },
                      { id: 'emerging', name: 'Emerging Technologies', icon: Cpu, quick: 'Internet of Things (IoT)' },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isAdded = selectedSkills.includes(cat.quick);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            if (!isAdded) {
                              setSelectedSkills([...selectedSkills, cat.quick]);
                            }
                          }}
                          className="group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-left shadow-2xs hover:border-[#0052cc]/60 hover:bg-blue-50/40 hover:shadow-xs transition-all cursor-pointer"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-all">
                            <Icon className="h-5 w-5 stroke-[1.75]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0052cc] transition-colors block truncate leading-tight">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                              + {cat.quick}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Buttons: Previous (Left) + Save & Continue (Right) */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Save & Continue</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            )}

            {/* =================================================================== */}
            {/* STEP 4: WORK EXPERIENCE (Pixel-matched to 5th phase.png)             */}
            {/* =================================================================== */}
            {currentStep === 4 && (
              <form onSubmit={handleNext} className="mt-6 space-y-5">
                {/* Row 1: Current Role + Company / Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Current Role / Job Title <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={currentRole}
                        disabled={isFresher}
                        onChange={(e) => setCurrentRole(e.target.value)}
                        placeholder="Electrical Technician (Fresher)"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={companyName}
                        disabled={isFresher}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Engineering Field / Domain + Industry / Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Engineering Field / Domain</label>
                    <div className="relative">
                      <Settings className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={experienceDomain}
                        onChange={(e) => setExperienceDomain(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
                        <option value="Aerospace Engineering">Aerospace Engineering</option>
                        <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Industry / Sector <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={industrySector}
                        onChange={(e) => setIndustrySector(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">Select industry sector</option>
                        <option value="Power, Energy & Utilities">Power, Energy & Utilities</option>
                        <option value="Automotive & Electric Vehicles (EV)">Automotive & Electric Vehicles (EV)</option>
                        <option value="Industrial Automation & PLC">Industrial Automation & PLC</option>
                        <option value="Electronics & Semiconductor">Electronics & Semiconductor</option>
                        <option value="Infrastructure & EPC">Infrastructure & EPC</option>
                        <option value="Information Technology / Software">Information Technology / Software</option>
                        <option value="Aerospace & Defense">Aerospace & Defense</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Work Location + Employment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Work Location</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <select
                          value={workCity}
                          onChange={(e) => setWorkCity(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-7 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Kolkata">Kolkata</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>

                      <div className="relative">
                        <select
                          value={workState}
                          onChange={(e) => setWorkState(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-7 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Employment Type</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Apprenticeship / NATS">Apprenticeship / NATS</option>
                        <option value="Internship">Internship</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Part Time">Part Time</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Total Experience + Notice Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Total Experience</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={totalExperience}
                        disabled={isFresher}
                        onChange={(e) => setTotalExperience(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-all cursor-pointer"
                      >
                        <option value="0 - 1 Year">0 - 1 Year</option>
                        <option value="1 - 2 Years">1 - 2 Years</option>
                        <option value="2 - 5 Years">2 - 5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Notice Period <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Row 5: Skills Used / Demonstrated in This Role (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Skills Used / Demonstrated in This Role <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={experienceSkillInput}
                        onChange={(e) => setExperienceSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (experienceSkillInput.trim() && !experienceSkills.includes(experienceSkillInput.trim())) {
                              setExperienceSkills([...experienceSkills, experienceSkillInput.trim()]);
                              setExperienceSkillInput('');
                            }
                          }
                        }}
                        placeholder="Search and add skills (e.g., PLC, AutoCAD, Troubleshooting, Project Management)"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (experienceSkillInput.trim() && !experienceSkills.includes(experienceSkillInput.trim())) {
                          setExperienceSkills([...experienceSkills, experienceSkillInput.trim()]);
                          setExperienceSkillInput('');
                        }
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Removable Skill Pills matching 5th phase.png */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {experienceSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#0052cc] hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => setExperienceSkills(experienceSkills.filter((s) => s !== skill))}
                          className="rounded-full p-0.5 hover:bg-blue-200/60 text-[#0052cc] transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Row 6: Key Responsibilities (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Key Responsibilities <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={keyResponsibilities}
                      onChange={(e) => setKeyResponsibilities(e.target.value)}
                      placeholder="Describe your key responsibilities and achievements..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="text-right text-[11px] text-slate-400 mt-1 font-mono">
                    {keyResponsibilities.length}/500 Characters
                  </div>
                </div>

                {/* Row 7: Previous Experience (Dashed Box) + Fresher Checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  {/* Previous Experience Container with Dashed Border matching 5th phase.png */}
                  <div className="flex-1 rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Add your previous work experience</h4>
                        <p className="text-[11px] text-slate-500">You can add multiple experiences</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setExtraExperiences([
                          ...extraExperiences,
                          { role: 'Apprentice Trainee', company: 'Bharat Heavy Electricals Ltd (BHEL)', duration: '6 Months' },
                        ]);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#0052cc] bg-white px-4 py-2 text-xs font-bold text-[#0052cc] hover:bg-blue-50 shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  {/* Fresher Checkbox */}
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer shrink-0 select-none">
                    <input
                      type="checkbox"
                      checked={isFresher}
                      onChange={(e) => {
                        setIsFresher(e.target.checked);
                        if (e.target.checked) {
                          setCurrentRole('Fresher / Graduate Trainee');
                          setCompanyName('');
                          setTotalExperience('0 - 1 Year');
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                    />
                    <span>
                      I don’t have any work experience <br className="hidden sm:inline" />
                      <span className="text-slate-500 font-normal">(I am a fresher)</span>
                    </span>
                  </label>
                </div>

                {/* Extra experience items if added */}
                {extraExperiences.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {extraExperiences.map((exp, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-slate-800">{exp.role}</span>
                          <span className="text-slate-500">at {exp.company} ({exp.duration})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExtraExperiences(extraExperiences.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Row 8: Bottom Action Buttons: Previous (Left) + Save & Continue (Right) */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Save & Continue</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            )}

            {/* =================================================================== */}
            {/* STEP 5: REVIEW & CONFIRMATION (Pixel-matched to 6th phase.png)      */}
            {/* =================================================================== */}
            {currentStep === 5 && (
              <div className="mt-6 space-y-6">
                {submitSuccess ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                      <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-950">
                      Congratulations, {fullName}!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                      Your engineering profile in <span className="font-bold">{selectedBranch}</span> ({qualification}) has been successfully submitted and indexed with National Skill Development standards.
                    </p>
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        to="/job-matching"
                        className="rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all"
                      >
                        Explore Matched Jobs
                      </Link>
                      <Link
                        to="/labour-market"
                        className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                      >
                        View Labour Market Analytics
                      </Link>
                      <Link
                        to="/assessment"
                        className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-100 transition-all"
                      >
                        Take Skill Assessment
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 4 Cards in 2x2 Grid matching 6th phase.png */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* CARD 1: PERSONAL INFORMATION */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                              <User className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold text-[#0A2540]">Personal Information</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Full Name</span>
                            <span className="font-bold text-slate-900">{fullName || 'Niranjan Roy'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Date of Birth</span>
                            <span className="font-semibold text-slate-800">15 July 2003</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Gender</span>
                            <span className="font-semibold text-slate-800">{gender || 'Male'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Mobile Number</span>
                            <span className="font-semibold text-slate-800">{countryCode} {mobileNumber || '98765 43210'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Email Address</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-none">{email || 'niranjan.roy@example.com'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Aadhaar Number</span>
                            <span className="font-mono text-slate-700 font-medium">XXXX XXXX 1234</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Alternate Mobile</span>
                            <span className="text-slate-400">-</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">Profile Photo</span>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
                                NR
                              </div>
                              <span className="text-[11px] font-semibold text-emerald-600">Attached</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD 2: EDUCATIONAL INFORMATION */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold text-[#0A2540]">Educational Information</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Highest Qualification</span>
                            <span className="font-bold text-[#0052cc]">{qualification || 'Diploma'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Engineering Field</span>
                            <span className="font-bold text-slate-800">{selectedBranch || 'Electrical Engineering'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Institute / College</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-none">{instituteName || 'Government Polytechnic Bengaluru'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">University / Board</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-none">{universityBoard || 'DTE Karnataka'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Year of Passing</span>
                            <span className="font-semibold text-slate-800">{passingYear || '2024'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Duration of Course</span>
                            <span className="font-semibold text-slate-800">{courseDuration || '3 Years'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Percentage / CGPA</span>
                            <span className="font-bold text-emerald-700">{percentageCgpa || '78.40 %'}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">Additional Certification</span>
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#0052cc] font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              <FileText className="h-3 w-3" />
                              <span>{uploadedFileName || 'Diploma_Certificate.pdf'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD 3: SKILLS INFORMATION */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                              <Cpu className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold text-[#0A2540]">Skills Information</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="space-y-3.5 text-xs">
                          {/* Technical Skills with Blue Badges matching 6th phase.png */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                              Technical Skills
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Electrical Wiring', 'PLC Basics', 'Troubleshooting', 'AutoCAD', 'MATLAB', 'Embedded Systems', 'Circuit Design'].map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0052cc] border border-blue-200/80 shadow-2xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Soft Skills with Mint Green Badges matching 6th phase.png */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                              Soft Skills
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Problem Solving', 'Teamwork', 'Communication', 'Time Management'].map((skill) => (
                                <span
                                  key={skill}
                                  className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                            <span className="text-slate-500">Proficiency Level</span>
                            <span className="font-bold text-slate-800">Intermediate</span>
                          </div>

                          <div className="flex justify-between items-start pt-1 border-t border-slate-50">
                            <span className="text-slate-500 mt-1">Certificates</span>
                            <div className="space-y-1.5 text-right">
                              <div className="inline-flex items-center gap-1.5 text-xs text-[#0052cc] font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                <FileText className="h-3 w-3" />
                                <span>Electrical_Wiring_Cert.pdf</span>
                              </div>
                              <br />
                              <div className="inline-flex items-center gap-1.5 text-xs text-[#0052cc] font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                <FileText className="h-3 w-3" />
                                <span>PLC_Certificate.pdf</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD 4: WORK EXPERIENCE */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold text-[#0A2540]">Work Experience</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Current Role / Job Title</span>
                            <span className="font-bold text-slate-900">{currentRole || 'Electrical Technician (Fresher)'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Company / Organization</span>
                            <span className="font-semibold text-slate-800">{companyName || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Engineering Field</span>
                            <span className="font-semibold text-slate-800">{experienceDomain || 'Electrical Engineering'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Industry / Sector</span>
                            <span className="text-slate-500">{industrySector || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Work Location</span>
                            <span className="font-semibold text-slate-800">{workCity}, {workState}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Employment Type</span>
                            <span className="font-semibold text-slate-800">{employmentType || 'Full Time'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Total Experience</span>
                            <span className="font-bold text-[#0052cc]">{totalExperience || '0 – 1 Year'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Notice Period</span>
                            <span className="font-semibold text-emerald-700">{noticePeriod || 'Immediate'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Key Responsibilities</span>
                            <span className="text-slate-400">{keyResponsibilities || '-'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-50">
                            <span className="text-slate-500">Skills Used in This Role</span>
                            <span className="font-medium text-slate-800 truncate max-w-[190px]">
                              {experienceSkills.join(', ') || 'Electrical Wiring, Troubleshooting, Industrial Safety'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">Previous Experience</span>
                            <span className="text-slate-500">
                              {extraExperiences.length > 0 ? `${extraExperiences.length} added` : 'No experience added'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GREEN ALERT BANNER MATCHING 6th phase.png */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                        <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950">All Set! Your profile is ready.</h4>
                        <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                          Click submit to create your profile and unlock personalized skill analysis, training programs, job opportunities and government schemes.
                        </p>
                      </div>
                    </div>

                    {/* BOTTOM ACTION BUTTONS MATCHING 6th phase.png */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer order-2 sm:order-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium text-center order-1 sm:order-2">
                        <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>By submitting, you agree to our <a href="#terms" className="text-[#0052cc] font-semibold hover:underline">Terms & Conditions</a> and <a href="#privacy" className="text-[#0052cc] font-semibold hover:underline">Privacy Policy</a>.</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0062eb] hover:from-[#0043a8] hover:to-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 order-3"
                      >
                        <span>{isSubmitting ? 'Registering with Flask...' : 'Submit Profile'}</span>
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 15 ENGINEERING DISCIPLINES DIRECTORY VIEW                                 */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0A2540]">
                  Explore Careers Across 15 Engineering Fields
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Discover career trajectories, in-demand technical competencies, and active employment across disciplines.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('onboarding')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] cursor-pointer self-start sm:self-auto"
              >
                <span>Return to Educational Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* 15 Cards Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {engineeringFieldsList.map((field) => {
                const Icon = field.icon;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedFieldModal(field)}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-4 text-center shadow-2xs hover:border-[#0052cc]/60 hover:bg-blue-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer min-h-[125px]"
                  >
                    <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-all">
                      <Icon className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#0052cc] transition-colors line-clamp-2">
                      {field.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {field.openJobsCount} Openings
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Field Details Modal */}
      {selectedFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0052cc]">
                  <selectedFieldModal.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">{selectedFieldModal.name}</h3>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {selectedFieldModal.openJobsCount} Open Opportunities
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFieldModal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed text-sm">{selectedFieldModal.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedFieldModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/jobs"
                onClick={() => setSelectedFieldModal(null)}
                className="rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                Explore Jobs in {selectedFieldModal.name.split(' ')[0]}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
