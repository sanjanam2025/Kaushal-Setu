import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  assessmentApi,
  getApiErrorMessage,
  type AssessmentDetail,
  type AssessmentMeta,
} from '../api/api';
import { ErrorState, Loading } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

type View = 'catalog' | 'test' | 'result';

const TEST_SECONDS = 15 * 60;

interface SubmitResult {
  score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  per_question: {
    question_id: number;
    skill: string;
    correct: boolean;
    correct_option: number;
    explanation: string;
  }[];
  verified_skill?: { skill: string; assessment_score: number | null };
}

export const Assessment: React.FC = () => {
  const [view, setView] = useState<View>('catalog');
  const [assessments, setAssessments] = useState<AssessmentMeta[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [active, setActive] = useState<AssessmentDetail | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(TEST_SECONDS);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const response = await assessmentApi.getAssessments();
      const data = response.data as { success: boolean; assessments: AssessmentMeta[] };
      setAssessments(data.assessments || []);
    } catch (err) {
      setListError(getApiErrorMessage(err, "We couldn't load the assessment catalog."));
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const startTest = async (assessmentId: string) => {
    setTestLoading(true);
    setSubmitError(null);
    try {
      const response = await assessmentApi.getAssessment(assessmentId);
      const data = response.data as { success: boolean; assessment: AssessmentDetail };
      setActive(data.assessment);
      setCurrent(0);
      setAnswers({});
      setSecondsLeft(TEST_SECONDS);
      setResult(null);
      setView('test');
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Failed to open the assessment.'));
    } finally {
      setTestLoading(false);
    }
  };

  const submit = useCallback(async () => {
    if (!active) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: Record<string, number> = {};
      Object.entries(answers).forEach(([questionId, option]) => {
        payload[questionId] = option;
      });

      const response = await assessmentApi.submitAssessment(active.id, payload);
      const data = response.data as { success: boolean; result: SubmitResult };
      setResult(data.result);
      setView('result');
      loadCatalog();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Failed to submit your assessment.'));
    } finally {
      setSubmitting(false);
    }
  }, [active, answers, loadCatalog]);

  // Countdown timer: auto-submit when time runs out.
  useEffect(() => {
    if (view !== 'test') return;

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [view]);

  useEffect(() => {
    if (view === 'test' && secondsLeft === 0 && !submitting) {
      submit();
    }
  }, [view, secondsLeft, submitting, submit]);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  const question = active?.questions[current];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ------------------------------------------------------------------
  // CATALOG VIEW
  // ------------------------------------------------------------------
  if (view === 'catalog') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Assessments"
          title={
            <>
              Prove what you know. <span className="text-[#e8720c]">Get verified.</span>
            </>
          }
          description="Short, discipline-specific assessments graded on the server. A passing score verifies the skill on your profile and lifts your job matches."
        />

        {listLoading && (
          <div className="mt-10">
            <Loading rows={3} />
          </div>
        )}

        {listError && (
          <div className="mt-10">
            <ErrorState message={listError} onRetry={loadCatalog} />
          </div>
        )}

        {!listLoading && !listError && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {assessments.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <div className="quiet-card flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#c25a04]">
                        {item.discipline}
                      </span>
                      <h2 className="font-display mt-1 text-lg font-semibold text-[#0e2420]">
                        {item.title}
                      </h2>
                    </div>
                    {item.status === 'Verified' ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e4f2ea] px-2.5 py-1 text-[11px] font-bold text-[#2e7d5b]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-[rgba(14,36,32,0.06)] px-2.5 py-1 text-[11px] font-semibold text-[#5b7169]">
                        {item.level}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-[#5b7169]">
                    Verifies <strong className="text-[#0e2420]">{item.primarySkill}</strong> ·{' '}
                    {item.duration}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.skillsCovered.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[rgba(14,36,32,0.05)] px-2.5 py-1 text-xs text-[#294b43]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={() => startTest(item.id)}
                      disabled={testLoading}
                      className="btn-primary w-full justify-center text-sm disabled:opacity-60"
                    >
                      {testLoading ? 'Preparing…' : item.status === 'Verified' ? 'Retake' : 'Start assessment'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {submitError && (
          <div className="mt-6">
            <ErrorState message={submitError} onRetry={loadCatalog} />
          </div>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------
  // TEST VIEW
  // ------------------------------------------------------------------
  if (view === 'test' && active && question) {
    const isLast = current === active.questions.length - 1;

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setView('catalog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5b7169] transition-colors hover:text-[#0e2420]"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit test
          </button>

          <span
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold ${
              secondsLeft < 120 ? 'bg-[#fdeee2] text-[#c25a04]' : 'bg-[rgba(14,36,32,0.06)] text-[#0e2420]'
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(secondsLeft)}
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5b7169]">
            <span>
              Question {current + 1} of {active.questions.length}
            </span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(14,36,32,0.08)]">
            <div
              className="h-full rounded-full bg-[#e8720c] transition-[width] duration-300"
              style={{ width: `${(answeredCount / active.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiet-card mt-8 p-7 sm:p-9">
          <h1 className="font-display text-xl font-semibold leading-snug text-[#0e2420] sm:text-2xl">
            {question.question}
          </h1>

          <div className="mt-7 space-y-3" role="radiogroup" aria-label="Answer options">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                  className={`flex w-full items-center gap-3.5 rounded-xl border px-4.5 py-3.5 text-left text-sm transition-all ${
                    selected
                      ? 'border-[#e8720c] bg-[#fdeee2]/60 text-[#0e2420]'
                      : 'border-[rgba(14,36,32,0.15)] bg-[#fffdf9] text-[#294b43] hover:border-[rgba(14,36,32,0.35)]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      selected ? 'bg-[#e8720c] text-white' : 'bg-[rgba(14,36,32,0.07)] text-[#5b7169]'
                    }`}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
            disabled={current === 0}
            className="btn-ghost text-sm disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {submitting ? 'Grading…' : 'Submit assessment'}
              {!submitting && <CheckCircle2 className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev + 1)}
              className="btn-primary text-sm"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RESULT VIEW
  // ------------------------------------------------------------------
  if (view === 'result' && result && active) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div
          className={`quiet-card p-8 text-center sm:p-10 ${
            result.passed ? 'border-[#bcdcc9]' : ''
          }`}
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              result.passed ? 'bg-[#e4f2ea] text-[#2e7d5b]' : 'bg-[#fdeee2] text-[#c25a04]'
            }`}
          >
            {result.passed ? (
              <Award className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#5b7169]">
            {active.title}
          </p>
          <h1 className="font-display type-title mt-2 font-semibold text-[#0e2420]">
            {result.passed ? 'Verified. Well done.' : 'Not quite this time.'}
          </h1>
          <p className="mt-3 text-sm text-[#5b7169]">
            You answered {result.correct_answers} of {result.total_questions} correctly — a score
            of <strong className="text-[#0e2420]">{Math.round(result.score)}%</strong>.
          </p>

          {result.verified_skill && (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-[#e4f2ea] px-4 py-1.5 text-sm font-semibold text-[#2e7d5b]">
              <CheckCircle2 className="h-4 w-4" />
              {result.verified_skill.skill} is now verified on your profile
            </p>
          )}

          {!result.passed && (
            <p className="mt-4 text-sm text-[#5b7169]">
              A score of 60% or higher verifies the skill. Review the answers below, learn the
              gaps, and try again whenever you're ready.
            </p>
          )}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/matching" className="btn-primary justify-center text-sm">
              See your updated matches
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setView('catalog')}
              className="btn-ghost justify-center text-sm"
            >
              <ClipboardCheck className="h-4 w-4" />
              Back to assessments
            </button>
          </div>
        </div>

        {/* Per-question review */}
        <div className="mt-8 space-y-3">
          <h2 className="font-display text-lg font-semibold text-[#0e2420]">Answer review</h2>
          {result.per_question.map((item) => {
            const questionMeta = active.questions.find((q) => q.id === item.question_id);
            return (
              <div key={item.question_id} className="quiet-card p-5">
                <div className="flex items-start gap-3">
                  {item.correct ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2e7d5b]" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#c25a04]" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#0e2420]">
                      {questionMeta?.question}
                    </p>
                    {!item.correct && (
                      <p className="mt-1.5 text-xs text-[#5b7169]">
                        Correct answer:{' '}
                        <strong className="text-[#0e2420]">
                          {questionMeta?.options[item.correct_option]}
                        </strong>
                      </p>
                    )}
                    <p className="mt-1 text-xs leading-relaxed text-[#5b7169]">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback (should not normally render)
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ErrorState message="The assessment could not be opened." onRetry={() => setView('catalog')} />
    </div>
  );
};

export default Assessment;
