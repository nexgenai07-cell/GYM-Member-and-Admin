// src/components/admin/FacilityNodeCard.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tl } from '../../i18n';

const STATUS_STYLE = {
  optimal: { label: tl('OPTIMAL'), color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400', bar: 'bg-emerald-400' },
  elevated: { label: tl('ELEVATED'), color: 'text-primary', bg: 'bg-primary/10', dot: 'bg-primary', bar: 'bg-primary' },
  congested: { label: tl('CONGESTED'), color: 'text-error', bg: 'bg-error/10', dot: 'bg-error', bar: 'bg-error' },
};

export default function FacilityNodeCard({ nodes = [], loading }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const list = Array.isArray(nodes) ? nodes : [];

  const totalActive = list.reduce((s, n) => s + (n.active_now || 0), 0);
  const totalVisits = list.reduce((s, n) => s + (n.visits_today || 0), 0);
  const totalCapacity = list.reduce((s, n) => s + (n.capacity || 0), 0);
  const overallUtil = totalCapacity > 0 ? Math.round((totalActive / totalCapacity) * 100) : 0;
  const overallStatus = overallUtil >= 85 ? 'congested' : overallUtil >= 50 ? 'elevated' : 'optimal';
  const overallStyle = STATUS_STYLE[overallStatus];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.55 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col h-full"
    >
      <div>
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {tl('Facilities right now')}
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className={`h-2 w-2 rounded-full ${overallStyle.dot} animate-pulse`} aria-hidden="true" />
            <span className={`font-label-md text-[10px] uppercase font-bold ${overallStyle.color}`}>
              {overallStyle.label}
            </span>
          </span>
        </div>

        <h3 className="font-headline-md text-headline-md uppercase text-on-surface">
          {tl('Facility load')}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-[13px]">
          {list.length > 0
            ? tl('{0} nodes · {1} visits today', { 0: list.length, 1: totalVisits })
            : tl('Set facility capacities in Admin → Facilities to track load')}
        </p>
      </div>

      {/* Aggregate */}
      <div className="my-4 p-4 bg-surface-container-lowest rounded-xl">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            {tl('Aggregate Occupancy')}
          </span>
          <span className="font-title-md text-title-md text-on-surface tabular-nums">
            {totalActive}/{totalCapacity}
          </span>
        </div>

        <div
          className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={overallUtil}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={tl('Aggregate occupancy')}
        >
          <motion.div
            className={overallStyle.bar}
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${Math.min(100, overallUtil)}%` }}
            transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.4 }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 gap-2">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tabular-nums">
            {tl('{0}% utilization', { 0: overallUtil })}
          </span>
          <span className={`font-label-md text-[10px] uppercase font-bold ${overallStyle.color}`}>
            {overallStyle.label}
          </span>
        </div>
      </div>

      {/* Per-node list — no nested scroll; the card grows naturally */}
      {loading ? (
        <div className="space-y-2 mb-3" aria-busy="true">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-surface-container-lowest rounded-lg animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="mb-3 text-center py-6 bg-surface-container-lowest rounded-lg" role="status">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant/40" aria-hidden="true">
            domain_disabled
          </span>
          <p className="font-label-md text-[11px] text-on-surface-variant mt-2">
            {tl('No facility activity yet')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-3">
          {list.map((node, i) => {
            const style = STATUS_STYLE[node.status] || STATUS_STYLE.optimal;
            return (
              <motion.div
                key={node.name}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={reduce ? false : { opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.1 + i * 0.05 }}
                className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-title-md text-title-md text-on-surface truncate text-[13px]">
                    {node.name}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded font-label-md text-[9px] uppercase font-bold shrink-0 ${style.bg} ${style.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                    {style.label}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-title-md text-title-md text-on-surface tabular-nums">
                    {node.active_now}
                    <span className="text-[10px] font-normal text-on-surface-variant ml-1">
                      / {node.capacity}
                    </span>
                  </span>
                  <span className={`font-label-md text-[10px] font-bold ${style.color} tabular-nums`}>
                    {node.utilization}%
                  </span>
                </div>

                <div
                  className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={node.utilization}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={node.name}
                >
                  <motion.div
                    className={style.bar}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${Math.min(100, node.utilization)}%` }}
                    transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3 + i * 0.08 }}
                  />
                </div>

                <span className="font-label-md text-[9px] text-on-surface-variant tabular-nums">
                  {tl('{0} visits today', { 0: node.visits_today })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/admin/facilities')}
        className="mt-auto w-full py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg font-label-lg text-label-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">space_dashboard</span>
        <span>{tl('Manage facilities')}</span>
      </button>
    </motion.div>
  );
}