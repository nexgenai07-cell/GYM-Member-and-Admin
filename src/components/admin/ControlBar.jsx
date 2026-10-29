// src/components/admin/ControlBar.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { tl } from '../../i18n';

const RANGES = [['7d', tl('7D')], ['30d', tl('30D')], ['90d', tl('90D')], ['ytd', tl('YTD')]];

export default function ControlBar({
  range, onRange, updatedAt, onRefresh, refreshing, onExport, exporting,
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4 }}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-surface-container-low shadow-sm"
      aria-label={tl('Dashboard controls')}
    >
      <div className="flex items-center gap-3 flex-wrap text-on-surface-variant font-label-md text-[11px] uppercase tracking-widest">
        <span aria-live="polite">
          {tl('Updated')}{' '}
          {updatedAt ? updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high hover:text-on-surface disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          aria-busy={refreshing}
        >
          <span
            className={`material-symbols-outlined text-[16px] ${refreshing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          >
            {refreshing ? 'progress_activity' : 'refresh'}
          </span>
          {refreshing ? tl('Refreshing…') : tl('Refresh')}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="flex items-center gap-1 bg-surface-container-high p-1 rounded-lg"
          role="radiogroup"
          aria-label={tl('Revenue period')}
        >
          {RANGES.map(([id, label]) => {
            const active = range === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onRange(id)}
                className={`px-3 py-1 rounded-lg font-label-md text-[11px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                  active
                    ? 'bg-surface-variant text-on-surface font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          aria-busy={exporting}
          className="flex items-center gap-2 bg-primary-container hover:bg-secondary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[12px] uppercase tracking-wider font-bold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            {exporting ? 'progress_activity' : 'download'}
          </span>
          <span className="hidden sm:inline">
            {exporting ? tl('Exporting…') : tl('Export CSV')}
          </span>
        </button>
      </div>
    </motion.section>
  );
}