import { motion } from 'framer-motion';
import CountUp from './CountUp';

const EASE = [0.22, 1, 0.36, 1];

export default function StreakBadge({ streak = 0, target = 12 }) {
  const percent = Math.min(100, Math.round((streak / target) * 100));
  const dots = 7;
  const activeDots = Math.min(streak, dots);

  return (
    <motion.div
      initial={{ opacity: 0, y: -14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
      whileHover={{ y: -3 }}
      className="relative flex items-center gap-space-md bg-surface-container-low px-space-lg py-space-sm rounded-xl shadow-lg overflow-hidden"
    >
      {/* Ambient fire glow */}
      <motion.div
        className="absolute -left-6 -top-6 w-28 h-28 bg-primary-container/15 rounded-full blur-2xl pointer-events-none"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Flame tile */}
      <div className="relative w-12 h-12 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container">
        <motion.span
          className="absolute inset-0 rounded-lg bg-primary-container/25 blur-md"
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="material-symbols-outlined text-headline-md relative z-10"
          style={{ fontVariationSettings: "'FILL' 1" }}
          animate={{
            scale: [1, 1.14, 1.04, 1.18, 1],
            rotate: [-3, 2, -2, 3, 0],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          local_fire_department
        </motion.span>
      </div>

      <div className="flex flex-col relative z-10">
        <div className="flex items-baseline gap-space-xs">
          <motion.span
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            className="font-headline-md text-headline-md text-on-surface leading-none"
          >
            <CountUp
              to={streak}
              suffix={streak === 1 ? ' DAY' : ' DAYS'}
              duration={1.2}
              delay={0.4}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
            className="font-label-md text-label-md text-primary tracking-widest uppercase"
          >
            Streak active
          </motion.span>
        </div>

        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: dots }).map((_, i) => (
            <motion.span
              key={i}
              className={`w-4 h-1 rounded-sm origin-left ${
                i < activeDots
                  ? 'bg-primary-container'
                  : 'bg-surface-container-high'
              } ${i === activeDots - 1 ? 'animate-pulse' : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.4 + i * 0.07,
                type: 'spring',
                stiffness: 320,
                damping: 20,
              }}
            />
          ))}
        </div>
      </div>

      <div className="pl-space-md border-l border-surface-container-high relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block"
        >
          Target {target}D
        </motion.span>
        <span className="font-body-md text-body-md text-on-surface font-bold">
          <CountUp to={percent} suffix="% of goal" duration={1.4} delay={0.6} />
        </span>
      </div>
    </motion.div>
  );
}