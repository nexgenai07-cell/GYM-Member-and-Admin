// src/components/admin/FlowAndRevenue.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

// Build a smooth SVG path from hourly counts
// viewBox: 0 0 600 240
// Hour 0 → x=0, hour 23 → x=600
// Y: 0 check-ins → y=230 (bottom), max → y=20 (top)
function buildPath(hourly, key) {
  if (!hourly || hourly.length === 0) return { line: '', area: '' };

  const maxVal = Math.max(...hourly.map((h) => h[key]), 1);

  const points = hourly.map((h, i) => {
    const x = (i / 23) * 600;
    const y = 230 - (h[key] / maxVal) * 210;
    return [x, y];
  });

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ');

  const area = `${line} L600,240 L0,240 Z`;

  return { line, area };
}

export default function FlowAndRevenue({ data, loading }) {
  const reduce = useReducedMotion();
  const today = data?.flow?.today || [];
  const mean = data?.flow?.rolling_mean || [];
  const streams = data?.revenue_streams || [];
  const summary = data?.summary || {};

  const todayPaths = buildPath(today, 'count');
  const meanPaths = buildPath(mean, 'count');

  const peak = today.reduce(
    (best, h) => (h.count > (best?.count ?? 0) ? h : best),
    null
  );

  const peakHourLabel = peak ? String(peak.hour).padStart(2, '0') : null;

  const chartAriaLabel =
    peak && peak.count > 0
      ? tl('Check-ins by hour, today vs 30-day average. Peak {0} at {1}:00.', {
          0: peak.count,
          1: peakHourLabel,
        })
      : tl('Check-ins by hour, today vs 30-day average. No check-ins today.');

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      aria-label={tl('Check-ins and revenue')}
    >
      {/* Flow chart */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.2 }}
        className="lg:col-span-7 bg-surface-container p-6 rounded-xl shadow-md flex flex-col justify-between"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              {tl('Check-ins by hour')}
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              {tl('Today vs 30-day average')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-primary-container rounded-full" aria-hidden="true" />
              <span className="font-label-md text-[10px] text-on-surface">{tl('Today')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-outline rounded-full" aria-hidden="true" />
              <span className="font-label-md text-[10px] text-on-surface-variant">
                {tl('30D Rolling Mean')}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 my-4 bg-surface-container-lowest rounded-lg animate-pulse" aria-busy="true" />
        ) : (
          <div className="w-full my-4">
            <div className="h-64 w-full relative flex items-end">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 600 240"
                role="img"
                aria-label={chartAriaLabel}
              >
                {/* Historical mean — dashed */}
                {meanPaths.line && (
                  <path
                    d={meanPaths.line}
                    fill="none"
                    stroke="#7a7a7a"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                  />
                )}

                {/* Today's area */}
                {todayPaths.area && (
                  <motion.path
                    d={todayPaths.area}
                    fill="#e51937"
                    fillOpacity="0.18"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5 }}
                  />
                )}

                {/* Today's line */}
                {todayPaths.line && (
                  <motion.path
                    d={todayPaths.line}
                    fill="none"
                    stroke="#e51937"
                    strokeWidth="3"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: reduce ? 0 : 1.5, delay: reduce ? 0 : 0.3 }}
                  />
                )}

                {/* Peak dot */}
                {peak && peak.count > 0 && (
                  <circle
                    cx={(peak.hour / 23) * 600}
                    cy={230 - (peak.count / Math.max(...today.map((h) => h.count), 1)) * 210}
                    r="5"
                    fill="#e51937"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </div>

            <div className="flex justify-between items-center text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider pt-2">
              {[0, 4, 8, 12, 16, 20, 23].map((h) => (
                <span
                  key={h}
                  className={peak && peak.hour === h ? 'text-primary font-bold' : ''}
                >
                  {h.toString().padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[18px]" aria-hidden="true">
              info
            </span>
            <span className="font-body-md text-body-md text-on-surface text-[13px]">
              {peak && peak.count > 0
                ? tl("Today's peak: {0} check-ins at {1}:00.", {
                    0: peak.count,
                    1: peakHourLabel,
                  })
                : tl('No check-ins today yet.')}
            </span>
          </div>
          <span className="font-label-md text-[10px] text-primary font-bold uppercase tracking-wider">
            {tl('Today')}
          </span>
        </div>
      </motion.div>

      {/* Revenue */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 }}
        className="lg:col-span-5 bg-surface-container p-6 rounded-xl shadow-md flex flex-col justify-between"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              {summary.range_label || tl('Revenue')}
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              {tl('Where revenue comes from')}
            </h2>
          </div>
          <span className="font-title-md text-title-md text-on-surface font-mono tabular-nums whitespace-nowrap">
            {formatSAR(summary.total_30d)}
          </span>
        </div>

        <div className="flex flex-col gap-4 my-4">
          {streams.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-[13px]" role="status">
              {tl('No payments in this period')}
            </div>
          ) : (
            streams.map((r, i) => (
              <motion.div
                key={r.label}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={reduce ? false : { opacity: 1, x: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.4 + i * 0.1 }}
                className="flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-baseline font-label-md text-[10px] gap-2">
                  <span className="text-on-surface font-bold uppercase tracking-wider truncate">
                    {r.label}
                  </span>
                  <span className="text-on-surface font-mono tabular-nums whitespace-nowrap">
                    {tl('{0} ({1}%)', { 0: formatSAR(r.value), 1: r.percent })}
                  </span>
                </div>
                <div
                  className="w-full bg-surface-container-lowest h-3 rounded-lg overflow-hidden"
                  role="progressbar"
                  aria-valuenow={r.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={r.label}
                >
                  <motion.div
                    className={`${r.color} h-full rounded-lg`}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${r.percent}%` }}
                    transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.5 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-surface-container-lowest rounded-lg">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
              {tl('Avg per paying member')}
            </span>
            <span className="font-headline-md text-headline-md text-on-surface tabular-nums">
              {formatSAR(summary.avg_per_member)}
            </span>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
              {tl('Annual run rate')}
            </span>
            <span className="font-headline-md text-headline-md text-primary tabular-nums">
              {formatSAR(summary.arr)}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}