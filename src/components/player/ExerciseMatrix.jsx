import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ExerciseMatrix({ exercises = [], onConnect }) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="w-full bg-surface-container-low rounded-xl p-space-xl text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          fitness_center
        </span>
        <p className="font-title-md text-title-md text-on-surface mt-3">
          Start Workout to See Prescribed Exercises
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Once you begin a session, today's movement protocol will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-space-md mt-space-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <span className="text-label-md font-label-md text-primary tracking-widest uppercase">
            Target Execution Matrix
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-surface tracking-wider uppercase">
            Today's Prescribed Movement Protocol
          </h2>
        </div>
        <div className="flex items-center gap-space-xs text-label-md font-label-md text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span>Autoregulated Telemetry Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {exercises.map((ex, i) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between gap-space-md shadow-sm hover:shadow-lg transition-all relative overflow-hidden"
          >
            {ex.is_compound && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
            )}

            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-space-xs py-0.5 rounded font-label-md text-label-md uppercase ${
                    ex.is_compound
                      ? 'bg-primary-container/20 text-primary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {ex.primary_muscle}
                </span>
                <span
                  className={`material-symbols-outlined text-title-md ${
                    ex.is_compound ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  fitness_center
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide mt-1">
                {ex.name}
              </h3>

              <p className="text-label-lg font-label-lg tracking-wider uppercase text-primary">
                {ex.total_sets || 0} Sets Logged
              </p>

              {ex.description && (
                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mt-space-2xs line-clamp-3">
                  {ex.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onConnect?.(ex)}
              className="w-full py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase transition-colors flex items-center justify-center gap-space-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-title-md">
                {ex.qr_tag_id ? 'sensors' : 'tune'}
              </span>
              <span>{ex.qr_tag_id ? 'Scan QR' : 'Log Set'}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}