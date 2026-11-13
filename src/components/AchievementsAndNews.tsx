import React, { useState } from 'react';
import {
  Award,
  Medal,
  Quote,
  ChevronLeft,
  ChevronRight,
  Bell,
  FileText,
  X
} from 'lucide-react';
import { NoticeItem } from '../data/schoolData';
import { useSchoolConfig } from '../context/SchoolContext';

export const AchievementsAndNews: React.FC = () => {
  const { config } = useSchoolConfig();
  const { toppers, awards, testimonials, notices, permissions } = config;
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  const currentTestimonial = testimonials[testimonialIdx] || testimonials[0];

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <>
      {/* SECTION 8: ACHIEVEMENTS, TOPPERS & PARENTS' TESTIMONIALS */}
      {permissions.showAchievements && (
        <section
          id="achievements"
          className="scroll-mt-16 py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                Proven Academic & Institutional Track Record
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Board Exam Toppers, Honours & Parent Voices
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Year after year, {config.name} scholars secure state ranks and admissions to premier institutions while our school is recognized for holistic innovation.
              </p>
            </div>

            {/* Board Exam Toppers Grid */}
            <div className="space-y-4">
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                <span>Recent Board Examination Toppers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {toppers.map((topper) => (
                  <div
                    key={topper.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {topper.grade}
                      </div>
                      <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        {topper.name}
                      </h4>
                      <div className="font-mono text-xl font-bold text-blue-900 dark:text-amber-400 tabular-nums">
                        {topper.score}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {topper.stream}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {topper.achievement}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Awards + Parent Testimonials Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400 font-display font-bold text-lg">
                    <Award className="w-5 h-5" />
                    <h3>Institutional Accolades</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    National and regional recognitions conferred upon {config.name}.
                  </p>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {awards.map((award) => (
                    <div key={award.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                      <div className="text-xs font-medium text-blue-900 dark:text-amber-400">
                        {award.year} · {award.issuer}
                      </div>
                      <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {award.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {award.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {currentTestimonial && (
                <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-blue-950 text-white border border-blue-900 flex flex-col justify-between space-y-8">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold tracking-wider text-amber-400">
                        Parent Testimonials · Verified Families
                      </div>
                      <Quote className="w-8 h-8 text-amber-400/40" />
                    </div>

                    <blockquote className="text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-medium">
                      “{currentTestimonial.quote}”
                    </blockquote>

                    <div className="text-xs sm:text-sm text-amber-400 font-medium">
                      Key Outcome: {currentTestimonial.outcome}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-bold text-base text-white">
                        {currentTestimonial.parentName}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {currentTestimonial.studentDetails} · {currentTestimonial.relationship}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handlePrevTestimonial}
                        aria-label="Previous parent testimonial"
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono text-slate-300 px-2 tabular-nums">
                        {testimonialIdx + 1} / {testimonials.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextTestimonial}
                        aria-label="Next parent testimonial"
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: NEWS & ANNOUNCEMENTS */}
      {permissions.showNews && (
        <section
          id="news"
          className="scroll-mt-16 py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                  Official Circulars & Updates
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Latest News & Announcements
                </h2>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Updated for Academic Session {config.academicYear}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <article
                  key={notice.id}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-amber-400 font-medium">
                      <span>{notice.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{notice.date}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {notice.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notice.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80">
                    <button
                      type="button"
                      onClick={() => setActiveNotice(notice)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Full Circular</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {activeNotice && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={activeNotice.title}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-blue-900 dark:text-amber-400">
                      {activeNotice.category} · {activeNotice.date}
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {activeNotice.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNotice(null)}
                    aria-label="Close circular dialog"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeNotice.fullText}
                </p>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Issued by Office of the Correspondent ({config.correspondent.name})</span>
                  <button
                    type="button"
                    onClick={() => setActiveNotice(null)}
                    className="px-4 py-2 rounded-lg bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
