import type { GalleryCategory, GalleryItem } from '../data/schoolData';

export interface AdmissionFormInput {
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  classApplyingFor: string;
  boardPreference: string;
  mediumPreference: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof AdmissionFormInput, string>>;
}

export interface ContactFormInput {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Validates the online Admission Enquiry form inputs.
 */
export function validateAdmissionForm(input: AdmissionFormInput): ValidationResult {
  const errors: Partial<Record<keyof AdmissionFormInput, string>> = {};

  if (!input.studentName || input.studentName.trim().length < 2) {
    errors.studentName = 'Please enter the student’s full name (minimum 2 characters).';
  }

  if (!input.parentName || input.parentName.trim().length < 2) {
    errors.parentName = 'Please enter the parent or guardian’s name.';
  }

  const cleanedPhone = (input.phone || '').replace(/[\s\-()]/g, '');
  if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(cleanedPhone) && !/^\+?\d{10,14}$/.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!input.classApplyingFor || input.classApplyingFor.trim() === '') {
    errors.classApplyingFor = 'Please select the class applying for.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates the Contact Us form inputs.
 */
export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  const cleanedPhone = (input.phone || '').replace(/[\s\-()]/g, '');
  if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(cleanedPhone) && !/^\+?\d{10,14}$/.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.message = 'Please enter a message with at least 10 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Filters gallery items by category.
 */
export function filterGalleryItems(items: GalleryItem[], category: GalleryCategory): GalleryItem[] {
  if (category === 'All') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

/**
 * Computes next and previous index for the gallery lightbox with wrap-around.
 */
export function getLightboxIndex(currentIndex: number, total: number, direction: 'next' | 'prev'): number {
  if (total <= 0) return 0;
  if (direction === 'next') {
    return (currentIndex + 1) % total;
  }
  return (currentIndex - 1 + total) % total;
}

/**
 * Generates a deterministic reference number for a submitted admission enquiry.
 */
export function generateEnquiryReference(studentName: string, classApplying: string, index: number): string {
  const cleanInitials = studentName
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() || 'S')
    .join('')
    .slice(0, 2)
    .padEnd(2, 'X');
  const cleanClass = classApplying.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'GEN';
  const serial = String(202600 + index).slice(-4);
  return `SRT-26-${cleanClass}-${cleanInitials}${serial}`;
}

/**
 * Verifies the admin lock password against the currently configured password.
 */
export function verifyAdminPassword(inputPassword: string, currentPassword: string): boolean {
  return inputPassword === currentPassword;
}

export interface PasswordChangeResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates changing the admin lock password (old password, new password, confirm password).
 */
export function validatePasswordChange(
  oldPasswordInput: string,
  currentStoredPassword: string,
  newPasswordInput: string,
  confirmPasswordInput: string
): PasswordChangeResult {
  if (!oldPasswordInput) {
    return { valid: false, error: 'Please enter your current password.' };
  }
  if (oldPasswordInput !== currentStoredPassword) {
    return { valid: false, error: 'Old password is incorrect.' };
  }
  if (!newPasswordInput || newPasswordInput.trim().length < 6) {
    return { valid: false, error: 'New password must be at least 6 characters long.' };
  }
  if (newPasswordInput !== confirmPasswordInput) {
    return { valid: false, error: 'New password and confirm password do not match.' };
  }
  if (newPasswordInput === currentStoredPassword) {
    return { valid: false, error: 'New password must be different from the old password.' };
  }
  return { valid: true };
}

export interface ParsedMapLocation {
  embedUrl: string;
  shareUrl: string;
  label: string;
  coordinates?: string;
  isShortLink: boolean;
}

// Known short-link cache so SRT School's official short link resolves in 0ms even offline
const KNOWN_SHORT_LINKS: Record<string, string> = {
  MKFZvMQ8UKvrshGMA:
    'https://www.google.com/maps/place/SRT+Universal+School/@11.3089232,76.9421433,845m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba920c2a33976f1:0x781e8cea2d643643!8m2!3d11.3089232!4d76.9421433!16s%2Fg%2F11cn949187'
};

/**
 * Checks whether a pasted string is a shortened Google Maps URL (maps.app.goo.gl or goo.gl/maps)
 * that may need server-side redirect expansion if not in KNOWN_SHORT_LINKS.
 */
export function isShortGoogleMapsUrl(rawInput: string): boolean {
  const trimmed = (rawInput || '').trim();
  return /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(trimmed);
}

/**
 * Parses any Google Maps URL (including expanded /maps/place/ URLs, /sorry/index?continue= URLs,
 * short links, raw coordinates, or <iframe src="..."> snippets) into embedUrl, shareUrl, and label.
 */
export function parseGoogleMapsInput(rawInput: string, mapType?: 'm' | 'h'): ParsedMapLocation {
  let working = (rawInput || '').trim();
  if (!working) {
    return {
      embedUrl:
        'https://maps.google.com/maps?q=11.3089232,76.9421433+(SRT+Universal+School)&t=h&z=17&ie=UTF8&iwloc=&output=embed',
      shareUrl: 'https://maps.app.goo.gl/MKFZvMQ8UKvrshGMA',
      label: 'SRT Universal School (11.3089232, 76.9421433)',
      coordinates: '11.3089232, 76.9421433',
      isShortLink: false
    };
  }

  const originalInput = working;

  // Check if it matches a known short link token
  for (const [token, expanded] of Object.entries(KNOWN_SHORT_LINKS)) {
    if (working.includes(token)) {
      working = expanded;
      break;
    }
  }

  // Unwrap Google /sorry/index?continue=... wrapper if present
  if (working.includes('google.com/sorry') && working.includes('continue=')) {
    try {
      const sorryUrl = new URL(working);
      const cont = sorryUrl.searchParams.get('continue');
      if (cont) {
        working = decodeURIComponent(cont);
      }
    } catch {
      // ignore
    }
  }

  // 1. If user pasted full <iframe src="..."> HTML snippet
  const iframeSrcMatch = working.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return {
      embedUrl: iframeSrcMatch[1],
      shareUrl: iframeSrcMatch[1],
      label: 'Custom Embedded Google Map',
      isShortLink: false
    };
  }

  // 2. If already a Google Maps embed URL
  if (working.includes('google.com/maps/embed') || working.includes('output=embed')) {
    return {
      embedUrl: working,
      shareUrl: originalInput.startsWith('http') ? originalInput : working,
      label: 'Embedded Campus Map',
      isShortLink: false
    };
  }

  // 3. If user pasted raw GPS coordinates like "11.3089232, 76.9421433"
  const rawCoordsMatch = working.match(/^(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)$/);
  if (rawCoordsMatch) {
    const lat = rawCoordsMatch[1];
    const lng = rawCoordsMatch[2];
    const coords = `${lat},${lng}`;
    const tParam = mapType || 'h';
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&t=${tParam}&z=17&ie=UTF8&iwloc=&output=embed`,
      shareUrl: `https://www.google.com/maps?q=${coords}`,
      label: `GPS Pin (${lat}, ${lng})`,
      coordinates: `${lat}, ${lng}`,
      isShortLink: false
    };
  }

