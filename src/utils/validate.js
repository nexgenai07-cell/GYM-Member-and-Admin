// src/utils/validate.js
// Field checks shared by every portal form. Same rules as the backend (apps/core/validators.py),
// so people see the problem under the field before anything is sent. Each returns a message or ''.
import { tl } from '../i18n';

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function emailError(value, required = true) {
  const v = String(value || '').trim();
  if (!v) return required ? tl('Email is required.') : '';
  const local = v.split('@')[0];
  if (v.length > 254 || !EMAIL_RE.test(v) || v.includes('..') || local.startsWith('.') || local.endsWith('.') || local.length > 64) {
    return tl('Enter a valid email address, e.g. name@example.com.');
  }
  return '';
}

export function requiredError(value, label) {
  return String(value ?? '').trim() ? '' : tl('{0} is required.', { 0: label });
}

const NAME_RE = /^\p{L}+(?:[ '\-.]\p{L}+)*\.?$/u;

export function nameError(value, label = 'Name', { required = true, max = 150 } = {}) {
  const v = String(value || '').trim().replace(/\s+/g, ' ');
  if (!v) return required ? tl('{0} is required.', { 0: tl(label) }) : '';
  if (v.length > max) return tl('{0} must be {1} characters or fewer.', { 0: tl(label), 1: max });
  if (!NAME_RE.test(v)) return tl('{0} can only contain letters, spaces, apostrophes and hyphens.', { 0: tl(label) });
  return '';
}

export function lengthError(value, label, { min = 0, max = 200, required = true } = {}) {
  const v = String(value || '').trim();
  if (!v) return required ? tl('{0} is required.', { 0: tl(label) }) : '';
  if (v.length < min) return tl('{0} must be at least {1} characters.', { 0: tl(label), 1: min });
  if (v.length > max) return tl('{0} must be {1} characters or fewer.', { 0: tl(label), 1: max });
  return '';
}

/** Saudi mobile: digits only, 5XXXXXXXX after +966 (or 05XXXXXXXX). */
export function saudiPhoneError(value, required = false) {
  const raw = String(value || '').trim();
  if (!raw) return required ? tl('Phone number is required.') : '';
  if (/[^\d+\s-]/.test(raw)) return tl('Phone number can only contain digits.');
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00966')) d = d.slice(5);
  else if (d.startsWith('966')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d.length === 9 && d.startsWith('5') ? '' : tl('Enter a Saudi mobile number, e.g. 05XXXXXXXX.');
}

export function numberError(value, label, { min = -Infinity, max = Infinity, integer = false, required = true } = {}) {
  const raw = String(value ?? '').trim();
  if (!raw) return required ? tl('{0} is required.', { 0: tl(label) }) : '';
  const n = Number(raw);
  if (!Number.isFinite(n)) return tl('{0} must be a number.', { 0: tl(label) });
  if (integer && !Number.isInteger(n)) return tl('{0} must be a whole number.', { 0: tl(label) });
  if (n < min || n > max) return tl('{0} must be between {1} and {2}.', { 0: tl(label), 1: min, 2: max });
  return '';
}

/** Keep only the entries that have a message. */
export function onlyErrors(map) {
  return Object.fromEntries(Object.entries(map).filter(([, v]) => v));
}
