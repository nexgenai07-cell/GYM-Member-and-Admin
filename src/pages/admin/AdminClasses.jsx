import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { classesService } from '../../services/classesService';

const statusColors = {
  full: { bg: 'bg-error/20', text: 'text-error', label: 'Full' },
  open: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', label: 'Open' },
};

export default function AdminClasses() {
  const [schedule, setSchedule] = useState({ days: [], slots: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, st] = await Promise.all([
        classesService.schedule(),
        classesService.stats(),
      ]);
      setSchedule(s);
      setStats(st);
    } catch (e) {
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statCards = [
    { label: 'Weekly Classes', value: stats?.total_classes ?? 0, icon: 'event', accent: false },
    { label: 'Active Enrollments', value: stats?.active_enrollments ?? 0, icon: 'groups', accent: true },
    { label: 'Attendance Rate', value: stats?.attendance_rate ? `${stats.attendance_rate}%` : '0%', icon: 'check_circle', accent: false },
    { label: 'Waitlisted', value: stats?.waitlisted ?? 0, icon: 'hourglass_empty', accent: true },
  ];

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">event</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Class Scheduling System
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Weekly Class Schedule
        </h1>
      </motion.div>

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

      {loading ? (
        <div className="h-96 bg-surface-container rounded-xl animate-pulse" />
      ) : schedule.slots.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            event
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">No classes scheduled</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Add classes via Django admin.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container rounded-xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-lowest">
                  <th className="py-3 px-4 text-left font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Time
                  </th>
                  {schedule.days.map((day) => (
                    <th
                      key={day}
                      className="py-3 px-2 text-center font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider"
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/50">
                {schedule.slots.map((slot, idx) => (
                  <tr key={slot.time}>
                    <td className="py-3 px-4 font-mono text-[13px] text-primary font-bold whitespace-nowrap">
                      {slot.time}
                    </td>
                    {schedule.days.map((day) => {
                      const cls = slot[day];
                      const status = statusColors[cls.status] || statusColors.open;
                      const isEmpty = cls.name === '—';
                      return (
                        <td key={day} className="py-2 px-1">
                          {isEmpty ? (
                            <div className="p-2 rounded-lg bg-surface-container-lowest/50 border border-dashed border-surface-container-high text-center">
                              <span className="font-label-md text-[10px] text-on-surface-variant/40">
                                —
                              </span>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className={`p-2 rounded-lg border-l-2 cursor-pointer ${
                                cls.status === 'full'
                                  ? 'bg-error/10 border-error'
                                  : 'bg-surface-container-lowest border-emerald-400'
                              }`}
                            >
                              <span className="font-title-md text-[11px] text-on-surface block leading-tight">
                                {cls.name}
                              </span>
                              <span className="font-label-md text-[9px] text-on-surface-variant uppercase block mt-1">
                                {cls.trainer}
                              </span>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-label-md text-[9px] text-on-surface-variant">
                                  {cls.enrolled}/{cls.capacity}
                                </span>
                                <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${status.bg} ${status.text}`}>
                                  {status.label}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}