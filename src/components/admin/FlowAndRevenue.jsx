// src/components/admin/FlowAndRevenue.jsx
import { motion } from 'framer-motion';

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

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Flow chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-7 bg-surface-container p-6 rounded-xl shadow-md flex flex-col justify-between"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              Turnstile Flow Analysis
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              24-Hour Arena Load vs 30D Baseline
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-primary-container rounded-full" />
              <span className="font-label-md text-[10px] text-on-surface">Today</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1 bg-outline rounded-full" />
              <span className="font-label-md text-[10px] text-on-surface-variant">
                30D Rolling Mean
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 my-4 bg-surface-container-lowest rounded-lg animate-pulse" />
        ) : (
          <div className="w-full my-4">
            <div className="h-64 w-full relative flex items-end">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 600 240"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                )}

                {/* Today's line */}
                {todayPaths.line && (
                  <motion.path
                    d={todayPaths.line}
                    fill="none"
                    stroke="#e51937"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
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
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              info
            </span>
            <span className="font-body-md text-body-md text-on-surface text-[13px]">
              {peak && peak.count > 0
                ? `Today's peak: ${peak.count} check-ins at ${String(peak.hour).padStart(2, '0')}:00.`
                : 'No check-ins today yet.'}
            </span>
          </div>
          <span className="font-label-md text-[10px] text-primary font-bold uppercase tracking-wider">
            Live Feed
          </span>
        </div>
      </motion.div>

      {/* Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:col-span-5 bg-surface-container p-6 rounded-xl shadow-md flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              Financial Engine
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              Revenue Protocol Streams
            </h2>
          </div>
          <span className="font-title-md text-title-md text-on-surface font-mono">
            ${Number(summary.total_30d || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-4 my-4">
          {streams.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-[13px]">
              No revenue streams in the last 30 days
            </div>
          ) : (
            streams.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-baseline font-label-md text-[10px]">
                  <span className="text-on-surface font-bold uppercase tracking-wider">
                    {r.label}
                  </span>
                  <span className="text-on-surface font-mono">
                    ${Number(r.value).toLocaleString()} ({r.percent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-container-lowest h-3 rounded-lg overflow-hidden">
                  <motion.div
                    className={`${r.color} h-full rounded-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${r.percent}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-surface-container-lowest rounded-lg">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
              Avg Revenue / Lifter
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              ${Number(summary.avg_per_member || 0).toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-surface-container-lowest rounded-lg">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
              Run Rate (ARR)
            </span>
            <span className="font-headline-md text-headline-md text-primary">
              ${Math.round((summary.arr || 0) / 1000)}K
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}