/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutAndStats } from './components/AboutAndStats';
import { AdmissionsSection } from './components/AdmissionsSection';
import { AcademicsAndGallery } from './components/AcademicsAndGallery';
import { AchievementsAndNews } from './components/AchievementsAndNews';
import { ContactAndFooter } from './components/ContactAndFooter';
import { AdminSettingsPage } from './components/AdminSettingsPage';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'public'
  );

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <SchoolProvider>
      {viewMode === 'admin' ? (
        <AdminSettingsPage
          onBackToSite={() => {
            if (window.location.hash === '#admin') {
              window.history.pushState('', document.title, window.location.pathname);
            }
            setViewMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
          {/* Sticky Navigation Bar */}
          <Navbar />

          {/* Main Content Flow */}
          <main className="flex-1">
            {/* 1. Hero Section + Announcement Ticker */}
            <HeroSection />

            {/* 2. About Us (Correspondent PRANAV.J), 3. Why Choose SRT, 4. Animated Statistics */}
            <AboutAndStats />

            {/* 5. Admissions (Timeline, Eligibility, Documents, Prospectus & Online Form) */}
            <AdmissionsSection />

            {/* 6. Academics & Facilities Tabs, 7. Events & Gallery + Lightbox + Calendar */}
            <AcademicsAndGallery />

            {/* 8. Achievements & Testimonials Carousel, 9. News & Announcements */}
            <AchievementsAndNews />

            {/* 10. Contact Us & Map, 11. Social Media Hub, 12. Footer */}
            <ContactAndFooter
              onOpenAdmin={() => {
                setViewMode('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </main>
        </div>
      )}
    </SchoolProvider>
  );
}
