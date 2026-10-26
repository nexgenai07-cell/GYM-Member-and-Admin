// src/components/admin/AdminHeader.jsx
// Admin console header: live gym load, global search, "needs attention" alerts
// (computed by the backend from live data), and the signed-in admin.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { dashboardService } from '../../services/dashboardService';
import { tl } from '../../i18n';
import LangToggle from '../../i18n/LangToggle';

const POLL_MS = 60_000;
const SEARCH_GROUPS = [['members', tl("Members"), 'person'], ['registrations', tl("Registrations"), 'how_to_reg'],
  ['orders', tl("Shop orders"), 'shopping_bag'], ['machines', tl("Machines"), 'precision_manufacturing']];

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(null);             // 'alerts' | 'profile' | 'search'
  const [alerts, setAlerts] = useState({ total: 0, items: [] });
  const [occ, setOcc] = useState(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const alertsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInput = useRef(null);

  const close = useCallback(() => setOpen(null), []);
  useClickOutside(alertsRef, () => open === 'alerts' && close());
  useClickOutside(profileRef, () => open === 'profile' && close());
  useClickOutside(searchRef, () => open === 'search' && close());

  // Alerts + live load, refreshed every minute.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [a, o] = await Promise.allSettled([api.get('/admin/alerts/'), dashboardService.occupancy()]);
      if (!alive) return;
      if (a.status === 'fulfilled') setAlerts(a.value.data);
      if (o.status === 'fulfilled') setOcc(o.value);
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // Ctrl/⌘+K focuses search, Esc closes everything.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // Debounced search.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return undefined;
    let alive = true;
    const id = setTimeout(async () => {
      try {
        const { data } = await api.get('/admin/search/', { params: { q: term } });
        if (alive) { setResults(data); setOpen('search'); }
      } catch { if (alive) setResults(null); }
    }, 250);
    return () => { alive = false; clearTimeout(id); };
  }, [q]);

  const go = (path) => { close(); setQ(''); setResults(null); navigate(path); };

  const handleLogout = async () => {
    close();
    try { await logout(); } finally { navigate('/admin/login', { replace: true }); }
  };

  const name = user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Admin';
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const role = user?.role === 'manager' ? 'Manager' : 'Administrator';
  const anyResults = results && SEARCH_GROUPS.some(([k]) => results[k]?.length);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#08080a]/95 backdrop-blur-xl z-40 border-b border-[#1a1a1e]">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* Live load */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] shrink-0">
          <span className={`w-2 h-2 rounded-full ${occ ? 'bg-emerald-400 animate-pulse' : 'bg-[#2a2a2e]'}`} />
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">{tl("Gym now")}</span>
          <span className="text-[12px] text-on-surface font-bold">
            {occ ? (occ.capacity ? `${occ.current}/${occ.capacity} · ${occ.percent}%` : tl("{0} in", { 0: occ.current })) : '—'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] w-80 focus-within:border-primary-container">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input
                ref={searchInput}
                type="search"
                value={q}
                onChange={(e) => { setQ(e.target.value); if (e.target.value.trim().length < 2) setResults(null); }}
                onFocus={() => results && setOpen('search')}
                placeholder={tl("Search members, Iqama, orders, machines…")}
                aria-label={tl("Search")}
                className="bg-transparent text-on-surface text-[13px] flex-1 outline-none placeholder:text-on-surface-variant/50"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1e] text-on-surface-variant text-[10px] font-mono">{tl("Ctrl K")}</kbd>
            </div>
            <AnimatePresence>
              {open === 'search' && results && (
                <Panel className="w-96 left-0 right-auto">
                  {!anyResults ? (
                    <p className="px-4 py-6 text-center text-[12px] text-on-surface-variant">{tl("No matches for “")}{q.trim()}”.</p>
                  ) : SEARCH_GROUPS.filter(([k]) => results[k]?.length).map(([k, label, icon]) => (
                    <div key={k} className="py-1 border-b border-[#1a1a1e] last:border-0">
                      <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</div>
                      {results[k].map((r) => (
                        <button key={`${k}-${r.id}`} type="button" onClick={() => go(r.path)}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#1a1a1e] text-left">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
                          <span className="min-w-0">
                            <span className="block text-[13px] text-on-surface truncate">{r.title}</span>
                            <span className="block text-[11px] text-on-surface-variant truncate">{r.subtitle}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </Panel>
              )}
            </AnimatePresence>
          </div>

          <LangToggle />
          {/* Alerts */}
          <div className="relative" ref={alertsRef}>
            <button type="button" onClick={() => setOpen(open === 'alerts' ? null : 'alerts')} aria-label={tl("Alerts ({0})", { 0: alerts.total })}
              className="relative w-9 h-9 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] flex items-center justify-center hover:bg-[#1a1a1e]">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
              {alerts.total > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold flex items-center justify-center">
                  {alerts.total > 99 ? '99+' : alerts.total}
                </span>
              )}
            </button>
            <AnimatePresence>
              {open === 'alerts' && (
                <Panel className="w-96">
                  <div className="px-4 py-3 border-b border-[#1a1a1e] text-[13px] text-on-surface font-bold uppercase tracking-wider">{tl("Needs attention")}</div>
                  {!alerts.items.length ? (
                    <p className="px-4 py-8 text-center text-[12px] text-on-surface-variant">{tl("All caught up — nothing waiting.")}</p>
                  ) : alerts.items.map((a) => (
                    <button key={a.key} type="button" onClick={() => go(a.path)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#1a1a1e] text-left border-b border-[#1a1a1e]/50 last:border-0">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.priority === 'high' ? 'bg-primary-container/20 text-primary' : 'bg-[#1a1a1e] text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[13px] text-on-surface font-bold">{a.title}</span>
                          <span className="text-[11px] text-primary font-bold">{a.count}</span>
                        </span>
                        <span className="block text-[12px] text-on-surface-variant">{a.message}</span>
                      </span>
                    </button>
                  ))}
                </Panel>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-8 bg-[#1a1a1e]" />

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button type="button" onClick={() => setOpen(open === 'profile' ? null : 'profile')}
              className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-lg hover:bg-[#0e0e0f]">
              <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[13px]">
                {initials}
              </span>
              <span className="hidden md:flex flex-col text-left">
                <span className="text-[13px] text-on-surface leading-tight">{name}</span>
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{role}</span>
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>
            <AnimatePresence>
              {open === 'profile' && (
                <Panel className="w-64">
                  <div className="px-4 py-3 border-b border-[#1a1a1e]">
                    <div className="text-[13px] text-on-surface font-bold">{name}</div>
                    <div className="text-[12px] text-on-surface-variant truncate">{user?.email}</div>
                  </div>
                  <div className="p-2">
                    <MenuItem icon="settings" label={tl("System settings")} onClick={() => go('/admin/settings')} />
                    <MenuItem icon="lock_reset" label={tl("Change password")} onClick={() => go('/dashboard/change-password')} />
                    <MenuItem icon="public" label={tl("Open public website")} onClick={() => { close(); window.open(import.meta.env.VITE_PUBLIC_SITE_URL || 'https://smart-gym-three.vercel.app', '_blank', 'noopener'); }} />
                  </div>
                  <div className="p-2 border-t border-[#1a1a1e]">
                    <button type="button" onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-error">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span className="text-[12px] uppercase tracking-wider font-bold">{tl("Sign out")}</span>
                    </button>
                  </div>
                </Panel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function Panel({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`absolute right-0 top-full mt-2 max-h-[70vh] overflow-y-auto bg-[#0e0e0f] border border-[#1a1a1e] rounded-xl shadow-2xl z-50 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a1e] text-left">
      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
      <span className="text-[13px] text-on-surface">{label}</span>
    </button>
  );
}
