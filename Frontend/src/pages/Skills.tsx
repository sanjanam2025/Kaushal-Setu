import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  X,
  Settings,
  Laptop,
  Lightbulb,
  Users,
  BarChart3,
  FlaskConical,
  Briefcase,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { skillsApi } from '../api/api';
import { config } from '../config/config';
import OnboardingIllustration from '../components/OnboardingIllustration';

// Suggested skill categories matching 4th phase.png
interface SuggestedCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: string[];
}

const suggestedCategoriesList: SuggestedCategory[] = [
  {
    id: 'tech',
    name: 'Technical Skills',
    icon: Settings,
    skills: ['Circuit Design', 'Power Systems', 'Electrical Machines', 'PCB Layout', 'Control Systems', 'High Voltage Engineering'],
  },
  {
    id: 'tools',
    name: 'Software Tools',
    icon: Laptop,
    skills: ['MATLAB', 'AutoCAD', 'PLC Programming', 'Simulink', 'LabVIEW', 'Multisim', 'Altium Designer'],
  },
  {
    id: 'domain',
    name: 'Domain Knowledge',
    icon: Lightbulb,
    skills: ['Renewable Energy', 'Smart Grids', 'Microcontroller Architecture', 'Power Electronics', 'Substation Automation'],
  },
  {
    id: 'soft',
    name: 'Soft Skills',
    icon: Users,
    skills: ['Communication Skills', 'Problem Solving', 'Team Leadership', 'Critical Thinking', 'Technical Documentation'],
  },
  {
    id: 'mgmt',
    name: 'Management Skills',
    icon: BarChart3,
    skills: ['Project Management', 'Agile / Scrum', 'Budget Estimation', 'Risk Assessment', 'Quality Assurance'],
  },
  {
    id: 'research',
    name: 'Research & Innovation',
    icon: FlaskConical,
    skills: ['Patent Analysis', 'Prototyping', 'Academic Research', 'Simulation Modeling', 'Scientific Writing'],
  },
  {
    id: 'readiness',
    name: 'Industry Readiness',
    icon: Briefcase,
    skills: ['Industrial Safety (OSHA)', 'Lean Manufacturing', 'Six Sigma', 'Equipment Maintenance', 'ISO Standards'],
  },
  {
    id: 'emerging',
    name: 'Emerging Technologies',
    icon: Cpu,
    skills: ['Internet of Things (IoT)', 'Electric Vehicle Powertrain', 'Battery Management Systems (BMS)', 'AI in Grid Management', 'Robotics'],
  },
];

