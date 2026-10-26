import { motion } from 'framer-motion';
import { tl } from '../../i18n';

export default function TelemetryImpact({ trainer }) {
  if (!trainer) return null;

  // Build telemetry from trainer data
  const metrics = [
    {
      label: tl("Athletes Trained"),
      value: `${trainer.total_students || 0}`,
      bar: Math.min(100, (trainer.total_students / 500) * 100),
      sub: tl("Active Roster"),
      accent: true,
    },
    {
      label: tl("Total Reviews"),
      value: `${trainer.total_reviews || 0}`,
      bar: Math.min(100, (trainer.total_reviews / 400) * 100),
      sub: tl("Verified Feedback"),
      accent: false,
    },
    {
      label: tl("Experience"),
      value: `${trainer.years_experience || 0} YRS`,
      bar: Math.min(100, (trainer.years_experience / 20) * 100),
      sub: tl("Industry Tenure"),
      accent: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col gap-space-md shadow-lg"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary-container text-title-md">
            monitoring
          </span>
          <span className="font-headline-md text-headline-md text-on-surface uppercase">
            {tl("Athlete Roster Telemetry Impact")}
          </span>
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {tl("Live Performance Metrics")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
            className="bg-surface-container rounded-lg p-space-md flex flex-col"
          >
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              {m.label}
            </span>
            <span
              className={`font-headline-lg text-headline-lg uppercase mt-space-2xs leading-none ${
                m.accent ? 'text-primary' : 'text-on-surface'
              }`}
            >
              {m.value}
            </span>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-space-sm overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  m.accent ? 'bg-primary-container' : 'bg-primary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${m.bar}%` }}
                transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
              />
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant mt-space-2xs uppercase">
              {m.sub}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}