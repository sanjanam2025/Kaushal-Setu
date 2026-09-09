import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Percent,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Server,
  RefreshCw,
  Cpu,
  Award,
  Building,
  MapPin,
  Calendar,
  ChevronRight,
  BookOpen,
  Check,
  X,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { jobMatchingApi } from '../api/api';
import { config } from '../config/config';

interface JobMatch {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  experienceRequired: string;
  matchScore: number;
  domain: string;
  salary: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
  assessmentPath?: string;
}

export const JobMatching: React.FC = () => {
  const [matchingScoreThreshold, setMatchingScoreThreshold] = useState(70);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [selectedAnalysisJob, setSelectedAnalysisJob] = useState<JobMatch | null>(null);
  const [appliedMatches, setAppliedMatches] = useState<string[]>([]);

  // Candidate context (matching 5th phase.png profile state)
  const candidateProfile = {
    domain: 'Electrical Engineering',
    experience: '0 - 1 Year (Fresher)',
    location: 'Bengaluru, Karnataka',
    skills: ['Electrical Wiring', 'PLC Basics', 'Troubleshooting', 'Industrial Safety', 'Circuit Design'],
  };

  const matchesData: JobMatch[] = [
    {
      id: 'match-1',
      jobTitle: 'Electrical Maintenance Engineer Trainee',
      company: 'Schneider Electric India',
      location: 'Bengaluru, Karnataka (On-site)',
      experienceRequired: '0 - 1 Year',
      matchScore: 94,
      domain: 'Electrical Engineering',
      salary: '₹5,50,000 - ₹8,00,000 / yr',
      matchedSkills: ['Electrical Wiring', 'PLC Basics', 'Troubleshooting', 'Industrial Safety'],
      missingSkills: ['Power Distribution Panels'],
      recommendation: 'Exceptional competency match. Your verified skills in Wiring, PLC Basics, and Industrial Safety satisfy 94% of employer criteria. Completing the Switchgear Diagnostic Assessment bridges the remaining requirement.',
      assessmentPath: '/assessment',
    },
    {
      id: 'match-2',
      jobTitle: 'Industrial Automation & PLC Commissioning Associate',
      company: 'Siemens Industrial Solutions',
      location: 'Bengaluru, Karnataka (Hybrid)',
      experienceRequired: '0 - 1 Year',
      matchScore: 88,
      domain: 'Electrical Engineering',
      salary: '₹6,00,000 - ₹9,00,000 / yr',
      matchedSkills: ['PLC Basics', 'Troubleshooting', 'Industrial Safety'],
      missingSkills: ['SCADA Systems', 'Ladder Logic Optimization'],
      recommendation: 'High algorithmic alignment for automation commissioning. Recommend reviewing the 15-minute SCADA Module Assessment to demonstrate complete operational readiness.',
      assessmentPath: '/assessment',
    },
    {
      id: 'match-3',
      jobTitle: 'Power Electronics & EV Systems Trainee',
      company: 'L&T Technology Services',
      location: 'Pune, Maharashtra (On-site)',
      experienceRequired: '1 - 2 Years',
      matchScore: 82,
      domain: 'Electrical Engineering',
      salary: '₹8,00,000 - ₹12,00,000 / yr',
      matchedSkills: ['Circuit Design', 'Troubleshooting'],
      missingSkills: ['CAN Bus Protocol', 'MATLAB Simulink', 'Battery Management'],
      recommendation: 'Solid foundational circuit theory. Completing the EV Powertrain Assessment will elevate your profile directly to Tier-1 interview shortlists.',
      assessmentPath: '/assessment',
    },
    {
      id: 'match-4',
      jobTitle: 'Graduate Apprentice Trainee (NATS Sponsored)',
      company: 'Bharat Heavy Electricals Ltd (BHEL)',
      location: 'Hyderabad, Telangana (On-site)',
      experienceRequired: '0 - 1 Year',
      matchScore: 91,
      domain: 'Electrical Engineering',
      salary: '₹18,500 / month (Govt Stipend)',
      matchedSkills: ['Electrical Wiring', 'Industrial Safety', 'Troubleshooting', 'Circuit Design'],
      missingSkills: ['High-Voltage Testing Protocols'],
      recommendation: 'Direct qualification match for Central Government NATS stipendiary engineering apprenticeship. Eligible for one-click application submission.',
      assessmentPath: '/assessment',
    },
    {
      id: 'match-5',
      jobTitle: 'Junior Full-Stack Engineering Trainee',
      company: 'Tata Consultancy Services',
      location: 'Bengaluru, Karnataka (Hybrid)',
      experienceRequired: '0 - 1 Year',
      matchScore: 68,
      domain: 'Computer Science & Engineering',
      salary: '₹6,50,000 - ₹9,50,000 / yr',
      matchedSkills: ['Troubleshooting', 'Industrial Safety'],
      missingSkills: ['Python Microservices', 'React UI', 'SQL Database'],
      recommendation: 'Cross-domain software vacancy. Significant training needed in programming stacks before interview eligibility.',
      assessmentPath: '/assessment',
    },
  ];

  const handleRecalculate = async () => {
    setRunningAnalysis(true);
    try {
      await jobMatchingApi.getMatchingJobs({ threshold: matchingScoreThreshold });
    } catch {
      // Gracefully standby
    } finally {
      setTimeout(() => setRunningAnalysis(false), 600);
    }
  };

  const handleApplyMatch = (matchId: string) => {
    if (!appliedMatches.includes(matchId)) {
      setAppliedMatches([...appliedMatches, matchId]);
    }
  };

  const filteredMatches = matchesData.filter((m) => m.matchScore >= matchingScoreThreshold);

  return (
    <div className="space-y-6 pb-12">
      {/* ----------------------------------------------------------------------- */}
      {/* HEADER: AI Matching Engine Title + Action Bar                           */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-blue-100/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0052cc] text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                  AI Job & Competency <span className="text-[#0052cc]">Matching Engine</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-bold text-[#0052cc]">
                  <Cpu className="h-3.5 w-3.5" />
                  Vector Match Engine v2.4
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Automated similarity indexing matching your verified skill stack, work experience, and educational credentials directly against live employer job profiles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRecalculate}
            disabled={runningAnalysis}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0043a8] transition-all disabled:opacity-50 cursor-pointer self-start lg:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${runningAnalysis ? 'animate-spin' : ''}`} />
            <span>{runningAnalysis ? 'Recalculating Match Vectors...' : 'Recalculate Matches'}</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* CANDIDATE PROFILE VECTOR CARD: Matches 5th phase.png credentials         */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Candidate Match Profile
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-base font-extrabold text-[#0A2540]">
                {candidateProfile.domain}
              </span>
              <span className="rounded-md bg-blue-50 text-[#0052cc] text-xs font-bold px-2 py-0.5 border border-blue-100">
                {candidateProfile.experience}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {candidateProfile.location}
              </span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#0052cc] hover:underline self-start md:self-auto"
          >
            Edit Profile Credentials →
          </Link>
        </div>

        {/* Verified Skills pills in matching bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-1">Indexed Skills:</span>
          {candidateProfile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-semibold text-[#0052cc]"
            >
              <Check className="h-3 w-3 stroke-[2.5]" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* THRESHOLD FILTER SLIDER & PRESETS                                       */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#0052cc]" />
            <span className="text-xs font-bold text-slate-800">
              Minimum Competency Match Threshold:
            </span>
            <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-extrabold text-[#0052cc]">
              {matchingScoreThreshold}%
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5">
            {[
              { label: 'All (60%+)', val: 60 },
              { label: 'Balanced (70%+)', val: 70 },
              { label: 'High Fit (85%+)', val: 85 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setMatchingScoreThreshold(preset.val)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  matchingScoreThreshold === preset.val
                    ? 'bg-[#0052cc] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min="50"
          max="95"
          step="5"
          value={matchingScoreThreshold}
          onChange={(e) => setMatchingScoreThreshold(Number(e.target.value))}
          className="w-full accent-[#0052cc] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>50% (High Gap / Exploratory)</span>
          <span>70% (Standard Benchmark)</span>
          <span>95% (Exact Role Parity)</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* MATCH RESULTS LIST                                                      */}
      {/* ----------------------------------------------------------------------- */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No jobs match the {matchingScoreThreshold}% threshold</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Lower the minimum match threshold or take skill assessments to verify additional competencies.
            </p>
            <button
              type="button"
              onClick={() => setMatchingScoreThreshold(60)}
              className="mt-4 rounded-xl bg-[#0052cc] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8]"
            >
              Reset to 60% Threshold
            </button>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const isApplied = appliedMatches.includes(match.id);
            const isHighMatch = match.matchScore >= 85;

            return (
              <div
                key={match.id}
                className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-[#0052cc]/50 hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Title & Company */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[11px] font-bold text-[#0052cc]">
                        {match.domain}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {match.location}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-[#0A2540] group-hover:text-[#0052cc] transition-colors">
                      {match.jobTitle}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        {match.company}
                      </span>
                      <span>• Required Exp: <strong className="text-slate-800">{match.experienceRequired}</strong></span>
                      <span className="font-bold text-[#0052cc]">• {match.salary}</span>
                    </div>
                  </div>

                  {/* Score Pill & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 border shadow-2xs ${
                      isHighMatch
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-blue-50 border-blue-200 text-[#0052cc]'
                    }`}>
                      <Percent className="h-4 w-4 stroke-[2.5]" />
                      <span className="text-sm font-black">
                        {match.matchScore}% Match Fit
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedAnalysisJob(match)}
                      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      Gap Analysis
                    </button>
                  </div>
                </div>

                {/* Competency Comparison Grid matching 5th phase.png */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {/* Verified Competencies */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Verified Candidate Competencies ({match.matchedSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800"
                        >
                          <Check className="h-3 w-3 text-emerald-600 stroke-[2.5]" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills / Gaps */}
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3.5">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Competency Gaps to Bridge ({match.missingSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {match.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Next Action Recommendation Banner */}
                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-[#f0f6ff] p-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#0052cc] mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-[#0A2540]">AI Recommendation: </strong>
                      <span>{match.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      to="/assessment"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0052cc] hover:underline"
                    >
                      <span>Take Assessment</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyMatch(match.id)}
                        className="rounded-xl bg-[#0052cc] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] transition-all cursor-pointer"
                      >
                        Apply with Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* GAP ANALYSIS MODAL                                                      */}
      {/* ----------------------------------------------------------------------- */}
      {selectedAnalysisJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <button
              type="button"
              onClick={() => setSelectedAnalysisJob(null)}
              className="absolute right-6 top-6 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-[#0052cc]">
                  {selectedAnalysisJob.domain}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                  {selectedAnalysisJob.matchScore}% Match Fit
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#0A2540]">{selectedAnalysisJob.jobTitle}</h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{selectedAnalysisJob.company} • {selectedAnalysisJob.location}</p>
            </div>

            {/* Gap analysis details */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Your Matched Competencies:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAnalysisJob.matchedSkills.map((s) => (
                    <span key={s} className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Gaps to Bridge for 100% Fit:
                </h4>
                <div className="space-y-2">
                  {selectedAnalysisJob.missingSkills.map((s) => (
                    <div key={s} className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-amber-200/80 text-xs">
                      <span className="font-semibold text-slate-800">• {s}</span>
                      <Link
                        to="/assessment"
                        onClick={() => setSelectedAnalysisJob(null)}
                        className="rounded-lg bg-[#0052cc] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#0043a8]"
                      >
                        Verify in Assessment
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAnalysisJob(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApplyMatch(selectedAnalysisJob.id);
                  setSelectedAnalysisJob(null);
                }}
                className="rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8] cursor-pointer"
              >
                Apply with Profile
              </button>
            </div>
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
          <li>GET {config.apiBaseUrl}/matching/jobs</li>
          <li>GET {config.apiBaseUrl}/matching/analysis/:jobId</li>
        </ul>
      </div>
    </div>
  );
};

export default JobMatching;
