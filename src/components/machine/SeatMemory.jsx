import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 420, damping: 22 };

export default function SeatMemory() {
  const rm = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 380, damping: 20 } }}
      className="group bg-surface-container-low rounded-xl p-space-md flex items-center justify-between shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-space-sm">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0"
        >
          <span className="material-symbols-outlined text-headline-md">
            airline_seat_recline_extra
          </span>
        </motion.div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase">
            Profile Seat Memory
          </span>
          <span className="font-title-md text-title-md text-on-surface uppercase">
            Setting #4 Pin
          </span>
          {/* Pin slot strip — slot 4 engaged */}
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.span
                key={n}
                className={`h-[3px] rounded-full ${
                  n === 4
                    ? 'bg-primary shadow-[0_0_6px_rgba(229,25,55,0.7)]'
                    : 'bg-surface-container-highest'
                }`}
                initial={{ width: 8 }}
                animate={{ width: n === 4 ? 16 : 8 }}
                transition={{ ...SPRING, delay: 0.5 + n * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 340, damping: 20 }}
        className="flex items-center gap-space-2xs bg-primary-container/10 px-space-xs py-1 rounded text-primary"
      >
        <motion.span
          className="material-symbols-outlined text-sm"
          animate={rm ? {} : { rotate: [0, 12, -12, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          tune
        </motion.span>
        <span className="font-label-md text-label-md uppercase">Locked</span>
      </motion.div>
    </motion.div>
  );
}