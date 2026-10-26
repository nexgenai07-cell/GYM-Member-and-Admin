// src/i18n/index.js
// English / Arabic for the whole portal. English text is the key; ar.json holds the Arabic.
// Anything without a translation shows in English. Switching language reloads the page so
// every label (including ones built at import time) picks it up; Arabic is right-to-left.
import AR from './ar.json';

const KEY = 'sg-lang';
const read = () => {
  try {
    return localStorage.getItem(KEY) === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
};

export const lang = read();
export const isAr = lang === 'ar';

if (typeof document !== 'undefined') {
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
}

/** tl('Save') → 'حفظ' in Arabic. `{name}` placeholders are filled from vars. */
export function tl(text, vars) {
  if (text == null) return text;
  let out = isAr ? (AR[text] ?? AR[String(text).trim()] ?? text) : text;
  if (vars) Object.entries(vars).forEach(([k, v]) => { out = out.split(`{${k}}`).join(v); });
  return out;
}

export function setLang(next) {
  try {
    localStorage.setItem(KEY, next === 'ar' ? 'ar' : 'en');
  } catch { /* private mode: stays as is */ }
  window.location.reload();
}

/** Locale for numbers and dates. */
export const locale = isAr ? 'ar-SA-u-nu-latn' : 'en-GB';