  // 4. If user pasted a Google Maps URL
  try {
    if (working.startsWith('http://') || working.startsWith('https://')) {
      const url = new URL(working);

      // Extract place name if present in /maps/place/<Name>/
      let placeName = '';
      const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/i);
      if (placeMatch && placeMatch[1] && !placeMatch[1].startsWith('@')) {
        placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
      }

      // Extract exact pin coordinates !3d<lat>!4d<lng> first, fallback to @<lat>,<lng>
      const exactPinMatch = working.match(/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/);
      const atCoordsMatch = working.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
      const lat = exactPinMatch ? exactPinMatch[1] : atCoordsMatch ? atCoordsMatch[1] : '';
      const lng = exactPinMatch ? exactPinMatch[2] : atCoordsMatch ? atCoordsMatch[2] : '';

      // Detect satellite mode (!1e3)
      const isSat = mapType ? mapType === 'h' : working.includes('!1e3');
      const tParam = isSat ? 'h' : '';

      if (lat && lng) {
        const query = placeName ? `${lat},${lng} (${placeName})` : `${lat},${lng}`;
        return {
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${tParam}&z=17&ie=UTF8&iwloc=&output=embed`,
          shareUrl: originalInput,
          label: placeName ? `${placeName} (${lat}, ${lng})` : `GPS (${lat}, ${lng})`,
          coordinates: `${lat}, ${lng}`,
          isShortLink: false
        };
      }

      const qParam =
        url.searchParams.get('q') ||
        url.searchParams.get('query') ||
        url.searchParams.get('ll') ||
        url.searchParams.get('destination');
      if (qParam) {
        return {
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&t=${tParam}&z=16&ie=UTF8&iwloc=&output=embed`,
          shareUrl: originalInput,
          label: qParam,
          isShortLink: false
        };
      }

      if (placeName) {
        return {
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=${tParam}&z=16&ie=UTF8&iwloc=&output=embed`,
          shareUrl: originalInput,
          label: placeName,
          isShortLink: false
        };
      }

      // If it's an uncached short link (maps.app.goo.gl/xyz), mark isShortLink: true so caller can expand via /api/resolve-map-link
      if (isShortGoogleMapsUrl(working)) {
        return {
          embedUrl:
            'https://maps.google.com/maps?q=11.3089232,76.9421433+(SRT+Universal+School)&t=h&z=17&ie=UTF8&iwloc=&output=embed',
          shareUrl: originalInput,
          label: 'Resolving Google Maps short link...',
          isShortLink: true
        };
      }
    }
  } catch {
    // Fallback below
  }

  return {
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(working)}&t=${mapType || ''}&z=15&ie=UTF8&iwloc=&output=embed`,
    shareUrl: originalInput.startsWith('http')
      ? originalInput
      : `https://www.google.com/maps?q=${encodeURIComponent(working)}`,
    label: working,
    isShortLink: false
  };
}

/**
 * Converts a copy-pasted Google Maps live location URL, share URL, GPS coordinates,
 * iframe HTML snippet, or address query into a clean Google Maps embed URL suitable for an <iframe>.
 */
export function resolveGoogleMapsEmbedUrl(rawInput: string): string {
  return parseGoogleMapsInput(rawInput).embedUrl;
}

/**
 * Resolves any pasted location input (URL, coordinates, or address) into a direct
 * shareable Google Maps live location link.
 */
export function resolveGoogleMapsShareUrl(rawInput: string): string {
  return parseGoogleMapsInput(rawInput).shareUrl;
}
