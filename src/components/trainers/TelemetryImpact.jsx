import { motion, useReducedMotion } from 'framer-motion';
import { tl } from '../../i18n';

export default function TelemetryImpact({ trainer }) {
  const reduce = useReducedMotion();
  if (!trainer) return null;

  // Bars normalize against a "target" so a bar at 100% means "at/above benchmark"
  // while the numeric value is shown raw. Prevents "1500 athletes trained" hiding
  // at a full-but-capped bar.
  const metrics = [
    {
      label: tl('Athletes Trained'),
      value: trainer.total_students || 0,
      target: 500,
      sub: tl('Active Roster'),
      accent: true,
    },
    {
      label: tl('Total Reviews'),
      value: trainer.total_reviews || 0,
      target: 400,
      sub: tl('Verified Feedback'),
      accent: false,
    },
    {
      label: tl('Experience'),
      value: trainer.years_experience || 0,
      suffix: tl('YRS'),
      target: 20,
      sub: tl('Industry Tenure'),
      accent: true,
    },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col gap-space-md shadow-lg"
      aria-label={tl('Trainer impact metrics')}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-space-xs">
          <span
            className="material-symbols-outlined text-primary-container text-title-md"
            aria-hidden="true"
          >
            monitoring
          </span>
          <span className="font-headline-md text-headline-md text-on-surface uppercase">
            {tl('Athlete Roster Telemetry Impact')}
          </span>
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {tl('Live Performance Metrics')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        {metrics.map((m, i) => {
          const pct = Math.min(100, (m.value / m.target) * 100);
          const display = m.suffix ? `${m.value} ${m.suffix}` : m.value.toLocaleString();
          return (
            <motion.div
              key={m.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
              className="bg-surface-container rounded-lg p-space-md flex flex-col"
            >
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                {m.label}
              </span>
              <span
                className={`font-headline-lg text-headline-lg uppercase mt-space-2xs leading-none tabular-nums ${
                  m.accent ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {display}
              </span>
              <div
                className="w-full bg-surface-container-highest h-1 rounded-full mt-space-sm overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={m.label}
              >
                <motion.div
                  className={`h-full rounded-full ${m.accent ? 'bg-primary-container' : 'bg-primary'}`}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.4 + i * 0.1 }}
                />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant mt-space-2xs uppercase">
                {m.sub}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}