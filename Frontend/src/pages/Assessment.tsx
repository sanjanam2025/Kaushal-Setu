import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Play,
  Server,
  Award,
  Sparkles,
  ShieldCheck,
  Check,
  Lightbulb,
  Building2,
  Cpu,
  Settings,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { assessmentApi } from '../api/api';
import { config } from '../config/config';
import OnboardingIllustration from '../components/OnboardingIllustration';

interface Question {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'In a three-phase power distribution network, which transformer configuration provides a stable neutral point for single-phase loads while isolating harmonic currents?',
    category: 'Electrical Engineering',
    options: [
      'Delta - Delta (Δ - Δ)',
      'Delta - Star (Δ - Y) with grounded neutral',
      'Star - Star (Y - Y) ungrounded',
      'Open Delta (V - V)',
    ],
    correctAnswer: 1,
    explanation: 'Delta-Star with grounded neutral is universally used in distribution networks because the star secondary provides a neutral wire for single-phase voltage (230V/400V).',
  },
  {
    id: 2,
    question: 'Which control algorithm is primarily used in PLC ladder logic for precise temperature and motor velocity regulation?',
    category: 'Automation & Control',
    options: [
      'Bang-Bang On/Off Controller',
      'Proportional-Integral-Derivative (PID) Loop',
      'Open-loop relay sequencing',
      'Feed-forward static attenuator',
    ],
    correctAnswer: 1,
    explanation: 'PID loops dynamically calculate error values and apply proportional, integral, and derivative corrections.',
  },
  {
    id: 3,
    question: 'When designing a high-speed PCB in CAD software, what is the primary purpose of length matching differential signal traces?',
    category: 'Circuit Design',
    options: [
      'To increase overall board capacitance',
      'To minimize propagation delay skew and phase jitter',
      'To reduce copper etching production cost',
      'To isolate analog power planes from digital grounds',
    ],
    correctAnswer: 1,
    explanation: 'Length matching guarantees that both positive and negative differential signals reach the receiver simultaneously, eliminating timing skew.',
  },
  {
    id: 4,
    question: 'In MATLAB / Simulink power simulation, which solver type is most suitable for stiff electrical switching circuits containing diodes and IGBTs?',
    category: 'Software Tools',
    options: [
      'Explicit Euler (ode1)',
      'Trapezoidal / Backward Differentiation Formula (ode23tb)',
      'Runge-Kutta 4th Order (ode4)',
      'Heun Predictor-Corrector',
    ],
    correctAnswer: 1,
    explanation: 'ode23tb is an implicit Runge-Kutta / trapezoidal solver specifically tuned for stiff differential-algebraic equations in power electronics.',
  },
];

