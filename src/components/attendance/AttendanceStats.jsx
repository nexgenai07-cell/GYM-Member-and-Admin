import { motion } from 'framer-motion';
import CountUp from '../CountUp';
import { tl } from '../../i18n';

const EASE = [0.22, 1, 0.36, 1];

const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

const isPureInt = (v) => /^\d+$/.test(String(v));

export default function AttendanceStats({ summary }) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-surface-container rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: tl("Current Streak"),
      sublabel: 'Cadence Velocity',
      value: String(summary.current_streak.value),
      unit: summary.current_streak.unit,
      icon: 'local_fire_department',
      accent: true,
      footer: summary.current_streak.footer,
      progress: summary.current_streak.progress,
    },
    {
      label: tl("Month Check-Ins"),
      sublabel: 'Cadence Frequency',
      value: String(summary.month_check_ins.value),
      unit: summary.month_check_ins.unit,
      icon: 'calendar_month',
      accent: false,
      badge: summary.month_check_ins.badge,
      footer: summary.month_check_ins.footer,
      footerRight: summary.month_check_ins.footer_right,
    },
    {
      label: tl("Workout Hours"),
      sublabel: 'Time Under Load',
      value: String(summary.workout_hours.value),
      unit: summary.workout_hours.unit,
      icon: 'timer',
      accent: false,
      footer: summary.workout_hours.footer,
      footerRight: summary.workout_hours.footer_right,
    },
    {
      label: tl("Prime Window"),
      sublabel: 'Optimal Rhythm',
      value: summary.prime_window.value,
      unit: summary.prime_window.unit,
      icon: 'speed',
      accent: true,
      badge: summary.prime_window.badge,
      footer: summary.prime_window.footer,
      footerRight: summary.prime_window.footer_right,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={gridV}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          variants={cardV}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-lg bg-surface-container p-space-lg shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
        >
          {s.accent && (
            <motion.div
              className="absolute -right-6 -top-6 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <div className="flex items-start justify-between z-10">
            <div className="flex flex-col">
              <span className={`font-label-md text-label-md uppercase tracking-widest font-bold ${s.accent ? 'text-primary' : 'text-on-surface-variant'}`}>
                {s.sublabel}
              </span>
              <span className="font-title-lg text-title-lg text-on-surface mt-1">
                {s.label}
              </span>
            </div>
            <div className={`w-12 h-12 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant ${s.accent ? 'text-primary-container shadow-[0_0_18px_rgba(229,25,55,0.35)]' : ''}`}>
              <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
          </div>

          <div className="my-space-md z-10">
            <div className="flex items-baseline gap-space-2xs flex-wrap">
              {isPureInt(s.value) ? (
                <span className={`font-display-xl text-display-xl leading-none tabular-nums ${s.label === 'Prime Window' ? 'text-headline-lg' : 'text-on-surface'}`}>
                  <CountUp to={Number(s.value)} duration={1.4} delay={0.3 + i * 0.1} />
                </span>
              ) : (
                <span className={`font-display-xl text-display-xl leading-none ${s.label === 'Prime Window' ? 'text-headline-lg' : 'text-on-surface'}`}>
                  {s.value}
                </span>
              )}
              {s.unit && (
                <span className="font-headline-md text-headline-md text-on-surface-variant uppercase">
                  {s.unit}
                </span>
              )}
            </div>

            {s.badge && (
              <div className="inline-flex items-center gap-space-2xs mt-space-2xs px-space-xs py-0.5 rounded bg-primary-container/10 text-primary font-label-md text-label-md uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                {s.badge}
              </div>
            )}
          </div>

          {s.progress !== undefined && (
            <div className="relative w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden z-10">
              <motion.div
                className="bg-primary-container h-full rounded-full shadow-[0_0_8px_rgba(229,25,55,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${s.progress}%` }}
                transition={{ duration: 1.1, delay: 0.4 + i * 0.1, ease: EASE }}
              />
            </div>
          )}

          <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md z-10 mt-space-2xs">
            <span>{s.footer}</span>
            {s.footerRight && (
              <span className={`${s.accent ? 'text-primary font-bold' : 'text-on-surface'}`}>
                {s.footerRight}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}