import { motion } from 'framer-motion';
import { tl } from '../../i18n';

const images = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTpQQZxWNLKQLpra2l594YhowLdXrb727C5jmZblvkjq6Ucr9I9lzdOgvA53tmjcw44tYKMXkQmSI0p8Ma4v9tmT7l_TfKRxtOv2HfEaly6iKivvJqnmnaX78uCPhtF40AV0BaakefxpFkiyVoP-J73sQQOesyqBDseduuAFSfwow7ZbMHOahXfU6yAYvUzW6NNPmLqGBG-4McC5DUQuns1Q-ueNCwH1vRYOxnItmHxqMj3ltRxOCCQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC6rLapvFmFNJx860WNpB8Mrf5tgDoYhOlU_xLMZ3DISxDlWk5X_nKy1nKxDbgBdSYvz0KsLd5v2010rru47jU5cEIF_n-0qe7EzpdflyQYyq2DOgg0keTwe3MuMbC2PMoy2-3UCcUMzBeMfJYfQQUcermOiltr_M7uhErht5evGlYp1Nl41iIzMQJR85jM2GbuO4YeSxFJEmoHr-DS7iRDnsbUEF544Tgtcx7IrinZ1O0_ZirL6g00pg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBI8bzequKwIF2CSGm78G3dWAOie9lH6AEEVmgfe0XSHQMZk4B2kDAI-6n-sPRwWoIpuIWok7BJwPcU8klNGXkGq7ip-IZ9lUWYXdZz1XUOVYYW8V5D_RTCB1tRLCKqz-R7Q4K2vrq3hY3im3ocyn5M-7xWAHQfR2Uk-llnc188-bcRDk2aJLY-_I90mLUBzn7pKHalHXPW68s00zmRAh5HhLnShyT-NIEV4O_iEMDnrLiesTh60QmgaA',
];

export default function ArenaSnapshots({ arenas }) {
  // Defensive: handle null, undefined, or non-array
  const safeArenas = Array.isArray(arenas) ? arenas : [];

  if (safeArenas.length === 0) {
    return (
      <div className="text-center py-10 bg-surface-container-low rounded-xl">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          place
        </span>
        <p className="text-on-surface-variant mt-2">
          {tl("Start checking in to unlock your top arena zones.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mt-space-sm">
      {safeArenas.map((a, i) => (
        <motion.div
          key={a.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="relative overflow-hidden rounded-lg bg-surface-container shadow-md h-56 flex flex-col justify-end p-space-lg group cursor-pointer"
        >
          <div
            className="bg-cover bg-center absolute inset-0 group-hover:scale-105 transition-transform duration-500 opacity-40"
            style={{ backgroundImage: `url('${a.image || images[i % 3]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent" />

          <div className="relative z-10">
            <span
              className={`px-space-xs py-0.5 rounded font-label-md text-label-md uppercase font-bold tracking-widest inline-block mb-1 ${
                a.tagAccent
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {a.tag}
            </span>
            <h4 className="font-headline-md text-headline-md text-on-surface uppercase">
              {a.title}
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-[13px]">
              {a.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}