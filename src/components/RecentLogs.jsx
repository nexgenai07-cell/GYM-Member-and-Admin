import { useState } from 'react';
import { motion } from 'framer-motion';
import { tl, locale } from '../i18n';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 380, damping: 32 };

const typeIcons = {
  strength: 'fitness_center',
  cardio: 'directions_run',
  combat: 'sports_mma',
  recovery: 'ac_unit',
  functional: 'sports_gymnastics',
};

const RANGE_DAYS = { '7 Days': 7, '30 Days': 30, 'All Time': null };

export default function RecentLogs({ workouts: all = [], loading }) {
  const [range, setRange] = useState('7 Days');
  const days = RANGE_DAYS[range];
  const [now] = useState(() => Date.now());
  const since = days ? now - days * 86400000 : 0;
  const workouts = all
    .filter((w) => new Date(w.completed_at || w.started_at).getTime() >= since)
    .slice(0, 10);

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low rounded-xl p-space-lg shadow-xl"
      >
        <div className="flex items-center justify-between mb-space-md">
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
            {tl("Recent workouts")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-surface-container rounded-lg animate-pulse"
            />
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-xl mb-space-xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-sm">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider m-0">
            {tl("Recent workouts")}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {tl("Your completed workouts.")}
          </p>
        </div>

        {/* Segmented control with sliding pill */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
          {['7 Days', '30 Days', 'All Time'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`relative px-space-sm py-space-xs rounded font-label-md text-label-md uppercase tracking-wider transition-colors duration-200 ${
                range === r
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {range === r && (
                <motion.span
                  layoutId="recent-logs-range-pill"
                  transition={SPRING}
                  className="absolute inset-0 rounded bg-surface-container-high shadow-sm"
                />
              )}
              <span className="relative z-10">{r}</span>
            </button>
          ))}
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-10 bg-surface-container rounded-lg">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            fitness_center
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-2">
            {tl("No workouts yet")}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tl("Your first session will appear here.")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-xs">
          {workouts.map((w, i) => {
            const icon = typeIcons[w.type] || typeIcons.strength;
            const isPR = w.status === 'completed' && w.is_pr;

            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-space-md bg-surface-container rounded-lg gap-space-sm hover:bg-surface-container-high transition-colors overflow-hidden"
              >
                {/* Hover accent bar */}
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-container origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <span className="material-symbols-outlined text-title-md">
                      {icon}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-surface uppercase">
                      {w.name}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {new Date(w.started_at).toLocaleString(locale)} ·{' '}
                      {w.total_exercises}{' '}{tl("exercises ·")}{' '}{w.total_sets} sets
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 md:flex items-center gap-space-lg">
                  <div className="flex flex-col md:text-right">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      {tl("Tonnage")}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface">
                      {Number(w.total_tonnage_kg || 0).toLocaleString(locale)} kg
                    </span>
                  </div>

                  <div className="flex flex-col md:text-right">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      {tl("Duration")}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface">
                      {w.duration_minutes || 0} min
                    </span>
                  </div>

                  <div className="flex flex-col md:text-right">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      {tl("Status")}
                    </span>
                    <span
                      className={`font-label-md text-label-md font-bold uppercase ${
                        w.status === 'completed'
                          ? isPR
                            ? 'text-primary drop-shadow-[0_0_10px_rgba(229,25,55,0.45)]'
                            : 'text-primary'
                          : w.status === 'in_progress'
                          ? 'text-yellow-400'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {w.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}