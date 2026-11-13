import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, PhoneCall } from 'lucide-react';
import { useSchoolConfig } from '../context/SchoolContext';
import { SafeImage } from './SafeImage';

export const HeroSection: React.FC = () => {
  const { config } = useSchoolConfig();
  const slides = config.heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="hero" className="relative bg-slate-950 text-white overflow-hidden">
      {/* Scrolling Announcements Bar */}
      {config.permissions.showAnnouncementBanner && (
        <div className="bg-blue-950 text-slate-100 border-b border-blue-900/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 overflow-hidden">
            <span
              className={`text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 ${
                config.permissions.admissionsOpen ? 'text-amber-400' : 'text-red-300'
              }`}
            >
              {config.permissions.admissionsOpen
                ? `Admissions Open ${config.academicYear}:`
                : `Admissions Closed (${config.academicYear}):`}
            </span>
            <div className="overflow-hidden relative w-full">
              <div className="animate-marquee flex items-center gap-8 text-xs text-slate-200 whitespace-nowrap">
                {[...config.announcementsTicker, ...config.announcementsTicker].map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-8">
                    <span>{item}</span>
                    <span aria-hidden="true" className="text-amber-400/70">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Slideshow Area */}
      {activeSlide && (
        <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <SafeImage
              key={activeSlide.id}
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover object-center transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </div>

          {/* Foreground Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            <div className="max-w-3xl space-y-6">
              {/* Unboxed Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-amber-400 tracking-wide">
                <span>{activeSlide.subtitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{config.affiliationCode}</span>
              </div>

              {/* Dominant Hero Headline */}
              <h1
                className="font-display font-bold text-white tracking-tight leading-[1.12]"
                style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)' }}
              >
                {activeSlide.title}
              </h1>

              {/* Tagline & Description */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                {activeSlide.description}
              </p>

              {/* Primary & Secondary Call-To-Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#admissions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm sm:text-base shadow-sm transition-all whitespace-nowrap shrink-0"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm sm:text-base backdrop-blur-xs transition-all whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Contact Us</span>
                </a>
              </div>

              {/* Slide Proof Footnote & Controls */}
              <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-amber-400">Campus Highlight:</span>{' '}
                  <span>{activeSlide.highlightMetric}</span>
                </div>

                {/* Slideshow Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero Slides">
                    {slides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={currentSlide === idx}
                        aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-7 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Previous campus slide"
                      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Next campus slide"
                      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
