// src/components/admin/ControlBar.jsx — dashboard range (drives revenue figures), refresh, CSV export.
import { motion } from 'framer-motion';

const RANGES = [['7d', '7D'], ['30d', '30D'], ['90d', '90D'], ['ytd', 'YTD']];

export default function ControlBar({ range, onRange, updatedAt, onRefresh, onExport, exporting }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm"
    >
      <div className="flex items-center gap-3 flex-wrap text-on-surface-variant font-label-md text-[11px] uppercase tracking-widest">
        <span>Updated {updatedAt ? updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
        <button type="button" onClick={onRefresh}
          className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high hover:text-on-surface">
          <span className="material-symbols-outlined text-[16px]">refresh</span> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-lg" role="tablist" aria-label="Revenue period">
          {RANGES.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={range === id} onClick={() => onRange(id)}
              className={`px-3 py-1 rounded-lg font-label-md text-[11px] uppercase tracking-wider transition-all ${
                range === id ? 'bg-surface-variant text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onExport} disabled={exporting}
          className="flex items-center gap-2 bg-primary-container hover:bg-secondary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[12px] uppercase tracking-wider font-bold disabled:opacity-60">
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>{exporting ? 'Exporting…' : 'Export transactions (CSV)'}</span>
        </button>
      </div>
    </motion.section>
  );
}
