import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const CIRCUMFERENCE = 326.72;
const TICKS = 60;

export default function RestTimer({ seconds, total, running, onToggle, onReset, onAdd }) {
  const rm = useReducedMotion();
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const progress = total > 0 ? seconds / total : 0;
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  const urgent = seconds > 0 && seconds <= 30;
  const complete = seconds === 0;

  const captionClass =
    'font-label-md text-[10px] text-primary tracking-widest uppercase mt-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
      className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent" />

      {/* Ambient glow — faster breathing when urgent */}
      <motion.div
        className="absolute inset-x-0 top-1/4 h-40 bg-primary-container/10 blur-3xl rounded-full pointer-events-none"
        animate={rm ? { opacity: 0.3 } : { opacity: running ? [0.5, 1, 0.5] : 0.3, scale: running ? [1, 1.15, 1] : 1 }}
        transition={{ duration: urgent ? 1 : running ? 1.8 : 5, repeat: rm ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <div className="w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-space-xs text-primary">
          <motion.span
            className="material-symbols-outlined text-title-md"
            animate={running && !rm ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: running && !rm ? Infinity : 0, ease: 'linear' }}
          >
            timer
          </motion.span>
          <span className="font-label-md text-label-md uppercase tracking-wider">
            Inter-Set Rest Clock
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="font-label-md text-label-md uppercase text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          type="button"
        >
          Reset (90s)
        </motion.button>
      </div>

      {/* Circular timer — tick ring, gradient stroke, orbit dot, completion burst */}
      <div className="relative my-space-md flex items-center justify-center">
        <motion.div
          animate={{
            filter: running
              ? 'drop-shadow(0 0 12px rgba(229,25,55,0.55))'
              : 'drop-shadow(0 0 0px rgba(229,25,55,0))',
          }}
          transition={{ duration: 0.6 }}
        >
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="restRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5a6e" />
                <stop offset="100%" stopColor="#e51937" />
              </linearGradient>
            </defs>

            {/* 60 tick marks, majors at quarters */}
            {Array.from({ length: TICKS }).map((_, i) => {
              const major = i % 15 === 0;
              return (
                <line
                  key={i}
                  x1="60"
                  y1="0"
                  x2="60"
                  y2={major ? '4.5' : '2.5'}
                  stroke={major ? '#5d3f3e' : '#2a2a2b'}
                  strokeWidth={major ? 1.6 : 1}
                  transform={`rotate(${(i / TICKS) * 360} 60 60)`}
                />
              );
            })}

            <circle cx="60" cy="60" fill="none" r="52" stroke="#201f20" strokeWidth="6" />
            <motion.circle
              cx="60"
              cy="60"
              fill="none"
              r="52"
              stroke="url(#restRingGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </svg>
        </motion.div>

        {/* Orbiting pulse dot rides the ring while running */}
        {running && !rm && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(229,25,55,0.9)]" />
          </motion.div>
        )}

        {/* Completion burst */}
        <AnimatePresence>
          {complete && (
            <motion.div
              key="burst"
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                >
                  <motion.span
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ left: 'calc(50% - 3px)', top: 'calc(50% - 3px)' }}
                    initial={{ y: 6, opacity: 1, scale: 1 }}
                    animate={{ y: -76, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </span>
              ))}
              <motion.span
                className="absolute inset-6 rounded-full border-2 border-primary/50"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute flex flex-col items-center pointer-events-none">
          <div className="overflow-hidden flex">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={seconds}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className={`font-display-xl text-display-xl text-on-surface leading-none tracking-tight tabular-nums ${
                  urgent ? 'animate-pulse' : ''
                }`}
              >
                {minutes}:{secs}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={complete ? 'done' : 'rec'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={captionClass}
            >
              {complete ? 'Rest Complete' : 'Recommended 90s'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-space-sm w-full relative z-10">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onToggle}
          className="flex-1 bg-primary-container hover:bg-secondary-container text-on-primary-container py-space-xs rounded-lg font-label-lg text-label-lg uppercase tracking-wider shadow-[0_0_16px_rgba(229,25,55,0.35)] transition-colors flex items-center justify-center gap-space-xs relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          type="button"
        >
          <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-[320%] transition-transform duration-700 ease-out" />
          <span className="material-symbols-outlined text-title-md relative z-10">
            {running ? 'pause' : 'play_arrow'}
          </span>
          <span className="relative z-10">{running ? 'Pause Rest' : 'Start Rest'}</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAdd(30)}
          className="bg-surface-container hover:bg-surface-container-high text-on-surface px-space-md py-space-xs rounded-lg font-label-lg text-label-lg uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          type="button"
        >
          +30s
        </motion.button>
      </div>
    </motion.div>
  );
}