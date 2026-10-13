import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

export default function VideoTutorial() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(42);
  const rm = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      className="relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-2xl flex flex-col group"
    >
      {/* Video viewport */}
      <div className="relative w-full aspect-video bg-surface-container-lowest overflow-hidden">
        <motion.img
          className="w-full h-full object-cover opacity-85"
          alt="Athlete performing chest press"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Tcijljr1m1Sr5JlL-JNRZE5OBywWXX3FmpxvulClFJwbk4NHl7I2DhYKgPzYeMPafhlkE60Ef_5oDIxlc5OjVEIpbtVeQhR88v3r3Ve9IOd0T9fWZJKWTfJ4ncptzyueYfnMcpn-9YFKTlryU7sNuXeEdnUT0YiD5YSPQ1VxgvEBifC3xzEsYepB9hqpSZEFyBSqDsNaoTr5tUFOODDf0Z3XaAYytH707J692DgNzL94WdnOLkcGUw"
          animate={rm ? undefined : { scale: [1.02, 1.06, 1.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-surface-container-lowest/60" />

        {/* Viewfinder corner brackets */}
        {[
          'top-2 left-2 border-t border-l',
          'top-2 right-2 border-t border-r',
          'bottom-2 left-2 border-b border-l',
          'bottom-2 right-2 border-b border-r',
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute w-5 h-5 border-primary-container/50 pointer-events-none ${pos}`}
          />
        ))}

        {/* Telemetry scan line */}
        {!rm && (
          <motion.div
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"
            animate={{ left: ['-14%', '106%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
        )}

        {/* Top HUD badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
          className="absolute top-space-md left-space-md right-space-md flex items-center justify-between pointer-events-none flex-wrap gap-space-xs"
        >
          <div className="flex items-center gap-space-xs bg-surface-container-lowest/80 backdrop-blur-md px-space-sm py-space-2xs rounded-lg">
            <span
              className="material-symbols-outlined text-primary text-title-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_display
            </span>
            <span className="font-label-md text-label-md text-on-surface tracking-wider uppercase">
              Titan Motion AR Guide
            </span>
          </div>
          <div className="flex items-center gap-space-2xs bg-primary-container/20 backdrop-blur-md text-primary px-space-sm py-space-2xs rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_6px_rgba(229,25,55,0.8)]" />
            <span className="font-label-md text-label-md uppercase tracking-wider">
              Telemetry Live Track
            </span>
          </div>
        </motion.div>

        {/* AR overlays — reactive to playback state */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {/* Elbow angle gimbal — spins faster while playing */}
          <div className="absolute left-[24%] top-[46%] flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <motion.svg
                className="w-20 h-20 text-primary"
                viewBox="0 0 100 100"
                animate={rm ? undefined : { rotate: 360 }}
                transition={{ duration: playing ? 6 : 16, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  className="opacity-60"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                />
              </motion.svg>
              <svg className="absolute w-20 h-20 text-primary" viewBox="0 0 100 100">
                <path
                  d="M 50 12 A 38 38 0 0 1 88 50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(229,25,55,0.6))' }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  fill="#e51937"
                  r="4"
                  animate={rm ? {} : { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: playing ? 1 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              </svg>
              <motion.div
                className="absolute -top-3 bg-surface-container-lowest/90 px-2 rounded text-primary font-label-md text-[10px] uppercase"
                animate={rm ? {} : { y: [0, -2, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                90° Lock
              </motion.div>
            </div>
            <span className="font-label-md text-[10px] text-on-surface tracking-widest uppercase bg-surface-container-lowest/80 px-1 py-0.5 rounded mt-1">
              Elbow Flexion
            </span>
          </div>

          {/* Bar path — dot travels only while playing, rests mid-vector when paused */}
          <div className="absolute right-[28%] top-[34%] flex flex-col items-center">
            <div className="h-28 w-0.5 bg-gradient-to-b from-primary via-primary-container to-transparent relative flex flex-col items-center">
              <motion.span
                className="material-symbols-outlined text-primary text-sm -mt-2"
                animate={rm ? {} : { y: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                arrow_downward
              </motion.span>
              <motion.span
                className="absolute -translate-y-1/2 w-3 h-3 rounded-full bg-primary-container/40 flex items-center justify-center"
                animate={
                  playing && !rm
                    ? { top: ['12%', '88%', '12%'] }
                    : { top: '50%' }
                }
                transition={
                  playing && !rm
                    ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.5, ease: EASE }
                }
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={rm ? {} : { scale: [1, 1.6, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.span>
            </div>
            <span className="font-label-md text-[10px] text-on-surface-variant tracking-widest uppercase bg-surface-container-lowest/80 px-1 py-0.5 rounded mt-1">
              Linear Vector
            </span>
          </div>
        </motion.div>

        {/* Play button — ripple rings, icon spring */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlaying((p) => !p)}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_24px_rgba(229,25,55,0.45)] hover:bg-secondary-container transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
          type="button"
          aria-label={playing ? 'Pause tutorial' : 'Play tutorial'}
        >
          {!rm && (
            <motion.span
              className="absolute inset-0 rounded-full bg-primary-container/40 pointer-events-none"
              animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <motion.span
            className="material-symbols-outlined text-headline-md leading-none ml-1 relative z-10"
            style={{ fontVariationSettings: "'FILL' 1" }}
            key={playing ? 'pause' : 'play'}
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {playing ? 'pause' : 'play_arrow'}
          </motion.span>
        </motion.button>
      </div>

      {/* Controls bar */}
      <div className="p-space-md bg-surface-container-low flex flex-col gap-space-sm">
        {/* Scrubber with buffer + chapter ticks */}
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden relative cursor-pointer group/bar">
          {/* Buffer */}
          <span className="absolute inset-y-0 left-0 bg-surface-container-highest/70" style={{ width: '78%' }} />
          {/* Progress */}
          <motion.div
            className="bg-primary-container h-full relative shadow-[0_0_10px_rgba(229,25,55,0.6)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.span
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-on-surface shadow-[0_0_8px_rgba(255,255,255,0.6)] opacity-0 group-hover/bar:opacity-100 transition-opacity"
              animate={rm ? {} : { scale: [1, 1.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          {/* Chapter ticks */}
          {[30, 55, 80].map((t) => (
            <span
              key={t}
              className="absolute top-0 bottom-0 w-[2px] bg-surface-container-lowest/60 pointer-events-none"
              style={{ left: `${t}%` }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setPlaying((p) => !p)}
              className="text-on-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-title-md">
                {playing ? 'pause' : 'play_arrow'}
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85, rotate: -20 }}
              className="text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-title-md">replay_10</span>
            </motion.button>
            <div className="text-on-surface-variant font-label-md text-label-md tracking-wider tabular-nums">
              <span className="text-on-surface">00:18</span> / 00:45
            </div>
          </div>

          <div className="flex items-center gap-space-xs">
            <motion.span
              whileHover={{ scale: 1.06 }}
              className="bg-surface-container-high px-space-xs py-0.5 rounded font-label-md text-[10px] text-primary uppercase cursor-default"
            >
              4K 60FPS
            </motion.span>
            <motion.button
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-title-md">speed</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              className="text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-title-md">fullscreen</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}