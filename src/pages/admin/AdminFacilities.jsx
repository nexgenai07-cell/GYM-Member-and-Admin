import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { facilitiesService } from '../../services/facilitiesService';

const FILTERS = [
  { key: 'all', label: 'All', icon: 'apps' },
  { key: 'gym', label: 'Gym', icon: 'fitness_center' },
  { key: 'recovery', label: 'Recovery', icon: 'ac_unit' },
  { key: 'aquatic', label: 'Aquatic', icon: 'pool' },
  { key: 'sports', label: 'Sports', icon: 'sports_basketball' },
  { key: 'combat', label: 'Combat', icon: 'sports_mma' },
];

const statusColors = {
  high: { bg: 'bg-primary-container/20', text: 'text-primary', label: 'High Load' },
  moderate: { bg: 'bg-primary/20', text: 'text-primary', label: 'Moderate' },
  low: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', label: 'Low Load' },
  full: { bg: 'bg-error/20', text: 'text-error', label: 'Booked Out' },
};

export default function AdminFacilities() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'all') params.category = activeFilter;
      if (search) params.search = search;
      const [list, st] = await Promise.all([
        facilitiesService.list(params),
        facilitiesService.stats(),
      ]);
      setFacilities(list);
      setStats(st);
    } catch (e) {
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const statCards = [
    { label: 'Total Facilities', value: stats?.total ?? 0, icon: 'meeting_room', accent: false },
    { label: 'Peak Utilization', value: `${stats?.peak_utilization ?? 0}%`, icon: 'trending_up', accent: true },
    { label: 'Active Bookings', value: stats?.active_bookings ?? 0, icon: 'event_available', accent: false },
    { label: 'Avg Dwell Time', value: `${stats?.avg_dwell ?? 0}m`, icon: 'schedule', accent: true },
  ];

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">meeting_room</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Facility Operations
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Facilities Management
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
              s.accent ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container'
            }`}
          >
            <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.accent ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
            </div>
            <span className="relative font-label-md text-[10px] text-on-surface-variant uppercase block">
              {s.label}
            </span>
            <span className={`relative block font-headline-lg text-headline-lg leading-none mt-1 ${s.accent ? 'text-primary' : 'text-on-surface'}`}>
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeFilter === f.key
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search facilities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            meeting_room
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">No facilities yet</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Add facilities via Django admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {facilities.map((f, i) => {
            const status = statusColors[f.status] || statusColors.low;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-surface-container rounded-xl p-5 shadow-md hover:shadow-xl transition-all flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                      {f.zone}
                    </span>
                    <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                      {f.name}
                    </h3>
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                      {f.code}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-surface-container-lowest rounded-lg p-2 text-center">
                    <span className="font-label-md text-[9px] text-on-surface-variant uppercase block">
                      Capacity
                    </span>
                    <span className="font-title-md text-[13px] text-on-surface">
                      {f.current}/{f.capacity}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-2 text-center">
                    <span className="font-label-md text-[9px] text-on-surface-variant uppercase block">
                      Temp
                    </span>
                    <span className="font-title-md text-[13px] text-on-surface">{f.temp}</span>
                  </div>
                  <div className="bg-surface-container-lowest rounded-lg p-2 text-center">
                    <span className="font-label-md text-[9px] text-on-surface-variant uppercase block">
                      24h
                    </span>
                    <span className="font-title-md text-[13px] text-on-surface">{f.bookings24h}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                      Utilization
                    </span>
                    <span className={`font-title-md text-title-md ${f.utilization > 80 ? 'text-primary' : 'text-on-surface'}`}>
                      {f.utilization}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${f.utilization > 80 ? 'bg-primary-container' : f.utilization > 50 ? 'bg-primary' : 'bg-surface-bright'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.utilization}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {f.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant text-[9px] uppercase tracking-wider"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}