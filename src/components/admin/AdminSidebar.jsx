import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ============================================
   ADMIN NAV ITEMS
   ============================================ */
const navGroups = [
  {
    label: 'Overview',
    items: [
      { path: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
      { path: '/admin/analytics', label: 'AI Insights', icon: 'insights' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/admin/members', label: 'Members', icon: 'groups' },
      { path: '/admin/trainers', label: 'Trainers & Courses', icon: 'school' },
      { path: '/admin/staff', label: 'Staff', icon: 'badge' },
      { path: '/admin/shop-orders', label: 'Shop Orders', icon: 'shopping_bag' },
      { path: '/admin/trainer-hours', label: 'Trainer Hours', icon: 'schedule' },
    ],
  },
    {
    label: 'Registrations',
    items: [
      { path: '/admin/registrations', label: 'Registrations', icon: 'how_to_reg' },
      { path: '/admin/member-lookup', label: 'Member Lookup', icon: 'person_search' },
    ],
  },
  {
    label: 'Facility',
    items: [
      { path: '/admin/machines', label: 'Machines & QR', icon: 'precision_manufacturing' },
      { path: '/admin/facilities', label: 'Facilities', icon: 'meeting_room' },
      { path: '/admin/classes', label: 'Classes', icon: 'event' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { path: '/admin/finance', label: 'Finance', icon: 'payments' },
      { path: '/admin/reports', label: 'Reports', icon: 'assessment' },
    ],
  },
  {
    label: 'Public Website',
    items: [
      { path: '/admin/site-content', label: 'Site Content', icon: 'web' },
      { path: '/admin/site-lists', label: 'Facilities & Articles', icon: 'view_list' },
      { path: '/admin/site-plans', label: 'Membership Plans', icon: 'sell' },
      { path: '/admin/facility-pricing', label: 'Facility Pricing', icon: 'pool' },
      { path: '/admin/site-inbox', label: 'Website Inbox', icon: 'inbox' },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/admin/cms', label: 'Content CMS', icon: 'article' },
      { path: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export default function AdminSidebar() {
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
            Smart Gym
          </span>
          <span className="font-label-md text-[10px] text-primary tracking-widest uppercase font-bold">
            Admin Command
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
                    <span className="leading-none">{item.label}</span>
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
              System Health
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-label-md text-[10px] text-emerald-400 uppercase font-bold">
                Optimal
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            <span>API Response</span>
            <span className="text-on-surface font-bold">42ms</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            <span>Active Terminals</span>
            <span className="text-on-surface font-bold">18/18</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}