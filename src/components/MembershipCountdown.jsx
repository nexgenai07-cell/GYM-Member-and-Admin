// src/components/MembershipCountdown.jsx
// Member dashboard card: time left on the membership, counted from the day the
// registration was approved (membership.start_date) to membership.expiry_date.
import { motion } from 'framer-motion';
import { formatDate } from '../utils/membershipTime';

function Figure({ value, unit }) {
  return (
    <div className="flex items-baseline gap-space-2xs">
      <span className="font-headline-lg text-[44px] leading-none text-on-surface tabular-nums">{value}</span>
      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{unit}</span>
    </div>
  );
}

export default function MembershipCountdown({ membership, loading }) {
  if (loading) {
    return <div className="h-[148px] rounded-lg bg-surface-container animate-pulse" aria-hidden="true" />;
  }
  if (!membership) {
    return (
      <div className="rounded-lg bg-surface-container p-space-lg flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-on-surface-variant">card_membership</span>
        <span className="font-body-md text-on-surface-variant">No active membership.</span>
      </div>
    );
  }

  const t = membership.time_remaining || {};
  const expired = !!t.expired;
  const used = Math.min(100, Math.max(0, t.percent_used ?? 0));
  const ending = !expired && (t.total_days_remaining ?? 0) <= 7;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg p-space-lg shadow-md flex flex-col gap-space-md ${
        expired ? 'bg-error/10 border border-error/40' : 'bg-surface-container'
      }`}
      aria-label="Membership time remaining"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
            Membership · {membership.plan?.name || 'Plan'}
          </span>
          {expired ? (
            <span className="font-headline-lg text-[36px] leading-none text-error uppercase">Expired</span>
          ) : (
            <div className="flex items-end gap-space-lg">
              <Figure value={t.months ?? 0} unit={t.months === 1 ? 'month' : 'months'} />
              <Figure value={t.days ?? 0} unit={t.days === 1 ? 'day' : 'days'} />
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest pb-1">
                left
              </span>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-space-lg gap-y-space-2xs text-right md:text-left">
          <dt className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Started (approved)</dt>
          <dt className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Expires</dt>
          <dd className="font-title-md text-[15px] text-on-surface">{formatDate(membership.start_date)}</dd>
          <dd className={`font-title-md text-[15px] ${ending || expired ? 'text-error' : 'text-on-surface'}`}>
            {formatDate(membership.expiry_date)}
          </dd>
        </dl>
      </div>

      <div className="flex flex-col gap-space-2xs">
        <div
          className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={used}
          aria-label="Share of the plan used"
        >
          <div
            className={`h-full rounded-full ${expired || ending ? 'bg-error' : 'bg-primary-container'}`}
            style={{ width: `${used}%` }}
          />
        </div>
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {expired
            ? 'Renew to keep access'
            : `${t.total_days_remaining ?? 0} of ${t.plan_total_days ?? 0} days left${ending ? ' · ending soon' : ''}`}
        </span>
      </div>
    </motion.section>
  );
}
