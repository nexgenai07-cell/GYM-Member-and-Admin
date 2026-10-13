// src/components/admin/Scorecards.jsx
import { motion } from 'framer-motion';

export default function Scorecards({ overview, loading }) {
  const cards = [
    {
      label: 'Monthly Recurring Revenue',
      value: overview
        ? `$${Math.round(overview.revenue.last_30d).toLocaleString()}`
        : '$0',
      icon: 'payments',
      accent: true,
      breakdown: {
        label: 'Live revenue stream',
        bars: [
          { width: 64, color: 'bg-primary-container' },
          { width: 26, color: 'bg-primary' },
          { width: 10, color: 'bg-surface-variant' },
        ],
      },
      footerLeft: `${overview?.revenue?.transaction_count ?? 0} settled transactions`,
      footerRight: 'Last 30 days',
    },
    {
      label: 'Active Memberships',
      value: overview?.members?.active_memberships ?? 0,
      suffix: `/ ${overview?.members?.total ?? 0}`,
      icon: 'stadium',
      accent: true,
      progress: overview && overview.members.total > 0
        ? Math.round((overview.members.active_memberships / overview.members.total) * 100)
        : 0,
      progressLabel: 'Active ratio',
      progressValue: `${
        overview && overview.members.total > 0
          ? Math.round((overview.members.active_memberships / overview.members.total) * 100)
          : 0
      }%`,
      footerLeft: `${overview?.members?.expiring_soon ?? 0} expiring in 14 days`,
      footerRight: 'Safety threshold: Normal',
    },
    {
      label: 'Content Pipeline',
      value: overview?.content?.active_courses ?? 0,
      icon: 'school',
      accent: false,
      breakdown2: [
        { label: 'Live Courses', value: overview?.content?.active_courses ?? 0, accent: false },
        { label: 'Pending', value: overview?.content?.pending_approvals ?? 0, accent: true },
      ],
      footerLeft:
        (overview?.content?.pending_approvals ?? 0) > 0
          ? `⚠️ ${overview.content.pending_approvals} awaiting review`
          : '✓ All approved',
      footerRight: 'Content queue',
    },
    {
      label: 'Platform Activity',
      value: overview?.activity?.workouts_30d ?? 0,
      icon: 'fitness_center',
      accent: true,
      dualMetric: [
        { label: 'Workouts (30d)', value: overview?.activity?.workouts_30d ?? 0, accent: false },
        { label: 'Shop Orders', value: overview?.activity?.orders_30d ?? 0, accent: true },
      ],
      footerLeft: `${overview?.activity?.check_ins_today ?? 0} check-ins today`,
      footerRight: '',
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* ⬇️ CHANGED: cards.map, not scorecards.map */}
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
          className="relative bg-surface-container p-6 rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-all"
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${
              c.accent ? 'bg-primary-container' : 'bg-surface-variant'
            }`}
          />

          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
                {c.label}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display-xl text-display-xl text-on-surface tracking-wide">
                  {loading ? '...' : c.value}
                </span>
                {c.suffix && (
                  <span className="font-headline-md text-headline-md text-on-surface-variant">
                    {c.suffix}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`p-2 rounded-lg ${
                c.accent
                  ? 'bg-surface-container-high text-primary-container'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
            </div>
          </div>

          {/* MRR breakdown (sparkline) */}
          {c.breakdown && (
            <div className="my-4">
              <svg
                className="w-full h-12 overflow-visible"
                fill="none"
                viewBox="0 0 240 48"
              >
                <path
                  className="text-primary-container"
                  d="M0 42L25 36L55 38L85 24L115 28L145 16L175 22L205 8L240 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  className="text-primary-container"
                  d="M0 42L25 36L55 38L85 24L115 28L145 16L175 22L205 8L240 2V48H0Z"
                  fill="currentColor"
                  fillOpacity="0.12"
                />
              </svg>
            </div>
          )}

          {c.breakdown && (
            <div className="flex flex-col gap-1 pt-2 bg-surface-container-low/50 p-2 rounded-lg">
              <div className="flex items-center justify-between font-label-md text-[10px]">
                <span className="text-primary font-bold">{c.footerLeft}</span>
                <span className="text-on-surface-variant">{c.footerRight}</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden flex">
                {c.breakdown.bars.map((b, idx) => (
                  <div
                    key={idx}
                    className={`${b.color} h-full`}
                    style={{ width: `${b.width}%` }}
                  />
                ))}
              </div>
              <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                {c.breakdown.label}
              </span>
            </div>
          )}

          {/* Progress gauge */}
          {c.progress !== undefined && (
            <>
              <div className="my-4 flex flex-col gap-1.5">
                <div className="flex justify-between font-label-md text-[10px]">
                  <span className="text-on-surface">{c.progressLabel}</span>
                  <span className="text-primary font-bold">{c.progressValue}</span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="bg-primary-container h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.progress}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low/50 p-2 rounded-lg">
                <span className="font-label-md text-[10px] text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    schedule
                  </span>
                  {c.footerLeft}
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant">
                  {c.footerRight}
                </span>
              </div>
            </>
          )}

          {/* Content pipeline dual metric */}
          {c.breakdown2 && (
            <>
              <div className="my-4 grid grid-cols-2 gap-2">
                {c.breakdown2.map((b) => (
                  <div
                    key={b.label}
                    className="bg-surface-container-lowest p-2 rounded-lg"
                  >
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                      {b.label}
                    </span>
                    <span
                      className={`block font-title-lg text-title-lg mt-1 ${
                        b.accent ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {b.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low/50 p-2 rounded-lg">
                <div className="flex items-center justify-between font-label-md text-[10px]">
                  <span className="text-on-surface-variant">{c.footerLeft}</span>
                  <span className="text-on-surface-variant uppercase">
                    {c.footerRight}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Platform dual metric */}
          {c.dualMetric && (
            <>
              <div className="my-4 flex items-center justify-between bg-surface-container-lowest p-2 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-label-md text-[10px] text-on-surface-variant">
                    {c.dualMetric[0].label}
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface">
                    {c.dualMetric[0].value}
                  </span>
                </div>
                <div className="h-8 w-px bg-surface-variant" />
                <div className="flex flex-col">
                  <span className="font-label-md text-[10px] text-on-surface-variant">
                    {c.dualMetric[1].label}
                  </span>
                  <span className="font-headline-md text-headline-md text-primary">
                    {c.dualMetric[1].value}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low/50 p-2 rounded-lg">
                <span className="font-label-md text-[10px] text-on-surface-variant">
                  {c.footerLeft}
                </span>
              </div>
            </>
          )}
        </motion.div>
      ))}
    </section>
  );
}