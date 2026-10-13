import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CountUp from '../CountUp';

const EASE = [0.22, 1, 0.36, 1];

const lineUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
};

const stats = [
  { value: 48, suffix: '+', label: 'Protocols' },
  { value: 5, suffix: 'K+', label: 'Active Athletes' },
  { value: 20, suffix: 'K+', label: 'Workouts Logged' },
];

export default function BrandingPanel() {
  const ref = useRef(null);

  // Mouse parallax (presentational only)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const bgX = useTransform(sx, [0, 1], ['-2.5%', '2.5%']);
  const bgY = useTransform(sy, [0, 1], ['-2%', '2%']);
  const contentX = useTransform(sx, [0, 1], ['1.5%', '-1.5%']);
  const contentY = useTransform(sy, [0, 1], ['1%', '-1%']);
  const glowX = useTransform(sx, [0, 1], ['-6%', '6%']);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      className="relative w-full h-full overflow-hidden bg-surface-container-low"
    >
      {/* Background image — Ken Burns + parallax */}
      <motion.div
        className="absolute inset-[-4%] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbVGUTzt-u3vCjuQm_-WPuCAir7kfIo0jNgxezUtVIimLofLZRy9QI5mZTSGx8Dy_c66iqhRXlVin-9XEbtpvISu1YW54EmfrvrXOno6bCtDm9eSuLOq7qTsklSf6kKZkKYRgqOmSGCCDBTG1xp9cIj59iSzPkoTgV3uMQrRF563W0On8Qjj8RF_qvcAcC_NshTj2yioD8GnydTr8YknFNWPfYn1C9arJIgraKl37Wkh6IR64K40MQog')",
          x: bgX,
          y: bgY,
        }}
        animate={{ scale: [1.08, 1.14, 1.08] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Telemetry grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-surface-container-lowest/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-container-lowest/40" />

      {/* Crimson ambient glow — drifting with parallax */}
      <motion.div
        className="absolute -right-24 top-1/3 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"
        style={{ x: glowX }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.18, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Slow scan light sweep */}
      <motion.div
        className="absolute top-0 bottom-0 w-40 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none"
        animate={{ left: ['-14%', '106%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 2 }}
      />

      {/* Content — with counter parallax */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-between p-space-2xl"
        style={{ x: contentX, y: contentY }}
      >
        {/* Logo — with orbiting ring */}
        <motion.div variants={lineUp} className="flex items-center gap-space-sm">
          <div className="relative w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(229,25,55,0.5)]">
            <motion.span
              className="material-symbols-outlined text-on-primary-container text-[26px]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              fitness_center
            </motion.span>
            <motion.span
              className="absolute -inset-1.5 rounded-xl border border-dashed border-primary-container/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-wider text-on-surface uppercase leading-none">
              Smart Gym
            </span>
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
              Performance Core
            </span>
          </div>
        </motion.div>

        {/* Hero content */}
        <div className="flex flex-col gap-space-lg max-w-xl">
          <motion.div variants={lineUp}>
            <motion.span
              className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded bg-primary-container/20 backdrop-blur-md text-primary font-label-md text-label-md tracking-widest uppercase mb-space-md"
              whileHover={{ scale: 1.03 }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary-container"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Member Access Portal
            </motion.span>

            {/* Headline — words rise in sequence */}
            <h1 className="font-display-xl text-display-xl text-on-surface uppercase leading-none mb-space-md">
              {['Train', 'Smarter.', 'Perform', 'Harder.'].map((word, i) => (
                <motion.span
                  key={word}
                  className={`inline-block ${i === 1 || i === 3 ? 'text-primary-container' : ''} ${
                    i === 1 ? 'mr-1' : ''
                  }`}
                  initial={{ opacity: 0, y: 34, rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.8, ease: EASE }}
                >
                  {word}
                  {i === 0 && <br />}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={lineUp}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-lg"
            >
              Access your personalized training protocols, biometric telemetry, and
              performance dashboards — engineered for elite strength athletes.
            </motion.p>
          </motion.div>

          {/* Stats strip — counts up, dividers draw in */}
          <motion.div
            variants={lineUp}
            className="flex items-center gap-space-lg flex-wrap"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-space-lg">
                {i > 0 && (
                  <motion.div
                    className="w-px h-10 bg-surface-container-highest origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 1.1 + i * 0.15, duration: 0.5, ease: EASE }}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-on-surface leading-none tabular-nums">
                    <CountUp to={s.value} suffix={s.suffix} duration={1.6} delay={1 + i * 0.2} />
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={lineUp}
          className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md uppercase tracking-wider"
        >
          <span>© 2025 Smart Gym</span>
          <span className="flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            All Systems Online
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}