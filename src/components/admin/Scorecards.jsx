// src/components/admin/Scorecards.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

function ValueSkeleton({ width = 'w-20' }) {
  return <span className={`inline-block h-6 rounded bg-surface-container-highest animate-pulse ${width}`} />;
}

function CardHeader({ label, icon, accent }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant truncate">
        {label}
      </span>
      <span
        className={`p-2 rounded-lg shrink-0 ${
          accent ? 'bg-surface-container-high text-primary-container' : 'bg-surface-container-high text-on-surface'
        }`}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
    </div>
  );
}

export default function Scorecards({ overview, loading }) {
  const reduce = useReducedMotion();
  const activePct = overview && overview.members?.total > 0
    ? Math.round((overview.members.active_memberships / overview.members.total) * 100)
    : 0;

  const cards = [
    {
      key: 'revenue',
      label: tl('Revenue received'),
      value: overview ? formatSAR(overview.revenue.last_30d) : '—',
      icon: 'payments',
      accent: true,
      footerLeft: tl('{0} payments via card, STC Pay, top-ups', {
        0: overview?.revenue?.transaction_count ?? 0,
      }),
      footerRight: overview?.revenue?.range_label || '',
    },
    {
      key: 'memberships',
      label: tl('Active Memberships'),
      value: overview?.members?.active_memberships ?? 0,
      suffix: `/ ${overview?.members?.total ?? 0}`,
      icon: 'stadium',
      accent: true,
      progress: activePct,
      progressLabel: tl('Active ratio'),
      progressValue: `${activePct}%`,
      footerLeft: tl('{0} expiring in 14 days', { 0: overview?.members?.expiring_soon ?? 0 }),
    },
    {
      key: 'content',
      label: tl('Content Pipeline'),
      value: overview?.content?.active_courses ?? 0,
      icon: 'school',
      accent: false,
      breakdown2: [
        { label: tl('Live Courses'), value: overview?.content?.active_courses ?? 0, accent: false },
        { label: tl('Pending'), value: overview?.content?.pending_approvals ?? 0, accent: true },
      ],
      footerLeft:
        (overview?.content?.pending_approvals ?? 0) > 0
          ? tl('{0} awaiting review', { 0: overview.content.pending_approvals })
          : tl('None awaiting review'),
    },
    {
      key: 'activity',
      label: tl('Member activity'),
      value: overview?.activity?.workouts_30d ?? 0,
      icon: 'fitness_center',
      accent: true,
      dualMetric: [
        { label: tl('Workouts (30d)'), value: overview?.activity?.workouts_30d ?? 0, accent: false },
        { label: tl('Shop Orders'), value: overview?.activity?.orders_30d ?? 0, accent: true },
      ],
      footerLeft: tl('{0} check-ins today', { 0: overview?.activity?.check_ins_today ?? 0 }),
    },
  ];

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      aria-label={tl('Key metrics')}
      aria-busy={loading}
    >
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 + i * 0.08 }}
          className="relative bg-surface-container p-6 rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors"
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${c.accent ? 'bg-primary-container' : 'bg-surface-variant'}`}
            aria-hidden="true"
          />

          <CardHeader label={c.label} icon={c.icon} accent={c.accent} />

          <div className="flex items-baseline gap-2 mt-2 min-w-0">
            <span className="font-display-xl text-display-xl text-on-surface tracking-wide tabular-nums truncate">
              {loading && !overview ? <ValueSkeleton /> : c.value}
            </span>
            {c.suffix && (
              <span className="font-headline-md text-headline-md text-on-surface-variant shrink-0">
                {c.suffix}
              </span>
            )}
          </div>

          {c.progress !== undefined && (
            <div className="my-4 flex flex-col gap-1.5">
              <div className="flex justify-between font-label-md text-[10px]">
                <span className="text-on-surface">{c.progressLabel}</span>
                <span className="text-primary font-bold tabular-nums">{c.progressValue}</span>
              </div>
              <div
                className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5"
                role="progressbar"
                aria-valuenow={c.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={c.progressLabel}
              >
                <motion.div
                  className="bg-primary-container h-full rounded-full"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.4 }}
                />
              </div>
            </div>
          )}

          {c.breakdown2 && (
            <div className="my-4 grid grid-cols-2 gap-2">
              {c.breakdown2.map((b) => (
                <div key={b.label} className="bg-surface-container-lowest p-2 rounded-lg">
                  <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                    {b.label}
                  </span>
                  <span
                    className={`block font-title-lg text-title-lg mt-1 tabular-nums ${
                      b.accent ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {b.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {c.dualMetric && (
            <div className="my-4 flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg">
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                  {c.dualMetric[0].label}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface tabular-nums">
                  {c.dualMetric[0].value}
                </span>
              </div>
              <div className="h-8 w-px bg-surface-variant shrink-0" aria-hidden="true" />
              <div className="flex flex-col min-w-0 text-right">
                <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                  {c.dualMetric[1].label}
                </span>
                <span className="font-headline-md text-headline-md text-primary tabular-nums">
                  {c.dualMetric[1].value}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1 bg-surface-container-low/50 p-2 rounded-lg mt-auto">
            <div className="flex items-center justify-between font-label-md text-[10px] gap-2 min-w-0">
              <span className="text-on-surface-variant truncate">{c.footerLeft}</span>
              {c.footerRight && (
                <span className="text-on-surface-variant uppercase shrink-0">{c.footerRight}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}