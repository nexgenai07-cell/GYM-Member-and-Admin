import { motion } from 'framer-motion';
import CountUp from './CountUp';
import { tl } from '../i18n';

const EASE = [0.22, 1, 0.36, 1];

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};
const rowV = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function FloorDensity({ density }) {
  const overall = density?.overall_percent ?? 0;
  const label = density?.label ?? '—';
  const hasCapacity = !!density?.capacity;
  const zones = Array.isArray(density?.zones) ? density.zones : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      className="lg:col-span-4 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-xl"
    >
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-widest text-primary">
            {tl("Gym right now")}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_10px_rgba(229,25,55,0.6)]" />
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide leading-none m-0">
            {density ? tl("{0} member{1} checked in", { 0: density.current, 1: density.current === 1 ? '' : 's' }) : tl("Loading…")}
          </h3>
          <span className="font-body-md text-body-md text-on-surface-variant block mt-1">
            {density?.peak_window ? tl("Usually busiest {0}", { 0: density.peak_window }) : tl("Busiest hours appear once there is enough data")}
          </span>
        </div>

        <div className="flex items-baseline gap-space-xs my-space-xs">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            className="font-display-xl text-display-xl text-on-surface leading-none tabular-nums"
          >
            {hasCapacity ? <CountUp to={overall} suffix="%" duration={1.6} delay={0.5} /> : (density?.current ?? 0)}
          </motion.span>
          <span className="font-label-lg text-label-lg text-primary tracking-widest uppercase">
            {label}
          </span>
        </div>

        <motion.div variants={listV} initial="hidden" whileInView="show" className="flex flex-col gap-space-xs text-body-md">
          {zones.map((z, i) => (
            <motion.div key={z.label} variants={rowV}>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">{z.label}</span>
                <span className={`font-label-md text-label-md ${z.accent ? 'text-primary' : 'text-on-surface'} font-bold tabular-nums`}>
                  {z.count} here
                </span>
              </div>
              <div className="relative w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
                <motion.div
                  className={`h-full rounded-full ${z.accent ? 'bg-primary-container shadow-[0_0_8px_rgba(229,25,55,0.5)]' : 'bg-surface-bright'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${z.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: EASE }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}