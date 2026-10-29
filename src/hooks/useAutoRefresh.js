// src/hooks/useAutoRefresh.js
// Calls `refresh` every `ms` while the tab is visible, and right away when the tab or window
// becomes active again — so new website messages, signups, orders or bookings appear on their own.
import { useEffect, useRef } from 'react';

export function useAutoRefresh(refresh, ms = 30_000) {
  const fn = useRef(refresh);
  useEffect(() => { fn.current = refresh; });
  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      if (document.visibilityState !== 'visible' || Date.now() - last < 5_000) return;
      last = Date.now();
      fn.current();
    };
    const id = setInterval(tick, ms);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [ms]);
}

export default useAutoRefresh;
