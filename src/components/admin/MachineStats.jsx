import { motion } from 'framer-motion';
import { machineStats } from '../../data/adminMachines';

export default function MachineStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {machineStats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`relative rounded-lg p-5 flex flex-col justify-between shadow-md overflow-hidden ${
            s.accent
              ? 'bg-primary-container/10 border border-primary-container/30'
              : 'bg-surface-container'
          }`}
        >
          {s.accent && (
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
          )}

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 relative ${
              s.accent
                ? 'bg-primary-container/20 text-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
          </div>

          <div className="relative mt-3">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              {s.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`font-headline-lg text-headline-lg leading-none ${
                  s.accent ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {s.value}
              </span>
            </div>
            <span className="font-label-md text-[10px] text-on-surface-variant mt-1 block">
              {s.delta}
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  );
}