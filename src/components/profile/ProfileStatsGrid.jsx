// src/components/profile/ProfileStatsGrid.jsx
import { motion } from 'framer-motion';

export default function ProfileStatsGrid({ dexa, stats }) {
  const cards = [
    {
      label: 'Weight',
      value: dexa?.weight_kg ?? '—',
      unit: 'KG',
      icon: 'accessibility_new',
      accent: false,
    },
    {
      label: 'Body Fat',
      value: dexa?.body_fat_percent ? Number(dexa.body_fat_percent).toFixed(1) : '—',
      unit: '%',
      icon: 'monitor_weight',
      accent: true,
    },
    {
      label: 'Lean Mass',
      value: dexa?.lean_mass_kg ? Number(dexa.lean_mass_kg).toFixed(1) : '—',
      unit: 'KG',
      icon: 'fitness_center',
      accent: false,
    },
    {
      label: 'Total Tonnage',
      value: Math.round((stats?.total_tonnage_all_time ?? 0) / 1000),
      unit: 'K kg',
      icon: 'bolt',
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
      {cards.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={`p-space-lg rounded-lg relative overflow-hidden shadow-md flex flex-col justify-between ${
            s.accent
              ? 'bg-primary-container/10 border border-primary-container/30'
              : 'bg-surface-container'
          }`}
        >
          {i === 0 && (
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container" />
          )}

          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              {s.label}
            </span>
            <span
              className={`material-symbols-outlined text-[20px] ${
                s.accent ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {s.icon}
            </span>
          </div>

          <div className="flex items-baseline gap-space-xs flex-wrap">
            <span
              className={`font-headline-lg text-headline-lg ${
                s.accent ? 'text-primary' : 'text-on-surface'
              }`}
            >
              {s.value}
            </span>
            {s.unit && (
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                {s.unit}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}