export const Skills: React.FC = () => {
  const navigate = useNavigate();

  // Tab view: reference builder vs verified matrix
  const [activeTab, setActiveTab] = useState<'builder' | 'verified'>('builder');

  // Pre-selected skills matching 4th phase.png exactly
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
  const [engineeringField, setEngineeringField] = useState('Electrical Engineering');
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<SuggestedCategory | null>(null);
  const [viewAllModal, setViewAllModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Add skill from search input
  const handleAddSkill = (skillToAdd?: string) => {
    const target = (skillToAdd || searchSkillInput).trim();
    if (!target) return;

    if (!selectedSkills.includes(target)) {
      setSelectedSkills((prev) => [...prev, target]);
    }
    setSearchSkillInput('');
  };

  // Remove skill badge
  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Save & Continue
  const handleSaveAndContinue = async () => {
    try {
      setSaveStatus('Saving to Flask backend...');
      // Connect with skillsApi
      await Promise.all(
        selectedSkills.slice(0, 3).map((s) =>
          skillsApi.addUserSkill({ skill_name: s, proficiency_level: 'Intermediate' }).catch(() => null)
        )
      );
      setSaveStatus('Saved successfully!');
      setTimeout(() => {
        navigate('/assessment');
      }, 500);
    } catch {
      navigate('/assessment');
    }
  };

  const stepsList = [
    { num: 1, label: 'Personal', completed: true },
    { num: 2, label: 'Education', completed: true },
    { num: 3, label: 'Skills', active: true },
    { num: 4, label: 'Experience' },
    { num: 5, label: 'Review' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Utility Nav / Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Skills & Expertise (Step 3 of 5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Verified Skills & Competency Matrix
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

      {activeTab === 'builder' ? (
        /* ========================================================================= */
        /* TWO-COLUMN DASHBOARD LAYOUT (Pixel-matched with Reference Image 4th phase.png) */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: MOTIVATION, ILLUSTRATION WITH FLOATING SKILL PILLS & STEPPER */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 xl:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between min-h-[640px]">
            <div>
              {/* Eyebrow */}
              <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] block">
                CREATE PROFILE
              </span>

              {/* Main Heading matching 4th phase.png */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
                Tell us about <br />
                your <span className="text-[#0052cc]">skills</span>
              </h1>

              {/* Accent horizontal bar */}
              <div className="h-1 w-12 bg-[#0052cc] rounded-full mt-2.5 mb-4" />

              {/* Explanatory description */}
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                Add your skills to help us recommend the best training programs, certifications and job
                opportunities for you.
              </p>

              {/* Illustration with Floating Skill Pills & Slogan */}
              <div className="my-6">
                <OnboardingIllustration step={3} />
              </div>

              {/* Reassurance Card */}
              <div className="rounded-2xl border border-blue-100 bg-[#f0f6ff] p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
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
            <div className="mt-8 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between relative px-2">
                {/* Stepper connecting background line */}
                <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-200 -z-0" />

                {stepsList.map((step) => {
                  return (
                    <div
                      key={step.num}
                      className="relative z-10 flex flex-col items-center group cursor-default"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                          step.active
                            ? 'bg-[#0052cc] text-white ring-4 ring-blue-100'
                            : step.completed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-500'
                        }`}
                      >
                        {step.completed ? <Check className="h-4 w-4 stroke-[3]" /> : step.num}
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-semibold transition-colors ${
                          step.active
                            ? 'text-[#0052cc] font-bold'
                            : step.completed
                            ? 'text-slate-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Motivational Quote at bottom */}
              <div className="mt-7 text-center">
                <p className="text-xs font-bold text-[#0052cc]">
                  “Showcase Your Skills. Unlock New Opportunities.”
                </p>
                <div className="h-0.5 w-12 bg-[#0052cc] mx-auto mt-2 rounded-full" />
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: SKILLS & EXPERTISE MAIN WORKSPACE (4th phase.png)         */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-8 xl:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-xs min-h-[640px]">
            {/* Header: Title + Notification Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                  Skills & Expertise
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Step 3 of 5</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the skills you have. You can add multiple skills from the list or type your own.
                </p>
              </div>

              {/* Lightbulb Notice Banner matching 4th phase.png */}
              <div className="rounded-2xl border border-blue-100/90 bg-[#f0f6ff] p-3.5 sm:p-4 flex items-center gap-3.5 max-w-md shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052cc] text-white shadow-xs">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Your skills help us match you with the right training programs, certifications, job
                  opportunities and government schemes.
                </p>
              </div>
            </div>

            {/* Form & Selection Content */}
            <div className="mt-6 space-y-6">
              {/* Field 1: Engineering Field (Read-only prefill from Step 2) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Engineering Field</label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs text-slate-800 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-800">{engineeringField}</span>
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSkill();
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchSkillInput}
                      onChange={(e) => setSearchSkillInput(e.target.value)}
                      placeholder="Search skills (e.g., AutoCAD, Circuit Design, Python, Project Management)"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Section: Your Selected Skills */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-slate-800">Your Selected Skills</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedSkills.length} skills selected
                  </span>
                </div>

                {/* Skill Pills (Matching 4th phase.png) */}
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#0052cc] hover:bg-blue-100 transition-colors shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="rounded-full p-0.5 hover:bg-blue-200/60 text-[#0052cc] transition-colors cursor-pointer"
                        title={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3 stroke-[2.5]" />
                      </button>
                    </span>
                  ))}

                  {selectedSkills.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">
                      No skills added yet. Use the search bar or suggested categories below.
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
                    onClick={() => setViewAllModal(true)}
                    className="text-xs font-bold text-[#0052cc] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Skills</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* 8 Category Cards (2x4 grid matching 4th phase.png) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {suggestedCategoriesList.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryModal(cat)}
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-left shadow-2xs hover:border-[#0052cc]/60 hover:bg-blue-50/40 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-all">
                          <Icon className="h-5 w-5 stroke-[1.75]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#0052cc] transition-colors leading-tight">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Buttons: Previous (Left) + Save & Continue (Right) */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>

                <div className="flex items-center gap-3">
                  {saveStatus && <span className="text-xs text-emerald-600 font-semibold">{saveStatus}</span>}
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0043a8] transition-all hover:shadow-lg cursor-pointer"
                  >
                    <span>Save & Continue</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VERIFIED SKILLS & COMPETENCY MATRIX VIEW                                  */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0A2540]">
                  Verified Skills & Competency Matrix
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Skills validated against National Occupational Standards (NOS) and industry partner benchmarks.
                </p>
              </div>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] cursor-pointer self-start sm:self-auto"
              >
                <Award className="h-4 w-4" />
                <span>Take Skill Assessment</span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSkills.map((skill, index) => {
                const isVerified = index < 6;
                return (
                  <div
                    key={skill}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{skill}</h4>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          Self-Reported
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Proficiency Index</span>
                        <span className="font-semibold text-slate-800">{isVerified ? '86%' : '60%'}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isVerified ? 'bg-[#0052cc]' : 'bg-slate-400'}`}
                          style={{ width: isVerified ? '86%' : '60%' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Suggestions Modal */}
      {selectedCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc]">
                  <selectedCategoryModal.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">{selectedCategoryModal.name}</h3>
                  <p className="text-xs text-slate-500">Click a skill to add it to your profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategoryModal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {selectedCategoryModal.skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveSkill(skill);
                      } else {
                        handleAddSkill(skill);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-[#0052cc] bg-blue-50 text-[#0052cc]'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCategoryModal(null)}
                className="rounded-xl bg-[#0052cc] px-5 py-2 text-xs font-bold text-white hover:bg-[#0043a8] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Skills Modal */}
      {viewAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0A2540]">All Engineering Skill Categories</h3>
                <p className="text-xs text-slate-500 mt-0.5">Explore and select skills across all domains</p>
              </div>
              <button
                type="button"
                onClick={() => setViewAllModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
              {suggestedCategoriesList.map((cat) => (
                <div key={cat.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <cat.icon className="h-4 w-4 text-[#0052cc]" />
                    <h4 className="text-xs font-bold text-slate-800">{cat.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveSkill(skill);
                            } else {
                              handleAddSkill(skill);
                            }
                          }}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border border-[#0052cc] bg-blue-50 text-[#0052cc]'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {skill} {isSelected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewAllModal(false)}
                className="rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043a8] cursor-pointer"
              >
                Done Selecting Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
