import { motion } from 'framer-motion';
import CountUp from '../CountUp';

const EASE = [0.22, 1, 0.36, 1];

const features = [
  {
    icon: 'sync_saved_locally',
    title: 'Auto-Sync With Smart Rigs',
    desc: 'Downloaded protocols automatically upload rep targets, rest timers, and eccentric cadences directly to Titan station touchscreens.',
    stat: 12,
    statLabel: 'Rig Models',
  },
  {
    icon: 'analytics',
    title: 'Live Coach Telemetry QA',
    desc: 'Trainers receive barbell trajectory metrics and set-by-set bar speed logs to deliver asymmetric feedback and load adjustments.',
    stat: 30,
    statLabel: 'FPS Tracking',
  },
  {
    icon: 'offline_bolt',
    title: 'Zero-Latency Video Cues',
    desc: 'High-definition multi-angle biomechanical breakdowns cached locally on your device for distraction-free off-grid sessions.',
    stat: 4,
    statLabel: 'K Cache',
  },
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

export default function CurriculumFeatures() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={gridV}
      className="grid grid-cols-1 lg:grid-cols-3 gap-space-md"
    >
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          variants={cardV}
          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 380, damping: 20 } }}
          className="group relative bg-surface-container-lowest p-space-lg rounded-xl flex items-start gap-space-md hover:bg-surface-container-low transition-colors shadow-sm hover:shadow-lg overflow-hidden"
        >
          {/* Top hairline */}
          <motion.span
            className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent origin-center"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: EASE }}
          />

          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container group-hover:shadow-[0_0_14px_rgba(229,25,55,0.35)] transition-shadow"
          >
            <span className="material-symbols-outlined text-title-md">{f.icon}</span>
          </motion.div>

          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-on-surface transition-transform duration-300 group-hover:translate-x-0.5">
              {f.title}
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
              {f.desc}
            </p>
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold mt-space-xs tabular-nums opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <CountUp to={f.stat} duration={1} /> {f.statLabel}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}