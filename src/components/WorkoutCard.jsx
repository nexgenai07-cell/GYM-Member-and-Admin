import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workoutsService } from '../services/workoutsService';
import toast from 'react-hot-toast';
import CountUp from './CountUp';

function useCountdown(startSeconds = 90) {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const EASE = [0.22, 1, 0.36, 1];
const HOVER = { type: 'spring', stiffness: 380, damping: 20 };

export default function WorkoutCard({ workout, onStartWorkout, starting }) {
  const timer = useCountdown(90);

  const exercises = workout?.exercises || [];
  const hasWorkout = !!workout;

  const handleLogSet = async (exercise, setNum) => {
    try {
      await workoutsService.logSet(exercise.id, {
        set_number: setNum,
        reps: 8,
        weight_kg: 100,
      });
      toast.success('Set logged');
    } catch (e) {
      toast.error('Failed to log set');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      className="lg:col-span-8 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between relative overflow-hidden shadow-xl"
    >
      {/* Watermark */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none flex items-center justify-end pr-space-md select-none">
        <motion.span
          className="material-symbols-outlined text-on-surface opacity-[0.05]"
          style={{ fontSize: '260px', lineHeight: 1 }}
          animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          fitness_center
        </motion.span>
      </div>

      <div className="flex flex-col gap-space-md relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 320, damping: 20 }}
              className={`px-space-xs py-space-2xs font-label-md text-label-md rounded uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(229,25,55,0.3)] ${
                hasWorkout && workout.status === 'in_progress'
                  ? 'bg-primary-container text-on-primary-container'
                  : hasWorkout
                  ? 'bg-surface-container-high text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {hasWorkout
                ? workout.status === 'in_progress'
                  ? 'In Progress'
                  : 'Last Session'
                : 'Ready'}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: EASE }}
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest"
            >
              {hasWorkout ? 'Active Protocol' : 'Start Your First Session'}
            </motion.span>
          </div>

          {hasWorkout && (
            <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded-full">
              <span className="material-symbols-outlined text-primary text-body-lg animate-spin-slow">
                timer
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                Rest Window:
              </span>
              <div className="overflow-hidden flex">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={timer}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="font-title-md text-title-md text-primary font-bold tracking-wider tabular-nums"
                  >
                    {timer}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mt-space-xs">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide leading-none m-0">
              {workout?.name || 'Ready for Today\'s Session'}
            </h2>
            <span className="font-body-md text-body-md text-on-surface-variant mt-1 block">
              {workout
                ? `${workout.total_exercises || 0} exercises · ${workout.total_sets || 0} sets`
                : 'Tap "Start Workout" to begin tracking'}
            </span>
          </div>

          {workout && workout.total_sets > 0 && (
            <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-xs rounded-xl self-start md:self-auto">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                  <motion.path
                    className="text-primary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="45, 100"
                    strokeLinecap="round"
                    strokeWidth="3.8"
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: '45, 100' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                  />
                </svg>
                <span className="absolute font-label-md text-label-md text-on-surface font-bold">
                  <CountUp to={45} suffix="%" duration={1.2} delay={0.6} />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface uppercase font-bold">
                  {workout.total_sets || 0} Sets
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  RPE Target
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Exercises */}
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mt-space-sm">
            {exercises.slice(0, 3).map((ex, i) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -3, transition: HOVER }}
                className="bg-surface-container p-space-sm rounded-lg flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-md text-label-md uppercase">
                      {ex.name}
                    </span>
                    {ex.muscle && (
                      <span className="text-[10px] text-primary font-bold uppercase">
                        {ex.muscle}
                      </span>
                    )}
                  </div>
                  <span className="font-title-lg text-title-lg text-on-surface block mt-1">
                    {ex.sets?.[ex.sets.length - 1]?.weight_kg || 0}{' '}
                    <span className="text-body-md text-on-surface-variant">KG</span>
                  </span>
                </div>
                <div className="flex items-center justify-between mt-space-sm pt-space-xs text-on-surface-variant">
                  <span className="font-label-md text-label-md">
                    {ex.total_sets || 0} SETS
                  </span>
                  <button
                    onClick={() => handleLogSet(ex, (ex.total_sets || 0) + 1)}
                    className="font-label-md text-label-md text-primary font-bold uppercase hover:underline"
                    type="button"
                  >
                    + LOG
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-space-lg rounded-lg flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
              fitness_center
            </span>
            <span className="font-title-md text-title-md text-on-surface">
              No Active Workout
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Start one to log exercises and track sets.
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-md mt-space-md border-t border-surface-container-high/60 relative z-10">
        <div className="flex items-center gap-space-sm">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartWorkout}
            disabled={starting}
            className="group px-space-md py-space-xs bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider rounded flex items-center gap-space-2xs shadow-[0_4px_20px_rgba(229,25,55,0.3)] disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-title-md">
              {starting ? 'sync' : 'play_arrow'}
            </span>
            {starting ? 'Starting...' : 'Start Workout'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}