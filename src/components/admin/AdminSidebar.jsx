import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { tl } from '../../i18n';

const HEALTH_MS = 60_000;
const ACTIVITY_MS = 45_000;

/**
 * New activity per sidebar section since this admin last opened it ({ trainers: 1, … }).
 * Opening a section marks it seen, so its bubble clears.
 */
function useActivity() {
  const { pathname } = useLocation();
  const [counts, setCounts] = useState({});
  useEffect(() => {
    let alive = true;
    const load = () => api.get('/admin/activity/').then(({ data }) => { if (alive) setCounts(data); }).catch(() => {});
    load();
    const id = setInterval(load, ACTIVITY_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);
  useEffect(() => {
    const section = pathname.split('/')[2];
    if (!section || !(section in counts) || !counts[section]) return;
    api.post('/admin/activity/', { section })
      .then(() => setCounts((c) => ({ ...c, [section]: 0 })))
      .catch(() => {});
  }, [pathname, counts]);
  return counts;
}

/** Measured round trip to the API (a light authenticated call), refreshed every minute. */
function useApiHealth() {
  const [health, setHealth] = useState({ ok: null, ms: null });
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      const t0 = performance.now();
      try {
        await api.get('/dashboard/occupancy/');
        if (alive) setHealth({ ok: true, ms: Math.round(performance.now() - t0) });
      } catch (e) {
        if (alive) setHealth({ ok: e?.response ? true : false, ms: e?.response ? Math.round(performance.now() - t0) : null });
      }
    };
    ping();
    const id = setInterval(ping, HEALTH_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return health;
}

/* ============================================
   ADMIN NAV ITEMS
   ============================================ */
const navGroups = [
  {
    label: tl("Overview"),
    items: [
      { path: '/admin', label: tl("Dashboard"), icon: 'dashboard', end: true },
      { path: '/admin/analytics', label: tl("Insights"), icon: 'insights' },
    ],
  },
  {
    label: tl("Operations"),
    items: [
      { path: '/admin/members', label: tl("Members"), icon: 'groups' },
      { path: '/admin/trainers', label: tl("Trainers & Courses"), icon: 'school' },
      { path: '/admin/nutrition', label: tl("Nutrition"), icon: 'restaurant' },
      { path: '/admin/staff', label: tl("Staff"), icon: 'badge' },
      { path: '/admin/shop', label: tl("Shop Products"), icon: 'storefront' },
      { path: '/admin/shop-orders', label: tl("Shop Orders"), icon: 'shopping_bag' },
      { path: '/admin/trainer-hours', label: tl("Trainer Hours"), icon: 'schedule' },
    ],
  },
    {
    label: tl("Registrations"),
    items: [
      { path: '/admin/registrations', label: tl("Registrations"), icon: 'how_to_reg' },
      { path: '/admin/member-lookup', label: tl("Member Lookup"), icon: 'person_search' },
    ],
  },
  {
    label: tl("Facility"),
    items: [
      { path: '/admin/machines', label: tl("Machines & QR"), icon: 'precision_manufacturing' },
      { path: '/admin/facilities', label: tl("Facilities"), icon: 'meeting_room' },
      { path: '/admin/classes', label: tl("Classes"), icon: 'event' },
    ],
  },
  {
    label: tl("Finance"),
    items: [
      { path: '/admin/finance', label: tl("Finance"), icon: 'payments' },
      { path: '/admin/reports', label: tl("Reports"), icon: 'assessment' },
    ],
  },
  {
    label: tl("Public Website"),
    items: [
      { path: '/admin/site-content', label: tl("Site Content"), icon: 'web' },
      { path: '/admin/site-lists', label: tl("Facilities & Articles"), icon: 'view_list' },
      { path: '/admin/site-plans', label: tl("Membership Plans"), icon: 'sell' },
      { path: '/admin/site-inbox', label: tl("Website Inbox"), icon: 'inbox' },
    ],
  },
  {
    label: tl("System"),
    items: [
      { path: '/admin/settings', label: tl("Settings"), icon: 'settings' },
    ],
  },
];

export default function AdminSidebar() {
  const health = useApiHealth();
  const activity = useActivity();
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#08080a] z-50 flex flex-col border-r border-[#1a1a1e]">
      {/* ============ LOGO / BRAND ============ */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0 px-5 h-20 flex items-center gap-3 border-b border-[#1a1a1e]"
      >
        <div className="relative w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(229,25,55,0.55)]">
          <span className="material-symbols-outlined text-on-primary-container text-[22px]">
            admin_panel_settings
          </span>
          {/* Live pulse ring */}
          <span className="absolute inset-0 rounded-lg ring-2 ring-primary-container/40 animate-ping" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-[18px] tracking-wider text-on-surface uppercase leading-none">
            {tl("Smart Gym")}
          </span>
          <span className="font-label-md text-[10px] text-primary tracking-widest uppercase font-bold">
            {tl("Admin Command")}
          </span>
        </div>
      </motion.div>

      {/* ============ NAVIGATION ============ */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        {navGroups.map((group, gIdx) => (
          <div key={group.label} className={gIdx > 0 ? 'mt-4' : ''}>
            <span className="px-3 py-1 font-label-md text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold block">
              {group.label}
            </span>

            <div className="flex flex-col gap-1 mt-1">
              {group.items.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (gIdx * 5 + i) * 0.02 }}
                >
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg uppercase tracking-wider transition-all duration-200 text-[12px] font-bold ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(229,25,55,0.4)]'
                          : 'text-on-surface-variant hover:bg-[#1a1a1e] hover:text-on-surface'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      {item.icon}
                    </span>
                    <span className="leading-none flex-1">{item.label}</span>
                    {activity[item.path.split('/')[2]] > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold grid place-items-center normal-case tracking-normal ring-2 ring-[#08080a]"
                        aria-label={tl("{0} new", { 0: activity[item.path.split('/')[2]] })}>
                        {activity[item.path.split('/')[2]] > 99 ? '99+' : activity[item.path.split('/')[2]]}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ============ BOTTOM: SYSTEM STATUS ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex-shrink-0 px-3 py-3 border-t border-[#1a1a1e]"
      >
        <div className="bg-[#0e0e0f] rounded-lg px-3 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              {tl("API")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${health.ok === false ? 'bg-error' : health.ok ? 'bg-emerald-400 animate-pulse' : 'bg-[#2a2a2e]'}`} />
              <span className={`font-label-md text-[10px] uppercase font-bold ${health.ok === false ? 'text-error' : 'text-emerald-400'}`}>
                {health.ok === false ? tl("Unreachable") : health.ok ? tl("Online") : tl("Checking…")}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            <span>{tl("Response time")}</span>
            <span className="text-on-surface font-bold">{health.ms != null ? tl("{0} ms", { 0: health.ms }) : '—'}</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}