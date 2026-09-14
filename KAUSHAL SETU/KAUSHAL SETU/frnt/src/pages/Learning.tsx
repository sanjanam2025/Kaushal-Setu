import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Play, Target } from 'lucide-react';
import {
  careerApi,
  curriculumApi,
  getApiErrorMessage,
  learningApi,
  rolesApi,
  type LearningProgressRecord,
} from '../api/api';
import { EmptyState, ErrorState, Loading, ScoreBar } from '../components/AsyncState';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

interface RoadmapSkill {
  skill_name: string;
  required_proficiency: string | null;
  is_mandatory: boolean;
  priority: string;
  skill_gap: number;
  user_score: number | null;
  step: number;
}

interface CurriculumItem {
  id: number;
  skill: string | null;
  course_title: string | null;
  provider: string | null;
  duration: string | null;
  level: string | null;
}

const STAGE_ORDER = ['Foundation', 'Core skills', 'Project', 'Advanced', 'Interview', 'Job ready'];

function stageFor(index: number, mandatory: boolean): string {
  // Deterministic mapping: mandatory skills come first as foundation/core.
  const bucket = Math.min(
    STAGE_ORDER.length - 1,
    mandatory ? index % 2 : 2 + (index % 3),
  );
  return STAGE_ORDER[bucket];
}

