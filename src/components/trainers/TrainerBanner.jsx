import { motion } from 'framer-motion';

export default function TrainerBanner({ trainer }) {
  if (!trainer) return null;

  const name = trainer.user?.full_name || 'Trainer';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  // Build metrics from backend data
  const metrics = [
    {
      label: 'Athlete Rating',
      value: trainer.rating || '—',
      unit: '/ 5.0',
      sub: `${trainer.total_reviews} Reviews`,
      icon: 'star',
    },
    {
      label: 'Experience',
      value: trainer.years_experience || 0,
      unit: 'YRS',
      sub: 'Industry',
      icon: 'speed',
    },
    {
      label: 'Athletes Coached',
      value: trainer.total_students || 0,
      unit: '',
      sub: 'Active Roster',
      icon: 'trophy',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-xl bg-surface-container-lowest overflow-hidden shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10" />
      <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-space-lg p-space-xl items-end">
        {/* Image + Identity */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-md items-start">
          <div className="relative w-36 h-48 sm:w-44 sm:h-56 lg:w-48 lg:h-60 rounded-lg overflow-hidden bg-surface-container-low shadow-md shrink-0">
            {trainer.photo_url ? (
              <img
                src={trainer.photo_url}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[64px]">
                {initials}
              </div>
            )}
            {trainer.is_accepting_clients && (
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded-lg flex items-center gap-space-2xs backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                  Accepting Athletes
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-space-2xs">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase flex items-center gap-space-2xs">
              <span className="material-symbols-outlined text-title-md text-primary">
                {trainer.is_verified ? 'verified' : 'person'}
              </span>
              {trainer.title}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide leading-none">
              {name}
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              {trainer.credentials}
            </p>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="lg:col-span-8 flex flex-wrap lg:flex-nowrap items-stretch gap-space-sm w-full">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="flex-1 min-w-[140px] bg-surface-container-low/90 rounded-lg p-space-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-md text-label-md uppercase">{m.label}</span>
                <span
                  className="material-symbols-outlined text-primary text-title-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {m.icon}
                </span>
              </div>
              <div className="mt-space-sm flex items-baseline gap-space-xs">
                <span className="font-headline-lg text-headline-lg text-on-surface leading-none">
                  {m.value}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {m.unit}
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary uppercase mt-space-2xs">
                {m.sub}
              </span>
            </motion.div>
          ))}

          {/* Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="flex-1 min-w-[140px] bg-surface-container-low/90 rounded-lg p-space-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase">Session Rate</span>
              <span className="material-symbols-outlined text-primary text-title-md">
                payments
              </span>
            </div>
            <div className="mt-space-sm flex flex-col">
              <span className="font-title-lg text-title-lg text-primary leading-tight font-bold">
                SAR {Number(trainer.hourly_rate).toFixed(2)}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                Per 60-min session
              </span>
            </div>
            {trainer.is_verified && (
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mt-space-2xs">
                Verified Coach
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}