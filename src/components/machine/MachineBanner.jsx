import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const lineUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE },
  },
};

const breadcrumbs = ['Sector 06 Iron Arena', '•', 'Station #14', '•', 'QR Tag ID: TITAN-MCH-0482'];

export default function MachineBanner() {
  const rm = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-xl"
    >
      <motion.div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"
        animate={rm ? {} : { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary-container/60 to-transparent origin-center"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-start gap-space-md">
          <motion.div
            variants={lineUp}
            className="relative w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary"
          >
            <motion.span
              className="material-symbols-outlined text-headline-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
              animate={rm ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              precision_manufacturing
            </motion.span>
            {!rm && (
              <motion.span
                className="absolute inset-0 rounded-lg border border-primary/40"
                animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.div>

          <div className="flex flex-col">
            <motion.div
              variants={lineUp}
              className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md uppercase tracking-wider flex-wrap"
            >
              {breadcrumbs.map((b, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.35, ease: EASE }}
                  className={b === '•' ? 'text-primary' : i === 4 ? 'text-primary font-bold' : ''}
                >
                  {b}
                </motion.span>
              ))}
            </motion.div>
            <motion.h1
              variants={lineUp}
              className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide leading-none mt-space-2xs m-0"
            >
              Iso-Lateral{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-primary-container">
                Chest Press
              </span>
            </motion.h1>
          </div>
        </div>

        {/* Live telemetry status */}
        <motion.div
          variants={lineUp}
          className="relative flex items-center gap-space-md bg-surface-container-lowest px-space-md py-space-sm rounded-lg self-start md:self-auto overflow-hidden"
        >
          {!rm && (
            <motion.span
              className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-primary-container/8 to-transparent pointer-events-none"
              animate={{ left: ['-12%', '106%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5 }}
            />
          )}

          <div className="flex items-center gap-space-xs relative z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container" />
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md uppercase text-on-surface tracking-widest leading-none">
                Unoccupied &amp; Calibrated
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-body-md text-[10px] text-on-surface-variant leading-tight tabular-nums">
                  Digital Load Cell: 0.0 KG
                </span>
                {/* Flatline EKG — matches the 0.0 KG load, redraws on loop */}
                <svg viewBox="0 0 44 10" className="w-10 h-2.5 text-primary-container overflow-visible shrink-0">
                  <motion.path
                    d="M0 5 H16 L19 1.5 L22 8.5 L25 5 H44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.9 }}
                    animate={
                      rm
                        ? { pathLength: 1, opacity: 0.9 }
                        : { pathLength: [0, 1, 1], opacity: [0.9, 0.9, 0.2] }
                    }
                    transition={
                      rm
                        ? { duration: 1 }
                        : { duration: 2.6, times: [0, 0.7, 1], repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }
                    }
                  />
                </svg>
              </div>
            </div>
          </div>

          <motion.div
            className="h-6 w-px bg-surface-container-high origin-top relative z-10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
          />

          <div className="flex items-center gap-space-2xs text-primary relative z-10">
            <motion.span
              className="material-symbols-outlined text-title-md"
              animate={rm ? {} : { opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              sensors
            </motion.span>
            <span className="font-label-md text-label-md uppercase">Sync 100%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}