export const Assessment: React.FC = () => {
  const [activeView, setActiveView] = useState<'catalog' | 'test' | 'results'>('catalog');
  const [testingApi, setTestingApi] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  // Active Test Simulator State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [score, setScore] = useState<number | null>(null);

  // Available Assessments Catalog
  const mockAssessments = [
    {
      id: 'asmt-01',
      title: 'Power Systems & Circuit Analysis',
      discipline: 'Electrical Engineering',
      duration: '30 mins',
      questionsCount: 20,
      level: 'Intermediate',
      status: 'Ready to Start',
      skillsCovered: ['Power Systems', 'Circuit Design', 'MATLAB', 'Electrical Machines'],
    },
    {
      id: 'asmt-02',
      title: 'PLC Programming & Industrial Automation',
      discipline: 'Electrical & Instrumentation',
      duration: '40 mins',
      questionsCount: 25,
      level: 'Advanced',
      status: 'Ready to Start',
      skillsCovered: ['PLC Programming', 'SCADA', 'Embedded Systems', 'Sensor Interfacing'],
    },
    {
      id: 'asmt-03',
      title: 'AutoCAD & Technical Engineering Drafting',
      discipline: 'Civil & Mechanical',
      duration: '35 mins',
      questionsCount: 20,
      level: 'Intermediate',
      status: 'Verified (Score: 92%)',
      skillsCovered: ['AutoCAD', 'Geometric Dimensioning', '3D Modeling'],
    },
    {
      id: 'asmt-04',
      title: 'Full-Stack Architecture & RESTful APIs',
      discipline: 'Computer Science & IT',
      duration: '45 mins',
      questionsCount: 30,
      level: 'Advanced',
      status: 'Ready to Start',
      skillsCovered: ['Python', 'Flask', 'React', 'SQL Databases'],
    },
  ];

  // Timer countdown during test
  useEffect(() => {
    if (activeView !== 'test') return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeView]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleStartAssessment = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeRemaining(600);
    setActiveView('test');
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    sampleQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / sampleQuestions.length) * 100);
    setScore(finalScore);
    setActiveView('results');
  };

  const handleTestApiCall = async () => {
    setTestingApi(true);
    setApiResult(null);
    try {
      const res = await assessmentApi.getAssessments();
      setApiResult(`Connected to Flask: Received assessments catalog.`);
    } catch {
      setApiResult(`Flask API endpoint (${config.apiBaseUrl}/assessments) is on local standby.`);
    } finally {
      setTestingApi(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stepsList = [
    { num: 1, label: 'Personal', completed: true },
    { num: 2, label: 'Education', completed: true },
    { num: 3, label: 'Skills', completed: true },
    { num: 4, label: 'Assessment', active: true },
    { num: 5, label: 'Verified' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Utility Nav / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeView === 'catalog'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Assessment Modules
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeView !== 'test') handleStartAssessment();
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeView === 'test'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {activeView === 'test' ? 'Active Test Simulator' : 'Simulate Diagnostic Test'}
          </button>
          {score !== null && (
            <button
              type="button"
              onClick={() => setActiveView('results')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'results'
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Latest Result ({score}%)
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleTestApiCall}
          disabled={testingApi}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Server className="h-3.5 w-3.5" />
          <span>{testingApi ? 'Connecting...' : 'Test Flask API Call'}</span>
        </button>
      </div>

      {apiResult && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 font-medium">
          {apiResult}
        </div>
      )}

      {/* TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MOTIVATION & STEPPER */}
        <div className="lg:col-span-4 xl:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between min-h-[640px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] block">
              SKILL ASSESSMENT
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1 tracking-tight leading-tight">
              Validate your <br />
              <span className="text-[#0052cc]">engineering skills</span>
            </h1>

            <div className="h-1 w-12 bg-[#0052cc] rounded-full mt-2.5 mb-4" />

            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
              Earn verified digital credentials aligned with National Skill Qualification Framework
              (NSQF) and industry recruitment benchmarks.
            </p>

            <div className="my-6">
              <OnboardingIllustration step={3} />
            </div>

            <div className="rounded-2xl border border-blue-100 bg-[#f0f6ff] p-4 flex items-start gap-3.5 shadow-2xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0A2540]">Official NSQF Accreditation</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Test scores are securely verifiable by government entities and engineering employers.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-200 -z-0" />

              {stepsList.map((step) => (
                <div key={step.num} className="relative z-10 flex flex-col items-center group cursor-default">
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
              ))}
            </div>

            <div className="mt-7 text-center">
              <p className="text-xs font-bold text-[#0052cc]">
                “Demonstrate Competence. Unlock Higher Packages.”
              </p>
              <div className="h-0.5 w-12 bg-[#0052cc] mx-auto mt-2 rounded-full" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ASSESSMENT CONTENT WORKSPACE */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-xs min-h-[640px]">
          {/* Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
                {activeView === 'test'
                  ? 'Electrical & Power Systems Evaluation'
                  : activeView === 'results'
                  ? 'Assessment Performance Summary'
                  : 'Diagnostic Assessments'}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Step 4 of 5</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeView === 'test'
                  ? 'Answer each multiple choice question. Results are recorded instantly upon submission.'
                  : 'Standardized tests designed to validate your practical and analytical engineering capabilities.'}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100/90 bg-[#f0f6ff] p-3.5 sm:p-4 flex items-center gap-3.5 max-w-md shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052cc] text-white shadow-xs">
                <Lightbulb className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Passing with 75%+ unlocks the Verified Engineering Badge on your public government profile.
              </p>
            </div>
          </div>

          {/* VIEW 1: CATALOG OF ASSESSMENTS */}
          {activeView === 'catalog' && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recommended For Your Profile
                </h3>
                <span className="text-xs text-slate-500">{mockAssessments.length} assessments available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAssessments.map((asmt) => {
                  const isVerified = asmt.status.includes('Verified');
                  return (
                    <div
                      key={asmt.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#0052cc]/50 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#0052cc]">
                            <Building2 className="h-3 w-3" />
                            <span>{asmt.discipline}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{asmt.duration}</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#0A2540] mt-2.5 leading-snug">
                          {asmt.title}
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {asmt.skillsCovered.map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{asmt.status}</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">
                              {asmt.questionsCount} questions • {asmt.level}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleStartAssessment}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0043a8] transition-all cursor-pointer"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>{isVerified ? 'Retake' : 'Start'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Link
                  to="/skills"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-2.5 text-xs font-bold text-[#0052cc] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous (Skills)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-7 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0043a8] transition-all hover:shadow-lg cursor-pointer"
                >
                  <span>Begin Diagnostic Test</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: ACTIVE TEST SIMULATOR */}
          {activeView === 'test' && (
            <div className="mt-6 space-y-6">
              {/* Test Progress & Timer Header */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700">
                    Question {currentQuestionIdx + 1} of {sampleQuestions.length}
                  </span>
                  <div className="h-2 w-48 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#0052cc] rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIdx + 1) / sampleQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-1.5 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                  <Clock className="h-4 w-4 text-[#0052cc]" />
                  <span>{formatTime(timeRemaining)} remaining</span>
                </div>
              </div>

              {/* Active Question Box */}
              {sampleQuestions[currentQuestionIdx] && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0052cc]">
                      {sampleQuestions[currentQuestionIdx].category}
                    </span>
                    <span className="text-xs text-slate-400">Standard Single Choice</span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-[#0A2540] leading-relaxed">
                    {sampleQuestions[currentQuestionIdx].question}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {sampleQuestions[currentQuestionIdx].options.map((option, optIdx) => {
                      const isSelected =
                        selectedAnswers[sampleQuestions[currentQuestionIdx].id] === optIdx;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleSelectOption(sampleQuestions[currentQuestionIdx].id, optIdx)
                          }
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-[#0052cc] bg-blue-50/70 text-[#0052cc] font-semibold shadow-xs ring-1 ring-[#0052cc]'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? 'bg-[#0052cc] text-white'
                                : 'border border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Test Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous Question</span>
                </button>

                {currentQuestionIdx < sampleQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043a8] cursor-pointer"
                  >
                    <span>Save & Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit Assessment</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: RESULTS SUMMARY */}
          {activeView === 'results' && score !== null && (
            <div className="mt-6 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/40 p-6 sm:p-8 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0052cc] text-white shadow-lg shadow-blue-500/30">
                  <Award className="h-8 w-8" />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {score >= 75 ? 'Assessment Passed • National Benchmark' : 'Assessment Completed'}
                  </span>
                  <h3 className="text-3xl font-extrabold text-[#0A2540]">
                    Your Score: <span className="text-[#0052cc]">{score}%</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    {score >= 75
                      ? 'Congratulations! You have demonstrated high competency in Electrical Engineering & Power Systems.'
                      : 'You are close to the national benchmark of 75%. Review the curriculum and retake anytime.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-bold text-slate-800">
                      {Math.round((score / 100) * sampleQuestions.length)} / {sampleQuestions.length}
                    </p>
                    <p className="text-[11px] text-slate-500">Correct Answers</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-bold text-emerald-600">Top 12%</p>
                    <p className="text-[11px] text-slate-500">National Percentile</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="text-lg font-bold text-[#0052cc]">NSQF L6</p>
                    <p className="text-[11px] text-slate-500">Credential Level</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveView('catalog')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Back to Assessments</span>
                </button>

                <Link
                  to="/skills"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0043a8] cursor-pointer"
                >
                  <span>View Verified Skills Matrix</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
