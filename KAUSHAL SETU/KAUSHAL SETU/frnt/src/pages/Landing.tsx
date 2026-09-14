import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowDown,
  ClipboardCheck,
  Compass,
  BookOpen,
  Briefcase,
  ScanSearch,
  Map,
  Route,
  Award,
} from 'lucide-react';
import BridgeCanvas from '../components/BridgeCanvas';
import Reveal from '../components/Reveal';
import { useAuth } from '../context/AuthContext';

const JOURNEY = [
  {
    icon: ScanSearch,
    step: '01',
    title: 'Map what you already know',
    body: 'Record the skills you have today — from classroom, workshop, or self-taught practice. Your profile becomes the starting point of the bridge.',
  },
  {
    icon: ClipboardCheck,
    step: '02',
    title: 'Prove it with an assessment',
    body: 'Short, discipline-specific tests grade your knowledge server-side and convert self-reported skill into a verified score employers can trust.',
  },
  {
    icon: Map,
    step: '03',
    title: 'See your career direction',
    body: 'Choose a target role and Kaushal Setu compares your verified profile against its real requirements — skill by skill, gap by gap.',
  },
  {
    icon: Route,
    step: '04',
    title: 'Walk the learning path',
    body: 'Missing skills become an ordered learning roadmap: foundation first, advanced last, with progress you can track as you go.',
  },
  {
    icon: Award,
    step: '05',
    title: 'Cross to employment',
    body: 'Verified skills rank you against live job postings. See your match score, what is missing, and apply where you genuinely fit.',
  },
];

const IMPACT = [
  { value: '1,000+', label: 'Skill assessments attempted across the platform' },
  { value: '15', label: 'Engineering disciplines covered, from civil to AI' },
  { value: '6 stages', label: 'One connected journey from skills to employment' },
];

