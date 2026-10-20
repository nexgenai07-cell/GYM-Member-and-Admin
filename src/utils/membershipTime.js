// src/utils/membershipTime.js
// Formats the backend's membership.time_remaining
// ({ months, days, total_days_remaining, plan_total_days, percent_used, expired }).
// The countdown starts on start_date — the day the registration was approved.

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** "2 months 14 days" · "14 days" · "3 months" · "Expired" · "—" */
export function formatRemaining(timeRemaining) {
  if (!timeRemaining) return '—';
  if (timeRemaining.expired) return 'Expired';
  const { months, days } = timeRemaining;
  const parts = [];
  if (months) parts.push(plural(months, 'month'));
  if (days || !months) parts.push(plural(days, 'day'));
  return parts.join(' ');
}

/** "20 Oct 2026" from an ISO date ("2026-10-20"), without timezone shifts. */
export function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}
