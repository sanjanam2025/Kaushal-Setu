import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { getApiErrorMessage, labourMarketApi } from '../api/api';
import { EmptyState, ErrorState, Loading } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

interface TrendRecord {
  id: number;
  [key: string]: unknown;
}

interface DemandRecord {
  id: number;
  [key: string]: unknown;
}

interface SalaryRecord {
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  engineering_field: string;
  salary_range: string;
}

function humanize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const LabourMarket: React.FC = () => {
  const [trends, setTrends] = useState<TrendRecord[]>([]);
  const [skills, setSkills] = useState<DemandRecord[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendsRes, skillsRes, salariesRes] = await Promise.all([
        labourMarketApi.getMarketTrends(),
        labourMarketApi.getInDemandSkills(),
        labourMarketApi.getSalaries(),
      ]);
      setTrends((trendsRes.data as { trends: TrendRecord[] }).trends || []);
      setSkills((skillsRes.data as { skills: DemandRecord[] }).skills || []);
      setSalaries((salariesRes.data as { salaries: SalaryRecord[] }).salaries || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load labour market data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const topSkills = skills.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Labour market"
        title={
          <>
            Where the demand <span className="text-[#e8720c]">actually is.</span>
          </>
        }
        description="Skill demand and salary signals drawn from the live job postings on the platform — not estimates."
      />

      {loading && (
        <div className="mt-10">
          <Loading rows={4} />
        </div>
      )}

      {error && (
        <div className="mt-10">
          <ErrorState message={error} onRetry={load} />
        </div>
      )}

      {!loading && !error && (
        <div className="mt-10 space-y-10">
          {/* In-demand skills */}
          <Reveal>
            <section>
              <h2 className="font-display text-xl font-semibold text-[#0e2420]">
                In-demand skills
              </h2>
              {topSkills.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No skill demand data yet"
                    description="As employers post jobs, the skills they ask for are aggregated here."
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {topSkills.map((skill) => {
                    const name = String(skill.skill ?? skill.name ?? 'Skill');
                    const demand = Number(skill.demand_index ?? 0);
                    const sector = skill.sector ? String(skill.sector) : null;
                    const growth = skill.growth_rate ? String(skill.growth_rate) : null;
                    return (
                      <div key={skill.id} className="quiet-card p-5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-[#0e2420]">{name}</p>
                          {growth && (
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#fdeee2] px-2 py-0.5 text-[10px] font-bold text-[#c25a04]">
                              <TrendingUp className="h-3 w-3" />
                              {growth}
                            </span>
                          )}
                        </div>
                        {sector && <p className="mt-0.5 text-xs text-[#5b7169]">{sector}</p>}
                        {demand > 0 && (
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="text-[#5b7169]">Demand index</span>
                              <span className="font-bold text-[#0e2420]">{demand}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(14,36,32,0.08)]">
                              <div
                                className="h-full rounded-full bg-[#e8720c]"
                                style={{ width: `${Math.min(100, demand)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </Reveal>

          {/* Industry trends */}
          <Reveal>
            <section>
              <h2 className="font-display text-xl font-semibold text-[#0e2420]">
                Industry trends
              </h2>
              {trends.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No trend data yet"
                    description="Curated industry signals will appear here as they are added to the platform."
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trends.map((trend) => (
                    <div key={trend.id} className="quiet-card p-5">
                      {trend.impact ? (
                        <span className="rounded-full bg-[#e4f2ea] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2e7d5b]">
                          {String(trend.impact)}
                        </span>
                      ) : null}
                      <h3 className="mt-2 font-semibold text-[#0e2420]">
                        {String(trend.title ?? 'Untitled trend')}
                      </h3>
                      {trend.sector ? (
                        <p className="mt-0.5 text-xs font-semibold text-[#c25a04]">
                          {String(trend.sector)}
                        </p>
                      ) : null}
                      {typeof trend.description === 'string' && (
                        <p className="mt-2 text-sm leading-relaxed text-[#5b7169]">
                          {trend.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Reveal>

          {/* Salary benchmarks from live postings */}
          <Reveal>
            <section>
              <h2 className="font-display text-xl font-semibold text-[#0e2420]">
                Salary benchmarks
              </h2>
              <p className="mt-1 text-sm text-[#5b7169]">
                Pulled directly from live postings in the platform's employer network.
              </p>
              {salaries.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No salary data yet"
                    description="Salary ranges appear once employers include them in their postings."
                  />
                </div>
              ) : (
                <div className="quiet-card mt-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(14,36,32,0.12)] text-xs uppercase tracking-wide text-[#5b7169]">
                        <th className="px-5 py-3.5 font-semibold">Role</th>
                        <th className="px-5 py-3.5 font-semibold">Company</th>
                        <th className="px-5 py-3.5 font-semibold">Location</th>
                        <th className="px-5 py-3.5 font-semibold">Field</th>
                        <th className="px-5 py-3.5 text-right font-semibold">Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaries.slice(0, 12).map((salary) => (
                        <tr
                          key={salary.job_id}
                          className="border-b border-[rgba(14,36,32,0.06)] last:border-0"
                        >
                          <td className="px-5 py-3.5 font-medium text-[#0e2420]">{salary.job_title}</td>
                          <td className="px-5 py-3.5 text-[#5b7169]">{salary.company}</td>
                          <td className="px-5 py-3.5 text-[#5b7169]">{salary.location || '—'}</td>
                          <td className="px-5 py-3.5 text-[#5b7169]">{salary.engineering_field || '—'}</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-[#0e2420]">
                            {salary.salary_range || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </Reveal>
        </div>
      )}
    </div>
  );
};

export default LabourMarket;
