import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const legend = [
  {
    color: 'bg-primary-container',
    glow: true,
    name: 'Pectoralis Major',
    meta: 'Primary Agonist (92%)',
    metaClass: 'text-primary uppercase font-bold',
  },
  {
    color: 'bg-tertiary-container',
    glow: false,
    name: 'Anterior Deltoid',
    meta: 'Secondary Synergist (64%)',
    metaClass: 'text-on-surface-variant uppercase',
  },
  {
    color: 'bg-surface-container-highest',
    glow: false,
    name: 'Triceps Brachii',
    meta: 'Fixator & Extensor (48%)',
    metaClass: 'text-on-surface-variant uppercase',
  },
];

export default function TargetBiomechanics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      className="md:col-span-7 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between gap-space-md shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-md text-label-md uppercase text-primary tracking-widest">
            Muscle Recruitment
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase">
            Target Biomechanics
          </h2>
        </div>
        <motion.span
          className="material-symbols-outlined text-primary-container text-headline-md"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          vital_signs
        </motion.span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md items-center">
        {/* SVG Anatomy — living tissue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="relative w-full aspect-square max-h-48 flex items-center justify-center bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden"
        >
          {/* Scan sweep over anatomy */}
          <motion.div
            className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none"
            animate={{ left: ['-14%', '106%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
          />

          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Torso */}
            <path
              d="M 60 40 Q 100 35 140 40 L 155 70 L 145 130 L 135 180 L 65 180 L 55 130 L 45 70 Z"
              fill="#201f20"
              stroke="#353436"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="24" fill="#2a2a2b" r="14" />
            <path d="M 88 35 L 112 35 L 116 46 L 84 46 Z" fill="#201f20" />

            {/* Deltoids — gentle breathing */}
            <motion.ellipse
              cx="56"
              cy="68"
              fill="#d53b43"
              rx="14"
              ry="18"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
            <motion.ellipse
              cx="144"
              cy="68"
              fill="#d53b43"
              rx="14"
              ry="18"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Pecs — alternating heartbeat contraction */}
            <motion.path
              d="M 97 58 C 84 56 68 62 66 74 C 64 88 78 102 97 104 Z"
              fill="#e51937"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: [0, 1, 0.75, 1], scale: [0.85, 1, 0.97, 1] }}
              transition={{
                opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', filter: 'drop-shadow(0 0 8px rgba(229,25,55,0.7))' }}
            />
            <motion.path
              d="M 103 58 C 116 56 132 62 134 74 C 136 88 122 102 103 104 Z"
              fill="#e51937"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: [0, 0.75, 1, 0.75], scale: [0.85, 0.97, 1, 0.97] }}
              transition={{
                opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
              }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', filter: 'drop-shadow(0 0 8px rgba(229,25,55,0.7))' }}
            />

            {/* Triceps */}
            <rect fill="#d53b43" height="34" opacity="0.3" rx="4" width="10" x="36" y="86" />
            <rect fill="#d53b43" height="34" opacity="0.3" rx="4" width="10" x="154" y="86" />

            {/* Sternum — draws downward */}
            <motion.line
              stroke="#353436"
              strokeDasharray="2 2"
              strokeWidth="1"
              x1="100"
              x2="100"
              y1="56"
              y2="175"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-1 right-2 font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider"
          >
            Anterior View
          </motion.div>
        </motion.div>

        {/* Legend — staggered rows */}
        <div className="flex flex-col gap-space-sm">
          {legend.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.12, ease: EASE }}
              className="flex items-center gap-space-xs group"
            >
              <motion.span
                className={`w-3 h-3 rounded-sm shrink-0 ${
                  l.glow ? 'shadow-[0_0_8px_rgba(229,25,55,0.5)]' : ''
                } ${l.color}`}
                animate={
                  l.glow
                    ? { scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }
                    : {}
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface uppercase transition-transform duration-300 group-hover:translate-x-0.5">
                  {l.name}
                </span>
                <span className={`font-label-md text-[10px] ${l.metaClass}`}>
                  {l.meta}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}