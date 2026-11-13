import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  BellPlus,
  Check
} from 'lucide-react';
import { GalleryCategory } from '../data/schoolData';
import { useSchoolConfig } from '../context/SchoolContext';
import { filterGalleryItems, getLightboxIndex } from '../utils/schoolUtils';
import { SafeImage } from './SafeImage';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Annual Day',
  'Sports Day',
  'Cultural',
  'Festivals',
  'Achievements'
];

export const AcademicsAndGallery: React.FC = () => {
  const { config } = useSchoolConfig();
  const { facilitiesTabs, gallery, upcomingEvents, permissions } = config;

  // Academics & Facilities Tab State
  const [activeTabId, setActiveTabId] = useState<string>(facilitiesTabs[0]?.id || 'classes');
  const activeFacility =
    facilitiesTabs.find((tab) => tab.id === activeTabId) || facilitiesTabs[0];

  // Gallery Filter & Lightbox State
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Upcoming Events RSVP / Reminder State
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>({});

  const filteredGallery = filterGalleryItems(gallery, selectedCategory);

  const handleCategoryChange = (category: GalleryCategory) => {
    setSelectedCategory(category);
    setLightboxIndex(null);
  };

  const handleLightboxNav = (direction: 'next' | 'prev') => {
    if (lightboxIndex === null || filteredGallery.length === 0) return;
    setLightboxIndex(getLightboxIndex(lightboxIndex, filteredGallery.length, direction));
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleLightboxNav('next');
      if (e.key === 'ArrowLeft') handleLightboxNav('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const toggleEventRsvp = (eventId: string) => {
    setRsvpEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const currentLightboxItem =
    lightboxIndex !== null ? filteredGallery[lightboxIndex] : null;

  return (
    <>
      {/* SECTION 6: ACADEMICS & FACILITIES TABS */}
      <section
        id="academics"
        className="scroll-mt-16 py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                Academics & Campus Infrastructure
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                World-Class Facilities Designed for Deep Learning
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Explore our smart classrooms, specialized STEM robotics labs, central library, sports complex, and GPS-enabled transport network.
              </p>
            </div>

            {/* Interactive Segmented Tab Bar */}
            <div
              role="tablist"
              aria-label="Campus Facilities Tabs"
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300/60 dark:border-slate-800 shrink-0"
            >
              {facilitiesTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Facility Showcase Panel */}
          {activeFacility && (
            <div
              role="tabpanel"
              aria-label={activeFacility.label}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Facility Image */}
                <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] bg-slate-900">
                  <SafeImage
                    src={activeFacility.image}
                    alt={activeFacility.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white">
                    <div className="text-xs font-medium text-amber-400">
                      {activeFacility.subtitle}
                    </div>
                    <div className="text-sm font-semibold mt-0.5">
                      {activeFacility.capacity}
                    </div>
                  </div>
                </div>

                {/* Facility Content */}
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-blue-900 dark:text-amber-400">
                      {activeFacility.label} · {activeFacility.subtitle}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                      {activeFacility.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeFacility.description}
                    </p>

                    <div className="pt-2 space-y-2.5">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Key Infrastructure Highlights:
                      </div>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                        {activeFacility.highlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-900 dark:text-amber-400 shrink-0" />
                      <span>{activeFacility.timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-900 dark:text-amber-400 shrink-0" />
                      <span>{activeFacility.capacity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7: EVENTS & GALLERY */}
      {permissions.showGallery && (
        <section
          id="gallery"
          className="scroll-mt-16 py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Header & Filter Bar */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
              <div className="max-w-xl space-y-3">
                <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                  Campus Life & Vibrancy
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Events & Campus Photo Gallery
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-300">
                  Filter moments from our Annual Day, Sports Meet, Cultural Confluence, Festivals, and National Achievements. Click any photograph to open the full-screen viewer.
                </p>
              </div>

              {/* Category Filter Buttons */}
              <div
                role="group"
                aria-label="Gallery Category Filter"
                className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
              >
                {GALLERY_CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View photo: ${item.title}`}
                  className="group text-left rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-800/50 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-3 right-3 w-9 h-9 rounded-lg bg-slate-950/75 text-white flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-amber-400 font-medium">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500 dark:text-slate-400">{item.date}</span>
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Upcoming Events Calendar Strip */}
            <div className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-blue-800 dark:text-amber-400">
                    Academic & Co-Curricular Calendar
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Upcoming Campus Events
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Parents & visitors can register for campus event reminders below
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((evt) => {
                  const isRegistered = Boolean(rsvpEvents[evt.id]);
                  return (
                    <div
                      key={evt.id}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-16 rounded-xl bg-blue-950 text-white flex flex-col items-center justify-center shrink-0 border border-blue-800">
                          <span className="text-[11px] font-semibold tracking-wider text-amber-400">
                            {evt.month}
                          </span>
                          <span className="font-display text-xl font-bold tabular-nums leading-none mt-0.5">
                            {evt.day}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-xs text-blue-900 dark:text-amber-400 font-medium">
                            {evt.category} · {evt.time}
                          </div>
                          <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                            {evt.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleEventRsvp(evt.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isRegistered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950'
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Reminder Set</span>
                            </>
                          ) : (
                            <>
                              <BellPlus className="w-3.5 h-3.5" />
                              <span>Remind Me</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lightbox Modal Dialog */}
          {currentLightboxItem && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Photo Lightbox: ${currentLightboxItem.title}`}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            >
              <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 text-white">
                  <div className="text-xs sm:text-sm font-medium text-slate-300">
                    <span className="text-amber-400 font-semibold">
                      {currentLightboxItem.category}
                    </span>{' '}
                    · {currentLightboxItem.date} · Photo {(lightboxIndex ?? 0) + 1} of{' '}
                    {filteredGallery.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    aria-label="Close photo lightbox"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative h-[320px] sm:h-[460px] bg-slate-950 flex items-center justify-center">
                  <SafeImage
                    src={currentLightboxItem.image}
                    alt={currentLightboxItem.title}
                    className="w-full h-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => handleLightboxNav('prev')}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLightboxNav('next')}
                    aria-label="Next photo"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 bg-slate-900 text-white space-y-1.5">
                  <h3 className="font-display text-lg font-bold">{currentLightboxItem.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentLightboxItem.caption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
