// src/components/profile/DigitalPass.jsx
// Entry pass. The QR is a signed token from the backend that expires after two
// minutes and is refreshed every minute, so a screenshot stops working. Staff
// scan it in Admin → Member Lookup (or the member uses the face gate).
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandedQR from '../../components/BrandedQR';
import { membersService } from '../../services/membersService';
import { formatDate, formatRemaining } from '../../utils/membershipTime';
import { tl } from '../../i18n';

export default function DigitalPass({ user, membership }) {
  const [pass, setPass] = useState(null);
  const [error, setError] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [left, setLeft] = useState(0);

  const tier = membership?.plan?.display_name || 'Member';
  const cardholder = user?.full_name || user?.email || 'Member';
  const expired = membership?.time_remaining?.expired;

  const refresh = useCallback(async () => {
    try {
      const data = await membersService.pass();
      setPass(data);
      setLeft(data.refresh_in || 60);
      setError('');
    } catch (e) {
      setError(e?.response?.status === 404 ? 'No membership yet.' : 'Could not load your pass. Check your connection.');
    }
  }, []);

  // Fetch, then count down and refetch every `refresh_in` seconds (also when the tab comes back).
  useEffect(() => {
    let alive = true;
    (async () => { if (alive) await refresh(); })();
    const tick = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { alive = false; clearInterval(tick); document.removeEventListener('visibilitychange', onVisible); };
  }, [refresh]);

  useEffect(() => {
    if (pass && left === 0) {
      const id = setTimeout(refresh, 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [left, pass, refresh]);

  // /dashboard/profile#pass scrolls here.
  useEffect(() => {
    if (window.location.hash === '#pass') {
      document.getElementById('pass')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const qr = (size) => (
    pass?.token ? (
      <BrandedQR value={pass.token} size={size} bgColor="#ffffff" fgColor="#0a0a0a" />
    ) : (
      <div style={{ width: size, height: size }} className="bg-surface-container-high animate-pulse rounded" />
    )
  );

  return (
    <motion.div
      id="pass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-lg bg-surface-container p-space-xl flex flex-col justify-between shadow-lg relative overflow-hidden scroll-mt-24"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-space-md flex-wrap gap-2">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">{tl("Entry pass")}</span>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">{tl("Digital Pass")}</h2>
          </div>
          <span className={`flex items-center gap-1 font-label-md text-label-md font-bold uppercase ${pass?.valid ? 'text-emerald-400' : 'text-error'}`}>
            <span className={`w-2 h-2 rounded-full ${pass?.valid ? 'bg-emerald-400 animate-pulse' : 'bg-error'}`} />
            {pass ? (pass.valid ? tl("Valid for entry") : tl("Not valid for entry")) : '…'}
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          {tl("Show this QR at the front desk to check in. It refreshes every minute — screenshots stop working.")}
        </p>
      </div>

      <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-xl relative overflow-hidden my-space-sm">
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-headline-md text-headline-md uppercase tracking-wider text-on-surface">{tl("Smart Gym")}</span>
          <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase">{tier}</span>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">{tl("Cardholder")}</span>
            <span className="font-title-md text-title-md text-on-surface truncate">{cardholder}</span>
            <span className="font-label-md text-label-md text-primary font-bold mt-1">{tl("Pass")}{' '}{pass?.pass_id || '—'}</span>
            <span className="font-label-md text-label-md text-on-surface-variant mt-2">{tl("Expiry:")}{' '}{formatDate(membership?.expiry_date)}</span>
            {membership?.time_remaining && (
              <span className={`font-label-md text-label-md font-bold ${expired ? 'text-error' : 'text-on-surface'}`}>
                {expired ? tl("Expired") : tl("{0} left", { 0: formatRemaining(membership.time_remaining) })}
              </span>
            )}
          </div>

          <button type="button" onClick={() => pass && setFullscreen(true)} aria-label={tl("Show pass QR full screen")}
            className="p-2 bg-white rounded shadow-md flex flex-col items-center justify-center">
            {qr(112)}
          </button>
        </div>
        {pass && <p className="text-on-surface-variant text-[11px] mt-3">{tl("Refreshes in")}{' '}{left}s</p>}
        {error && <p className="text-error text-[12px] mt-3" role="alert">{error}</p>}
      </div>

      <button type="button" onClick={() => setFullscreen(true)} disabled={!pass}
        className="w-full mt-space-md py-space-sm px-space-md rounded bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider font-bold flex items-center justify-center gap-space-xs disabled:opacity-50">
        <span className="material-symbols-outlined text-[18px]">fullscreen</span>
        {tl("Show at the desk")}
      </button>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-white flex flex-col items-center justify-center gap-6 p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)} role="dialog" aria-modal="true" aria-label={tl("Entry pass QR")}
          >
            {qr(Math.min(320, window.innerWidth - 64))}
            <div className="text-center text-black">
              <p className="text-xl font-bold">{cardholder}</p>
              <p className="text-sm opacity-70">{tier}{' '}{tl("· refreshes in")}{' '}{left}{tl("s · tap to close")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
