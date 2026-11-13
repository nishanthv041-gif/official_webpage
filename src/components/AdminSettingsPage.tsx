import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  MapPin,
  Phone,
  GraduationCap,
  Shield,
  Calendar,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Navigation,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useSchoolConfig } from '../context/SchoolContext';
import {
  verifyAdminPassword,
  validatePasswordChange,
  parseGoogleMapsInput,
  isShortGoogleMapsUrl
} from '../utils/schoolUtils';
import type { GalleryCategory, SchoolPermissions } from '../data/schoolData';
import { SafeImage } from './SafeImage';

interface AdminSettingsPageProps {
  onBackToSite: () => void;
}

type AdminTab =
  | 'general'
  | 'contact-socials'
  | 'admissions'
  | 'photos-gallery'
  | 'events-news'
  | 'permissions-security';

const GALLERY_CATEGORIES_EDIT: Exclude<GalleryCategory, 'All'>[] = [
  'Annual Day',
  'Sports Day',
  'Cultural',
  'Festivals',
  'Achievements'
];

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ onBackToSite }) => {
  const {
    config,
    updateConfig,
    resetConfigToDefaults,
    adminPassword,
    updateAdminPassword,
    isAdminUnlocked,
    setIsAdminUnlocked,
    enquiries,
    deleteEnquiry
  } = useSchoolConfig();

  // Lock screen state
  const [passwordInput, setPasswordInput] = useState('');
  const [showLockPass, setShowLockPass] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedLocation, setCopiedLocation] = useState(false);

  // Password Change state (Old, New, Confirm)
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // New Gallery Photo state
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] =
    useState<Exclude<GalleryCategory, 'All'>>('Annual Day');
  const [newPhotoDate, setNewPhotoDate] = useState('March 2026');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // New Additional School Detail state
  const [newDetailLabel, setNewDetailLabel] = useState('');
  const [newDetailValue, setNewDetailValue] = useState('');

  // New Eligibility Row state
  const [newEligLevel, setNewEligLevel] = useState('');
  const [newEligAge, setNewEligAge] = useState('');
  const [newEligMedium, setNewEligMedium] = useState('CBSE & State Board · English / Tamil Medium');

  // New Event state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventMonth, setNewEventMonth] = useState('JUN');
  const [newEventDay, setNewEventDay] = useState('15');
  const [newEventTime, setNewEventTime] = useState('9:30 AM – 12:30 PM');
  const [newEventVenue, setNewEventVenue] = useState('Main Auditorium');
  const [newEventDesc, setNewEventDesc] = useState('');

  // New Topper state
  const [newTopperName, setNewTopperName] = useState('');
  const [newTopperGrade, setNewTopperGrade] = useState('Class XII (CBSE)');
  const [newTopperScore, setNewTopperScore] = useState('496 / 500 (99.2%)');
  const [newTopperStream, setNewTopperStream] = useState('');
  const [newTopperAchievement, setNewTopperAchievement] = useState('');

  // New Notice state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState('April 2026');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Official Circular');
  const [newNoticeSummary, setNewNoticeSummary] = useState('');

  // New Testimonial state
  const [newTestParent, setNewTestParent] = useState('');
  const [newTestStudent, setNewTestStudent] = useState('');
  const [newTestQuote, setNewTestQuote] = useState('');
  const [newTestOutcome, setNewTestOutcome] = useState('');

  // Location paste input state
  const [rawMapInput, setRawMapInput] = useState(config.contact.locationShareLink);
  const [resolvingMap, setResolvingMap] = useState(false);
  const [resolvedMapLabel, setResolvedMapLabel] = useState(
    () => parseGoogleMapsInput(config.contact.locationShareLink).label
  );

  // Confirm reset state
  const [confirmReset, setConfirmReset] = useState(false);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput.trim(), adminPassword)) {
      setIsAdminUnlocked(true);
      setLockError(null);
      setPasswordInput('');
    } else {
      setLockError('Incorrect admin password. Please enter the valid lock password.');
    }
  };

  // Convert local file upload to Data URL so non-technical admins can upload photos from device
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
        triggerToast('Photo uploaded and saved.');
      }
    };
    reader.readAsDataURL(file);
  };

  const applyAndResolveLocationLink = async (inputStr: string, showToastMsg = true) => {
    const cleanInput = (inputStr || '').trim();
    if (!cleanInput) return;

    const initialParsed = parseGoogleMapsInput(cleanInput);
    setResolvedMapLabel(initialParsed.label);

    updateConfig((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        locationShareLink: initialParsed.shareUrl,
        googleMapsEmbedUrl: initialParsed.embedUrl
      }
    }));

    // If it is an uncached short link (e.g. a new maps.app.goo.gl link), expand it via backend /api/resolve-map-link
    if (isShortGoogleMapsUrl(cleanInput) && initialParsed.isShortLink) {
      setResolvingMap(true);
      try {
        const resp = await fetch(`/api/resolve-map-link?url=${encodeURIComponent(cleanInput)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.embedUrl) {
            setResolvedMapLabel(data.label || 'Live School Location');
            updateConfig((prev) => ({
              ...prev,
              contact: {
                ...prev.contact,
                locationShareLink: data.shareUrl || cleanInput,
                googleMapsEmbedUrl: data.embedUrl
              }
            }));
          }
        }
      } catch {
        // Fallback already applied
      } finally {
        setResolvingMap(false);
      }
    }

    if (showToastMsg) {
      triggerToast('Live Google Map location updated and active.');
    }
  };

  const handleApplyMapLink = () => {
    applyAndResolveLocationLink(rawMapInput, true);
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setRawMapInput(text.trim());
          await applyAndResolveLocationLink(text.trim(), true);
          return;
        }
      }
    } catch {
      // If clipboard read is blocked in iframe, apply whatever is currently in rawMapInput
    }
    if (rawMapInput.trim()) {
      await applyAndResolveLocationLink(rawMapInput.trim(), true);
    }
  };

  const handleCopyLocationLink = () => {
    const link = config.contact.locationShareLink || config.contact.googleMapsEmbedUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 2000);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validatePasswordChange(oldPass, adminPassword, newPass, confirmPass);
    if (!res.valid) {
      setPassMessage({ type: 'error', text: res.error || 'Password validation failed.' });
      return;
    }
    updateAdminPassword(newPass);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setPassMessage({
      type: 'success',
      text: 'Admin lock password updated! Use your new password next time you unlock the Admin page.'
    });
    triggerToast('Admin lock password changed.');
  };

  const handlePermissionToggle = (key: Exclude<keyof SchoolPermissions, 'siteTheme'>) => {
    updateConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
    triggerToast('Website setting updated.');
  };

  const handleSetTheme = (theme: 'light' | 'dark') => {
    updateConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        siteTheme: theme
      }
    }));
    triggerToast(`Website theme set to ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Admin Only).`);
  };

  const handleSetAdmissionOpen = (open: boolean) => {
    updateConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        admissionsOpen: open
      }
    }));
    triggerToast(open ? 'Admissions set to OPEN.' : 'Admissions set to CLOSED.');
  };

  const handleAddGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;
    const newItem = {
      id: `gal-${Date.now()}`,
      title: newPhotoTitle.trim(),
      category: newPhotoCategory,
      date: newPhotoDate.trim() || '2026',
      image: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || newPhotoTitle.trim(),
      aspect: 'standard' as const
    };
    updateConfig((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery]
    }));
    setNewPhotoTitle('');
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    triggerToast('New photo added to gallery.');
  };

  const handleAddAdditionalDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDetailLabel.trim() || !newDetailValue.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      additionalDetails: [
        ...(prev.additionalDetails || []),
        {
          id: `add-${Date.now()}`,
          label: newDetailLabel.trim(),
          value: newDetailValue.trim()
        }
      ]
    }));
    setNewDetailLabel('');
    setNewDetailValue('');
    triggerToast('Additional school detail added.');
  };

  const handleAddEligibilityRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEligLevel.trim() || !newEligAge.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      admissions: {
        ...prev.admissions,
        eligibility: [
          ...prev.admissions.eligibility,
          {
            level: newEligLevel.trim(),
            ageCriteria: newEligAge.trim(),
            medium: newEligMedium.trim() || 'CBSE & State Board'
          }
        ]
      }
    }));
    setNewEligLevel('');
    setNewEligAge('');
    triggerToast('Eligibility criteria added.');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      upcomingEvents: [
        ...prev.upcomingEvents,
        {
          id: `evt-${Date.now()}`,
          date: '2026',
          month: newEventMonth.trim() || 'JUN',
          day: newEventDay.trim() || '01',
          title: newEventTitle.trim(),
          category: 'Campus Event',
          time: newEventTime.trim() || '9:00 AM',
          venue: newEventVenue.trim() || 'School Campus',
          description: newEventDesc.trim() || newEventTitle.trim()
        }
      ]
    }));
    setNewEventTitle('');
    setNewEventDesc('');
    triggerToast('Upcoming event added.');
  };

  const handleAddTopper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopperName.trim() || !newTopperScore.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      toppers: [
        ...prev.toppers,
        {
          id: `top-${Date.now()}`,
          name: newTopperName.trim(),
          grade: newTopperGrade.trim() || 'Class XII',
          score: newTopperScore.trim(),
          stream: newTopperStream.trim() || 'Distinction Scholar',
          achievement: newTopperAchievement.trim() || 'School Topper'
        }
      ]
    }));
    setNewTopperName('');
    setNewTopperStream('');
    setNewTopperAchievement('');
    triggerToast('New topper added.');
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeSummary.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      notices: [
        {
          id: `not-${Date.now()}`,
          date: newNoticeDate.trim() || 'April 2026',
          category: newNoticeCategory.trim() || 'Circular',
          title: newNoticeTitle.trim(),
          summary: newNoticeSummary.trim(),
          fullText: newNoticeSummary.trim(),
          attachmentLabel: 'View Circular'
        },
        ...prev.notices
      ]
    }));
    setNewNoticeTitle('');
    setNewNoticeSummary('');
    triggerToast('New notice published.');
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestParent.trim() || !newTestQuote.trim()) return;
    updateConfig((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          id: `test-${Date.now()}`,
          parentName: newTestParent.trim(),
          studentDetails: newTestStudent.trim() || 'SRT School Parent',
          relationship: 'Verified Parent',
          quote: newTestQuote.trim(),
          outcome: newTestOutcome.trim() || 'Holistic Student Excellence'
        }
      ]
    }));
    setNewTestParent('');
    setNewTestStudent('');
    setNewTestQuote('');
    setNewTestOutcome('');
    triggerToast('Parent testimonial added.');
  };

  // ============================================================================
  // 1. LOCK SCREEN GATE (IF NOT UNLOCKED)
  // ============================================================================
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <span>{config.name} · Admin Security Gate</span>
          </div>
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to School Website</span>
          </button>
        </div>

        <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-400">Protected Administrator Area</div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                Admin Lock Screen
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Enter the administrator lock password to access full settings for admissions open/close, dark/light theme, Google Map live location link, photos, and all school content.
          </p>

          {lockError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{lockError}</span>
            </div>
          )}

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-lock-password"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Admin Lock Password
              </label>
              <div className="relative">
                <input
                  id="admin-lock-password"
                  type={showLockPass ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (lockError) setLockError(null);
                  }}
                  placeholder="Enter admin lock password"
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLockPass((p) => !p)}
                  aria-label={showLockPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showLockPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Settings</span>
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          © 2026 {config.name} · Administrative Control System
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. UNLOCKED ADMIN & SETTINGS DASHBOARD
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm sm:text-base leading-tight">
                {config.name} – Admin & Settings Control Center
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>All changes automatically saved to live website</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-700 px-2.5 py-1 rounded-lg text-xs">
                <span className="text-red-200">Reset all?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetConfigToDefaults();
                    setConfirmReset(false);
                    triggerToast('Restored default school content.');
                  }}
                  className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 cursor-pointer"
                >
                  No
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsAdminUnlocked(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Live Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {saveToast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Settings Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ====================================================================
            MASTER QUICK SETTINGS BAR (ADMISSIONS OPEN/CLOSE, ADMIN-ONLY THEME,
            AND GOOGLE MAP LIVE LOCATION PASTE LINK)
        ==================================================================== */}
        <section
          aria-label="Master Quick Settings"
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-900/20 dark:border-amber-500/30 shadow-xs space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-900 dark:text-amber-400" />
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Master Quick Settings Control Panel
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Instant controls for Admission Status, Admin-Only Website Theme, and Google Map Live Location Link
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* 1. Admission Open / Close Setting */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1. Admission Status Control
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  Online Admissions ({config.academicYear})
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetAdmissionOpen(true)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    config.permissions.admissionsOpen
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Admissions OPEN</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAdmissionOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    !config.permissions.admissionsOpen
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admissions CLOSED</span>
                </button>
              </div>
            </div>

            {/* 2. Dark & Light Mode Theme Control (Admin Only) */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Website Theme (Admin Only)
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  Public Website Appearance Mode
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetTheme('light')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    config.permissions.siteTheme === 'light'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTheme('dark')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    config.permissions.siteTheme === 'dark'
                      ? 'bg-blue-950 text-amber-400 border border-amber-400/40 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* 3. Google Map Live Location Paste Link */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    3. Google Map Live Location Link
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    Paste Location Link or GPS Pin
                  </div>
                </div>
                <a
                  href={config.contact.locationShareLink || config.contact.googleMapsEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950 dark:bg-slate-800 text-amber-400 text-[11px] font-semibold shrink-0 hover:bg-blue-900"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Live Map</span>
                </a>
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  aria-label="Quick Paste Google Map Live Location Link"
                  value={rawMapInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRawMapInput(val);
                    if (
                      val.includes('maps.app.goo.gl') ||
                      val.includes('google.com/maps') ||
                      val.includes('goo.gl/maps')
                    ) {
                      applyAndResolveLocationLink(val, false);
                    }
                  }}
                  placeholder="Paste Google Maps live location link..."
                  className="flex-1 min-w-0 px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="px-2.5 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-semibold cursor-pointer shrink-0"
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={handleApplyMapLink}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shrink-0"
                >
                  {resolvingMap ? 'Loading...' : 'Apply'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Map Preview & Location Verification Bar directly inside Master Quick Settings */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Live Resolved Location:</span>
                <span className="text-blue-900 dark:text-amber-400 font-bold">
                  {resolvedMapLabel}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLocationLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {copiedLocation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>
                <a
                  href={config.contact.locationShareLink || config.contact.googleMapsEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
            <div className="h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
              <iframe
                key={config.contact.googleMapsEmbedUrl}
                title="Master Quick Settings Live Map Preview"
                src={config.contact.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Settings Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Admin Settings Sections"
          className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          {[
            { id: 'general', label: '1. School, Correspondent & Custom Details', icon: GraduationCap },
            { id: 'contact-socials', label: '2. Contact, Live Location & Socials', icon: MapPin },
            { id: 'admissions', label: '3. Admissions Control & Enquiries', icon: Calendar },
            { id: 'photos-gallery', label: '4. All Photos, Facilities & Gallery', icon: ImageIcon },
            { id: 'events-news', label: '5. Events, Toppers, Awards & News', icon: Phone },
            { id: 'permissions-security', label: '6. Permissions, Theme & Password', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            TAB 1: GENERAL, CORRESPONDENT, CUSTOM DETAILS, WHY SRT & STATS
        ==================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* School Identity Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">Core School Identity & Streams</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">School Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Academic Year</label>
                  <input
                    type="text"
                    value={config.academicYear}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, academicYear: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Affiliation & School Code</label>
                  <input
                    type="text"
                    value={config.affiliationCode}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, affiliationCode: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Board & Medium</label>
                  <input
                    type="text"
                    value={config.boardAndMedium}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, boardAndMedium: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Classes Offered</label>
                  <input
                    type="text"
                    value={config.classesOffered}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, classesOffered: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">School Tagline</label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) =>
                      updateConfig((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Additional Custom School Details (Add / Edit / Delete Other Details) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Additional School Details (Add & Edit Custom Details)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Add or edit any additional school information (such as UDISE+ Code, Principal Name, Exam Center Info, Bus Helpline, or Scholarship Details).
                </p>
              </div>

              <form
                onSubmit={handleAddAdditionalDetail}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  placeholder="Detail Label (e.g. Principal Name / UDISE Code) *"
                  value={newDetailLabel}
                  onChange={(e) => setNewDetailLabel(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Detail Value (e.g. Dr. Kavitha R. / 33030901425) *"
                  value={newDetailValue}
                  onChange={(e) => setNewDetailValue(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Detail</span>
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(config.additionalDetails || []).map((detail, idx) => (
                  <div
                    key={detail.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={detail.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...(prev.additionalDetails || [])];
                          next[idx] = { ...next[idx], label: val };
                          return { ...prev, additionalDetails: next };
                        });
                      }}
                      className="w-2/5 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={detail.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...(prev.additionalDetails || [])];
                          next[idx] = { ...next[idx], value: val };
                          return { ...prev, additionalDetails: next };
                        });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          additionalDetails: (prev.additionalDetails || []).filter(
                            (d) => d.id !== detail.id
                          )
                        }))
                      }
                      aria-label={`Delete ${detail.label}`}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Correspondent Profile & Photo Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">
                Correspondent / Principal Profile & Photo
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <div className="h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <SafeImage
                      src={config.correspondent.photo}
                      alt={config.correspondent.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold">Correspondent Photo URL</label>
                    <input
                      type="text"
                      value={config.correspondent.photo}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          correspondent: { ...prev.correspondent, photo: e.target.value }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) =>
                            updateConfig((prev) => ({
                              ...prev,
                              correspondent: { ...prev.correspondent, photo: dataUrl }
                            }))
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Correspondent Name</label>
                      <input
                        type="text"
                        value={config.correspondent.name}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            correspondent: { ...prev.correspondent, name: e.target.value }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Designation</label>
                      <input
                        type="text"
                        value={config.correspondent.designation}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            correspondent: { ...prev.correspondent, designation: e.target.value }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Qualifications</label>
                      <input
                        type="text"
                        value={config.correspondent.qualifications}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            correspondent: { ...prev.correspondent, qualifications: e.target.value }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Welcome Headline</label>
                    <input
                      type="text"
                      value={config.correspondent.welcomeHeadline}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          correspondent: { ...prev.correspondent, welcomeHeadline: e.target.value }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Welcome Message (Paragraphs separated by blank line)
                    </label>
                    <textarea
                      rows={4}
                      value={config.correspondent.welcomeMessage.join('\n\n')}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          correspondent: {
                            ...prev.correspondent,
                            welcomeMessage: e.target.value.split(/\n\s*\n/).filter(Boolean)
                          }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Signature Quote</label>
                    <input
                      type="text"
                      value={config.correspondent.quote}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          correspondent: { ...prev.correspondent, quote: e.target.value }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Us, Mission, Highlights & Statistics Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">
                About Us History, Vision, Mission & Animated Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">History Section Title</label>
                  <input
                    type="text"
                    value={config.about.historyTitle}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        about: { ...prev.about, historyTitle: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Vision Statement</label>
                  <input
                    type="text"
                    value={config.about.vision}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        about: { ...prev.about, vision: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">School History Paragraph</label>
                <textarea
                  rows={3}
                  value={config.about.historyText}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      about: { ...prev.about, historyText: e.target.value }
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Mission Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  value={config.about.mission.join('\n')}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        mission: e.target.value.split('\n').filter(Boolean)
                      }
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold mb-3">Animated Counter Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {config.statistics.map((stat, idx) => (
                    <div
                      key={stat.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const lbl = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.statistics];
                            next[idx] = { ...next[idx], label: lbl };
                            return { ...prev, statistics: next };
                          });
                        }}
                        className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            updateConfig((prev) => {
                              const next = [...prev.statistics];
                              next[idx] = { ...next[idx], value: val };
                              return { ...prev, statistics: next };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono"
                        />
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => {
                            const suf = e.target.value;
                            updateConfig((prev) => {
                              const next = [...prev.statistics];
                              next[idx] = { ...next[idx], suffix: suf };
                              return { ...prev, statistics: next };
                            });
                          }}
                          placeholder="Suffix (+/%)"
                          className="w-16 px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        value={stat.detail}
                        onChange={(e) => {
                          const det = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.statistics];
                            next[idx] = { ...next[idx], detail: det };
                            return { ...prev, statistics: next };
                          });
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Choose SRT Cards Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">
                “Why Choose {config.name}” Advantage Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {config.whyChooseUs.map((card, idx) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="text-xs font-mono font-bold text-blue-900 dark:text-amber-400">
                      Card #{card.number}
                    </div>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.whyChooseUs];
                          next[idx] = { ...next[idx], title: val };
                          return { ...prev, whyChooseUs: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.whyChooseUs];
                          next[idx] = { ...next[idx], description: val };
                          return { ...prev, whyChooseUs: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      value={card.metric}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.whyChooseUs];
                          next[idx] = { ...next[idx], metric: val };
                          return { ...prev, whyChooseUs: next };
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-blue-900 dark:text-amber-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: CONTACT DETAILS, GOOGLE MAP LIVE LOCATION LINK & SOCIAL MEDIA
        ==================================================================== */}
        {activeTab === 'contact-socials' && (
          <div className="space-y-8">
            {/* Location Copy-Paste Link & Live Map Preview */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Google Map Live Location Paste Link
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Paste any Google Maps live location link, share URL, GPS coordinates (e.g. 12.9345, 80.1418), or embed code below.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLocationLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    {copiedLocation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Location Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Location Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={config.contact.locationShareLink || config.contact.googleMapsEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Map</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  aria-label="Paste Location Link or Address"
                  value={rawMapInput}
                  onChange={(e) => setRawMapInput(e.target.value)}
                  placeholder="Paste Google Maps live location link, GPS coordinates, or <iframe> code here..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                />
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
                >
                  Paste Link
                </button>
                <button
                  type="button"
                  onClick={handleApplyMapLink}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm cursor-pointer shrink-0"
                >
                  Apply Live Location Link
                </button>
              </div>

              <div className="h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <iframe
                  title="Admin Live Map Preview"
                  src={config.contact.googleMapsEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">Contact Numbers, Address & Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={config.contact.addressLine1}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, addressLine1: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Address Line 2 (City / PIN)</label>
                  <input
                    type="text"
                    value={config.contact.addressLine2}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, addressLine2: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Main Office Phone</label>
                  <input
                    type="text"
                    value={config.contact.phonePrimary}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phonePrimary: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Admissions Helpline Phone</label>
                  <input
                    type="text"
                    value={config.contact.phoneAdmissions}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phoneAdmissions: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Admissions Email</label>
                  <input
                    type="email"
                    value={config.contact.emailAdmissions}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, emailAdmissions: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">General Office Email</label>
                  <input
                    type="email"
                    value={config.contact.emailGeneral}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, emailGeneral: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">School & Office Working Hours</label>
                  <input
                    type="text"
                    value={config.contact.workingHours}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, workingHours: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">Social Media & WhatsApp Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    value={config.socials.facebook}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        socials: { ...prev.socials, facebook: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={config.socials.instagram}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        socials: { ...prev.socials, instagram: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={config.socials.youtube}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        socials: { ...prev.socials, youtube: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    WhatsApp Number (with country code, e.g. 919840172500)
                  </label>
                  <input
                    type="text"
                    value={config.socials.whatsappNumber}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        socials: { ...prev.socials, whatsappNumber: e.target.value }
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: ADMISSIONS OPEN/CLOSE CONTROL, STEPS, ELIGIBILITY & ENQUIRIES
        ==================================================================== */}
        {activeTab === 'admissions' && (
          <div className="space-y-8">
            {/* Master Admission Status Control */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Admissions Open / Close Setting & Banner Control
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Open or close online admission registrations across the website, customize the closed message, and edit required documents.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetAdmissionOpen(true)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                      config.permissions.admissionsOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Admissions OPEN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAdmissionOpen(false)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                      !config.permissions.admissionsOpen
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Admissions CLOSED
                  </button>
                </div>
              </div>

              {/* Custom Message Shown When Admissions Are Closed */}
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Message Shown When Admissions Are CLOSED
                </label>
                <textarea
                  rows={2}
                  value={config.admissions.closedMessage || ''}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      admissions: {
                        ...prev.admissions,
                        closedMessage: e.target.value
                      }
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Scrolling Ticker Announcements Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold">
                  Top Scrolling Announcement Banner Messages (One per line)
                </label>
                <textarea
                  rows={4}
                  value={config.announcementsTicker.join('\n')}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcementsTicker: e.target.value
                        .split('\n')
                        .filter((line) => line.trim() !== '')
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Required Documents & Fee Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Required Documents Checklist (One document per line)
                  </label>
                  <textarea
                    rows={6}
                    value={config.admissions.requiredDocuments.join('\n')}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        admissions: {
                          ...prev.admissions,
                          requiredDocuments: e.target.value.split('\n').filter(Boolean)
                        }
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Fee Structure & Scholarship Highlight Note
                  </label>
                  <textarea
                    rows={6}
                    value={config.admissions.feeHighlights}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        admissions: {
                          ...prev.admissions,
                          feeHighlights: e.target.value
                        }
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 4-Step Admission Process Timeline Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">
                Step-by-Step Admission Process Timeline
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.admissions.steps.map((st, idx) => (
                  <div
                    key={st.step}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-900 dark:text-amber-400">
                        {st.step}
                      </span>
                      <input
                        type="text"
                        value={st.timeline}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.admissions.steps];
                            next[idx] = { ...next[idx], timeline: val };
                            return {
                              ...prev,
                              admissions: { ...prev.admissions, steps: next }
                            };
                          });
                        }}
                        className="w-28 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.admissions.steps];
                          next[idx] = { ...next[idx], title: val };
                          return {
                            ...prev,
                            admissions: { ...prev.admissions, steps: next }
                          };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={st.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.admissions.steps];
                          next[idx] = { ...next[idx], description: val };
                          return {
                            ...prev,
                            admissions: { ...prev.admissions, steps: next }
                          };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Classes & Eligibility Criteria Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">
                Classes Offered & Eligibility Criteria (Add / Edit)
              </h2>

              <form
                onSubmit={handleAddEligibilityRow}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  placeholder="Class Wing (e.g. Pre-KG) *"
                  value={newEligLevel}
                  onChange={(e) => setNewEligLevel(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Age / Eligibility Criteria *"
                  value={newEligAge}
                  onChange={(e) => setNewEligAge(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Board / Medium"
                  value={newEligMedium}
                  onChange={(e) => setNewEligMedium(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Eligibility Row</span>
                </button>
              </form>

              <div className="space-y-3">
                {config.admissions.eligibility.map((row, idx) => (
                  <div
                    key={`${row.level}-${idx}`}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                  >
                    <input
                      type="text"
                      value={row.level}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.admissions.eligibility];
                          next[idx] = { ...next[idx], level: val };
                          return {
                            ...prev,
                            admissions: { ...prev.admissions, eligibility: next }
                          };
                        });
                      }}
                      className="sm:col-span-3 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={row.ageCriteria}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.admissions.eligibility];
                          next[idx] = { ...next[idx], ageCriteria: val };
                          return {
                            ...prev,
                            admissions: { ...prev.admissions, eligibility: next }
                          };
                        });
                      }}
                      className="sm:col-span-5 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      value={row.medium}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.admissions.eligibility];
                          next[idx] = { ...next[idx], medium: val };
                          return {
                            ...prev,
                            admissions: { ...prev.admissions, eligibility: next }
                          };
                        });
                      }}
                      className="sm:col-span-3 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          admissions: {
                            ...prev.admissions,
                            eligibility: prev.admissions.eligibility.filter((_, i) => i !== idx)
                          }
                        }))
                      }
                      aria-label={`Delete ${row.level}`}
                      className="sm:col-span-1 p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitted Admission Enquiries Log */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="font-display text-xl font-bold">
                Received Online Admission Enquiries ({enquiries.length})
              </h2>
              {enquiries.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No online admission enquiries submitted yet in this browser session.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.referenceId}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {enq.studentName} ·{' '}
                          <span className="text-blue-900 dark:text-amber-400">
                            {enq.classApplyingFor}
                          </span>{' '}
                          ({enq.boardPreference}, {enq.mediumPreference})
                        </div>
                        <div className="text-slate-600 dark:text-slate-300">
                          Parent: {enq.parentName} · Phone: {enq.phone} · Email: {enq.email}
                        </div>
                        {enq.message && (
                          <div className="text-slate-500 italic">“{enq.message}”</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {enq.referenceId}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteEnquiry(enq.referenceId)}
                          aria-label={`Delete enquiry ${enq.referenceId}`}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: ALL PHOTOS, HERO SLIDES, FACILITIES & GALLERY MANAGER
        ==================================================================== */}
        {activeTab === 'photos-gallery' && (
          <div className="space-y-8">
            {/* Hero Slideshow Photos & Text */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">Hero Banner Slideshow Photos & Text</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {config.heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="h-36 rounded-lg overflow-hidden bg-slate-900">
                      <SafeImage
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Slide Headline</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.heroSlides];
                            next[idx] = { ...next[idx], title: val };
                            return { ...prev, heroSlides: next };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Slide Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.heroSlides];
                            next[idx] = { ...next[idx], subtitle: val };
                            return { ...prev, heroSlides: next };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Image URL</label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.heroSlides];
                            next[idx] = { ...next[idx], image: val };
                            return { ...prev, heroSlides: next };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Slide Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) =>
                            updateConfig((prev) => {
                              const next = [...prev.heroSlides];
                              next[idx] = { ...next[idx], image: dataUrl };
                              return { ...prev, heroSlides: next };
                            })
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Academics & Campus Facilities Tabs Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">
                Academics & Campus Facilities Tabs (Photos & Content)
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {config.facilitiesTabs.map((fac, idx) => (
                  <div
                    key={fac.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div className="h-28 rounded-lg overflow-hidden bg-slate-900">
                        <SafeImage
                          src={fac.image}
                          alt={fac.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <input
                          type="text"
                          value={fac.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => {
                              const next = [...prev.facilitiesTabs];
                              next[idx] = { ...next[idx], label: val };
                              return { ...prev, facilitiesTabs: next };
                            });
                          }}
                          className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-blue-900 dark:text-amber-400"
                        />
                        <input
                          type="text"
                          value={fac.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig((prev) => {
                              const next = [...prev.facilitiesTabs];
                              next[idx] = { ...next[idx], title: val };
                              return { ...prev, facilitiesTabs: next };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={fac.image}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateConfig((prev) => {
                                const next = [...prev.facilitiesTabs];
                                next[idx] = { ...next[idx], image: val };
                                return { ...prev, facilitiesTabs: next };
                              });
                            }}
                            className="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer shrink-0">
                            <Upload className="w-3 h-3" />
                            <span>Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (dataUrl) =>
                                  updateConfig((prev) => {
                                    const next = [...prev.facilitiesTabs];
                                    next[idx] = { ...next[idx], image: dataUrl };
                                    return { ...prev, facilitiesTabs: next };
                                  })
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={fac.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.facilitiesTabs];
                          next[idx] = { ...next[idx], description: val };
                          return { ...prev, facilitiesTabs: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Add & Edit Photo Gallery */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="font-display text-xl font-bold">
                Events & Campus Photo Gallery ({config.gallery.length} Photos)
              </h2>

              {/* Add New Photo Form */}
              <form
                onSubmit={handleAddGalleryPhoto}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="text-sm font-bold">Add New Gallery Photo</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Photo Title *"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                  <select
                    value={newPhotoCategory}
                    onChange={(e) =>
                      setNewPhotoCategory(e.target.value as Exclude<GalleryCategory, 'All'>)
                    }
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    {GALLERY_CATEGORIES_EDIT.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Date (e.g. March 2026)"
                    value={newPhotoDate}
                    onChange={(e) => setNewPhotoDate(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Image URL or Upload File *"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-semibold cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (dataUrl) => setNewPhotoUrl(dataUrl))}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Caption description"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo to Gallery</span>
                </button>
              </form>

              {/* Existing Gallery Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {config.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900">
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((g) => g.id !== item.id)
                          }))
                        }
                        aria-label={`Delete ${item.title}`}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.gallery];
                          next[idx] = { ...next[idx], title: val };
                          return { ...prev, gallery: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.gallery];
                            next[idx] = { ...next[idx], image: val };
                            return { ...prev, gallery: next };
                          });
                        }}
                        className="flex-1 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer shrink-0">
                        <Upload className="w-3 h-3" />
                        <span>Replace</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (dataUrl) =>
                              updateConfig((prev) => {
                                const next = [...prev.gallery];
                                next[idx] = { ...next[idx], image: dataUrl };
                                return { ...prev, gallery: next };
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 5: EVENTS, TOPPERS, AWARDS, TESTIMONIALS & NEWS EDITOR
        ==================================================================== */}
        {activeTab === 'events-news' && (
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">Upcoming Campus Events (Add / Edit)</h2>

              <form
                onSubmit={handleAddEvent}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-6 gap-3"
              >
                <input
                  type="text"
                  placeholder="Month (APR)"
                  value={newEventMonth}
                  onChange={(e) => setNewEventMonth(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Day (25)"
                  value={newEventDay}
                  onChange={(e) => setNewEventDay(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Event Title *"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Time & Venue"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {config.upcomingEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={evt.month}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.upcomingEvents];
                            next[idx] = { ...next[idx], month: val };
                            return { ...prev, upcomingEvents: next };
                          });
                        }}
                        className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={evt.day}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.upcomingEvents];
                            next[idx] = { ...next[idx], day: val };
                            return { ...prev, upcomingEvents: next };
                          });
                        }}
                        className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.upcomingEvents];
                            next[idx] = { ...next[idx], time: val };
                            return { ...prev, upcomingEvents: next };
                          });
                        }}
                        className="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            upcomingEvents: prev.upcomingEvents.filter((e) => e.id !== evt.id)
                          }))
                        }
                        aria-label={`Delete ${evt.title}`}
                        className="p-1.5 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={evt.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.upcomingEvents];
                          next[idx] = { ...next[idx], title: val };
                          return { ...prev, upcomingEvents: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={evt.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.upcomingEvents];
                          next[idx] = { ...next[idx], description: val };
                          return { ...prev, upcomingEvents: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Board Exam Toppers Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">
                Board Exam Toppers & Academic Honors (Add / Edit)
              </h2>

              <form
                onSubmit={handleAddTopper}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3"
              >
                <input
                  type="text"
                  placeholder="Student Name *"
                  value={newTopperName}
                  onChange={(e) => setNewTopperName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Class / Stream"
                  value={newTopperGrade}
                  onChange={(e) => setNewTopperGrade(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Score (e.g. 498/500) *"
                  value={newTopperScore}
                  onChange={(e) => setNewTopperScore(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Achievement / Rank"
                  value={newTopperAchievement}
                  onChange={(e) => setNewTopperAchievement(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Topper</span>
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.toppers.map((topper, idx) => (
                  <div
                    key={topper.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={topper.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.toppers];
                            next[idx] = { ...next[idx], name: val };
                            return { ...prev, toppers: next };
                          });
                        }}
                        className="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            toppers: prev.toppers.filter((t) => t.id !== topper.id)
                          }))
                        }
                        aria-label={`Delete ${topper.name}`}
                        className="p-1 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={topper.score}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.toppers];
                          next[idx] = { ...next[idx], score: val };
                          return { ...prev, toppers: next };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-amber-600 dark:text-amber-400"
                    />
                    <input
                      type="text"
                      value={topper.grade}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.toppers];
                          next[idx] = { ...next[idx], grade: val };
                          return { ...prev, toppers: next };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <input
                      type="text"
                      value={topper.achievement}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.toppers];
                          next[idx] = { ...next[idx], achievement: val };
                          return { ...prev, toppers: next };
                        });
                      }}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Parent Testimonials Editor */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">
                Parent Testimonials Carousel (Add / Edit)
              </h2>

              <form
                onSubmit={handleAddTestimonial}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  placeholder="Parent Name *"
                  value={newTestParent}
                  onChange={(e) => setNewTestParent(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Student Class Details"
                  value={newTestStudent}
                  onChange={(e) => setNewTestStudent(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Testimonial Quote *"
                  value={newTestQuote}
                  onChange={(e) => setNewTestQuote(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {config.testimonials.map((testItem, idx) => (
                  <div
                    key={testItem.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={testItem.parentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.testimonials];
                            next[idx] = { ...next[idx], parentName: val };
                            return { ...prev, testimonials: next };
                          });
                        }}
                        className="flex-1 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.filter((t) => t.id !== testItem.id)
                          }))
                        }
                        aria-label={`Delete ${testItem.parentName}`}
                        className="p-1.5 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={testItem.studentDetails}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.testimonials];
                          next[idx] = { ...next[idx], studentDetails: val };
                          return { ...prev, testimonials: next };
                        });
                      }}
                      className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                    <textarea
                      rows={3}
                      value={testItem.quote}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.testimonials];
                          next[idx] = { ...next[idx], quote: val };
                          return { ...prev, testimonials: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News & Circulars */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <h2 className="font-display text-xl font-bold">
                Latest News & Announcements (Add / Edit)
              </h2>

              <form
                onSubmit={handleAddNotice}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  placeholder="Notice Date (e.g. April 10, 2026)"
                  value={newNoticeDate}
                  onChange={(e) => setNewNoticeDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Circular Headline *"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <input
                  type="text"
                  placeholder="Circular Summary / Details *"
                  value={newNoticeSummary}
                  onChange={(e) => setNewNoticeSummary(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Circular</span>
                </button>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {config.notices.map((notice, idx) => (
                  <div
                    key={notice.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={notice.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => {
                            const next = [...prev.notices];
                            next[idx] = { ...next[idx], date: val };
                            return { ...prev, notices: next };
                          });
                        }}
                        className="flex-1 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((prev) => ({
                            ...prev,
                            notices: prev.notices.filter((n) => n.id !== notice.id)
                          }))
                        }
                        aria-label={`Delete ${notice.title}`}
                        className="p-1.5 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={notice.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.notices];
                          next[idx] = { ...next[idx], title: val };
                          return { ...prev, notices: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={notice.summary}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateConfig((prev) => {
                          const next = [...prev.notices];
                          next[idx] = { ...next[idx], summary: val, fullText: val };
                          return { ...prev, notices: next };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 6: PERMISSIONS, ADMIN-ONLY THEME & PASSWORD CHANGE
        ==================================================================== */}
        {activeTab === 'permissions-security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Website Permissions & Feature Visibility */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold">
                  All Website Permissions, Theme & Visibility Controls
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Control website Light/Dark theme (Admin Only), open/close admissions, and toggle sections across the public website.
                </p>
              </div>

              {/* Admin-Only Theme Switcher Row */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Website Light / Dark Theme (Admin-Only Control)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Public visitors cannot change the theme—they will see whichever theme mode you set here.
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetTheme('light')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      config.permissions.siteTheme === 'light'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light Theme</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTheme('dark')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      config.permissions.siteTheme === 'dark'
                        ? 'bg-blue-950 text-amber-400 border border-amber-400/40'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Theme</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {(
                  [
                    {
                      key: 'admissionsOpen',
                      title: 'Online Admission Status (Open / Close)',
                      desc: 'Enable or close online admission enquiries and update admission badges across the site.'
                    },
                    {
                      key: 'showAnnouncementBanner',
                      title: 'Top Scrolling Announcement Ticker',
                      desc: 'Show the scrolling admissions & news ticker at the top of the Hero section.'
                    },
                    {
                      key: 'allowDocumentDownloads',
                      title: 'Prospectus & Application Form Downloads',
                      desc: 'Show downloadable Prospectus and Application Form buttons in Admissions.'
                    },
                    {
                      key: 'showStatistics',
                      title: 'Animated Campus Statistics Section',
                      desc: 'Display student, teacher, years, and pass rate counter metrics.'
                    },
                    {
                      key: 'showGallery',
                      title: 'Events & Campus Photo Gallery Section',
                      desc: 'Display the filterable photo gallery and upcoming events strip.'
                    },
                    {
                      key: 'showAchievements',
                      title: 'Board Toppers, Awards & Testimonials Section',
                      desc: 'Display exam toppers, institutional accolades, and parent testimonials.'
                    },
                    {
                      key: 'showNews',
                      title: 'Latest News & Circulars Section',
                      desc: 'Display official school notices and circular cards.'
                    },
                    {
                      key: 'showSocialFeed',
                      title: 'Instagram & YouTube Campus Highlights',
                      desc: 'Display the social media video/photo preview grid above the footer.'
                    },
                    {
                      key: 'showFloatingWhatsApp',
                      title: 'Floating WhatsApp & Social Quick Bar',
                      desc: 'Show the floating Chat on WhatsApp button in the bottom-right corner.'
                    }
                  ] as const
                ).map((item) => {
                  const enabled = config.permissions[item.key];
                  return (
                    <div
                      key={item.key}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={item.title}
                        onClick={() => handlePermissionToggle(item.key)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                          enabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {enabled ? 'Enabled (Open)' : 'Disabled (Closed)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Password Change Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Change Admin Password</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify your old password to set a new lock password.
                  </p>
                </div>
              </div>

              {passMessage && (
                <div
                  role="alert"
                  className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    passMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-emerald-800 text-red-900 dark:text-red-200'
                  }`}
                >
                  {passMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{passMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-old-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Old Password
                  </label>
                  <input
                    id="admin-old-password"
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-new-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    New Password
                  </label>
                  <input
                    id="admin-new-password"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-confirm-password"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="admin-confirm-password"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-lg bg-blue-950 dark:bg-amber-500 hover:bg-blue-900 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Update Admin Lock Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
