import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CircleDashed, Percent, RefreshCw } from 'lucide-react';
import { getApiErrorMessage, jobMatchingApi, type JobMatch } from '../api/api';
import { EmptyState, ErrorState, Loading, ScoreBar } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

const PRESETS = [
  { label: 'All', value: 0 },
  { label: '60%+', value: 60 },
  { label: '80%+', value: 80 },
];

export const JobMatching: React.FC = () => {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobMatchingApi.getMatchingJobs();
      const data = response.data as { jobs: JobMatch[] };
      setMatches(data.jobs || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't compute your job matches."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(
    () => matches.filter((match) => match.match_score >= threshold),
    [matches, threshold],
  );

  const strongest = useMemo(
    () => filtered.filter((match) => match.match_score >= 60),
    [filtered],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Job matching"
        title={
          <>
            Matches you can <span className="text-[#e8720c]">actually explain.</span>
          </>
        }
        description="Every score is computed from your verified skills against each posting's real requirements — matched skills, missing skills, and the gap between you and the role."
        actions={
          <button type="button" onClick={refresh} disabled={refreshing} className="btn-ghost text-sm disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Recomputing…' : 'Refresh matches'}
          </button>
        }
      />

      {/* Threshold control */}
      <Reveal className="mt-8">
        <div className="quiet-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <Percent className="h-5 w-5 shrink-0 text-[#e8720c]" />
            <div className="w-full max-w-sm">
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="text-[#5b7169]">Minimum match</span>
                <span className="text-[#0e2420]">{threshold}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="w-full accent-[#e8720c]"
                aria-label="Minimum match threshold"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setThreshold(preset.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  threshold === preset.value
                    ? 'bg-[#0e2420] text-[#f7f4ee]'
                    : 'bg-[rgba(14,36,32,0.06)] text-[#5b7169] hover:bg-[rgba(14,36,32,0.1)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Summary line */}
      {!loading && !error && matches.length > 0 && (
        <Reveal className="mt-6">
          <p className="text-sm text-[#5b7169]">
            {strongest.length > 0 ? (
              <>
                You're a <strong className="text-[#2e7d5b]">60%+ fit</strong> for{' '}
                <strong className="text-[#0e2420]">{strongest.length}</strong> of{' '}
                {matches.length} open roles. Your strongest match:{' '}
                <strong className="text-[#0e2420]">{filtered[0]?.title}</strong> at{' '}
                <strong className="text-[#0e2420]">{Math.round(filtered[0]?.match_score ?? 0)}%</strong>.
              </>
            ) : (
              <>
                No strong matches yet — verify more skills to raise your scores.
                The closest is {filtered[0]?.title || matches[0]?.title} at{' '}
                {Math.round(filtered[0]?.match_score ?? matches[0]?.match_score ?? 0)}%.
              </>
            )}
          </p>
        </Reveal>
      )}

      {/* Match list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <Loading rows={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nothing above this threshold"
            description="Lower the minimum match to explore roles you could reach with a little more learning."
          />
        ) : (
          filtered.map((match, index) => (
            <Reveal key={match.job_id} delay={Math.min(index * 40, 200)}>
              <article className="quiet-card p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {match.engineering_field && (
                        <span className="rounded-full bg-[#fdeee2] px-2.5 py-0.5 text-[11px] font-bold text-[#c25a04]">
                          {match.engineering_field}
                        </span>
                      )}
                      <span className="text-[11px] text-[#5b7169]">
                        {match.location || 'India'}
                      </span>
                    </div>

                    <h2 className="font-display mt-1.5 text-xl font-semibold text-[#0e2420]">
                      {match.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#5b7169]">
                      {match.company}
                      {match.salary ? ` · ${match.salary}` : ''}
                      {match.experience ? ` · ${match.experience}` : ''}
                    </p>

                    {/* Matched vs missing */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#2e7d5b]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          You have ({match.matched_skills.length})
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {match.matched_skills.length === 0 ? (
                            <span className="text-xs text-[#5b7169]">None of the required skills yet</span>
                          ) : (
                            match.matched_skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-[#e4f2ea] px-2.5 py-1 text-xs font-medium text-[#2e7d5b]"
                              >
                                {skill}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#c25a04]">
                          <CircleDashed className="h-3.5 w-3.5" />
                          Gaps to bridge ({match.missing_skills.length})
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {match.missing_skills.length === 0 ? (
                            <span className="text-xs font-semibold text-[#2e7d5b]">
                              Full match — you're eligible!
                            </span>
                          ) : (
                            match.missing_skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-[#fdeee2] px-2.5 py-1 text-xs font-medium text-[#9a4303]"
                              >
                                {skill}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score column */}
                  <div className="flex shrink-0 flex-col items-start gap-3 lg:w-52 lg:items-end">
                    <div className="text-left lg:text-right">
                      <p className="font-display text-3xl font-semibold text-[#0e2420]">
                        {Math.round(match.match_score)}%
                      </p>
                      <p className="text-xs text-[#5b7169]">
                        {match.matched_skills.length}/{match.required_skills.length} skills matched
                      </p>
                    </div>
                    <div className="w-full lg:w-40">
                      <ScoreBar value={match.match_score} />
                    </div>
                    <Link to="/learning" className="btn-ghost text-xs">
                      Close the gap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))
        )}
      </div>
    </div>
  );
};

export default JobMatching;
