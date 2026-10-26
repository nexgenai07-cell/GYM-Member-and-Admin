// src/utils/membershipTime.js
// Formats the backend's membership.time_remaining
// ({ months, days, total_days_remaining, plan_total_days, percent_used, expired }).
// The countdown starts on start_date — the day the registration was approved.
import { isAr, tl } from '../i18n';

const plural = (n, word) => (isAr
  ? `${n} ${word === 'month' ? (n === 1 ? 'شهر' : n === 2 ? 'شهران' : n <= 10 ? 'أشهر' : 'شهرًا') : (n === 1 ? 'يوم' : n === 2 ? 'يومان' : n <= 10 ? 'أيام' : 'يومًا')}`
  : `${n} ${word}${n === 1 ? '' : 's'}`);

/** "2 months 14 days" · "14 days" · "3 months" · "Expired" · "—" */
export function formatRemaining(timeRemaining) {
  if (!timeRemaining) return '—';
  if (timeRemaining.expired) return tl('Expired');
  const { months, days } = timeRemaining;
  const parts = [];
  if (months) parts.push(plural(months, 'month'));
  if (days || !months) parts.push(plural(days, 'day'));
  return parts.join(isAr ? ' و' : ' ');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/** "20 Oct 2026" (Arabic: "20 أكتوبر 2026") from an ISO date ("2026-10-20"), without timezone shifts. */
export function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return `${d} ${(isAr ? MONTHS_AR : MONTHS)[m - 1]} ${y}`;
}
