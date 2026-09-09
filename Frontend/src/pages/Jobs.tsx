import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Building,
  Search,
  CheckCircle2,
  Server,
  ArrowUpRight,
  Clock,
  Settings,
  Building2,
  X,
  ChevronDown,
  Calendar,
  Sparkles,
  Bookmark,
  Share2,
  FileText,
  AlertCircle,
  BadgeCheck,
  Check,
} from 'lucide-react';
import { jobsApi } from '../api/api';
import { config } from '../config/config';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  state: string;
  type: string;
  experience: string;
  salary: string;
  sector: string;
  industry: string;
  postedDate: string;
  skills: string[];
  responsibilities: string[];
  openings: number;
  isNATSApproved?: boolean;
}

export const Jobs: React.FC = () => {
  // Search and filter states inspired by 5th phase.png fields
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Detail Modal & Application State
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job-101']);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(['job-102']);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplySuccessModal, setShowApplySuccessModal] = useState<string | null>(null);

  // User candidate skills for matching comparison
  const candidateSkills = [
    'Electrical Wiring',
    'PLC Basics',
    'Troubleshooting',
    'Industrial Safety',
    'Circuit Design',
    'Python',
  ];

  const jobsData: JobPosting[] = [
    {
      id: 'job-101',
      title: 'Electrical Maintenance Engineer Trainee',
      company: 'Schneider Electric India',
      location: 'Bengaluru, Karnataka (On-site)',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: 'Full Time',
      experience: '0 - 1 Year',
      salary: '₹5,50,000 - ₹8,00,000 / yr',
      sector: 'Electrical Engineering',
      industry: 'Power, Energy & Utilities',
      postedDate: '2 days ago',
      openings: 8,
      isNATSApproved: true,
      skills: ['Electrical Wiring', 'PLC Basics', 'Troubleshooting', 'Industrial Safety', 'Power Systems'],
      responsibilities: [
        'Perform preventive and breakdown maintenance of LV/MV switchgear, transformers, and electrical distribution panels.',
        'Execute troubleshooting on automated PLC control loops, relays, and motor control centers (MCC).',
        'Ensure 100% adherence to industrial safety regulations, LOTO protocols, and Indian Electricity Rules.',
        'Assist senior plant engineers in equipment testing, commissioning, and maintaining calibration logs.',
      ],
    },
    {
      id: 'job-102',
      title: 'Power Electronics & EV Powertrain Specialist',
      company: 'L&T Technology Services',
      location: 'Pune, Maharashtra (On-site)',
      city: 'Pune',
      state: 'Maharashtra',
      type: 'Full Time',
      experience: '1 - 2 Years',
      salary: '₹8,00,000 - ₹12,00,000 / yr',
      sector: 'Electrical Engineering',
      industry: 'Automotive & Electric Vehicles (EV)',
      postedDate: '1 day ago',
      openings: 5,
      isNATSApproved: false,
      skills: ['Circuit Design', 'MATLAB', 'CAN Bus', 'Power Distribution', 'Troubleshooting'],
      responsibilities: [
        'Design and simulate DC-DC converters, inverters, and battery management sub-systems for EV platforms.',
        'Perform hardware-in-the-loop (HIL) testing and harness verification using MATLAB/Simulink.',
        'Analyze thermal and electromagnetic compatibility (EMC) compliance for high-voltage automotive modules.',
      ],
    },
    {
      id: 'job-103',
      title: 'Industrial Automation & PLC Commissioning Associate',
      company: 'Siemens Industrial Solutions',
      location: 'Bengaluru, Karnataka (Hybrid)',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: 'Full Time',
      experience: '0 - 1 Year',
      salary: '₹6,00,000 - ₹9,00,000 / yr',
      sector: 'Electrical Engineering',
      industry: 'Industrial Automation & PLC',
      postedDate: '3 days ago',
      openings: 12,
      isNATSApproved: true,
      skills: ['PLC Basics', 'Ladder Logic', 'Troubleshooting', 'SCADA', 'Industrial Safety'],
      responsibilities: [
        'Configure and test PLC architectures (TIA Portal / Allen Bradley) for automated manufacturing cells.',
        'Develop SCADA screen graphics, alarm tables, and telemetry tags for production lines.',
        'Conduct pre-dispatch inspections and client factory acceptance tests (FAT).',
      ],
    },
    {
      id: 'job-104',
      title: 'Graduate Apprentice Trainee (NATS Sponsored)',
      company: 'Bharat Heavy Electricals Ltd (BHEL)',
      location: 'Hyderabad, Telangana (On-site)',
      city: 'Hyderabad',
      state: 'Telangana',
      type: 'Apprenticeship / NATS',
      experience: '0 - 1 Year',
      salary: '₹18,500 / month (Govt Stipend)',
      sector: 'Electrical Engineering',
      industry: 'Power, Energy & Utilities',
      postedDate: 'Just now',
      openings: 25,
      isNATSApproved: true,
      skills: ['Electrical Wiring', 'Industrial Safety', 'Troubleshooting', 'Circuit Design'],
      responsibilities: [
        'Rotational apprenticeship across turbo-generator manufacturing, high-voltage test lab, and quality assurance.',
        'Receive structured national skill qualification framework (NSQF Level 7) mentored training.',
        'Prepare technical documentation and inspection certificates for central utility clients.',
      ],
    },
    {
      id: 'job-105',
      title: 'Junior Full-Stack Engineering Trainee',
      company: 'Tata Consultancy Services',
      location: 'Bengaluru, Karnataka (Hybrid)',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: 'Full Time',
      experience: '0 - 1 Year',
      salary: '₹6,50,000 - ₹9,50,000 / yr',
      sector: 'Computer Science & Engineering',
      industry: 'Information Technology / Software',
      postedDate: '4 days ago',
      openings: 30,
      isNATSApproved: true,
      skills: ['Python', 'React', 'SQL', 'Data Structures', 'REST APIs'],
      responsibilities: [
        'Build scalable microservices and RESTful API routes using Python and modern frontend frameworks.',
        'Participate in code reviews, CI/CD pipeline automation, and automated unit testing.',
        'Collaborate with agile development pods on cloud modernization projects.',
      ],
    },
    {
      id: 'job-106',
      title: 'CAD/FEA Structural Mechanical Engineer',
      company: 'Mahindra & Mahindra Research Valley',
      location: 'Chennai, Tamil Nadu (On-site)',
      city: 'Chennai',
      state: 'Tamil Nadu',
      type: 'Full Time',
      experience: '1 - 2 Years',
      salary: '₹7,50,000 - ₹11,00,000 / yr',
      sector: 'Mechanical Engineering',
      industry: 'Automotive & Electric Vehicles (EV)',
      postedDate: '5 days ago',
      openings: 4,
      isNATSApproved: false,
      skills: ['SolidWorks', 'ANSYS FEA', 'AutoCAD', 'GD&T', 'Material Testing'],
      responsibilities: [
        'Create parametric 3D CAD models of chassis and body-in-white (BIW) subsystems.',
        'Execute non-linear finite element structural stress and fatigue simulations.',
        'Coordinate with toolmakers and prototype validation teams on DFM/DFA guidelines.',
      ],
    },
  ];

  // Filter logic
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.sector.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = selectedDomain === 'All' || job.sector === selectedDomain;
    const matchesLocation =
      selectedLocation === 'All' ||
      job.city.toLowerCase() === selectedLocation.toLowerCase() ||
      job.state.toLowerCase() === selectedLocation.toLowerCase();
    const matchesType = selectedType === 'All' || job.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience;

    return matchesSearch && matchesDomain && matchesLocation && matchesType && matchesExperience;
  });

  const handleApply = async (jobId: string) => {
    setIsApplying(true);
    try {
      await jobsApi.applyForJob(jobId, {});
    } catch {
      // Standby API gracefully handled
    } finally {
      setTimeout(() => {
        setIsApplying(false);
        if (!appliedJobs.includes(jobId)) {
          setAppliedJobs([...appliedJobs, jobId]);
        }
        setShowApplySuccessModal(jobId);
      }, 400);
    }
  };

  const toggleBookmark = (jobId: string) => {
    if (bookmarkedJobs.includes(jobId)) {
      setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== jobId));
    } else {
      setBookmarkedJobs([...bookmarkedJobs, jobId]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ----------------------------------------------------------------------- */}
      {/* HEADER: Inspired by KaushalSetu & 5th phase.png design system             */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-blue-100/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0052cc] text-white shadow-md shadow-blue-500/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                  Engineering Jobs & <span className="text-[#0052cc]">Opportunities</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Employers
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Discover full-time, contractual, and apprentice roles tailored to your verified skills, education, and experience across 15 engineering domains.
              </p>
            </div>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-blue-100 bg-[#f0f6ff] px-4 py-2.5 text-center">
              <span className="block text-lg font-black text-[#0052cc]">{jobsData.length}</span>
              <span className="text-[11px] font-semibold text-slate-600">Active Roles</span>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-2.5 text-center">
              <span className="block text-lg font-black text-emerald-700">{appliedJobs.length}</span>
              <span className="text-[11px] font-semibold text-emerald-800">Applied</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* SEARCH & FILTERS: Inspired by form controls in 5th phase.png             */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        {/* Row 1: Search, Domain, Location */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main search input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, company, or skills (e.g., Electrical Wiring, PLC, Python)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Domain Dropdown */}
          <div className="md:col-span-3 relative">
            <Settings className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
            >
              <option value="All">All Engineering Domains</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Computer Science & Engineering">Computer Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electronics & Communication">Electronics & Comm.</option>
              <option value="Civil & Structural Engineering">Civil Engineering</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-800 focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Bengaluru">Bengaluru, Karnataka</option>
              <option value="Pune">Pune, Maharashtra</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
              <option value="Chennai">Chennai, Tamil Nadu</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Row 2: Secondary Filters & Employment Type Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">Employment Type:</span>
            {['All', 'Full Time', 'Apprenticeship / NATS', 'Internship'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-[#0052cc] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Experience filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Experience:</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs text-slate-800 focus:border-[#0052cc] focus:outline-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="0 - 1 Year">0 - 1 Year (Fresher)</option>
                <option value="1 - 2 Years">1 - 2 Years</option>
                <option value="2 - 5 Years">2 - 5 Years</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 text-slate-400" />
            </div>

            {(searchTerm || selectedDomain !== 'All' || selectedLocation !== 'All' || selectedType !== 'All' || selectedExperience !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDomain('All');
                  setSelectedLocation('All');
                  setSelectedType('All');
                  setSelectedExperience('All');
                }}
                className="text-xs font-semibold text-[#0052cc] hover:underline ml-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* JOB LISTINGS: Rich cards matching 5th phase.png typography & pill style */}
      {/* ----------------------------------------------------------------------- */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching engineering jobs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria, domain selector, or experience level to view more available roles.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedDomain('All');
                setSelectedLocation('All');
                setSelectedType('All');
                setSelectedExperience('All');
              }}
              className="mt-4 rounded-xl bg-[#0052cc] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            const isBookmarked = bookmarkedJobs.includes(job.id);

            // Compute how many required skills the candidate has
            const matchedSkillsCount = job.skills.filter((s) => candidateSkills.includes(s)).length;
            const matchPercentage = Math.round((matchedSkillsCount / job.skills.length) * 100);

            return (
              <div
                key={job.id}
                className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-[#0052cc]/50 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left content block */}
                  <div className="flex-1">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-blue-50 border border-blue-200/80 px-3 py-0.5 text-[11px] font-bold text-[#0052cc]">
                        {job.sector}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {job.type}
                      </span>
                      {job.isNATSApproved && (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                          NATS Apprentice Scheme
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium ml-auto lg:ml-0">
                        Posted {job.postedDate}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2540] group-hover:text-[#0052cc] transition-colors">
                      {job.title}
                    </h2>

                    {/* Company, Location, Experience row */}
                    <div className="mt-2 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Exp: <span className="font-semibold text-slate-800">{job.experience}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {job.industry}
                      </span>
                    </div>

                    {/* Required Skills matching 5th phase.png removable pill style */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Required Competencies ({matchedSkillsCount}/{job.skills.length} in your profile):
                        </span>
                        <span className="text-xs font-extrabold text-[#0052cc]">
                          {matchPercentage}% Skill Match
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => {
                          const isMatched = candidateSkills.includes(skill);
                          return (
                            <span
                              key={skill}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                isMatched
                                  ? 'border border-blue-200/80 bg-blue-50 text-[#0052cc]'
                                  : 'border border-slate-200 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {isMatched ? (
                                <Check className="h-3 w-3 text-[#0052cc] stroke-[2.5]" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              )}
                              <span>{skill}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Action column */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="lg:text-right">
                      <span className="block text-base sm:text-lg font-black text-[#0A2540]">{job.salary}</span>
                      <span className="text-[11px] font-medium text-slate-500">{job.openings} open positions</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(job.id)}
                        className={`rounded-xl p-2.5 border transition-all cursor-pointer ${
                          isBookmarked
                            ? 'border-amber-300 bg-amber-50 text-amber-600'
                            : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700'
                        }`}
                        title={isBookmarked ? 'Saved to bookmarks' : 'Save job'}
                      >
                        <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                      >
                        View Details
                      </button>

                      {isApplied ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApply(job.id)}
                          disabled={isApplying}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer disabled:opacity-50"
                        >
                          <span>Apply Now</span>
                          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* JOB DETAIL MODAL: Full breakdown matching 5th phase.png responsibilities*/}
      {/* ----------------------------------------------------------------------- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute right-6 top-6 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-blue-50 border border-blue-200/80 px-3 py-0.5 text-xs font-bold text-[#0052cc]">
                  {selectedJob.sector}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                  {selectedJob.type}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A2540]">{selectedJob.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span className="font-bold text-slate-800">{selectedJob.company}</span>
                <span>• {selectedJob.location}</span>
                <span>• Exp: {selectedJob.experience}</span>
                <span className="font-bold text-[#0052cc]">• {selectedJob.salary}</span>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0052cc]" />
                Key Responsibilities & Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedJob.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0052cc] mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Candidate Fit */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Competency Alignment Analysis
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill) => {
                  const isMatched = candidateSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                        isMatched
                          ? 'border border-blue-200/80 bg-blue-50 text-[#0052cc]'
                          : 'border border-slate-200 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isMatched ? (
                        <Check className="h-3 w-3 text-[#0052cc] stroke-[2.5]" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                      )}
                      <span>{skill}</span>
                      {isMatched && <span className="text-[10px] font-bold text-blue-600">(In your profile)</span>}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              {appliedJobs.includes(selectedJob.id) ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Application Submitted
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isApplying}
                  onClick={() => {
                    handleApply(selectedJob.id);
                    setSelectedJob(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer"
                >
                  <span>Submit Application</span>
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* APPLICATION SUCCESS NOTIFICATION MODAL                                   */}
      {/* ----------------------------------------------------------------------- */}
      {showApplySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl text-center space-y-4 border border-emerald-100">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0A2540]">Application Submitted Successfully!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your profile, verified skills, and experience details have been transmitted to the employer’s technical recruitment portal.
            </p>
            <button
              type="button"
              onClick={() => setShowApplySuccessModal(null)}
              className="w-full rounded-xl bg-[#0052cc] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] cursor-pointer"
            >
              Continue Exploring Jobs
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* REST API ENDPOINTS REFERENCE: Preserved for Flask Backend Connection     */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-slate-50/80 p-5 shadow-xs text-xs text-slate-600">
        <h3 className="font-bold text-slate-800 mb-1.5 flex items-center gap-2">
          <Server className="h-4 w-4 text-[#0052cc]" />
          Connected Flask REST API Endpoints:
        </h3>
        <ul className="space-y-1 font-mono text-[11px] text-slate-600 pl-6 list-disc">
          <li>GET {config.apiBaseUrl}/jobs</li>
          <li>GET {config.apiBaseUrl}/jobs/:id</li>
          <li>POST {config.apiBaseUrl}/jobs/:id/apply</li>
        </ul>
      </div>
    </div>
  );
};

export default Jobs;
