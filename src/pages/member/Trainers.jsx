import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { catalogService } from '../../services/catalogService';
import { tl } from '../../i18n';

const EASE = [0.22, 1, 0.36, 1];

const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

export default function Trainers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data: trainers, loading } = useApi(
    () => catalogService.trainers(),
    []
  );

  const list = Array.isArray(trainers) ? trainers : [];

  const filtered = useMemo(() => {
    let result = [...list];
    if (verifiedOnly) result = result.filter((t) => t.is_verified);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.user?.full_name?.toLowerCase().includes(s) ||
          t.title?.toLowerCase().includes(s) ||
          t.specialties?.some((sp) => sp.toLowerCase().includes(s))
      );
    }
    return result;
  }, [list, search, verifiedOnly]);

  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(128,128,128,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 80%)',
          }}
        />
        <motion.div
          className="absolute -top-40 right-[10%] w-[460px] h-[460px] rounded-full bg-primary-container/10 blur-3xl"
          animate={{ x: [0, 34, 0], y: [0, 26, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">group</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            {tl("Elite Coaching Network")}
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          {tl("Elite Trainers")}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          {tl("World-class specialists in VBT, powerlifting, biomechanics, and recovery. Click a trainer to view their full profile and book a session.")}
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVerifiedOnly(false)}
            className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
              !verifiedOnly
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            {tl("All Trainers (")}{list.length})
          </button>
          <button
            onClick={() => setVerifiedOnly(true)}
            className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              verifiedOnly
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {tl("Verified (")}{list.filter((t) => t.is_verified).length})
          </button>
        </div>

        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder={tl("Search by name, title, or specialty...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            person_search
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            {tl("No trainers found")}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {tl("Try a different search or filter.")}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={gridV}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.button
                key={t.id}
                layout
                variants={cardV}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/dashboard/trainers/${t.id}`)}
                className="text-left bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                type="button"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.user?.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[48px]">
                      {t.user?.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  {t.is_verified && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      {tl("Verified")}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary-container text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {t.rating || tl("New")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                      {t.title}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface uppercase mt-1 group-hover:text-primary transition-colors">
                      {t.user?.full_name}
                    </h3>
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {t.credentials}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(t.specialties || []).slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant text-[9px] font-bold uppercase tracking-wider"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
                    <div>
                      <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
                        {tl("Rate")}
                      </span>
                      <span className="font-title-md text-title-md text-primary font-bold">
                        ${t.hourly_rate}/hr
                      </span>
                    </div>
                    <span className="px-4 py-2 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:bg-secondary-container transition-colors">
                      {tl("View Profile")}
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}