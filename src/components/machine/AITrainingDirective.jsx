import { motion, useReducedMotion } from 'framer-motion';
import CountUp from '../CountUp';

const EASE = [0.22, 1, 0.36, 1];

const cells = [
  {
    label: 'Recommended Start',
    value: 75,
    decimals: 1,
    valueClass: 'text-on-surface',
    meta: '4 Sets • 8-10 Reps',
  },
  {
    label: 'Personal Record',
    value: 90,
    decimals: 1,
    valueClass: 'text-primary drop-shadow-[0_0_10px_rgba(229,25,55,0.4)]',
    meta: '6 Reps • 14 Days Ago',
  },
];

const compare = [
  { label: 'Start', v: 75, bar: 'bg-surface-bright', text: 'text-on-surface-variant' },
  {
    label: 'PR',
    v: 90,
    bar: 'bg-primary-container shadow-[0_0_8px_rgba(229,25,55,0.5)]',
    text: 'text-primary font-bold',
  },
];

export default function AITrainingDirective() {
  const rm = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.4, ease: EASE }}
      className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-md flex-1 justify-between relative overflow-hidden"
    >
      {/* AI shimmer */}
      {!rm && (
        <motion.span
          className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-transparent via-primary-container/8 to-transparent pointer-events-none"
          animate={{ left: ['-14%', '106%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1.2 }}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <span className="flex items-center gap-1.5 font-label-md text-label-md uppercase text-on-surface-variant tracking-wider">
          {/* AI processing waveform */}
          {!rm && (
            <span className="flex items-end gap-[2px] h-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2px] rounded-full bg-primary/70"
                  style={{ height: 4 }}
                  animate={{ height: [3, 9, 4, 11, 3] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
                />
              ))}
            </span>
          )}
          AI Training Directive
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 340, damping: 20 }}
          className="font-label-md text-label-md uppercase text-primary font-bold"
        >
          Hypertrophy
        </motion.span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm relative z-10">
        {cells.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.5 + i * 0.12, ease: EASE }}
            whileHover={{ y: -2 }}
            className="bg-surface-container rounded-lg p-space-sm flex flex-col"
          >
            <span className="font-label-md text-label-md uppercase text-on-surface-variant">
              {c.label}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`font-headline-lg text-headline-lg leading-none tabular-nums ${c.valueClass}`}
              >
                <CountUp
                  to={c.value}
                  decimals={c.decimals}
                  duration={1.4}
                  delay={0.6 + i * 0.15}
                />
              </span>
              <span className="font-label-md text-label-md text-primary font-bold">KG</span>
            </div>
            <span className="font-body-md text-[10px] text-on-surface-variant mt-1">
              {c.meta}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Start vs PR comparison bars */}
      <div className="flex flex-col gap-1 relative z-10">
        {compare.map((r, i) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className={`font-label-md text-[9px] uppercase tracking-wider w-9 ${r.text}`}>
              {r.label}
            </span>
            <div className="flex-1 h-1 bg-surface-container-highest/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${r.bar}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.v / 90) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 + i * 0.15, ease: EASE }}
              />
            </div>
            <span className={`font-label-md text-[9px] tabular-nums w-7 text-right ${r.text}`}>
              {r.v}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between pt-space-xs text-xs text-on-surface-variant flex-wrap gap-2 relative z-10"
      >
        <span className="flex items-center gap-1 font-label-md text-label-md uppercase">
          <motion.span
            className="material-symbols-outlined text-primary text-sm"
            animate={rm ? {} : { scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            bolt
          </motion.span>
          Target Intensity: RPE 8.0
        </span>
        <span className="font-label-md text-label-md uppercase">Cadence: 3-0-1-0</span>
      </motion.div>
    </motion.div>
  );
}