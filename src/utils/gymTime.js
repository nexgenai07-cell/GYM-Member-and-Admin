import { locale } from '../i18n';
// src/utils/gymTime.js — show times in the gym's time zone (bookings, sessions),
// whatever time zone the viewer's device is set to. Matches the backend TIME_ZONE.
export const GYM_TZ = import.meta.env.VITE_GYM_TIME_ZONE || 'Asia/Riyadh';

/** "Thu 22 Oct, 09:00" in gym time. */
export function formatGymDateTime(iso, opts = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(locale, { ...opts, timeZone: GYM_TZ, hour12: false });
}
