// src/components/shop/CategoryTabs.jsx
import { motion } from 'framer-motion';

export default function CategoryTabs({
  categories = [],
  activeCategory,
  setActiveCategory,
  visibleCount,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full px-space-xl py-space-sm bg-surface sticky top-16 z-30 shadow-md"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs overflow-x-auto pb-space-2xs md:pb-0">
          {[{ key: 'all', name: 'All Products' }, ...categories].map((c) => {
            const active = activeCategory === c.key;
            return (
              <motion.button
                key={c.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(c.key)}
                className={`px-space-md py-space-xs rounded font-label-lg text-label-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                  active
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.4)]'
                    : 'bg-surface-container-low text-outline hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                {c.name}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-space-sm flex-shrink-0 self-end md:self-center">
          <div className="flex items-center gap-space-xs px-space-sm py-space-2xs bg-surface-container-lowest rounded">
            <span className="material-symbols-outlined text-sm text-primary">
              bolt
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Metro Locker Hub:{' '}
              <span className="text-primary font-bold">Online</span>
            </span>
          </div>
          <div className="h-4 w-px bg-surface-container-highest" />
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
            {visibleCount} Products
          </span>
        </div>
      </div>
    </motion.section>
  );
}