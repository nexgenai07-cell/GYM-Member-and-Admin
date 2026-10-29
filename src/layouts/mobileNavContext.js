// src/layouts/mobileNavContext.js
// Shared open/closed state of the sidebar drawer on small screens (see MobileNav.jsx).
import { createContext, useContext } from 'react';

export const MobileNavContext = createContext({ open: false, setOpen: () => {} });

export const useMobileNav = () => useContext(MobileNavContext);

/** Sidebar position classes: off-screen on small screens unless open, always shown from lg. */
export function drawerClasses(open) {
  return `transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`;
}
