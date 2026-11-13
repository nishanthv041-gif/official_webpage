import React, { createContext, useContext, useState, useEffect } from 'react';
import { SCHOOL_CONFIG, DEFAULT_ADMIN_PASSWORD } from '../data/schoolData';
import {
  resolveGoogleMapsEmbedUrl,
  type AdmissionFormInput
} from '../utils/schoolUtils';

export type SchoolConfigType = typeof SCHOOL_CONFIG;

export interface SubmittedEnquiryRecord extends AdmissionFormInput {
  referenceId: string;
  submittedAt: string;
}

interface SchoolContextValue {
  config: SchoolConfigType;
  updateConfig: (updater: (prev: SchoolConfigType) => SchoolConfigType) => void;
  resetConfigToDefaults: () => void;
  adminPassword: string;
  updateAdminPassword: (newPassword: string) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  enquiries: SubmittedEnquiryRecord[];
  addEnquiry: (enquiry: SubmittedEnquiryRecord) => void;
  deleteEnquiry: (referenceId: string) => void;
}

const STORAGE_KEY_CONFIG = 'srt_school_config_v3';
const STORAGE_KEY_PASSWORD = 'srt_school_admin_pass_v1';
const STORAGE_KEY_ENQUIRIES = 'srt_school_enquiries_v1';

const SchoolContext = createContext<SchoolContextValue | null>(null);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SchoolConfigType>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY_CONFIG) || localStorage.getItem('srt_school_config_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedContact = {
          ...SCHOOL_CONFIG.contact,
          ...(parsed.contact || {})
        };

        // Upgrade old placeholder map URL or re-resolve any maps.app.goo.gl link
        if (
          !mergedContact.locationShareLink ||
          mergedContact.locationShareLink.includes('Tambaram+Velachery')
        ) {
          mergedContact.locationShareLink = SCHOOL_CONFIG.contact.locationShareLink;
          mergedContact.googleMapsEmbedUrl = SCHOOL_CONFIG.contact.googleMapsEmbedUrl;
        } else {
          mergedContact.googleMapsEmbedUrl = resolveGoogleMapsEmbedUrl(
            mergedContact.locationShareLink
          );
        }

        return {
          ...SCHOOL_CONFIG,
          ...parsed,
          permissions: {
            ...SCHOOL_CONFIG.permissions,
            ...(parsed.permissions || {})
          },
          correspondent: {
            ...SCHOOL_CONFIG.correspondent,
            ...(parsed.correspondent || {})
          },
          contact: mergedContact,
          socials: {
            ...SCHOOL_CONFIG.socials,
            ...(parsed.socials || {})
          },
          about: {
            ...SCHOOL_CONFIG.about,
            ...(parsed.about || {})
          },
          admissions: {
            ...SCHOOL_CONFIG.admissions,
            ...(parsed.admissions || {})
          },
          additionalDetails: Array.isArray(parsed.additionalDetails)
            ? parsed.additionalDetails
            : SCHOOL_CONFIG.additionalDetails
        };
      }
    } catch {
      // Fallback to default config
    }
    return SCHOOL_CONFIG;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const savedPass = localStorage.getItem(STORAGE_KEY_PASSWORD);
      return savedPass || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  const [enquiries, setEnquiries] = useState<SubmittedEnquiryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sync admin-controlled website theme (Light / Dark) to document root
  useEffect(() => {
    const root = document.documentElement;
    if (config.permissions.siteTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.permissions.siteTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PASSWORD, adminPassword);
    } catch {
      // Ignore
    }
  }, [adminPassword]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
    } catch {
      // Ignore
    }
  }, [enquiries]);

  const updateConfig = (updater: (prev: SchoolConfigType) => SchoolConfigType) => {
    setConfig((prev) => updater(prev));
  };

  const resetConfigToDefaults = () => {
    setConfig(SCHOOL_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    } catch {
      // Ignore
    }
  };

  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const addEnquiry = (enquiry: SubmittedEnquiryRecord) => {
    setEnquiries((prev) => [enquiry, ...prev]);
  };

  const deleteEnquiry = (referenceId: string) => {
    setEnquiries((prev) => prev.filter((item) => item.referenceId !== referenceId));
  };

  return (
    <SchoolContext.Provider
      value={{
        config,
        updateConfig,
        resetConfigToDefaults,
        adminPassword,
        updateAdminPassword,
        isAdminUnlocked,
        setIsAdminUnlocked,
        enquiries,
        addEnquiry,
        deleteEnquiry
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export function useSchoolConfig(): SchoolContextValue {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error('useSchoolConfig must be used within a SchoolProvider');
  }
  return ctx;
}
