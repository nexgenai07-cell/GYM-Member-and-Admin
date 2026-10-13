import { useState } from 'react';
import { motion } from 'framer-motion';

const ranges = ['7D', '30D', '90D', 'YTD'];

export default function ControlBar() {
  const [activeRange, setActiveRange] = useState('30D');

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm"
    >
      {/* Left: Live indicators */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container" />
          </span>
          <span className="font-label-md text-[11px] uppercase tracking-wider text-primary font-bold">
            Live Feed Active
          </span>
        </div>

        <div className="h-4 w-px bg-surface-variant hidden sm:block" />

        <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-[11px] uppercase tracking-widest">
          <span>Facility ID:</span>
          <span className="text-on-surface font-title-md text-title-md">
            METRO-HQ-01
          </span>
        </div>

        <div className="h-4 w-px bg-surface-variant hidden sm:block" />

        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-[11px]">
          <span className="material-symbols-outlined text-primary-container text-[16px]">
            sync
          </span>
          <span>Latency: 14ms (Edge Cluster)</span>
        </div>
      </div>

      {/* Right: Filters + CTA */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex p-1 bg-surface-container-lowest rounded-lg">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-3 py-1 rounded-lg font-label-md text-[11px] uppercase tracking-wider transition-all ${
                activeRange === r
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-primary-container hover:bg-secondary-container text-on-primary-container px-4 py-2 rounded-lg font-label-lg text-label-lg uppercase tracking-wider shadow-lg shadow-primary-container/20 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Dossier</span>
        </motion.button>
      </div>
    </motion.section>
  );
}