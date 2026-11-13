import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Send,
  ClipboardCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import { useSchoolConfig, SubmittedEnquiryRecord } from '../context/SchoolContext';
import {
  AdmissionFormInput,
  validateAdmissionForm,
  generateEnquiryReference
} from '../utils/schoolUtils';

const INITIAL_FORM: AdmissionFormInput = {
  studentName: '',
  parentName: '',
  phone: '',
  email: '',
  classApplyingFor: '',
  boardPreference: 'CBSE',
  mediumPreference: 'English Medium',
  message: ''
};

const CLASSES_LIST = [
  'LKG',
  'UKG',
  'Class I',
  'Class II',
  'Class III',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
  'Class XI (Science - CS/Bio)',
  'Class XI (Commerce & Accountancy)',
  'Class XI (Humanities)'
];

export const AdmissionsSection: React.FC = () => {
  const { config, enquiries, addEnquiry } = useSchoolConfig();
  const { admissions, permissions } = config;
  const [formData, setFormData] = useState<AdmissionFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AdmissionFormInput, string>>>({});
  const [latestReceipt, setLatestReceipt] = useState<SubmittedEnquiryRecord | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AdmissionFormInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAdmissionForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const referenceId = generateEnquiryReference(
      formData.studentName,
      formData.classApplyingFor,
      enquiries.length + 1
    );

    const newRecord: SubmittedEnquiryRecord = {
      ...formData,
      referenceId,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    addEnquiry(newRecord);
    setLatestReceipt(newRecord);
    setErrors({});
    setFormData(INITIAL_FORM);
  };

  const handleDownloadDocument = (docType: 'prospectus' | 'application') => {
    const isProspectus = docType === 'prospectus';
    const filename = isProspectus
      ? 'SRT_School_Prospectus_2026_27.txt'
      : 'SRT_School_Application_Form_2026_27.txt';

    const content = isProspectus
      ? `====================================================================
${config.name.toUpperCase()} – OFFICIAL PROSPECTUS (${config.academicYear})
====================================================================
Tagline: ${config.tagline}
Correspondent: ${config.correspondent.name} (${config.correspondent.designation})
Streams & Medium: ${config.boardAndMedium}
Classes Offered: ${config.classesOffered}

CONTACT ADMISSIONS DESK:
Address: ${config.contact.addressLine1}, ${config.contact.addressLine2}
Phone: ${config.contact.phoneAdmissions} | Email: ${config.contact.emailAdmissions}
====================================================================`
      : `====================================================================
${config.name.toUpperCase()} – ADMISSION APPLICATION FORM (${config.academicYear})
====================================================================
Correspondent: ${config.correspondent.name}
Board / Medium: [ ] CBSE   [ ] State Board   |   [ ] English   [ ] Tamil

1. Student Full Name (in Block Letters): _______________________________
2. Date of Birth (DD/MM/YYYY): ______________ Gender: __________________
3. Class Applying For: ______________________ Blood Group: _____________
4. Father's / Mother's / Guardian's Name: ______________________________
5. Contact Mobile Number: ___________________ Email: ___________________
6. Residential Address: ________________________________________________

REQUIRED DOCUMENTS CHECKLIST:
${admissions.requiredDocuments.map((d, i) => `[ ] ${i + 1}. ${d}`).join('\n')}
====================================================================`;

    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }

    setDownloadStatus(
      isProspectus
        ? 'School Prospectus downloaded.'
        : 'Printable Application Form downloaded.'
    );
  };

  return (
    <section
      id="admissions"
      className="scroll-mt-16 py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header + Downloadable Prospectus & Application Form */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold tracking-wider text-blue-800 dark:text-amber-400">
              Admissions {config.academicYear} · {config.boardAndMedium}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Transparent, Step-by-Step Admission Process
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Applications are open for {config.classesOffered}. Download our official prospectus or submit an online enquiry below for priority campus counseling.
            </p>
          </div>

          {/* Download Buttons */}
          {permissions.allowDocumentDownloads && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleDownloadDocument('prospectus')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Prospectus</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadDocument('application')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Application Form</span>
              </button>
            </div>
          )}
        </div>

        {downloadStatus && (
          <div
            role="status"
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{downloadStatus}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadStatus(null)}
              className="text-xs font-medium underline hover:no-underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4-Step Admission Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {admissions.steps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-blue-900 dark:text-amber-400">{step.step}</span>
                  <span className="text-slate-500 dark:text-slate-400">{step.timeline}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Split: Left (Eligibility, Documents & Fee Info) | Right (Online Admission Enquiry Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Classes, Eligibility & Required Documents */}
          <div className="lg:col-span-6 space-y-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/60 dark:bg-slate-950/60">
              <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Classes Offered & Eligibility Criteria
                </h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {admissions.eligibility.map((item) => (
                  <div key={item.level} className="p-5 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.level}
                      </span>
                      <span className="text-xs text-blue-900 dark:text-amber-400 font-medium">
                        {item.medium}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {item.ageCriteria}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-5 h-5 text-blue-900 dark:text-amber-400" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Required Documents for Admission
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {admissions.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Fee & Scholarship Info: </strong>
                {admissions.feeHighlights}
              </div>
            </div>
          </div>

          {/* Right Column: Online Admission Enquiry Form */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-blue-900 dark:text-amber-400">
                  Online Admission Desk · {config.academicYear}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Submit an Admission Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Fill out the form below to receive an instant enquiry reference ID and schedule your campus interaction.
                </p>
              </div>

              {!permissions.admissionsOpen ? (
                <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2.5 text-amber-950 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Online Admissions Currently Closed</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {admissions.closedMessage ||
                      `Online admission registration for ${config.academicYear} is currently paused by the school administration.`}
                  </p>
                  <div className="pt-1 text-xs font-semibold text-amber-900 dark:text-amber-300">
                    Admissions Helpline: {config.contact.phoneAdmissions} · {config.contact.emailAdmissions}
                  </div>
                </div>
              ) : (
                <>
                  {latestReceipt && (
                    <div
                      role="region"
                      aria-label="Admission Enquiry Confirmation"
                      className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-semibold text-sm">
                          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Admission Enquiry Registered Successfully!</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          Ref: {latestReceipt.referenceId}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                        Thank you, <strong>{latestReceipt.parentName}</strong>. We have registered the admission enquiry for{' '}
                        <strong>{latestReceipt.studentName}</strong> ({latestReceipt.classApplyingFor},{' '}
                        {latestReceipt.boardPreference}). Our Admissions Counselor will contact you at{' '}
                        <strong>{latestReceipt.phone}</strong> within 24 working hours.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="admission-student-name"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Student Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="admission-student-name"
                          name="studentName"
                          type="text"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          placeholder="e.g. Aarav Karthik"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {errors.studentName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="admission-parent-name"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Parent / Guardian Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="admission-parent-name"
                          name="parentName"
                          type="text"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="e.g. Karthik Rajan"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {errors.parentName && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.parentName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="admission-phone"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="admission-phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 98401 72500"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="admission-email"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="admission-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="parent@example.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="admission-class"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Class Applying For <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="admission-class"
                          name="classApplyingFor"
                          value={formData.classApplyingFor}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Class</option>
                          {CLASSES_LIST.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                        {errors.classApplyingFor && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.classApplyingFor}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="admission-board"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Preferred Board
                        </label>
                        <select
                          id="admission-board"
                          name="boardPreference"
                          value={formData.boardPreference}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="CBSE">CBSE Stream</option>
                          <option value="State Board">State Board Stream</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="admission-medium"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                        >
                          Medium of Instruction
                        </label>
                        <select
                          id="admission-medium"
                          name="mediumPreference"
                          value={formData.mediumPreference}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="English Medium">English Medium</option>
                          <option value="Tamil Medium">Tamil Medium</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="admission-message"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                      >
                        Questions / Campus Visit Preference (Optional)
                      </label>
                      <textarea
                        id="admission-message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mention transport route enquiry, scholarship test interest, or preferred campus visit date..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Enquiry</span>
                    </button>
                  </form>
                </>
              )}

              {enquiries.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Session Enquiries Logged ({enquiries.length}):
                  </div>
                  <div className="space-y-1.5">
                    {enquiries.map((item) => (
                      <div
                        key={item.referenceId}
                        className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800"
                      >
                        <span>
                          <strong>{item.studentName}</strong> · {item.classApplyingFor} ({item.boardPreference})
                        </span>
                        <span className="font-mono text-blue-900 dark:text-amber-400 font-semibold">
                          {item.referenceId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
