// src/components/admin/ArenaHeatmap.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { tl } from '../../i18n';

export default function ArenaHeatmap({ data, loading }) {
  const reduce = useReducedMotion();
  const zones = data?.zones || [];
  const activeNow = data?.active_now || 0;
  const totalToday = data?.total_today || 0;

  return (
    <section className="flex flex-col gap-4" aria-label={tl('Busy zones')}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {tl('Today')}
          </span>
          <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">
            {tl('Busy zones')}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <LegendItem color="bg-error" label={tl('Critical (>85%)')} />
          <LegendItem color="bg-primary" label={tl('Elevated (60–84%)')} />
          <LegendItem color="bg-emerald-400" label={tl('Nominal (<60%)')} />
          <span className="font-label-md text-[10px] text-primary font-bold tabular-nums">
            {tl('{0} active · {1} today', { 0: activeNow, 1: totalToday })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4" aria-busy="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-48 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <div className="p-8 text-center bg-surface-container rounded-xl" role="status">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40" aria-hidden="true">
            grid_view
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            {tl('No zone activity today')}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tl('Zones populate from member check-ins. Use the check-in flow to populate.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {zones.map((z, i) => (
            <motion.article
              key={z.sector}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? false : { opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 + i * 0.06 }}
              whileHover={reduce ? undefined : { y: -3 }}
              className="bg-surface-container p-4 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${z.topBar}`} aria-hidden="true" />

              <div>
                <div className="flex justify-between items-center mb-2 gap-2">
                  <span
                    className={`font-label-md text-[10px] uppercase font-bold truncate ${
                      z.sectorAccent ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {z.sector}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-label-md text-[10px] uppercase font-bold shrink-0 ${
                      z.sectorLabelAccent ? 'bg-error/20 text-error' : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {z.sectorLabel}
                  </span>
                </div>

                <h3 className="font-headline-md text-headline-md uppercase text-on-surface leading-tight">
                  {z.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-[12px] line-clamp-2">
                  {z.description}
                </p>
              </div>

              <div className="my-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-display-xl text-display-xl text-on-surface tabular-nums">
                    {z.load}
                  </span>
                  <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                    {z.dwell}
                  </span>
                </div>
                <div
                  className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={z.width}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={z.title}
                >
                  <motion.div
                    className={`${z.barColor} h-full rounded-full`}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${z.width}%` }}
                    transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.4 + i * 0.08 }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-surface-container-highest flex items-center justify-between text-on-surface-variant font-label-md text-[10px] gap-2">
                <span className="truncate">{z.footerLeft}</span>
                <span
                  className={`font-bold shrink-0 ${
                    z.footerRightAccent === 'error'
                      ? 'text-error'
                      : z.footerRightAccent === 'primary'
                      ? 'text-primary'
                      : 'text-on-surface'
                  }`}
                >
                  {z.footerRight}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

function LegendItem({ color, label }) {
  return (
    <span className="flex items-center gap-1 font-label-md text-[10px] text-on-surface-variant">
      <span className={`w-2 h-2 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </span>
  );
}