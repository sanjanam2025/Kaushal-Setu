import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  getApiErrorMessage,
  jobsApi,
  type Job,
} from '../api/api';
import { EmptyState, ErrorState, Loading } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

interface Application {
  application_id: number;
  job_id: string;
  status: string;
}

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getJobs({ search: search || undefined, location: location || undefined, job_type: jobType || undefined }),
        jobsApi.getMyApplications().catch(() => null),
      ]);
      setJobs((jobsRes.data as { jobs: Job[] }).jobs || []);
      if (appsRes) {
        setApplications((appsRes.data as { applications: Application[] }).applications || []);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load open roles."));
    } finally {
      setLoading(false);
    }
  }, [search, location, jobType]);

  // Debounced search: wait for typing to pause before hitting the API.
  useEffect(() => {
    const timer = window.setTimeout(load, 300);
    return () => window.clearTimeout(timer);
  }, [load]);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((application) => application.job_id)),
    [applications],
  );

  const locations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((job) => {
      if (job.location) {
        const city = job.location.split(',')[0].trim();
        if (city) set.add(city);
      }
    });
    return Array.from(set).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((job) => {
      if (job.job_type) set.add(job.job_type);
    });
    return Array.from(set).sort();
  }, [jobs]);

  const apply = async (job: Job) => {
    setApplyingTo(job.job_id);
    setActionMessage(null);
    try {
      await jobsApi.applyForJob(job.job_id);
      setApplications((prev) => [
        ...prev,
        { application_id: Date.now(), job_id: job.job_id, status: 'Applied' },
      ]);
      setActionMessage({ kind: 'ok', text: `Application submitted for ${job.title}.` });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not submit your application.');
      setActionMessage({ kind: 'err', text: message });
    } finally {
      setApplyingTo(null);
    }
  };

  const hasFilters = Boolean(search || location || jobType);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Open roles"
        title={
          <>
            Jobs that fit your <span className="text-[#e8720c]">verified skills.</span>
          </>
        }
        description="Live postings from the Kaushal Setu employer network. Apply with your verified profile in one click."
      />

      {/* Filters */}
      <Reveal className="mt-8">
        <div className="quiet-card grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, company, or skill…"
              className="field-input pl-10 pr-9"
              aria-label="Search jobs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b7169] hover:text-[#0e2420]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="field-input sm:w-48"
            aria-label="Filter by location"
          >
            <option value="">All locations</option>
            {locations.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
            className="field-input sm:w-44"
            aria-label="Filter by employment type"
          >
            <option value="">All types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </Reveal>

      {actionMessage && (
        <p
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            actionMessage.kind === 'ok'
              ? 'bg-[#e4f2ea] text-[#2e7d5b]'
              : 'bg-[#fdeee2] text-[#9a4303]'
          }`}
          role="status"
        >
          {actionMessage.text}
        </p>
      )}

      {/* Results */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <Loading rows={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No roles match your filters' : 'No open roles right now'}
            description={
              hasFilters
                ? 'Try clearing the search or choosing a different location.'
                : 'When employers post openings on Kaushal Setu, they appear here instantly.'
            }
          />
        ) : (
          jobs.map((job, index) => {
            const applied = appliedJobIds.has(job.job_id);
            return (
              <Reveal key={job.job_id} delay={Math.min(index * 40, 240)}>
                <article className="quiet-card p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.engineering_field && (
                          <span className="rounded-full bg-[#fdeee2] px-2.5 py-0.5 text-[11px] font-bold text-[#c25a04]">
                            {job.engineering_field}
                          </span>
                        )}
                        {job.job_type && (
                          <span className="rounded-full bg-[rgba(14,36,32,0.06)] px-2.5 py-0.5 text-[11px] font-semibold text-[#5b7169]">
                            {job.job_type}
                          </span>
                        )}
                        {job.posted_date && (
                          <span className="text-[11px] text-[#5b7169]">
                            Posted {job.posted_date}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display mt-2 text-xl font-semibold text-[#0e2420]">
                        {job.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5b7169]">
                        <span className="flex items-center gap-1.5 font-semibold text-[#294b43]">
                          <Building2 className="h-3.5 w-3.5" />
                          {job.company}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                        )}
                        {job.experience && <span>{job.experience}</span>}
                        {job.salary && (
                          <span className="font-semibold text-[#0e2420]">{job.salary}</span>
                        )}
                      </div>

                      {job.required_skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {job.required_skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-[rgba(14,36,32,0.05)] px-2.5 py-1 text-xs text-[#294b43]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 self-start lg:flex-col lg:items-end">
                      {applied ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-[#e4f2ea] px-4 py-2 text-sm font-bold text-[#2e7d5b]">
                          <CheckCircle2 className="h-4 w-4" />
                          Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => apply(job)}
                          disabled={applyingTo === job.job_id}
                          className="btn-primary text-sm disabled:opacity-60"
                        >
                          {applyingTo === job.job_id ? 'Applying…' : 'Apply now'}
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      )}
                      {!applied && (
                        <span className="hidden items-center gap-1.5 text-xs text-[#5b7169] lg:flex">
                          <Briefcase className="h-3.5 w-3.5" />
                          with your verified profile
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Jobs;
