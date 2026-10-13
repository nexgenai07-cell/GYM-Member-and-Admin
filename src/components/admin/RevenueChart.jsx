// src/components/admin/RevenueChart.jsx
import { motion } from 'framer-motion';

export default function RevenueChart({ data = [], loading }) {
  const rows = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="bg-surface-container p-6 rounded-xl h-96 animate-pulse" />
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-surface-container p-6 rounded-xl">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            show_chart
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            No revenue data yet
          </p>
        </div>
      </div>
    );
  }

  const maxRev = Math.max(...rows.map((r) => Math.max(r.revenue, r.target)), 1);
  const minRev = 0;
  const chartHeight = 220;
  const range = maxRev - minRev;

  const points = rows.map((r, i) => {
    const x = (i / Math.max(rows.length - 1, 1)) * 600;
    const y = chartHeight - ((r.revenue - minRev) / range) * (chartHeight - 40);
    return { x, y, ...r };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L 600 ${chartHeight} L 0 ${chartHeight} Z`;

  const targetPath = rows
    .map((r, i) => {
      const x = (i / Math.max(rows.length - 1, 1)) * 600;
      const y = chartHeight - ((r.target - minRev) / range) * (chartHeight - 40);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const latest = rows[rows.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            Revenue Trajectory
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Monthly Revenue vs Target
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-1 bg-primary-container rounded-full" />
            <span className="font-label-md text-[10px] text-on-surface">Actual</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-1 bg-outline rounded-full" />
            <span className="font-label-md text-[10px] text-on-surface-variant">
              Target
            </span>
          </div>
        </div>
      </div>

      <div className="w-full mt-6">
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 600 ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#e51937" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#e51937" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                stroke="#2a2a2b"
                strokeDasharray="3 3"
                strokeWidth="1"
                x1="0"
                x2="600"
                y1={chartHeight * p}
                y2={chartHeight * p}
              />
            ))}

            <motion.path
              d={areaPath}
              fill="url(#revGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />

            <motion.path
              d={targetPath}
              fill="none"
              stroke="#ad8886"
              strokeDasharray="6 4"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />

            <motion.path
              d={linePath}
              fill="none"
              stroke="#e51937"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />

            {points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 6 : 3.5}
                fill={i === points.length - 1 ? '#fffcff' : '#e51937'}
                stroke={i === points.length - 1 ? '#e51937' : 'none'}
                strokeWidth={i === points.length - 1 ? 3 : 0}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
              />
            ))}
          </svg>

          <div className="absolute top-0 right-0 flex flex-col items-end">
            <span className="font-headline-md text-headline-md text-primary leading-none">
              ${Number(latest.revenue).toLocaleString()}
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              Current Month
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider pt-3 border-t border-surface-container-high mt-3">
          {rows.map((r, i) => (
            <span
              key={r.month}
              className={i === rows.length - 1 ? 'text-primary font-bold' : ''}
            >
              {r.short || r.month}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-surface-container-high">
        <Insight
          label="12M Total"
          value={`$${rows.reduce((s, r) => s + r.revenue, 0).toLocaleString()}`}
        />
        <Insight
          label="Avg Monthly"
          value={`$${Math.round(
            rows.reduce((s, r) => s + r.revenue, 0) / rows.length
          ).toLocaleString()}`}
        />
        <Insight
          label="Target Hit Rate"
          value={`${Math.round(
            (rows.filter((r) => r.revenue >= r.target * 0.9).length / rows.length) * 100
          )}%`}
          accent
        />
        <Insight
          label="Trend"
          value={
            rows.length > 1 && rows[rows.length - 2].revenue > 0
              ? `${
                  rows[rows.length - 1].revenue > rows[rows.length - 2].revenue
                    ? '+'
                    : ''
                }${(
                  ((rows[rows.length - 1].revenue - rows[rows.length - 2].revenue) /
                    rows[rows.length - 2].revenue) *
                  100
                ).toFixed(1)}%`
              : '—'
          }
          accent
        />
      </div>
    </motion.div>
  );
}

function Insight({ label, value, accent }) {
  return (
    <div>
      <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider block">
        {label}
      </span>
      <span
        className={`font-title-lg text-title-lg mt-1 block ${
          accent ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
    </div>
  );
}