import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAdmissionForm,
  validateContactForm,
  filterGalleryItems,
  getLightboxIndex,
  generateEnquiryReference,
  verifyAdminPassword,
  validatePasswordChange,
  resolveGoogleMapsEmbedUrl,
  resolveGoogleMapsShareUrl
} from './schoolUtils';
import { SCHOOL_CONFIG, DEFAULT_ADMIN_PASSWORD } from '../data/schoolData';

test('validateAdmissionForm rejects empty or invalid inputs and accepts valid data', () => {
  const invalidResult = validateAdmissionForm({
    studentName: 'A',
    parentName: '',
    phone: '12345',
    email: 'not-an-email',
    classApplyingFor: '',
    boardPreference: 'CBSE',
    mediumPreference: 'English',
    message: ''
  });

  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.studentName);
  assert.ok(invalidResult.errors.parentName);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.classApplyingFor);

  const validResult = validateAdmissionForm({
    studentName: 'Aarav Karthik',
    parentName: 'Karthik Rajan',
    phone: '9840172500',
    email: 'karthik.rajan@example.com',
    classApplyingFor: 'Class VI',
    boardPreference: 'CBSE',
    mediumPreference: 'English Medium',
    message: 'Interested in STEM Robotics and Campus Tour'
  });

  assert.equal(validResult.valid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('validateContactForm enforces name, phone, email, and minimum message length', () => {
  const shortMsg = validateContactForm({
    name: 'Meena R',
    phone: '+91 98401 72500',
    email: 'meena@example.com',
    subject: 'Bus Route Enquiry',
    message: 'Too short'
  });
  assert.equal(shortMsg.valid, false);
  assert.ok(shortMsg.errors.message);

  const validMsg = validateContactForm({
    name: 'Meena R',
    phone: '+91 98401 72500',
    email: 'meena@example.com',
    subject: 'Bus Route Enquiry',
    message: 'Could you please share the morning pickup time for Chromepet?'
  });
  assert.equal(validMsg.valid, true);
});

test('filterGalleryItems returns all items for All and filters accurately by category', () => {
  const all = filterGalleryItems(SCHOOL_CONFIG.gallery, 'All');
  assert.equal(all.length, SCHOOL_CONFIG.gallery.length);

  const achievements = filterGalleryItems(SCHOOL_CONFIG.gallery, 'Achievements');
  assert.equal(achievements.length, 2);
  assert.ok(achievements.every((item) => item.category === 'Achievements'));
});

test('getLightboxIndex wraps around accurately in both directions', () => {
  assert.equal(getLightboxIndex(0, 6, 'prev'), 5);
  assert.equal(getLightboxIndex(5, 6, 'next'), 0);
  assert.equal(getLightboxIndex(2, 6, 'next'), 3);
});

test('generateEnquiryReference produces deterministic reference string', () => {
  const ref = generateEnquiryReference('Aarav Karthik', 'Class VI', 1);
  assert.equal(ref, 'SRT-26-CLA-AK2601');
});

test('verifyAdminPassword and validatePasswordChange enforce srtschool1527 and password rules', () => {
  assert.equal(verifyAdminPassword('srtschool1527', DEFAULT_ADMIN_PASSWORD), true);
  assert.equal(verifyAdminPassword('wrongpass', DEFAULT_ADMIN_PASSWORD), false);

  const wrongOld = validatePasswordChange('wrong', 'srtschool1527', 'newpass123', 'newpass123');
  assert.equal(wrongOld.valid, false);
  assert.match(wrongOld.error || '', /Old password is incorrect/);

  const mismatch = validatePasswordChange('srtschool1527', 'srtschool1527', 'newpass123', 'different123');
  assert.equal(mismatch.valid, false);
  assert.match(mismatch.error || '', /do not match/);

  const validChange = validatePasswordChange('srtschool1527', 'srtschool1527', 'srtadmin2026', 'srtadmin2026');
  assert.equal(validChange.valid, true);
});

test('resolveGoogleMapsEmbedUrl and resolveGoogleMapsShareUrl handle live location links, coordinates, and iframes', () => {
  const fromIframe = resolveGoogleMapsEmbedUrl('<iframe src="https://www.google.com/maps/embed?pb=12345" width="600"></iframe>');
  assert.equal(fromIframe, 'https://www.google.com/maps/embed?pb=12345');

  const fromShareLink = resolveGoogleMapsEmbedUrl('https://maps.google.com/?q=SRT+School+Chennai');
  assert.ok(fromShareLink.includes('output=embed'));
  assert.ok(fromShareLink.includes('SRT%20School%20Chennai'));

  const fromLiveCoords = resolveGoogleMapsEmbedUrl('12.9345, 80.1418');
  assert.ok(fromLiveCoords.includes('12.9345%2C80.1418'));
  assert.ok(fromLiveCoords.includes('output=embed'));

  const fromAtPinUrl = resolveGoogleMapsEmbedUrl('https://www.google.com/maps/@12.9345,80.1418,17z');
  assert.ok(fromAtPinUrl.includes('12.9345%2C80.1418'));

  const fromShortLink = resolveGoogleMapsEmbedUrl('https://maps.app.goo.gl/MKFZvMQ8UKvrshGMA');
  assert.ok(fromShortLink.includes('11.3089232%2C76.9421433'));
  assert.ok(fromShortLink.includes('SRT%20Universal%20School'));
  assert.ok(fromShortLink.includes('output=embed'));

  const shareUrl = resolveGoogleMapsShareUrl('12.9345, 80.1418');
  assert.equal(shareUrl, 'https://www.google.com/maps?q=12.9345,80.1418');
});


