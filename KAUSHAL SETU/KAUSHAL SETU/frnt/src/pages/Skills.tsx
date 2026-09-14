import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, BadgeCheck, X } from 'lucide-react';
import { getApiErrorMessage, skillsApi, type UserSkill } from '../api/api';
import { EmptyState, ErrorState, Loading, ScoreBar } from '../components/AsyncState';
import { PageHeader } from '../components';
import Reveal from '../components/Reveal';

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skillInput, setSkillInput] = useState('');
  const [proficiency, setProficiency] = useState('intermediate');
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userSkills, allSkills] = await Promise.all([
        skillsApi.getUserSkills(),
        skillsApi.getAllSkills(),
      ]);
      const userData = userSkills.data as unknown as { skills: UserSkill[] };
      const allData = allSkills.data as unknown as { skills: { skill: string }[] };
      setSkills(userData.skills || []);
      setSuggestions((allData.skills || []).map((item) => item.skill));
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load your skills."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addSkill = async (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    setAdding(true);
    setActionError(null);
    try {
      await skillsApi.addUserSkill({ skill_name: trimmed, proficiency_level: proficiency });
      setSkillInput('');
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not add that skill.'));
    } finally {
      setAdding(false);
    }
  };

  const removeSkill = async (skillId: number) => {
    setActionError(null);
    try {
      await skillsApi.deleteUserSkill(skillId);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not remove that skill.'));
    }
  };

  const filteredSuggestions = suggestions
    .filter((skill) => !skills.some((owned) => owned.skill.toLowerCase() === skill.toLowerCase()))
    .filter((skill) =>
      skillInput.trim() ? skill.toLowerCase().includes(skillInput.trim().toLowerCase()) : true,
    )
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Your skill profile"
        title={
          <>
            What do you <span className="text-[#e8720c]">already know?</span>
          </>
        }
        description="Everything on this page feeds your job matches, career gaps, and learning roadmap. Verified skills (via assessments) carry the most weight."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        {/* Add skill panel */}
        <Reveal className="lg:col-span-5">
          <div className="quiet-card p-7">
            <h2 className="font-display text-lg font-semibold text-[#0e2420]">Add a skill</h2>
            <p className="mt-1 text-sm text-[#5b7169]">
              Type a skill you have, choose how confident you are, and add it.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                addSkill(skillInput);
              }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b7169]" />
                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  placeholder="e.g. Python, PLC Programming, AutoCAD"
                  className="field-input pl-10"
                  aria-label="Skill name"
                />
              </div>

              <select
                value={proficiency}
                onChange={(event) => setProficiency(event.target.value)}
                className="field-input"
                aria-label="Self-assessed proficiency"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={adding || !skillInput.trim()} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
                <Plus className="h-4 w-4" />
                {adding ? 'Adding…' : 'Add skill'}
              </button>
            </form>

            {filteredSuggestions.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5b7169]">
                  {skillInput.trim() ? 'Matches on the platform' : 'Popular on Kaushal Setu'}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {filteredSuggestions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="inline-flex items-center gap-1 rounded-full border border-[rgba(14,36,32,0.18)] bg-[#fffdf9] px-3 py-1.5 text-xs font-medium text-[#294b43] transition-colors hover:border-[#e8720c] hover:bg-[#fdeee2]"
                    >
                      <Plus className="h-3 w-3" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {actionError && (
              <p className="mt-4 rounded-lg bg-[#fdeee2] px-3 py-2 text-xs text-[#9a4303]" role="alert">
                {actionError}
              </p>
            )}
          </div>
        </Reveal>

        {/* Skill list */}
        <Reveal delay={100} className="lg:col-span-7">
          <div className="quiet-card h-fit p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#0e2420]">
                Your skills
                <span className="ml-2 rounded-full bg-[rgba(14,36,32,0.06)] px-2.5 py-0.5 text-xs font-bold text-[#5b7169]">
                  {skills.length}
                </span>
              </h2>
              <Link to="/assessment" className="text-sm font-semibold text-[#c25a04] hover:underline">
                Verify with an assessment
              </Link>
            </div>

            {loading ? (
              <div className="mt-6">
                <Loading rows={3} />
              </div>
            ) : error ? (
              <div className="mt-6">
                <ErrorState message={error} onRetry={load} />
              </div>
            ) : skills.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No skills yet"
                  description="Add your first skill on the left. Even one skill unlocks job matching."
                />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {skills.map((skill) => {
                  const score = skill.assessment_score;
                  const verified = score !== null && score >= 60;
                  return (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-4 rounded-xl border border-[rgba(14,36,32,0.1)] p-4 transition-colors hover:border-[rgba(14,36,32,0.25)]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#0e2420]">{skill.skill}</p>
                          {verified && (
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e4f2ea] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2e7d5b]">
                              <BadgeCheck className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="mt-2 max-w-xs">
                          {score !== null ? (
                            <ScoreBar value={score} label="Assessment score" />
                          ) : (
                            <p className="text-xs text-[#5b7169]">
                              Self-reported — verify it with an assessment
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        aria-label={`Remove ${skill.skill}`}
                        className="rounded-lg p-2 text-[#5b7169] transition-colors hover:bg-[#fdeee2] hover:text-[#c25a04]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Skills;
