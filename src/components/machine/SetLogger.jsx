import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 420, damping: 22 };

const initialSets = [
  { id: 1, load: '75.0', reps: '10', done: true },
  { id: 2, load: '77.5', reps: '8', done: false, active: true },
  { id: 3, load: '77.5', reps: '8', done: false },
  { id: 4, load: '80.0', reps: '8', done: false },
];

export default function SetLogger({ onLogSet }) {
  const rm = useReducedMotion();
  const [sets, setSets] = useState(initialSets);
  const [logged, setLogged] = useState(false);

  const toggleSet = (id) => {
    setSets((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              done: !s.done,
              active: !s.done ? false : s.active,
            }
          : s
      )
    );
    if (!sets.find((s) => s.id === id)?.done) {
      onLogSet?.();
    }
  };

  const updateSet = (id, field, value) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleLogActive = () => {
    setLogged(true);
    onLogSet?.();
    setTimeout(() => setLogged(false), 1500);
  };

  // ===== Presentational derivations (display only — no state/handler changes) =====
  const completedVolume = sets
    .filter((s) => s.done)
    .reduce((acc, s) => acc + (parseFloat(s.load) || 0) * (parseInt(s.reps, 10) || 0), 0);
  const doneCount = sets.filter((s) => s.done).length;
  const maxVol = Math.max(
    ...sets.map((s) => (parseFloat(s.load) || 0) * (parseInt(s.reps, 10) || 0)),
    1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
      className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md"
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          className="flex flex-col"
        >
          <span className="font-label-md text-label-md uppercase text-primary tracking-widest">
            Active Series
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase m-0">
            Work Set Logger
          </h3>
        </motion.div>

        {/* LIVE derived volume — flips on change */}
        <div className="bg-surface-container px-space-xs py-1 rounded overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={Math.round(completedVolume * 10)}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={`block font-label-md text-[10px] uppercase tracking-wider tabular-nums whitespace-nowrap ${
                completedVolume > 0 ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              Volume: {completedVolume.toFixed(1)} KG
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots + logged count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex items-center justify-between px-space-2xs"
      >
        <div className="flex items-center gap-1">
          {sets.map((s) => (
            <motion.span
              key={s.id}
              className={`h-1 rounded-full transition-colors duration-300 ${
                s.done
                  ? 'bg-primary-container shadow-[0_0_6px_rgba(229,25,55,0.6)]'
                  : 'bg-surface-container-highest'
              }`}
              animate={{ width: s.done ? 18 : 10 }}
              transition={SPRING}
            />
          ))}
        </div>
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider tabular-nums">
          {doneCount}/{sets.length} Logged
        </span>
      </motion.div>

      {/* Column header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-12 gap-space-xs text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider px-space-2xs"
      >
        <span className="col-span-2 text-center">Set</span>
        <span className="col-span-4 text-center">Load (KG)</span>
        <span className="col-span-3 text-center">Reps</span>
        <span className="col-span-3 text-right">Status</span>
      </motion.div>

      {/* Rows */}
      <div className="flex flex-col gap-space-xs">
        {sets.map((set, i) => {
          const isActive = set.active && !set.done;
          const vol = (parseFloat(set.load) || 0) * (parseInt(set.reps, 10) || 0);
          return (
            <motion.div
              key={set.id}
              layout
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: EASE }}
              className={`group relative grid grid-cols-12 gap-space-xs items-center rounded-lg p-space-xs transition-colors overflow-hidden ${
                isActive
                  ? 'bg-surface-container-high border-l-2 border-primary-container shadow'
                  : set.done
                  ? 'bg-surface-container opacity-90'
                  : 'bg-surface-container opacity-70'
              }`}
            >
              {/* Active row energy sweep */}
              {isActive && !rm && (
                <motion.span
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-primary-container/10 to-transparent pointer-events-none"
                  animate={{ left: ['-14%', '106%'] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Per-set volume micro-bar */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] rounded-r-full transition-all duration-500 ${
                  set.done
                    ? 'bg-primary-container'
                    : isActive
                    ? 'bg-primary-container/50'
                    : 'bg-surface-container-highest'
                }`}
                style={{ width: `${Math.max((vol / maxVol) * 100, 4)}%` }}
              />

              <div
                className={`col-span-2 flex items-center justify-center font-headline-md text-title-md relative z-10 ${
                  isActive ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {String(set.id).padStart(2, '0')}
              </div>

              <div className="col-span-4 relative z-10">
                <input
                  type="number"
                  step="0.5"
                  value={set.load}
                  onChange={(e) => updateSet(set.id, 'load', e.target.value)}
                  className={`w-full bg-surface-container-lowest text-center font-title-md text-title-md rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(229,25,55,0.15)] transition-all tabular-nums ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}
                />
              </div>

              <div className="col-span-3 relative z-10">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(set.id, 'reps', e.target.value)}
                  className={`w-full bg-surface-container-lowest text-center font-title-md text-title-md rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-[0_0_12px_rgba(229,25,55,0.15)] transition-all tabular-nums ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}
                />
              </div>

              <div className="col-span-3 flex justify-end relative z-10">
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleSet(set.id)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    set.done
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.45)]'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                  }`}
                  type="button"
                  aria-label={`Toggle set ${set.id}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={set.done ? 'done' : 'pending'}
                      initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.3, opacity: 0, rotate: 90 }}
                      transition={SPRING}
                      className="material-symbols-outlined text-sm font-bold"
                    >
                      {set.done ? 'done' : 'check'}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Log button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogActive}
        className="relative mt-space-sm w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded-lg shadow-[0_0_20px_rgba(229,25,55,0.4)] transition-colors flex items-center justify-center gap-space-xs overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
        type="button"
      >
        {!rm && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-primary-container/50 pointer-events-none"
            animate={{ scale: [1, 1.08], opacity: [0.3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[320%] transition-transform duration-700 ease-out" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={logged ? 'logged-icon' : 'log-icon'}
            initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, rotate: 90 }}
            transition={SPRING}
            className="material-symbols-outlined text-title-md relative z-10"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {logged ? 'check_circle' : 'add_task'}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={logged ? 'logged-label' : 'log-label'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="relative z-10"
          >
            {logged ? 'Set 02 Logged' : 'Log Active Set 02'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between text-[11px] text-on-surface-variant px-space-xs pt-space-xs border-t border-surface-container"
      >
        <span className="flex items-center gap-1">
          <motion.span
            className="material-symbols-outlined text-primary text-sm"
            animate={rm ? {} : { scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            verified_user
          </motion.span>
          RPE Verified Auto-Sync
        </span>
        <button className="text-primary hover:underline uppercase font-bold underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm" type="button">
          Adjust Target
        </button>
      </motion.div>
    </motion.div>
  );
}