export const Learning: React.FC = () => {
  const [roadmap, setRoadmap] = useState<RoadmapSkill[]>([]);
  const [progress, setProgress] = useState<LearningProgressRecord[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busySkill, setBusySkill] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [targetRes, progressRes, curriculumRes] = await Promise.all([
        careerApi.getTargetRole(),
        learningApi.getProgress(),
        curriculumApi.getCurricula(),
      ]);

      const targetData = targetRes.data as { target_role_id: number | null };
      setProgress((progressRes.data as { learning_progress: LearningProgressRecord[] }).learning_progress || []);
      setCurriculum((curriculumRes.data as { curriculum: CurriculumItem[] }).curriculum || []);

      if (targetData.target_role_id) {
        const rolesRes = await rolesApi.getRoles();
        const rolesData = rolesRes.data as {
          roles: { role_id: number; role_name: string }[];
        };
        const role = (rolesData.roles || []).find((r) => r.role_id === targetData.target_role_id);

        if (role) {
          setTargetRole(role.role_name);
          const roadmapRes = await rolesApi.getLearningRoadmap(role.role_id);
          setRoadmap((roadmapRes.data as { roadmap: RoadmapSkill[] }).roadmap || []);
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load your learning path."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const progressFor = useCallback(
    (skillName: string) =>
      progress.find(
        (record) => record.skill_name.toLowerCase() === skillName.toLowerCase(),
      ),
    [progress],
  );

  const startLearning = async (skillName: string) => {
    setBusySkill(skillName);
    setActionError(null);
    try {
      await learningApi.startLearning(skillName);
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not start learning that skill.'));
    } finally {
      setBusySkill(null);
    }
  };

  const advance = async (skillName: string, currentProgress: number) => {
    setBusySkill(skillName);
    setActionError(null);
    try {
      const next = Math.min(100, currentProgress + 25);
      await learningApi.updateProgress(skillName, next);
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update progress.'));
    } finally {
      setBusySkill(null);
    }
  };

  const grouped = useMemo(() => {
    const groups = new Map<string, RoadmapSkill[]>();
    roadmap.forEach((item, index) => {
      const stage = stageFor(index, item.is_mandatory);
      const list = groups.get(stage) || [];
      list.push(item);
      groups.set(stage, list);
    });
    return STAGE_ORDER.filter((stage) => groups.has(stage)).map((stage) => ({
      stage,
      skills: groups.get(stage) as RoadmapSkill[],
    }));
  }, [roadmap]);

  const coursesFor = useCallback(
    (skillName: string) =>
      curriculum.filter(
        (course) => course.skill && course.skill.toLowerCase() === skillName.toLowerCase(),
      ),
    [curriculum],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Learning path"
        title={
          <>
            Cross the gap, <span className="text-[#e8720c]">one skill at a time.</span>
          </>
        }
        description={
          targetRole
            ? `A prioritized path toward your target role: ${targetRole}. Mandatory skills come first.`
            : 'Choose a target role on the Career page and a prioritized learning path will appear here.'
        }
        actions={
          !targetRole ? (
            <Link to="/career" className="btn-primary text-sm">
              <Target className="h-4 w-4" />
              Choose a target role
            </Link>
          ) : undefined
        }
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

      {!loading && !error && roadmap.length === 0 && targetRole && (
        <div className="mt-10">
          <EmptyState
            title="Your target role has no skill requirements"
            description="Once this role defines its required skills, your roadmap will be generated from the gaps."
            action={
              <Link to="/career" className="btn-ghost text-sm">
                Back to career
              </Link>
            }
          />
        </div>
      )}

      {!loading && !error && !targetRole && (
        <div className="mt-10">
          <EmptyState
            title="No target role yet"
            description="Your learning path is generated from the skills your target role needs. Pick one to get started."
            action={
              <Link to="/career" className="btn-primary text-sm">
                Choose a target role
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      )}

      {/* Journey stages */}
      {!loading && !error && grouped.length > 0 && (
        <div className="mt-10">
          {actionError && (
            <p className="mb-5 rounded-xl bg-[#fdeee2] px-4 py-3 text-sm text-[#9a4303]" role="alert">
              {actionError}
            </p>
          )}

          <div className="space-y-0">
            {grouped.map((group, groupIndex) => (
              <Reveal key={group.stage} delay={groupIndex * 60}>
                <div className="relative border-l-2 border-[rgba(14,36,32,0.15)] pb-12 pl-8 last:pb-0 sm:pl-10">
                  {/* Stage node */}
                  <span
                    className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#f7f4ee] ${
                      group.skills.every((skill) => (progressFor(skill.skill_name)?.status === 'Completed'))
                        ? 'bg-[#2e7d5b]'
                        : 'bg-[#e8720c]'
                    }`}
                  >
                    {group.skills.every((skill) => progressFor(skill.skill_name)?.status === 'Completed') ? (
                      <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c25a04]">
                    Stage {groupIndex + 1} · {group.stage}
                  </p>

                  <div className="mt-4 space-y-4">
                    {group.skills.map((skill) => {
                      const record = progressFor(skill.skill_name);
                      const currentProgress = record ? Number(record.progress_percentage) : 0;
                      const courses = coursesFor(skill.skill_name);

                      return (
                        <div key={skill.skill_name} className="quiet-card p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-[#0e2420]">{skill.skill_name}</h3>
                                {skill.is_mandatory && (
                                  <span className="rounded-full bg-[#fdeee2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#c25a04]">
                                    Mandatory
                                  </span>
                                )}
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                    skill.priority === 'High'
                                      ? 'bg-[#fdeee2] text-[#c25a04]'
                                      : 'bg-[rgba(14,36,32,0.06)] text-[#5b7169]'
                                  }`}
                                >
                                  {skill.priority} priority
                                </span>
                              </div>
                              {record && (
                                <p className="mt-1 text-xs text-[#5b7169]">
                                  Status: {record.status} · {Math.round(currentProgress)}% done
                                </p>
                              )}
                            </div>

                            {!record ? (
                              <button
                                type="button"
                                onClick={() => startLearning(skill.skill_name)}
                                disabled={busySkill === skill.skill_name}
                                className="btn-primary text-xs disabled:opacity-60"
                              >
                                <Play className="h-3.5 w-3.5" />
                                {busySkill === skill.skill_name ? 'Starting…' : 'Start learning'}
                              </button>
                            ) : record.status !== 'Completed' ? (
                              <button
                                type="button"
                                onClick={() => advance(skill.skill_name, currentProgress)}
                                disabled={busySkill === skill.skill_name}
                                className="btn-ghost text-xs disabled:opacity-60"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                                {busySkill === skill.skill_name ? 'Saving…' : 'Advance +25%'}
                              </button>
                            ) : (
                              <span className="flex items-center gap-1.5 rounded-full bg-[#e4f2ea] px-3 py-1.5 text-xs font-bold text-[#2e7d5b]">
                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                Completed
                              </span>
                            )}
                          </div>

                          {record && (
                            <div className="mt-3">
                              <ScoreBar value={currentProgress} />
                            </div>
                          )}

                          {courses.length > 0 && (
                            <div className="mt-4 border-t border-[rgba(14,36,32,0.08)] pt-3.5">
                              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5b7169]">
                                <BookOpen className="h-3.5 w-3.5" />
                                Recommended courses
                              </p>
                              <div className="mt-2 space-y-1.5">
                                {courses.slice(0, 3).map((course) => (
                                  <p key={course.id} className="text-xs text-[#294b43]">
                                    <strong>{course.course_title}</strong>
                                    {course.provider ? ` · ${course.provider}` : ''}
                                    {course.duration ? ` · ${course.duration}` : ''}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
