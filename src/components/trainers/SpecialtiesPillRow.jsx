import { motion } from 'framer-motion';
import { tl } from '../../i18n';

export default function SpecialtiesPillRow({ specialties = [] }) {
  if (!specialties || specialties.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap gap-space-xs items-center"
    >
      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mr-space-xs">
        {tl("Pillars:")}
      </span>
      {specialties.map((s, i) => (
        <motion.span
          key={s}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
          className="px-space-md py-space-2xs bg-surface-container-low rounded text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-2xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          {s}
        </motion.span>
      ))}
    </motion.div>
  );
}