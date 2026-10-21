import { motion } from 'framer-motion';

const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24 } },
};

/**
 * Numbers from the member's latest completed workout (dashboard API `biometric`).
 * Smart Gym has no wearable integration, so nothing here is a live sensor value.
 */
export default function BiometricStream({ session }) {
  const metrics = session
    ? [
      { label: 'Volume moved', icon: 'fitness_center', value: Number(session.tonnage_kg).toLocaleString(), unit: 'kg',
        caption: `${session.total_sets} sets · ${session.total_reps} reps` },
      { label: 'Duration', icon: 'timer', value: String(session.duration_minutes || 0), unit: 'min',
        caption: session.completed_at ? new Date(session.completed_at).toLocaleString() : '' },
      { label: 'Energy (est.)', icon: 'local_fire_department', value: String(session.calories || 0), unit: 'kcal',
        caption: 'Estimated from session length' },
      session.avg_velocity
        ? { label: 'Avg bar speed', icon: 'speed', value: Number(session.avg_velocity).toFixed(2), unit: 'm/s', caption: 'From logged velocity' }
        : { label: 'Avg effort', icon: 'speed', value: session.rpe_avg ? String(session.rpe_avg) : '—', unit: session.rpe_avg ? 'RPE' : '',
          caption: session.rpe_avg ? 'Average RPE logged' : 'Log RPE with your sets to see this' },
    ]
    : [];

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between gap-space-sm flex-wrap">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary">monitoring</span>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide m-0">Last session</h3>
        </div>
        {session && (
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{session.workout_name}</span>
        )}
      </div>

      {!session ? (
        <div className="rounded-lg bg-surface-container p-space-lg text-on-surface-variant text-[13px]">
          Finish your first workout to see its volume, duration and effort here.
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          {metrics.map((m) => (
            <motion.div key={m.label} variants={cardV} className="rounded-lg bg-surface-container p-space-lg shadow-md flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{m.label}</span>
                <span className="material-symbols-outlined text-primary text-[20px]">{m.icon}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-lg text-headline-lg text-on-surface leading-none">{m.value}</span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">{m.unit}</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">{m.caption}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
