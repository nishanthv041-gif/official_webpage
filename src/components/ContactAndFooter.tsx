import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Play,
  ExternalLink,
  MessageCircle,
  GraduationCap,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { useSchoolConfig } from '../context/SchoolContext';
import { ContactFormInput, validateContactForm } from '../utils/schoolUtils';
import { SafeImage } from './SafeImage';

interface ContactAndFooterProps {
  onOpenAdmin: () => void;
}

const INITIAL_CONTACT: ContactFormInput = {
  name: '',
  phone: '',
  email: '',
  subject: 'General / Campus Visit Enquiry',
  message: ''
};

export const ContactAndFooter: React.FC<ContactAndFooterProps> = ({ onOpenAdmin }) => {
  const { config } = useSchoolConfig();
  const { contact, socials, socialFeed, permissions } = config;
  const [contactForm, setContactForm] = useState<ContactFormInput>(INITIAL_CONTACT);
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [contactSubmittedName, setContactSubmittedName] = useState<string | null>(null);
  const [copiedMapLink, setCopiedMapLink] = useState(false);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (contactErrors[name as keyof ContactFormInput]) {
      setContactErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(contactForm);
    if (!validation.valid) {
      setContactErrors(validation.errors);
      return;
    }

    setContactSubmittedName(contactForm.name);
    setContactErrors({});
    setContactForm(INITIAL_CONTACT);
  };

  const handleCopyLocation = () => {
    const linkToCopy = contact.locationShareLink || contact.googleMapsEmbedUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy).catch(() => {});
    }
    setCopiedMapLink(true);
    setTimeout(() => setCopiedMapLink(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${socials.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${config.name} Admissions Desk, I would like to enquire about admissions for ${config.academicYear}.`
  )}`;

  return (
    <>
      {/* SECTION 10: CONTACT US & GOOGLE MAP */}
      <section
        id="contact"
        className="scroll-mt-16 py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
              Get in Touch · Visit Our Campus
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Contact {config.name}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Have questions about admissions, bus routes, or curriculum streams? Reach out to our administrative desk or visit our campus Monday through Saturday.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Address, Phone, Email, Hours & Map */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400 font-semibold text-sm">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>Campus Address</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyLocation}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {copiedMapLink ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <a
                        href={contact.locationShareLink || contact.googleMapsEmbedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-950 dark:bg-amber-500 text-white dark:text-slate-950 text-[11px] font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live Map</span>
                      </a>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {contact.addressLine1}, {contact.addressLine2}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400 font-semibold text-sm">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Phone Numbers</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <div>Office: {contact.phonePrimary}</div>
                    <div>Admissions: {contact.phoneAdmissions}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400 font-semibold text-sm">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Official Email</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <div>{contact.emailAdmissions}</div>
                    <div>{contact.emailGeneral}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400 font-semibold text-sm">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {contact.workingHours}
                  </p>
                </div>
              </div>

              {/* Embedded Google Map + Live Location Action Bar */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Live Campus Location Map</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLocation}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedMapLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Location Link</span>
                        </>
                      )}
                    </button>
                    <a
                      href={contact.locationShareLink || contact.googleMapsEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Live Map</span>
                    </a>
                  </div>
                </div>
                <div className="h-72 relative bg-slate-200 dark:bg-slate-950">
                  <iframe
                    key={contact.googleMapsEmbedUrl}
                    title="SRT School Campus Location Map"
                    src={contact.googleMapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Validated Contact Form */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-blue-900 dark:text-amber-400">
                    Direct Message to Administration
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Send Us a Message
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Our front-office team responds to all parent and visitor messages within one working day.
                  </p>
                </div>

                {contactSubmittedName && (
                  <div
                    role="status"
                    className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      Thank you, <strong>{contactSubmittedName}</strong>! Your message has been received by the {config.name} Front Desk. We will get back to you shortly.
                    </div>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Full Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {contactErrors.name && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{contactErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        placeholder="+91 98401 72500"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {contactErrors.phone && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{contactErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {contactErrors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{contactErrors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                      >
                        Department / Subject
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="General / Campus Visit Enquiry">General / Campus Visit Enquiry</option>
                        <option value="Admissions & Scholarship Desk">Admissions & Scholarship Desk</option>
                        <option value="Transport & Bus Routes">Transport & Bus Routes</option>
                        <option value="Correspondent Office Appointment">Correspondent Office Appointment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="How can we help you today?"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {contactErrors.message && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{contactErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-lg bg-blue-950 dark:bg-amber-500 hover:bg-blue-900 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: SOCIAL MEDIA FEED PREVIEW SECTION */}
      {permissions.showSocialFeed && (
        <section
          id="social-media"
          className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
                  @srtschool · Connected Campus Community
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Instagram & YouTube Campus Highlights
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Subscribe on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialFeed.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-800/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <SafeImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    {post.platform === 'YouTube' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
                      <span>{post.platform}</span>
                      {post.duration && <span className="font-mono">{post.duration}</span>}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-900 dark:group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{post.viewsOrLikes}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 12: FOOTER */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Brand & Correspondent Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5 text-white font-display text-xl font-bold">
                <GraduationCap className="w-6 h-6 text-amber-400 shrink-0" />
                <span>{config.name}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {config.tagline}. Offering holistic K-12 education ({config.classesOffered}) across {config.boardAndMedium}.
              </p>
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div>
                  <strong className="text-slate-200">Correspondent:</strong>{' '}
                  {config.correspondent.name}
                </div>
                <div>{config.affiliationCode}</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li>
                  <a href="#about" className="hover:text-amber-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#why-srt" className="hover:text-amber-400 transition-colors">
                    Why Choose SRT
                  </a>
                </li>
                <li>
                  <a href="#admissions" className="hover:text-amber-400 transition-colors">
                    Admissions {config.academicYear}
                  </a>
                </li>
                <li>
                  <a href="#academics" className="hover:text-amber-400 transition-colors">
                    Academics & Labs
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-amber-400 transition-colors">
                    Events & Gallery
                  </a>
                </li>
                <li>
                  <a href="#achievements" className="hover:text-amber-400 transition-colors">
                    Toppers & Results
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Summary */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Contact & Location
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                <p>
                  {contact.addressLine1}, {contact.addressLine2}
                </p>
                <p>Phone: {contact.phonePrimary}</p>
                <p>Admissions: {contact.phoneAdmissions}</p>
                <p>Email: {contact.emailAdmissions}</p>
              </div>
            </div>

            {/* Social Connect */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">
                Follow Us
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay connected with campus events, student achievements, and official updates across our social channels.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Facebook
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Instagram
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  YouTube
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© 2026 {config.name}. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#admissions" className="hover:text-white transition-colors">
                Mandatory Public Disclosure
              </a>
              <span aria-hidden="true">·</span>
              <a href="#contact" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Settings</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP & SOCIAL QUICK-ACTION BUTTON */}
      {permissions.showFloatingWhatsApp && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
          <div className="hidden lg:flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 p-1.5 rounded-xl text-xs text-slate-200 shadow-lg">
            <a
              href={socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SRT School on Facebook"
              className="px-2.5 py-1.5 rounded-lg hover:bg-blue-900 hover:text-amber-400 transition-colors font-semibold text-center"
            >
              FB
            </a>
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SRT School on Instagram"
              className="px-2.5 py-1.5 rounded-lg hover:bg-blue-900 hover:text-amber-400 transition-colors font-semibold text-center"
            >
              IG
            </a>
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SRT School on YouTube"
              className="px-2.5 py-1.5 rounded-lg hover:bg-blue-900 hover:text-amber-400 transition-colors font-semibold text-center"
            >
              YT
            </a>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with SRT School Admissions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg transition-all whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}
    </>
  );
};
