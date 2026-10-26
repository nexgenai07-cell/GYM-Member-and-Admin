// src/components/admin/MonthlyColumns.jsx
// One value per month as columns (single series → one hue, no legend; the title names it).
// Hover a column for its value; a visually hidden table carries the same data.
import { useState } from 'react';
import { tl } from '../../i18n';

const W = 640;
const H = 220;
const PAD = { top: 16, right: 8, bottom: 26, left: 56 };

const niceMax = (v) => {
  if (v <= 0) return 100;
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p;
};
const short = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${Number.isInteger(v) ? v : v.toFixed(1)}`);

export default function MonthlyColumns({ rows: input = [], loading, eyebrow, title, format = (v) => String(v), unit = '', empty = 'Nothing yet.' }) {
  const [hover, setHover] = useState(null);
  const rows = (Array.isArray(input) ? input : []).map((r) => ({ ...r, v: Number(r.value) || 0 }));

  if (loading) return <div className="h-80 bg-surface-container rounded-xl animate-pulse" />;

  const max = niceMax(Math.max(0, ...rows.map((r) => r.v)));
  const min = Math.min(0, ...rows.map((r) => r.v));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const y = (v) => PAD.top + ((max - v) / (max - min || 1)) * innerH;
  const slot = innerW / Math.max(rows.length, 1);
  const barW = Math.min(28, slot * 0.55);
  const ticks = [0, 0.5, 1].map((f) => min + (max - min) * f);
  const total = rows.reduce((s, r) => s + r.v, 0);
  const h = hover != null ? rows[hover] : null;

  return (
    <section className="bg-surface-container rounded-xl p-6 shadow-md">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">{eyebrow || tl("Last {0} months", { 0: rows.length })}</span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">{title}</h2>
        </div>
        <div className="text-right">
          <div className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">{tl("Total")}</div>
          <div className="font-title-lg text-title-lg text-on-surface">{format(total)}</div>
        </div>
      </div>

      {rows.every((r) => !r.v) ? (
        <p className="py-16 text-center text-on-surface-variant text-[13px]">{empty}</p>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
            aria-label={tl("{0}, last {1} months; total {2}", { 0: title, 1: rows.length, 2: format(total) })}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e5e2e3" strokeOpacity={t === 0 ? 0.35 : 0.08} />
                <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#e6bdbb" fillOpacity="0.7">{short(t)}</text>
              </g>
            ))}
            {rows.map((r, i) => {
              const cx = PAD.left + slot * i + slot / 2;
              const top = y(Math.max(r.v, 0));
              const height = Math.max(r.v ? 2 : 0, Math.abs(y(r.v) - y(0)));
              return (
                <g key={r.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  {/* hit target wider than the mark */}
                  <rect x={cx - slot / 2} y={PAD.top} width={slot} height={innerH} fill="transparent" />
                  <rect x={cx - barW / 2} y={r.v >= 0 ? top : y(0)} width={barW} height={height} rx="4"
                    fill={r.v >= 0 ? '#e51937' : '#e6bdbb'} fillOpacity={hover == null || hover === i ? 1 : 0.45} />
                  <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="#e6bdbb" fillOpacity="0.8">{r.short}</text>
                </g>
              );
            })}
          </svg>
          {h && (
            <div className="absolute pointer-events-none -translate-x-1/2 -translate-y-full bg-[#0e0e0f] border border-[#2a2a2e] rounded px-3 py-2 text-[12px] text-on-surface shadow-lg"
              style={{ left: `${((PAD.left + slot * hover + slot / 2) / W) * 100}%`, top: `${(y(Math.max(h.v, 0)) / H) * 100}%` }}>
              <div className="text-on-surface-variant text-[11px]">{h.month}</div>
              <div className="font-bold">{format(h.v)}</div>
            </div>
          )}
        </div>
      )}

      <table className="sr-only">
        <caption>{title}</caption>
        <thead><tr><th>{tl("Month")}</th><th>{unit || title}</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.month}><td>{r.month}</td><td>{r.v}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
