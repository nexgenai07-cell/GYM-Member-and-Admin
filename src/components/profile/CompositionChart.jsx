// src/components/profile/CompositionChart.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { tl } from '../../i18n';

const TIMEFRAMES = ['1M', '3M', '6M', '1Y', 'ALL'];

// Convert a list of {date, lean_mass_kg, body_fat_percent} → SVG path
// X spans 20 → 580 (viewBox 0 0 600 220)
// Y: lean maps from 0kg→190 (bottom) to 100kg→40 (top) — adjust as needed
// Y: bf maps from 0%→190 to 40%→40
function buildPaths(history) {
  if (!history || history.length < 2) return { leanPath: '', fatPath: '', points: [] };

  const sorted = [...history].sort(
    (a, b) => new Date(a.scan_date) - new Date(b.scan_date)
  );

  const leanValues = sorted.map((h) => Number(h.lean_mass_kg));
  const bfValues = sorted.map((h) => Number(h.body_fat_percent));

  const maxLean = Math.max(...leanValues, 1);
  const minLean = Math.min(...leanValues, 0);
  const maxBf = Math.max(...bfValues, 1);
  const minBf = Math.min(...bfValues, 0);

  const spanX = 560; // 20 → 580
  const chartTop = 40;
  const chartBottom = 190;
  const chartHeight = chartBottom - chartTop;

  const xFor = (i) => 20 + (i / Math.max(sorted.length - 1, 1)) * spanX;
  const yForLean = (v) => {
    const range = maxLean - minLean || 1;
    return chartBottom - ((v - minLean) / range) * chartHeight;
  };
  const yForBf = (v) => {
    const range = maxBf - minBf || 1;
    return chartBottom - ((v - minBf) / range) * chartHeight;
  };

  const leanPoints = sorted.map((h, i) => [
    xFor(i),
    yForLean(Number(h.lean_mass_kg)),
  ]);
  const bfPoints = sorted.map((h, i) => [xFor(i), yForBf(Number(h.body_fat_percent))]);

  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const leanPath = toPath(leanPoints);
  const fatPath = toPath(bfPoints);

  // Area path closes to bottom
  const leanAreaPath = leanPath
    ? `${leanPath} L${leanPoints[leanPoints.length - 1][0].toFixed(1)},190 L${leanPoints[0][0].toFixed(1)},190 Z`
    : '';

  return {
    leanPath,
    fatPath,
    leanAreaPath,
    leanPoints,
    bfPoints,
    sorted,
    latestLean: leanValues[leanValues.length - 1],
    latestBf: bfValues[bfValues.length - 1],
  };
}

export default function CompositionChart({ dexaHistory = [], stats }) {
  const [active, setActive] = useState('6M');

  // Filter history by timeframe
  const filtered = useMemo(() => {
    if (active === 'ALL' || dexaHistory.length === 0) return dexaHistory;
    const now = new Date();
    const days = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[active] || 9999;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return dexaHistory.filter((h) => new Date(h.scan_date) >= cutoff);
  }, [dexaHistory, active]);

  const { leanPath, fatPath, leanAreaPath, leanPoints, bfPoints, sorted, latestLean, latestBf } =
    buildPaths(filtered);

  const hasData = filtered.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg bg-surface-container p-space-xl flex flex-col justify-between shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">
            {tl("Telemetry History")}
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
            {tl("Lean Mass vs Body Fat %")}
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded">
          {TIMEFRAMES.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-space-xs py-1 rounded font-label-md text-label-md font-bold transition-all ${
                active === t
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-16 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            insights
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            {tl("Not enough DEXA history")}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tl("Need at least 2 scans in this timeframe to plot the trend.")}
          </p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-72 flex flex-col justify-end">
            <div className="absolute top-0 right-0 flex items-center gap-space-md font-label-md text-label-md">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary-container" />
                <span className="text-on-surface">{tl("Lean Muscle Mass (kg)")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-outline-variant" />
                <span className="text-on-surface-variant">{tl("Body Fat % (DEXA)")}</span>
              </div>
            </div>

            <svg className="w-full h-56 overflow-visible" viewBox="0 0 600 220">
              {[40, 90, 140, 190].map((y) => (
                <line
                  key={y}
                  className="text-surface-container-high"
                  stroke="currentColor"
                  strokeDasharray={y === 190 ? '0' : '4 4'}
                  strokeWidth="1"
                  x1="0"
                  x2="600"
                  y1={y}
                  y2={y}
                />
              ))}

              <defs>
                <linearGradient id="muscleGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#e51937" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#e51937" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {leanAreaPath && (
                <path d={leanAreaPath} fill="url(#muscleGradient)" />
              )}

              {leanPath && (
                <motion.path
                  d={leanPath}
                  fill="none"
                  stroke="#e51937"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />
              )}

              {fatPath && (
                <motion.path
                  d={fatPath}
                  fill="none"
                  stroke="#ad8886"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
              )}

              {leanPoints.map(([cx, cy], i) => (
                <circle key={`l-${i}`} cx={cx} cy={cy} fill="#e51937" r="4" />
              ))}
              {bfPoints.map(([cx, cy], i) => (
                <circle key={`b-${i}`} cx={cx} cy={cy} fill="#ad8886" r="3" />
              ))}

              {/* Endpoint highlight */}
              {leanPoints.length > 0 && (
                <circle
                  className="filter drop-shadow-[0_0_8px_rgba(229,25,55,0.8)]"
                  cx={leanPoints[leanPoints.length - 1][0]}
                  cy={leanPoints[leanPoints.length - 1][1]}
                  fill="#fffcff"
                  r="6"
                  stroke="#e51937"
                  strokeWidth="3"
                />
              )}

              {latestLean !== undefined && (
                <text
                  fill="#fffcff"
                  fontFamily="Montserrat"
                  fontSize="12"
                  fontWeight="700"
                  x="530"
                  y="45"
                >
                  {latestLean.toFixed(1)}{' '}{tl("KG")}
                </text>
              )}
              {latestBf !== undefined && (
                <text
                  fill="#ffb3b1"
                  fontFamily="Montserrat"
                  fontSize="12"
                  fontWeight="700"
                  x="530"
                  y="175"
                >
                  {latestBf.toFixed(1)}%
                </text>
              )}
            </svg>

            <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md mt-2 pt-2 border-t border-surface-container-high">
              {sorted.map((h, i) => (
                <span
                  key={h.id}
                  className={
                    i === sorted.length - 1 ? 'text-primary font-bold' : ''
                  }
                >
                  {new Date(h.scan_date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: '2-digit',
                  })}
                </span>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg pt-space-md border-t border-surface-container-high">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                {tl("Lean Mass Change")}
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-1">
                {(
                  Number(sorted[sorted.length - 1].lean_mass_kg) -
                  Number(sorted[0].lean_mass_kg)
                ).toFixed(1)}{' '}
                kg
              </p>
              <span className="font-label-md text-label-md text-primary">
                {tl("Across")}{' '}{sorted.length} scans
              </span>
            </div>

            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                {tl("Body Fat Change")}
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-1">
                {(
                  Number(sorted[sorted.length - 1].body_fat_percent) -
                  Number(sorted[0].body_fat_percent)
                ).toFixed(1)}
                %
              </p>
              <span className="font-label-md text-label-md text-primary">
                {tl("Net movement")}
              </span>
            </div>

            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                {tl("Total Tonnage")}
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-1">
                {Math.round((stats?.total_tonnage_all_time ?? 0) / 1000)}{' '}{tl("K kg")}
              </p>
              <span className="font-label-md text-label-md text-primary">
                {tl("All-time lifted")}
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}