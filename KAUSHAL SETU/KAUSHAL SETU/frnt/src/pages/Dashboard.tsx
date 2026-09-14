import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardCheck,
  Compass,
  GraduationCap,
  Briefcase,
  Sparkles,
  Target,
} from 'lucide-react';
import { dashboardApi, type DashboardSummary } from '../api/api';
import { getApiErrorMessage } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ErrorState, Loading, ScoreBar } from '../components/AsyncState';
import Reveal from '../components/Reveal';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getSummary();
      setSummary((response.data as { success: boolean } & DashboardSummary));
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load your career overview."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
        <Loading rows={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (!summary) return null;

  const firstName = user?.name?.split(' ')[0] || 'there';
  const journey = [
    {
      icon: GraduationCap,
      label: 'Skills',
      value: `${summary.skills.total}`,
      caption: `${summary.skills.verified} verified`,
      to: '/skills',
      active: summary.skills.total > 0,
    },
    {
      icon: ClipboardCheck,
      label: 'Assessments',
      value: `${summary.assessments.passed}`,
      caption: `${summary.assessments.total} attempted`,
      to: '/assessment',
      active: summary.assessments.total > 0,
    },
    {
      icon: Compass,
      label: 'Career',
      value: summary.target_role ? '1' : '0',
      caption: summary.target_role?.role_name || 'No direction set',
      to: '/career',
      active: Boolean(summary.target_role),
    },
    {
      icon: Target,
      label: 'Learning',
      value: `${summary.learning.total}`,
      caption: `${summary.learning.in_progress} in progress`,
      to: '/learning',
      active: summary.learning.total > 0,
    },
    {
      icon: Briefcase,
      label: 'Applications',
      value: `${summary.applications.total}`,
      caption: 'Total submitted',
      to: '/jobs',
      active: summary.applications.total > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Greeting */}
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e8720c]">
          {greeting()}, {firstName}
        </p>
        <h1 className="type-display mt-2 font-semibold text-[#0e2420]">
          {summary.target_role
            ? `Your path to ${summary.target_role.role_name} is taking shape.`
            : 'Your career path is becoming clearer.'}
        </h1>
      </Reveal>

      {/* Journey rail: the five spans of the bridge with real numbers */}
      <Reveal delay={100}>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {journey.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="quiet-card group flex flex-col gap-3 p-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      item.active ? 'bg-[#fdeee2] text-[#c25a04]' : 'bg-[rgba(14,36,32,0.06)] text-[#5b7169]'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#5b7169] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-[#0e2420]">{item.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0e2420]">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#5b7169]" title={item.caption}>
                    {item.caption}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {/* Next step */}
      {summary.next_step && (
        <Reveal delay={150}>
          <div className="ink-panel mt-10 flex flex-col gap-5 rounded-2xl p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0a35c]/20 text-[#f0a35c]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#f0a35c]">
                  Your next step
                </p>
                <h2 className="font-display mt-1 text-xl font-semibold text-[#f7f4ee]">
                  {summary.next_step.title}
                </h2>
                <p className="mt-1 max-w-xl text-sm text-[rgba(247,244,238,0.68)]">
                  {summary.next_step.description}
                </p>
              </div>
            </div>
            <Link to={summary.next_step.link} className="btn-primary shrink-0 self-start sm:self-center">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        {/* Skill profile */}
        <Reveal delay={200} className="lg:col-span-7">
          <div className="quiet-card h-full p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#0e2420]">Your skill profile</h2>
              <Link to="/skills" className="text-sm font-semibold text-[#c25a04] hover:underline">
                Manage
              </Link>
            </div>

            {summary.skills.items.length === 0 ? (
              <p className="mt-6 text-sm text-[#5b7169]">
                No skills yet. Add the ones you already have — they are the foundation of every match.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {summary.skills.items.slice(0, 6).map((skill) => (
                  <div key={skill.skill}>
                    <ScoreBar
                      value={skill.score ?? 0}
                      label={`${skill.skill}${skill.score === null ? ' (self-reported)' : ''}`}
                    />
                  </div>
                ))}
                {summary.skills.items.length > 6 && (
                  <p className="text-xs text-[#5b7169]">
                    + {summary.skills.items.length - 6} more skills
                  </p>
                )}
              </div>
            )}
          </div>
        </Reveal>

        {/* Top job matches */}
        <Reveal delay={250} className="lg:col-span-5">
          <div className="quiet-card h-full p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#0e2420]">Top job matches</h2>
              <Link to="/matching" className="text-sm font-semibold text-[#c25a04] hover:underline">
                View all
              </Link>
            </div>

            {summary.job_matches.items.length === 0 ? (
              <p className="mt-6 text-sm text-[#5b7169]">
                Add a few skills and your matches will appear here, ranked by fit.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {summary.job_matches.items.slice(0, 4).map((match) => (
                  <div key={match.job_id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0e2420]">{match.title}</p>
                        <p className="truncate text-xs text-[#5b7169]">
                          {match.company} · {match.location || 'India'}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          match.match_score >= 60
                            ? 'bg-[#e4f2ea] text-[#2e7d5b]'
                            : 'bg-[rgba(14,36,32,0.07)] text-[#5b7169]'
                        }`}
                      >
                        {Math.round(match.match_score)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <ScoreBar value={match.match_score} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Learning progress */}
        <Reveal delay={300} className="lg:col-span-12">
          <div className="quiet-card p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-[#0e2420]">Learning progress</h2>
              <div className="flex items-center gap-5 text-xs text-[#5b7169]">
                <span>
                  <strong className="text-[#0e2420]">{summary.learning.completed}</strong> completed
                </span>
                <span>
                  <strong className="text-[#0e2420]">{summary.learning.in_progress}</strong> in progress
                </span>
                <span>
                  avg <strong className="text-[#0e2420]">{Math.round(summary.learning.average_progress)}%</strong>
                </span>
              </div>
            </div>

            {summary.learning.items.length === 0 ? (
              <p className="mt-6 text-sm text-[#5b7169]">
                Start learning a skill from your career roadmap and track it here.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {summary.learning.items.slice(0, 6).map((item) => (
                  <div key={item.skill} className="rounded-xl border border-[rgba(14,36,32,0.1)] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[#0e2420]" title={item.skill}>
                        {item.skill}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          item.status === 'Completed'
                            ? 'bg-[#e4f2ea] text-[#2e7d5b]'
                            : 'bg-[#fdeee2] text-[#c25a04]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <ScoreBar value={item.progress} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Dashboard;
