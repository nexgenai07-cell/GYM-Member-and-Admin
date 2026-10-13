import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================
   NOTIFICATIONS DATA
   ============================================================ */
const initialNotifications = [
  {
    id: 1,
    type: 'workout',
    icon: 'fitness_center',
    title: 'Workout Ready',
    message: 'Chest & Triceps hypertrophy session is queued.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'course',
    icon: 'school',
    title: 'New Course Available',
    message: 'Velocity-Based Training by Coach Marcus just dropped.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'recovery',
    icon: 'ac_unit',
    title: 'Recovery Alert',
    message: 'Cryo Pod session recommended — HRV drop detected.',
    time: '3 hours ago',
    unread: true,
  },
  {
    id: 4,
    type: 'payment',
    icon: 'credit_card',
    title: 'Invoice Paid',
    message: 'October renewal ($79.00) processed successfully.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    type: 'achievement',
    icon: 'emoji_events',
    title: 'New PR Unlocked',
    message: 'Bench Press 315 lbs — 100% completion milestone.',
    time: '2 days ago',
    unread: false,
  },
];

/* ============================================================
   HOOK: Click outside to close
   ============================================================ */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/* ============================================================
   HEADER COMPONENT
   ============================================================ */
export default function Header() {
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null); // 'notifications' | 'profile' | 'quick'
  const [notifications, setNotifications] = useState(initialNotifications);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useClickOutside(notificationsRef, () =>
    openDropdown === 'notifications' && setOpenDropdown(null)
  );
  useClickOutside(profileRef, () =>
    openDropdown === 'profile' && setOpenDropdown(null)
  );
  useClickOutside(quickRef, () =>
    openDropdown === 'quick' && setOpenDropdown(null)
  );

  // Escape key closes all dropdowns
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleLogout = () => {
    setOpenDropdown(null);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-20 w-full px-space-xl flex items-center justify-between">
        {/* ============ LEFT: Live Occupancy ============ */}
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-xs px-space-sm py-space-2xs rounded bg-surface-container">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide">
              Occupancy:
            </span>
            <span className="font-title-md text-title-md text-on-surface">
              64%
            </span>
            <span className="font-label-md text-label-md text-primary">
              (Optimal Zone)
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md uppercase">
            <span className="material-symbols-outlined text-[16px] text-primary">
              schedule
            </span>
            <span>Peak Hours: 17:00 - 20:00</span>
          </div>
        </div>

        {/* ============ RIGHT: Actions & Profile ============ */}
        <div className="flex items-center gap-space-md">
          {/* --- Notifications --- */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => toggleDropdown('notifications')}
              aria-label="Notifications"
              className={`relative w-9 h-9 rounded bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors ${
                openDropdown === 'notifications' ? 'bg-surface-container-high' : ''
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
                <DropdownPanel
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-96"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-space-md py-space-sm border-b border-surface-container-high">
                    <div className="flex items-center gap-2">
                      <h3 className="font-title-md text-title-md text-on-surface uppercase tracking-wider">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-label-md font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="font-label-md text-label-md text-primary uppercase tracking-wider hover:underline"
                        type="button"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                          notifications_off
                        </span>
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                          No notifications
                        </span>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markOneRead(n.id)}
                          className={`w-full text-left flex items-start gap-space-sm px-space-md py-space-sm hover:bg-surface-container-high transition-colors border-b border-surface-container-high/50 last:border-b-0 ${
                            n.unread ? 'bg-primary-container/5' : ''
                          }`}
                          type="button"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              n.unread
                                ? 'bg-primary-container/20 text-primary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {n.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`font-title-md text-title-md truncate ${
                                  n.unread ? 'text-on-surface' : 'text-on-surface-variant'
                                }`}
                              >
                                {n.title}
                              </span>
                              {n.unread && (
                                <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                              )}
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                            <span className="font-label-md text-label-md text-on-surface-variant/70 uppercase mt-1 inline-block">
                              {n.time}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-space-xs border-t border-surface-container-high">
                    <Link
                      to="/notifications"
                      onClick={() => setOpenDropdown(null)}
                      className="w-full block text-center py-space-xs rounded font-label-md text-label-md text-primary uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>

          {/* --- Quick Actions --- */}
          <div className="relative" ref={quickRef}>
            <button
              onClick={() => toggleDropdown('quick')}
              aria-label="Quick actions"
              className={`w-9 h-9 rounded bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors ${
                openDropdown === 'quick' ? 'bg-surface-container-high' : ''
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                tune
              </span>
            </button>

            <AnimatePresence>
              {openDropdown === 'quick' && (
                <DropdownPanel
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-64"
                >
                  <div className="px-space-md py-space-xs border-b border-surface-container-high">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Quick Actions
                    </span>
                  </div>

                  <div className="p-space-xs">
                    <QuickAction icon="qr_code_scanner" label="Scan Machine QR" onClick={() => { navigate('/machine-guide'); setOpenDropdown(null); }} />
                    <QuickAction icon="play_circle" label="Resume Workout" onClick={() => { navigate('/player'); setOpenDropdown(null); }} />
                    <QuickAction icon="restaurant" label="Log Meal" onClick={() => { navigate('/nutritionists'); setOpenDropdown(null); }} />
                    <QuickAction icon="shopping_bag" label="Open Shop" onClick={() => { navigate('/shop'); setOpenDropdown(null); }} />
                  </div>

                  <div className="px-space-md py-space-xs border-y border-surface-container-high">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Preferences
                    </span>
                  </div>

                  <div className="p-space-xs">
                    <QuickAction icon="dark_mode" label="Theme: Dark" onClick={() => setOpenDropdown(null)} />
                    <QuickAction icon="language" label="Language: EN" onClick={() => setOpenDropdown(null)} />
                    <QuickAction icon="settings" label="Settings" onClick={() => setOpenDropdown(null)} />
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>

          {/* --- Profile --- */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => toggleDropdown('profile')}
              className={`flex items-center gap-space-sm pl-space-xs pr-space-sm py-1 rounded hover:bg-surface-container-high transition-colors ${
                openDropdown === 'profile' ? 'bg-surface-container-high' : ''
              }`}
              type="button"
            >
              <div className="flex flex-col text-right">
                <span className="font-title-md text-title-md text-on-surface leading-snug">
                  Alex Mercer
                </span>
                <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-bold">
                  Pro Athlete
                </span>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/30"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VWw2EoNgLdLezRog8td7sOxrm9KrXDhDgTEC3tqr-igzosY5k2clK9rwS9aFMIKBVVhwA1nOsSma0_YzMh_TuKmnp10nokuuuCGClI2fcIdr4SlgA3WxLTPel09IKPHNUHQRdNZdZnY8O0myeYIdedBcLLDUeK90iu9sgrE7AjScMVQ2TnHWZc9uEDCYMtv4_YUfDwt-liAn3Le_bHxS2FxT4L2rGB8P_O2FWD2TtmKbyM1CePPewIhj6alGAYoI7OctGUavMHJC8"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'profile' && (
                <DropdownPanel
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-72"
                >
                  {/* Profile header */}
                  <div className="px-space-md py-space-md border-b border-surface-container-high">
                    <div className="flex items-center gap-space-sm">
                      <img
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-container/40"
                        src="https://lh3.googleusercontent.com/aida/AEtjO1VWw2EoNgLdLezRog8td7sOxrm9KrXDhDgTEC3tqr-igzosY5k2clK9rwS9aFMIKBVVhwA1nOsSma0_YzMh_TuKmnp10nokuuuCGClI2fcIdr4SlgA3WxLTPel09IKPHNUHQRdNZdZnY8O0myeYIdedBcLLDUeK90iu9sgrE7AjScMVQ2TnHWZc9uEDCYMtv4_YUfDwt-liAn3Le_bHxS2FxT4L2rGB8P_O2FWD2TtmKbyM1CePPewIhj6alGAYoI7OctGUavMHJC8"
                      />
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-on-surface">
                          Alex Mercer
                        </span>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          alex.mercer@smartgym.com
                        </span>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-label-md uppercase tracking-wider font-bold w-fit">
                          Pro Athlete · Tier #8841-TK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-space-xs">
                    <DropdownLink icon="person" label="My Profile" onClick={() => { navigate('/dashboard/profile'); setOpenDropdown(null); }} />
                    <DropdownLink icon="credit_card" label="Membership" onClick={() => { navigate('/dashboard/payments'); setOpenDropdown(null); }} />
                    <DropdownLink icon="receipt_long" label="Payments & Invoices" onClick={() => { navigate('/dashboard/payments'); setOpenDropdown(null); }} />
                    <DropdownLink icon="event_available" label="Attendance History" onClick={() => { navigate('/dashboard/attendance'); setOpenDropdown(null); }} />
                    <DropdownLink icon="emoji_events" label="Achievements" onClick={() => { navigate('/dashboard/profile'); setOpenDropdown(null); }} />
                  </div>

                  <div className="p-space-xs border-t border-surface-container-high">
                    <DropdownLink icon="settings" label="Settings" onClick={() => setOpenDropdown(null)} />
                    <DropdownLink icon="help" label="Help & Support" onClick={() => setOpenDropdown(null)} />
                  </div>

                  {/* Logout */}
                  <div className="p-space-xs border-t border-surface-container-high">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-error/10 text-error transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      <span className="font-title-md text-title-md uppercase tracking-wider">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */
function DropdownPanel({ children, className = '', ...motionProps }) {
  return (
    <motion.div
      {...motionProps}
      className={`absolute right-0 top-full mt-2 bg-surface-container-low rounded-xl shadow-2xl border border-surface-container-high overflow-hidden z-50 origin-top-right ${className}`}
    >
      {children}
    </motion.div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high transition-colors text-left group"
      type="button"
    >
      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-title-md text-title-md text-on-surface">
        {label}
      </span>
    </button>
  );
}

function DropdownLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high transition-colors text-left group"
      type="button"
    >
      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="font-title-md text-title-md text-on-surface">
        {label}
      </span>
    </button>
  );
}