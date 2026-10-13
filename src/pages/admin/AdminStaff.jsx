// src/pages/admin/AdminStaff.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';

const roleColors = {
  admin: 'bg-primary-container text-on-primary-container',
  manager: 'bg-primary-container/20 text-primary',
  trainer: 'bg-blue-400/15 text-blue-400',
  nutritionist: 'bg-emerald-400/15 text-emerald-400',
  receptionist: 'bg-yellow-400/15 text-yellow-400',
};

const statusColors = {
  active: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', label: 'On Shift' },
  suspended: { bg: 'bg-error/20', text: 'text-error', label: 'Suspended' },
};

export default function AdminStaff() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: staff, loading } = useApi(
    () =>
      adminService.staffAdmin({
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: search || undefined,
      }),
    [roleFilter, search]
  );

  const { data: stats } = useApi(() => adminService.staffStats(), []);
  const list = Array.isArray(staff) ? staff : [];

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">badge</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Team Management
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Staff Roster
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Total Staff"
          value={stats?.total ?? '—'}
          icon="badge"
        />
        <StatTile
          label="On Shift Now"
          value={stats?.on_shift_now ?? '—'}
          icon="how_to_reg"
          accent
        />
        <StatTile
          label="Avg Tenure"
          value={`${stats?.avg_tenure_years ?? 0}y`}
          icon="timeline"
        />
        <StatTile
          label="Open Positions"
          value={stats?.open_positions ?? 0}
          icon="work"
          accent
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-surface-container-low rounded-xl p-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'admin', 'manager', 'trainer', 'nutritionist', 'receptionist'].map(
            (r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  roleFilter === r
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                {r}
              </button>
            )
          )}
        </div>

        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-surface-container rounded animate-pulse"
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            badge
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            No staff found
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Staff</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Shift</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/50">
                {list.map((s, i) => {
                  const status = statusColors[s.status] || statusColors.active;
                  const roleColor =
                    roleColors[s.role] ||
                    'bg-surface-container-high text-on-surface-variant';

                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-surface-container-high/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 ${
                              s.role === 'admin'
                                ? 'bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {s.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-title-md text-[13px] text-on-surface truncate">
                              {s.user_name}
                            </span>
                            <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                              {s.user_email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${roleColor}`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-body-md text-[13px] text-on-surface capitalize">
                          {s.department.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[12px] text-on-surface-variant">
                          {s.shift_display}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-current ${
                              s.status === 'active' ? 'animate-pulse' : ''
                            }`}
                          />
                          {status.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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