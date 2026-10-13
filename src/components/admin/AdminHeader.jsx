import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================
   HOOK: Click outside
   ============================================ */
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

/* ============================================
   MOCK ADMIN NOTIFICATIONS
   ============================================ */
const adminAlerts = [
  { id: 1, icon: 'person_add', title: 'New Member Registration', message: 'Sarah Lindqvist signed up for Pro Tier.', time: '5 min ago', unread: true },
  { id: 2, icon: 'warning', title: 'Machine Maintenance', message: 'Chest Press #14 reported sensor fault.', time: '28 min ago', unread: true },
  { id: 3, icon: 'payments', title: 'Large Transaction', message: '$1,240.00 corporate renewal processed.', time: '1 hour ago', unread: true },
  { id: 4, icon: 'school', title: 'Course Pending Approval', message: 'Coach Marcus submitted new VBT protocol.', time: '2 hours ago', unread: false },
];

export default function AdminHeader() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [alerts] = useState(adminAlerts);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = alerts.filter((a) => a.unread).length;

  useClickOutside(notificationsRef, () =>
    openDropdown === 'notifications' && setOpenDropdown(null)
  );
  useClickOutside(profileRef, () =>
    openDropdown === 'profile' && setOpenDropdown(null)
  );

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenDropdown(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggle = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  const handleLogout = async () => {
  setOpenDropdown(null);
  await logout(); // from useAuth
  navigate('/login');
};

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#08080a]/95 backdrop-blur-xl z-40 border-b border-[#1a1a1e]">
      <div className="h-16 w-full px-6 flex items-center justify-between">
        {/* ============ LEFT: ENVIRONMENT BADGE ============ */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
              Production Environment
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px] text-primary">
              location_on
            </span>
            <span>Metro Station Core 01 · Sub-Level Alpha</span>
          </div>
        </div>

        {/* ============ RIGHT: ACTIONS ============ */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] w-72">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search members, machines, invoices..."
              className="flex-1 bg-transparent text-on-surface font-body-md text-body-md outline-none placeholder:text-on-surface-variant/40"
            />
            <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1e] text-on-surface-variant text-[10px] font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => toggle('notifications')}
              aria-label="Admin alerts"
              className={`relative w-9 h-9 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] flex items-center justify-center hover:bg-[#1a1a1e] transition-colors ${
                openDropdown === 'notifications' ? 'bg-[#1a1a1e]' : ''
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(229,25,55,0.6)]">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {openDropdown === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-[#0e0e0f] border border-[#1a1a1e] rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-[#1a1a1e] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-on-surface uppercase tracking-wider">
                        Admin Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-label-md font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-[#1a1a1e] transition-colors border-b border-[#1a1a1e]/50 last:border-b-0 cursor-pointer ${
                          a.unread ? 'bg-primary-container/5' : ''
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            a.unread
                              ? 'bg-primary-container/20 text-primary'
                              : 'bg-[#1a1a1e] text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {a.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-title-md text-[13px] truncate ${
                                a.unread ? 'text-on-surface' : 'text-on-surface-variant'
                              }`}
                            >
                              {a.title}
                            </span>
                            {a.unread && (
                              <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                            )}
                          </div>
                          <p className="font-body-md text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">
                            {a.message}
                          </p>
                          <span className="font-label-md text-[10px] text-on-surface-variant/60 uppercase mt-1 inline-block">
                            {a.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-[#1a1a1e]" />

          {/* Admin Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => toggle('profile')}
              className={`flex items-center gap-3 pl-1 pr-2 py-1 rounded-lg hover:bg-[#0e0e0f] transition-colors ${
                openDropdown === 'profile' ? 'bg-[#0e0e0f]' : ''
              }`}
              type="button"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[13px] shadow-[0_0_12px_rgba(229,25,55,0.4)]">
                  AD
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#08080a]" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-title-md text-[13px] text-on-surface leading-tight">
                  Admin Root
                </span>
                <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                  Super Admin
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </button>

            <AnimatePresence>
              {openDropdown === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#0e0e0f] border border-[#1a1a1e] rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="px-4 py-4 border-b border-[#1a1a1e]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[15px]">
                        AD
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-on-surface">
                          Admin Root
                        </span>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          root@smartgym.internal
                        </span>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-[10px] uppercase tracking-wider font-bold w-fit">
                          Super Admin · Full Access
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <AdminMenuItem
                      icon="person"
                      label="Admin Profile"
                      onClick={() => {
                        navigate('/admin/settings');
                        setOpenDropdown(null);
                      }}
                    />
                    <AdminMenuItem
                      icon="shield"
                      label="Security & 2FA"
                      onClick={() => {
                        navigate('/admin/settings');
                        setOpenDropdown(null);
                      }}
                    />
                    <AdminMenuItem
                      icon="history"
                      label="Activity Log"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <AdminMenuItem
                      icon="settings"
                      label="System Settings"
                      onClick={() => {
                        navigate('/admin/settings');
                        setOpenDropdown(null);
                      }}
                    />
                  </div>

                  <div className="p-2 border-t border-[#1a1a1e]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      <span className="font-title-md text-title-md uppercase tracking-wider">
                        End Admin Session
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================
   MENU ITEM
   ============================================ */
function AdminMenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a1e] transition-colors text-left group"
      type="button"
    >
      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-title-md text-title-md text-on-surface">{label}</span>
    </button>
  );
}