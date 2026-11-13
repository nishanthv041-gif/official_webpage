import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  MonitorPlay,
  Trophy,
  ShieldCheck,
  Bus,
  Palette,
  Compass,
  Target,
  CheckCircle2
} from 'lucide-react';
import { WhyChooseItem } from '../data/schoolData';
import { useSchoolConfig } from '../context/SchoolContext';
import { SafeImage } from './SafeImage';

const ICON_MAP: Record<WhyChooseItem['iconName'], React.FC<{ className?: string }>> = {
  GraduationCap,
  MonitorPlay,
  Trophy,
  ShieldCheck,
  Bus,
  Palette
};

export const AboutAndStats: React.FC = () => {
  const { config } = useSchoolConfig();
  const { correspondent, about, whyChooseUs, statistics, permissions } = config;
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(statistics.map((s) => s.value));

  useEffect(() => {
    setCounts(statistics.map((s) => s.value));
  }, [statistics]);

  useEffect(() => {
    const node = statsRef.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const startTime = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(
              statistics.map((stat) =>
                progress === 1 ? stat.value : Math.max(1, Math.round(stat.value * eased))
              )
            );
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated, statistics]);

  return (
    <>
      {/* SECTION 2: ABOUT US & CORRESPONDENT MESSAGE */}
      <section
        id="about"
        className="scroll-mt-16 py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header & History Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                About {config.name} · Established 2004
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {about.historyTitle}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {about.historyText}
              </p>

              {/* Key Highlights Row */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {about.keyHighlights.map((hl, idx) => (
                  <div
                    key={`${hl.label}-${idx}`}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400">{hl.label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {hl.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Custom School Details configured in Admin Settings */}
              {config.additionalDetails && config.additionalDetails.length > 0 && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {config.additionalDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="px-4 py-3 rounded-xl bg-blue-50/60 dark:bg-slate-800/40 border border-blue-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {detail.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-950 dark:text-amber-400 text-right">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vision & Mission Cards */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5 text-blue-900 dark:text-amber-400 font-display font-semibold text-lg">
                  <Compass className="w-5 h-5 shrink-0" />
                  <h3>Our Vision</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {about.vision}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5 text-blue-900 dark:text-amber-400 font-display font-semibold text-lg">
                  <Target className="w-5 h-5 shrink-0" />
                  <h3>Our Mission</h3>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  {about.mission.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Correspondent Welcome Message Feature Box */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Portrait Column */}
              <div className="lg:col-span-4 relative min-h-[340px] lg:min-h-full bg-slate-900">
                <SafeImage
                  src={correspondent.photo}
                  alt={`Correspondent ${correspondent.name}`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-6 text-white">
                  <div className="font-display text-xl font-bold tracking-tight">
                    {correspondent.name}
                  </div>
                  <div className="text-xs text-amber-400 font-medium mt-0.5">
                    {correspondent.designation}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {correspondent.qualifications}
                  </div>
                </div>
              </div>

              {/* Welcome Letter Column */}
              <div className="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-blue-900 dark:text-amber-400 tracking-wide">
                    From the Correspondent’s Desk · {correspondent.name}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {correspondent.welcomeHeadline}
                  </h3>
                  {correspondent.welcomeMessage.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <blockquote className="text-sm italic text-slate-700 dark:text-slate-300 max-w-xl">
                    “{correspondent.quote}”
                  </blockquote>
                  <div className="shrink-0 text-right">
                    <div className="font-display font-bold text-slate-900 dark:text-white text-base">
                      {correspondent.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Correspondent, {config.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY CHOOSE SRT SCHOOL */}
      <section
        id="why-srt"
        className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
              The SRT Advantage · Holistic K-12 Ecosystem
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Why Families Across Tamil Nadu Trust {config.name}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Every aspect of our campus—from faculty mentorship to student safety and athletics—is engineered for measurable student growth.
            </p>
          </div>

          {/* Asymmetric Bento Capability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => {
              const IconComponent = ICON_MAP[item.iconName] || GraduationCap;
              return (
                <div
                  key={item.id}
                  className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-800/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-blue-950 dark:bg-amber-500/15 text-amber-400 flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {item.number}. {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-blue-900 dark:text-amber-400">
                    {item.metric}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: ANIMATED STATISTICS */}
      {permissions.showStatistics && (
        <section
          ref={statsRef}
          aria-label="School Impact Statistics"
          className="py-16 lg:py-20 bg-blue-950 text-white border-b border-blue-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.map((stat, idx) => (
                <div
                  key={stat.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-blue-800/60 space-y-2"
                >
                  <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 tabular-nums tracking-tight">
                    {(counts[idx] ?? stat.value).toLocaleString()}
                    {stat.suffix}
                  </div>
                  <div className="text-base font-semibold text-white">{stat.label}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
