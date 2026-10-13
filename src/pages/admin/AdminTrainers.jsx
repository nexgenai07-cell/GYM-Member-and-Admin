// src/pages/admin/AdminTrainers.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { catalogService } from '../../services/catalogService';

export default function AdminTrainers() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('trainers');

  const { data: trainers, loading: trainersLoading } = useApi(
    () => adminService.trainersAdmin({ search: search || undefined }),
    [search]
  );

  const { data: trainerStats } = useApi(
    () => adminService.trainerStats(),
    []
  );

  const { data: courses, loading: coursesLoading } = useApi(
    () => catalogService.courses(),
    []
  );

  const trainerList = Array.isArray(trainers) ? trainers : [];
  const courseList = Array.isArray(courses) ? courses : [];

  const handleVerify = async (trainer) => {
    try {
      // Uses member update pattern — could add a dedicated endpoint later
      await adminService.updateMember(trainer.user_id, {
        is_verified: !trainer.is_verified,
      });
      window.location.reload();
    } catch (e) {
      alert('Failed to update verification');
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Trainer & Content Management
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Trainers & Courses
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Manage elite trainers and curriculum.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Total Trainers"
          value={trainerStats?.total ?? trainerList.length}
          icon="group"
        />
        <StatTile
          label="Verified"
          value={trainerStats?.verified ?? '—'}
          icon="verified"
          accent
        />
        <StatTile label="Total Courses" value={courseList.length} icon="menu_book" />
        <StatTile
          label="Featured"
          value={courseList.filter((c) => c.is_featured).length}
          icon="star"
          accent
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('trainers')}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            activeTab === 'trainers'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          Trainers
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            activeTab === 'courses'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          Courses
        </button>
      </div>

      {activeTab === 'trainers' && (
        <>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
              search
            </span>
            <input
              type="text"
              placeholder="Search trainers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
            />
          </div>

          {trainersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-surface-container rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : trainerList.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                group
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-3">
                No trainers
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trainerList.map((t, i) => {
                const initials = (t.user_name || '?')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface-container rounded-xl p-5 shadow-md flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[15px]">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface">
                            {t.user_name}
                          </span>
                          <span className="font-label-md text-[10px] text-primary uppercase tracking-wider font-bold">
                            {t.title}
                          </span>
                        </div>
                      </div>
                      {t.is_verified && (
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          verified
                        </span>
                      )}
                    </div>

                    {Array.isArray(t.specialties) && t.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {t.specialties.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant text-[9px] uppercase tracking-wider"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-surface-container-high">
                      <div>
                        <span className="font-label-md text-[9px] text-on-surface-variant uppercase block">
                          Rating
                        </span>
                        <span className="font-title-md text-[12px] text-primary">
                          {t.rating > 0 ? t.rating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <div>
                        <span className="font-label-md text-[9px] text-on-surface-variant uppercase block">
                          Rate
                        </span>
                        <span className="font-title-md text-[12px] text-on-surface">
                          ${t.hourly_rate}/hr
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'courses' && (
        <>
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-surface-container rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : courseList.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                menu_book
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-3">
                No courses
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {courseList.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface-container rounded-xl overflow-hidden shadow-md"
                >
                  <div className="relative h-40 bg-surface-container-high">
                    {c.cover_image_url ? (
                      <img
                        src={c.cover_image_url}
                        alt={c.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-container/30 to-secondary-container/20" />
                    )}
                    {c.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded bg-surface-container-lowest/90 text-primary text-[9px] font-bold uppercase">
                        {c.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-title-md text-title-md text-on-surface">
                      {c.title}
                    </h3>
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                      {c.trainer_name}
                    </span>
                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-surface-container-high">
                      <span className="font-title-md text-[13px] text-primary font-bold">
                        ${c.price}
                      </span>
                      <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                        {c.total_enrolled} enrolled
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatTile({ label, value, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
        accent
          ? 'bg-primary-container/10 border border-primary-container/30'
          : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
          accent
            ? 'bg-primary-container/20 text-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
        {label}
      </span>
      <span
        className={`block font-headline-lg text-headline-lg leading-none mt-1 ${
          accent ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
    </motion.div>
  );
}