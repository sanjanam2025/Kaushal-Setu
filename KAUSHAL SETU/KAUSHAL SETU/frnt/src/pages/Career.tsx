import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, MapPin, Target, TrendingUp } from 'lucide-react';
import {
  careerApi,
  getApiErrorMessage,
  rolesApi,
  type JobMatch,
} from '../api/api';
import { EmptyState, ErrorState, Loading, ScoreBar } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

interface FieldInfo {
  field: string;
  openings: number;
  companies: number;
}

interface RoleInfo {
  role_id: number;
  role_name: string;
  engineering_field: string | null;
  industry: string | null;
  demand_level: string | null;
  min_experience: string | null;
}

interface GapItem {
  skill_name: string;
  required_proficiency: string | null;
  user_score: number | null;
  is_mandatory: boolean;
  gap: number;
  status: string;
}

type Tab = 'explore' | 'target';

export const Career: React.FC = () => {
  const [tab, setTab] = useState<Tab>('explore');

  // Field explorer state
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [fieldCareers, setFieldCareers] = useState<JobMatch[] | null>(null);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  const [careersLoading, setCareersLoading] = useState(false);

  // Target role state
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [targetRole, setTargetRole] = useState<RoleInfo | null>(null);
  const [gap, setGap] = useState<GapItem[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [savingRole, setSavingRole] = useState<string | null>(null);

  const loadFields = useCallback(async () => {
    setFieldsLoading(true);
    setFieldsError(null);
    try {
      const response = await careerApi.getFields();
      const data = response.data as { fields: FieldInfo[] };
      setFields(data.fields || []);
    } catch (err) {
      setFieldsError(getApiErrorMessage(err, "We couldn't load career fields."));
    } finally {
      setFieldsLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const [rolesResponse, targetResponse] = await Promise.all([
        rolesApi.getRoles(),
        careerApi.getTargetRole(),
      ]);
      const rolesData = rolesResponse.data as { roles: RoleInfo[] };
      const targetData = targetResponse.data as { target_role_id: number | null };
      setRoles(rolesData.roles || []);

      if (targetData.target_role_id) {
        const match = (rolesData.roles || []).find(
          (role) => role.role_id === targetData.target_role_id,
        );
        setTargetRole(match || null);
      }
    } catch (err) {
      setRolesError(getApiErrorMessage(err, "We couldn't load career roles."));
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFields();
    loadRoles();
  }, [loadFields, loadRoles]);

  // Load gap analysis when a target role is chosen.
  useEffect(() => {
    if (!targetRole) {
      setGap([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await rolesApi.getSkillGap(targetRole.role_id);
        if (cancelled) return;
        const data = response.data as { skill_gap: GapItem[] };
        setGap(data.skill_gap || []);
      } catch {
        if (!cancelled) setGap([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [targetRole]);

  const openField = async (field: string) => {
    setSelectedField(field);
    setCareersLoading(true);
    try {
      const response = await careerApi.discoverByField(field);
      const data = response.data as { careers: JobMatch[] };
      setFieldCareers(data.careers || []);
    } catch {
      setFieldCareers([]);
    } finally {
      setCareersLoading(false);
    }
  };

  const chooseTarget = async (role: RoleInfo) => {
    setSavingRole(role.role_name);
    try {
      await careerApi.setTargetRole(role.role_name);
      setTargetRole(role);
    } catch (err) {
      // Surface nothing destructive; the error is visible via state below.
      setRolesError(getApiErrorMessage(err, 'Could not save that target role.'));
    } finally {
      setSavingRole(null);
    }
  };

  const gapSummary = useMemo(() => {
    if (gap.length === 0) return null;
    const missing = gap.filter((item) => item.status === 'Missing').length;
    const coverage = Math.round(((gap.length - missing) / gap.length) * 100);
    return { missing, coverage, total: gap.length };
  }, [gap]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Career direction"
        title={
          <>
            Where do you want to <span className="text-[#e8720c]">cross to?</span>
          </>
        }
        description="Explore where the jobs are, then pick a target role. Kaushal Setu compares your verified skills against that role's real requirements."
      />

      {/* Tabs */}
      <div className="mt-8 flex gap-2" role="tablist" aria-label="Career sections">
        {(
          [
            { id: 'explore', label: 'Explore fields', icon: Compass },
            { id: 'target', label: 'My target role', icon: Target },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? 'bg-[#0e2420] text-[#f7f4ee]'
                  : 'bg-[rgba(14,36,32,0.06)] text-[#5b7169] hover:bg-[rgba(14,36,32,0.1)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------ EXPLORE ------------------------------ */}
      {tab === 'explore' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {fieldsLoading ? (
              <Loading rows={4} />
            ) : fieldsError ? (
              <ErrorState message={fieldsError} onRetry={loadFields} />
            ) : fields.length === 0 ? (
              <EmptyState
                title="No fields yet"
                description="Once employers post jobs, their engineering fields appear here."
              />
            ) : (
              <div className="space-y-2.5">
                {fields.map((field, index) => (
                  <Reveal key={field.field} delay={index * 40}>
                    <button
                      type="button"
                      onClick={() => openField(field.field)}
                      className={`quiet-card flex w-full items-center justify-between gap-4 p-5 text-left ${
                        selectedField === field.field ? 'border-[#e8720c]' : ''
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-[#0e2420]">{field.field}</p>
                        <p className="mt-0.5 text-xs text-[#5b7169]">
                          {field.companies} {field.companies === 1 ? 'employer' : 'employers'}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#fdeee2] px-3 py-1 text-xs font-bold text-[#c25a04]">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {field.openings}
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {!selectedField ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-[rgba(14,36,32,0.25)] p-10 text-center">
                <p className="max-w-xs text-sm text-[#5b7169]">
                  Pick a field to see live openings and how well your skills fit each role.
                </p>
              </div>
            ) : careersLoading ? (
              <Loading rows={4} />
            ) : !fieldCareers || fieldCareers.length === 0 ? (
              <EmptyState
                title="No roles here yet"
                description="No job postings exist for this field right now. Try another field."
              />
            ) : (
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold text-[#0e2420]">
                  {selectedField}
                  <span className="ml-2 text-sm font-normal text-[#5b7169]">
                    {fieldCareers.length} openings, ranked by your fit
                  </span>
                </h2>
                {fieldCareers.map((career) => (
                  <div key={career.job_id} className="quiet-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0e2420]">{career.title}</p>
                        <p className="mt-0.5 text-xs text-[#5b7169]">
                          {career.company} · {career.location || 'India'}
                          {career.salary ? ` · ${career.salary}` : ''}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          career.match_score >= 60
                            ? 'bg-[#e4f2ea] text-[#2e7d5b]'
                            : career.match_score > 0
                              ? 'bg-[#fdeee2] text-[#c25a04]'
                              : 'bg-[rgba(14,36,32,0.06)] text-[#5b7169]'
                        }`}
                      >
                        {Math.round(career.match_score)}% fit
                      </span>
                    </div>
                    <div className="mt-3">
                      <ScoreBar value={career.match_score} />
                    </div>
                    {career.missing_skills.length > 0 && (
                      <p className="mt-2.5 truncate text-xs text-[#5b7169]" title={career.missing_skills.join(', ')}>
                        Gaps: {career.missing_skills.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------ TARGET ------------------------------ */}
      {tab === 'target' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Role picker */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-lg font-semibold text-[#0e2420]">Choose your target</h2>
            <p className="mt-1 text-sm text-[#5b7169]">
              Your target role powers the gap analysis and learning roadmap.
            </p>

            {rolesLoading ? (
              <div className="mt-5">
                <Loading rows={4} />
              </div>
            ) : rolesError ? (
              <div className="mt-5">
                <ErrorState message={rolesError} onRetry={loadRoles} />
              </div>
            ) : (
              <div className="mt-5 max-h-[560px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                {roles.map((role) => (
                  <button
                    key={role.role_id}
                    type="button"
                    onClick={() => chooseTarget(role)}
                    disabled={savingRole === role.role_name}
                    className={`quiet-card flex w-full items-center justify-between gap-3 p-4 text-left ${
                      targetRole?.role_id === role.role_id ? 'border-[#e8720c]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0e2420]">{role.role_name}</p>
                      <p className="mt-0.5 truncate text-xs text-[#5b7169]">
                        {role.engineering_field || 'General'}
                        {role.demand_level ? ` · ${role.demand_level} demand` : ''}
                      </p>
                    </div>
                    {targetRole?.role_id === role.role_id ? (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8720c] text-white">
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#5b7169]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gap analysis */}
          <div className="lg:col-span-7">
            {!targetRole ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-[rgba(14,36,32,0.25)] p-10 text-center">
                <p className="max-w-xs text-sm text-[#5b7169]">
                  Select a target role and your skill gap analysis appears here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="ink-panel rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#f0a35c]">
                    Current target
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-semibold text-[#f7f4ee]">
                    {targetRole.role_name}
                  </h2>
                  {gapSummary && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[rgba(247,244,238,0.75)]">
                      <span>
                        <strong className="text-[#f0a35c]">{gapSummary.coverage}%</strong> skill
                        coverage
                      </span>
                      <span>
                        <strong className="text-[#f0a35c]">{gapSummary.missing}</strong> of{' '}
                        {gapSummary.total} skills missing
                      </span>
                    </div>
                  )}
                </div>

                {gap.length === 0 ? (
                  <EmptyState
                    title="No requirements defined for this role"
                    description="This role has no skill requirements in the database yet, so no gap analysis is possible."
                  />
                ) : (
                  <div className="quiet-card p-6">
                    <h3 className="font-display text-lg font-semibold text-[#0e2420]">
                      Skill gap, span by span
                    </h3>
                    <div className="mt-5 space-y-4">
                      {gap.map((item) => (
                        <div key={item.skill_name}>
                          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-[#0e2420]">
                              {item.skill_name}
                              {item.is_mandatory && (
                                <span className="rounded-full bg-[#fdeee2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#c25a04]">
                                  Mandatory
                                </span>
                              )}
                            </span>
                            <span
                              className={`text-xs font-bold ${
                                item.status === 'Matched' ? 'text-[#2e7d5b]' : 'text-[#c25a04]'
                              }`}
                            >
                              {item.status === 'Matched'
                                ? `Have it (+${Math.round(100 - item.gap)}%)`
                                : 'Missing'}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(14,36,32,0.08)]">
                            <div
                              className={`h-full rounded-full transition-[width] duration-700 ${
                                item.status === 'Matched' ? 'bg-[#2e7d5b]' : 'bg-[rgba(14,36,32,0.25)]'
                              }`}
                              style={{
                                width: `${item.status === 'Matched' ? 100 - item.gap : 6}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link to="/learning" className="btn-primary text-sm">
                        Build my learning path
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to="/assessment" className="btn-ghost text-sm">
                        Verify a skill now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Career;
