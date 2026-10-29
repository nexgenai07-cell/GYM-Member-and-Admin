// src/layouts/MobileNav.jsx
// On phones and tablets the sidebar is a drawer: the header's menu button opens it, picking a
// page or tapping outside closes it. From the lg breakpoint up it's always shown.
import { useEffect, useMemo, useState } from 'react';
import { tl } from '../i18n';
import { MobileNavContext, useMobileNav } from './mobileNavContext';

export function MobileNavProvider({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';       // no page scroll behind the drawer
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

/** Hamburger shown below lg. */
export function MenuButton({ className = '' }) {
  const { open, setOpen } = useMobileNav();
  return (
    <button type="button" onClick={() => setOpen(!open)} aria-label={tl('Menu')} aria-expanded={open}
      className={`lg:hidden w-10 h-10 shrink-0 rounded-lg grid place-items-center text-on-surface hover:bg-white/5 ${className}`}>
      <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
    </button>
  );
}

/** Dark overlay behind the open drawer; tapping it closes the drawer. */
export function DrawerBackdrop() {
  const { open, setOpen } = useMobileNav();
  if (!open) return null;
  return <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />;
}
