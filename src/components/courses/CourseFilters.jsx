import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 420, damping: 30 };

const levels = [
  { key: 'all', label: 'All Levels' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

const sorts = [
  'Top Rated',
  'Price: Low to High',
  'Price: High to Low',
];

export default function CourseFilters({
  level,
  setLevel,
  search,
  setSearch,
  sortBy,
  setSortBy,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-space-md shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        {/* Level pills with sliding pill */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 md:pb-0">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider mr-space-xs shrink-0">
            Level:
          </span>
          {levels.map((lvl) => {
            const isActive = level === lvl.key;
            return (
              <motion.button
                key={lvl.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLevel(lvl.key)}
                className={`relative px-space-md py-space-2xs rounded-sm font-label-md text-label-md uppercase tracking-wider transition-colors shrink-0 ${
                  isActive
                    ? 'text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {isActive && (
                  <motion.span
                    layoutId="level-active-pill"
                    transition={SPRING}
                    className="absolute inset-0 rounded-sm bg-primary-container shadow-[0_0_14px_rgba(229,25,55,0.35)]"
                  />
                )}
                <span className="relative z-10">{lvl.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-space-xs shrink-0">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md uppercase tracking-wider px-space-sm py-space-2xs rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-container/50 cursor-pointer"
          >
            {sorts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
          search
        </span>
        <input
          type="text"
          placeholder="Search courses by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
        />
      </div>
    </motion.div>
  );
}