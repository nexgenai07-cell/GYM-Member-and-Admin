import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const sparkHeights = [2, 4, 5, 7, 6, 8];
const sparkColors = [
  'bg-surface-container-high',
  'bg-surface-container-high',
  'bg-primary-container/40',
  'bg-primary-container/70',
  'bg-primary-container',
  'bg-primary shadow-[0_0_10px_rgba(229,25,55,0.6)]',
];

const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 24 },
  },
};

export default function BiometricStream({
  calories = 640,
  velocity = 0.82,
  recovery = 91,
  heartRate = 178,
  heartZone = 'Zone 4 (Threshold Hypertrophy)',
  velocityDelta = '+0.12',
  hrvDelta = '+14ms via Sleep Matrix',
}) {
  // Metrics built from props
  const metrics = [
    {
      label: 'Metabolic Burn',
      icon: 'local_fire_department',
      value: String(calories),
      unit: 'kcal',
      caption: '+18% above target pace',
      captionClass: 'text-primary font-bold',
      visual: 'sparkline',
    },
    {
      label: 'Peak Cardiac Zone',
      icon: 'favorite',
      value: String(heartRate),
      unit: 'bpm',
      caption: heartZone,
      captionClass: 'text-on-surface-variant',
      visual: 'pulse',
    },
    {
      label: 'Bar Velocity Delta',
      icon: 'speed',
      value: velocityDelta,
      unit: 'm/s',
      caption: 'VBT Optimal Acceleration',
      captionClass: 'text-primary font-bold',
      visual: 'bars',
      currentVelocity: velocity,
    },
    {
      label: 'Recovery Readiness',
      icon: 'battery_charging_full',
      value: `${recovery}%`,
      unit: 'Optimal',
      unitClass: 'text-primary',
      caption: `HRV Delta: ${hrvDelta}`,
      captionClass: 'text-on-surface-variant',
      visual: 'progress',
      recoveryPercent: recovery,
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={gridV}
      className="flex flex-col gap-space-sm"
    >
      <motion.div variants={cardV} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-space-xs">
          <motion.span
            className="material-symbols-outlined text-primary text-title-md"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            vital_signs
          </motion.span>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider m-0">
            Biometric Telemetry Stream
          </h3>
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
          Titan Core Sensor Engine V2.8
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            variants={cardV}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 380, damping: 20 } }}
            className="group bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                {m.label}
              </span>
              <span className="material-symbols-outlined text-primary-container text-title-md transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(229,25,55,0.5)]">
                {m.icon}
              </span>
            </div>

            <div className="my-space-xs">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg text-on-surface leading-none">
                  {m.value}
                </span>
                <span
                  className={`font-label-lg text-label-lg uppercase ${
                    m.unitClass || 'text-on-surface-variant'
                  }`}
                >
                  {m.unit}
                </span>
              </div>
              <span className={`font-label-md text-label-md mt-1 block ${m.captionClass}`}>
                {m.caption}
              </span>
            </div>

            {/* Sparkline */}
            {m.visual === 'sparkline' && (
              <div className="h-8 w-full flex items-end gap-1">
                {sparkHeights.map((h, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-1/6 rounded-sm origin-bottom ${sparkColors[idx]}`}
                    style={{ height: `${h * 4}px` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.4 + i * 0.1 + idx * 0.06,
                      type: 'spring',
                      stiffness: 280,
                      damping: 20,
                    }}
                  />
                ))}
              </div>
            )}

            {/* ECG pulse */}
            {m.visual === 'pulse' && (
              <div className="h-8 w-full flex items-center">
                <svg
                  className="w-full h-6 text-primary-container"
                  fill="none"
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="ecgGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 12 L20 12 L28 4 L34 20 L42 2 L48 16 L54 12 L100 12"
                    stroke="url(#ecgGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(229,25,55,0.35))' }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [1, 0.7, 1] }}
                    transition={{
                      pathLength: { duration: 1.8, delay: 0.4, ease: 'easeInOut' },
                      opacity: { duration: 2, repeat: Infinity, delay: 2.2 },
                    }}
                  />
                </svg>
              </div>
            )}

            {/* VBT bars */}
            {m.visual === 'bars' && (
              <div>
                <div className="flex items-center justify-between text-label-md font-label-md text-on-surface-variant">
                  <span>Set 1: {(velocity * 0.85).toFixed(2)} m/s</span>
                  <span className="text-on-surface">Set 2: {velocity.toFixed(2)} m/s</span>
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full w-[68%] bg-surface-bright rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: EASE }}
                    />
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full w-[80%] bg-primary-container rounded-full origin-left shadow-[0_0_8px_rgba(229,25,55,0.4)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.65 + i * 0.1, duration: 0.8, ease: EASE }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Progress + shimmer */}
            {m.visual === 'progress' && (
              <div className="relative w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-primary-container h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${m.recoveryPercent}%` }}
                  transition={{ duration: 1.1, delay: 0.4 + i * 0.1, ease: EASE }}
                />
                <motion.div
                  className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ left: ['-15%', '105%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 1.4 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}