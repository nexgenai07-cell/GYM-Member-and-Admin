import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const phases = [
  {
    num: 'Phase 01',
    icon: 'accessibility_new',
    title: 'Retract Scapulae',
    desc: 'Depress your shoulder blades and drive thoracic spine firmly into the backpad. Maintain natural lumbar arch.',
  },
  {
    num: 'Phase 02',
    icon: 'straighten',
    title: '90° Elbow Flare',
    desc: 'Keep elbows tucked at ~45-60° from torso. Avoid hyper-flaring at 90° to eliminate anterior glenohumeral shear.',
  },
  {
    num: 'Phase 03',
    icon: 'speed',
    title: 'Concentric Drive',
    desc: 'Press powerfully without locking elbows completely out. Maintain tension across pectoral fibers throughout full stroke.',
  },
];

const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

export default function ExecutionPhases() {
  const rm = useReducedMotion();

  return (
    <div>
      {/* Connector rail — dot travels across phase centers */}
      <div className="relative hidden md:block h-px bg-surface-container-highest mx-space-md mb-space-xs">
        {[16.66, 50, 83.33].map((x) => (
          <span
            key={x}
            className="absolute -top-[3px] w-[7px] h-[7px] rounded-full bg-surface-container-low border border-surface-container-highest"
            style={{ left: `calc(${x}% - 3.5px)` }}
          />
        ))}
        {!rm && (
          <motion.span
            className="absolute -top-[3px] w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(229,25,55,0.8)]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={gridV}
        className="grid grid-cols-1 md:grid-cols-3 gap-space-md"
      >
        {phases.map((p, i) => (
          <motion.div
            key={p.num}
            variants={cardV}
            whileHover={{ y: -5, transition: { type: 'spring', stiffness: 380, damping: 20 } }}
            className="group relative bg-surface-container rounded-xl p-space-md flex flex-col gap-space-2xs shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Ghost step numeral */}
            <span className="absolute -right-2 -bottom-4 font-headline-lg text-[64px] leading-none text-on-surface/[0.04] font-bold select-none pointer-events-none">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Top accent hairline */}
            <motion.span
              className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent origin-center"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE }}
            />

            <div className="flex items-center justify-between text-primary relative z-10">
              <span className="font-label-md text-label-md uppercase tracking-wider">
                {p.num}
              </span>
              <motion.span
                className="material-symbols-outlined text-title-md transition-transform duration-300 group-hover:scale-110"
                animate={rm ? {} : { y: [0, -3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              >
                {p.icon}
              </motion.span>
            </div>
            <span className="font-title-md text-title-md text-on-surface uppercase transition-transform duration-300 group-hover:translate-x-0.5 relative z-10">
              {p.title}
            </span>
            <p className="font-body-md text-on-surface-variant text-xs leading-relaxed relative z-10">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}