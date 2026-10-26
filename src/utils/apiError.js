// src/utils/apiError.js
// DRF errors come back as { detail } or { field: ["msg"] } or nested
// ({ data: { title: "Required." } } from the site-content lists).

import { tl } from '../i18n';

/** Field → message map (one level deep under `data` for list items). */
export function fieldErrors(err) {
  const body = err?.response?.data;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const src = body.data && typeof body.data === 'object' && !Array.isArray(body.data) ? body.data : body;
  const out = {};
  for (const [field, value] of Object.entries(src)) {
    if (field === 'detail') continue;
    out[field] = Array.isArray(value) ? value.join(' ') : String(value);
  }
  return out;
}

/** One human sentence for a toast. */
export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const body = err?.response?.data;
  if (!err?.response) return tl('Network error — check your connection.');
  if (body?.detail) return tl(String(body.detail));
  const fields = fieldErrors(err);
  const first = Object.entries(fields)[0];
  if (first) return `${tl(first[0].replace(/_/g, ' '))}: ${tl(first[1])}`;
  return tl(fallback);
}