function useScrolledPast(threshold: number) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const onScroll = () => setPassed(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return passed;
}

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroOffset, setHeroOffset] = useState(0);
  const scrolled = useScrolledPast(80);

  // Parallax: the hero content lifts gently as you begin the journey.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current && y < window.innerHeight) {
        setHeroOffset(y * 0.28);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryCta = isAuthenticated ? '/dashboard' : '/register';
  const primaryLabel = isAuthenticated ? 'Go to your dashboard' : 'Start your bridge';

  return (
    <div>
      {/* ============================= HERO ============================= */}
      <section
        ref={heroRef}
        className="ink-panel relative flex min-h-[92vh] flex-col overflow-hidden"
      >
        <div className="absolute inset-0" style={{ transform: `translateY(${heroOffset * 0.4}px)` }}>
          <BridgeCanvas />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(232,114,12,0.16), transparent 60%)',
          }}
        />

        <div
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8"
          style={{ transform: `translateY(${heroOffset * -0.5}px)`, opacity: 1 - Math.min(0.6, heroOffset / 500) }}
        >
          <span className="rounded-full border border-[rgba(247,244,238,0.25)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#f0a35c]">
            KAUSHAL SETU · कौशल सेतु
          </span>

          <h1 className="type-hero mt-8 max-w-5xl font-semibold text-[#f7f4ee]">
            Your skills already exist.
            <span className="block text-[#f0a35c]">We build the bridge.</span>
          </h1>

          <p className="type-lead mt-7 max-w-2xl text-[rgba(247,244,238,0.72)]">
            Kaushal Setu connects what you know to where you can go — verified
            assessments, a clear career direction, a learning path that closes
            your real gaps, and jobs that actually fit.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link to={primaryCta} className="btn-primary text-base">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-ghost-light text-base">
              See how it works
            </a>
          </div>
        </div>

        <div
          className={`relative z-10 flex justify-center pb-10 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden="true"
        >
          <ArrowDown className="h-5 w-5 animate-bounce text-[rgba(247,244,238,0.5)]" />
        </div>
      </section>

      {/* ========================= THE PROBLEM ========================= */}
      <section className="paper-texture mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#e8720c]">
              The gap
            </span>
            <h2 className="type-display mt-3 font-semibold text-[#0e2420]">
              Millions can do the work.
              <span className="block text-[#5b7169]">Few can prove it.</span>
            </h2>
            <div className="brush-underline mt-4 h-1 w-24 rounded-full bg-[#e8720c]/40" />
          </Reveal>

          <div className="space-y-8 lg:col-span-6 lg:col-start-7">
            <Reveal delay={100}>
              <p className="type-lead text-[#294b43]">
                Skills learned outside formal resumes stay invisible. Recruiters
                filter on credentials. Training budgets chase the wrong topics.
                Everyone loses.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-base leading-relaxed text-[#5b7169]">
                Kaushal Setu makes the invisible measurable. A candidate's
                verified skill profile speaks to employers in numbers; employers
                post exactly what they need; the platform computes the distance
                between the two — and builds the shortest path across it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== THE BRIDGE (STICKY) ===================== */}
      <section id="bridge" className="ink-panel relative overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#f0a35c]">
              The bridge
            </span>
            <h2 className="type-display mt-3 font-semibold text-[#f7f4ee]">
              One crossing. Five spans.
            </h2>
            <p className="type-lead mt-4 text-[rgba(247,244,238,0.7)]">
              Each span carries you closer to work you are actually ready for.
            </p>
          </Reveal>

          <div className="mt-16 space-y-0">
            {JOURNEY.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              return (
                <Reveal key={item.step} delay={index * 60}>
                  <div
                    className={`group flex flex-col gap-5 border-t border-[rgba(247,244,238,0.12)] py-10 md:flex-row md:items-center md:gap-12 ${
                      isEven ? '' : 'md:flex-row-reverse md:text-right'
                    }`}
                  >
                    <div className={`flex items-center gap-6 md:w-56 md:shrink-0 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                      <span className="font-display text-4xl font-semibold text-[rgba(247,244,238,0.18)] transition-colors duration-300 group-hover:text-[#f0a35c]/60">
                        {item.step}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(247,244,238,0.18)] text-[#f0a35c] transition-all duration-300 group-hover:border-[#f0a35c]/50 group-hover:bg-[#f0a35c]/10">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className={isEven ? '' : 'md:mr-auto'}>
                      <h3 className="font-display text-xl font-semibold text-[#f7f4ee]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[rgba(247,244,238,0.62)] md:ml-auto">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= HOW IT WORKS ========================= */}
      <section id="how-it-works" className="paper-texture mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#e8720c]">
              How it works
            </span>
            <h2 className="type-display mt-3 font-semibold text-[#0e2420]">
              Not another feed of jobs you can't get.
            </h2>
            <p className="type-lead mt-5 text-[#5b7169]">
              Every recommendation is computed from your own data: the skills you
              verified, the role you picked, and the real requirements of live
              postings. No black box, no lottery.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={primaryCta} className="btn-primary">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-ghost">
                I already have an account
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {[
              {
                icon: Compass,
                title: 'Career mapping',
                body: 'Pick a target role and watch your readiness score move as skills get verified.',
              },
              {
                icon: ScanSearch,
                title: 'Honest gap analysis',
                body: 'See exactly which skills separate you from each role — nothing vague.',
              },
              {
                icon: BookOpen,
                title: 'Learning that ranks',
                body: 'The roadmap orders skills by priority: mandatory first, biggest gap next.',
              },
              {
                icon: Briefcase,
                title: 'Matching, explained',
                body: 'Every match shows its math: which skills matched, which are missing, why the score.',
              },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={index * 80}>
                  <div className="quiet-card h-full p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdeee2] text-[#c25a04]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-[#0e2420]">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5b7169]">{card.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ IMPACT ============================ */}
      <section id="impact" className="border-y border-[rgba(14,36,32,0.1)] bg-[#efe9df] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {IMPACT.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="text-center sm:text-left">
              <p className="font-display text-4xl font-semibold text-[#0e2420] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#5b7169]">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================== FINAL CTA ========================== */}
      <section className="ink-panel relative overflow-hidden py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 50% 130%, rgba(232,114,12,0.2), transparent 65%)',
          }}
        />
        <Reveal className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="type-display font-semibold text-[#f7f4ee]">
            The bridge is built. The first step is yours.
          </h2>
          <p className="type-lead mt-5 text-[rgba(247,244,238,0.72)]">
            Create your profile, verify one skill today, and see your career
            direction by tonight.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={primaryCta} className="btn-primary text-base">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Landing;
