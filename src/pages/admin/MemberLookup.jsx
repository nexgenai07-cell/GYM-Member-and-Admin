// src/pages/admin/MemberLookup.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { formatDate, formatRemaining } from '../../utils/membershipTime';
import { errorMessage } from '../../utils/apiError';
import QrScanner from '../../components/QrScanner';

const PASS_PREFIX = 'SGPASS:';

const fmtDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function MemberLookup() {
  const [iqama, setIqama] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [scanning, setScanning] = useState(false);
  // Tick every second while a session is running
  useEffect(() => {
    if (!result?.active_check_in) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [result?.active_check_in]);

  // Accepts a typed Iqama number or a scanned digital pass (camera or a USB
  // scanner typing into the box).
  const lookup = async (e, value) => {
    e?.preventDefault();
    const q = (value ?? iqama).trim();
    if (!q) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = q.startsWith(PASS_PREFIX)
        ? await adminService.lookupMemberByPass(q)
        : await adminService.lookupMember(q);
      setResult(res);
      if (!res.found) {
        setError(
          res.reason === 'registration_pending'
            ? 'This Iqama has a registration waiting for approval.'
            : 'Member not found.'
        );
      }
    } catch (err) {
      const body = err?.response?.data;
      setError(body?.reason === 'not_found' ? 'Member not found.'
        : body?.reason === 'registration_pending' ? 'This Iqama has a registration waiting for approval.'
          : errorMessage(err, 'Lookup failed'));
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async () => {
    if (!result?.member) return;
    setBusy(true);
    try {
      // Desk check-in: no face comparison happens here (the gate script does that).
      const ci = await adminService.checkInMember(result.member.id, {});
      toast.success('Session started');
      setResult({ ...result, active_check_in: ci });
    } catch (err) {
      toast.error(err.message || 'Check-in failed');
    } finally {
      setBusy(false);
    }
  };

  const endTimer = async () => {
    if (!result?.active_check_in) return;
    setBusy(true);
    try {
      const ci = await adminService.checkOut(result.active_check_in.id);
      toast.success(`Session ended — ${ci.duration_minutes} min`);
      setResult({ ...result, active_check_in: null });
    } catch (err) {
      toast.error(err.message || 'Check-out failed');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setIqama('');
    setResult(null);
    setError('');
  };

  // Live session elapsed
  const sessionElapsed = (() => {
    if (!result?.active_check_in) return null;
    const start = new Date(result.active_check_in.check_in_time).getTime();
    return Math.max(0, Math.floor((now - start) / 1000));
  })();

  return (
    <div className="p-8 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-headline-lg text-[28px] text-on-surface uppercase tracking-wider mb-1">
          Member Lookup
        </h1>
        <p className="font-body-sm text-on-surface-variant text-[13px]">
          Scan the member's digital pass QR (or type their Iqama number) to verify the
          membership and start their session timer.
        </p>
      </motion.div>

      <QrScanner
        open={scanning}
        title="Scan member pass"
        manualLabel="Or type the Iqama number"
        onResult={(code) => { setScanning(false); setIqama(code.startsWith(PASS_PREFIX) ? '' : code); lookup(null, code); }}
        onClose={() => setScanning(false)}
      />

      {/* Search box */}
      <form onSubmit={lookup} className="flex gap-2 mb-6 max-w-2xl">
        <input
          value={iqama}
          onChange={(e) => {
            const v = e.target.value;
            // Pass tokens (from a USB scanner) are kept as typed; Iqama numbers are digits only.
            setIqama(/^s/i.test(v) ? v.trim().slice(0, 400) : v.replace(/\D/g, '').slice(0, 10));
          }}
          placeholder="Iqama 2XXXXXXXXX or scan pass"
          aria-label="Iqama number or pass"
          className="flex-1 bg-[#131316] border border-[#1a1a1e] rounded px-4 py-3 text-[16px] font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container outline-none"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded bg-primary-container hover:opacity-90 disabled:opacity-40 text-on-primary-container text-[12px] font-bold uppercase tracking-wider"
        >
          {loading ? 'Searching…' : 'Lookup'}
        </button>
        <button
          type="button"
          onClick={() => setScanning(true)}
          className="px-4 py-3 rounded bg-[#131316] hover:bg-[#1a1a1e] text-on-surface text-[12px] font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span> Scan pass
        </button>
        {result && (
          <button
            type="button"
            onClick={reset}
            className="px-4 py-3 rounded bg-[#131316] hover:bg-[#1a1a1e] text-on-surface-variant text-[12px] font-bold uppercase tracking-wider"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="max-w-2xl mb-6 p-4 rounded border border-rose-500/30 bg-rose-500/10 text-rose-300 text-[13px]">
          {error}
        </div>
      )}

      {result?.found && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6"
        >
          {/* Photo card */}
          <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-5 flex flex-col items-center">
            <div className="w-40 h-40 rounded-lg overflow-hidden bg-[#1a1a1e] flex items-center justify-center mb-4">
              {result.registration_photo_url ? (
                <img
                  src={result.registration_photo_url}
                  alt={result.member.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-[11px] text-on-surface-variant text-center px-2">
                  No registration photo
                </span>
              )}
            </div>

            <div className="text-center mb-3">
              <div className="text-[16px] font-bold text-on-surface">
                {result.member.full_name}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {result.member.email}
              </div>
            </div>

            <div
              className={`w-full text-center py-2 rounded font-bold text-[12px] uppercase tracking-widest ${
                result.is_valid
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {result.is_valid ? '✓ Valid' : '✗ Not Valid'}
            </div>

          </div>

          {/* Details */}
          <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Stat label="Plan" value={result.membership?.plan?.display_name} />
              <Stat
                label="Time Remaining"
                value={formatRemaining(result.membership?.time_remaining)}
                accent={
                  result.membership?.time_remaining?.expired
                    ? 'text-rose-400'
                    : result.membership?.days_remaining <= 5 ? 'text-amber-400' : ''
                }
              />
              <Stat label="Started (approved)" value={formatDate(result.membership?.start_date)} />
              <Stat label="Status" value={result.membership?.status} />
              <Stat label="Pass ID" value={result.membership?.pass_id} mono />
              <Stat
                label="Iqama"
                value={result.membership?.iqama_number}
                mono
              />
              <Stat
                label="Expires"
                value={formatDate(result.membership?.expiry_date)}
              />
            </div>

            {/* Session timer */}
            <div className="border-t border-[#1a1a1e] pt-6">
              {result.active_check_in ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                      Session Active
                    </span>
                  </div>
                  <div className="text-[48px] font-mono text-on-surface leading-none mb-5">
                    {fmtDuration(sessionElapsed)}
                  </div>
                  <button
                    onClick={endTimer}
                    disabled={busy}
                    className="px-6 py-3 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white text-[12px] font-bold uppercase tracking-wider"
                  >
                    End Timer
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[13px] text-on-surface-variant mb-4">
                    No active session. Click below to start the timer.
                  </div>
                  <button
                    onClick={startTimer}
                    disabled={busy || !result.is_valid}
                    className="px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[12px] font-bold uppercase tracking-wider"
                  >
                    ▶ Start Timer
                  </button>
                  {!result.is_valid && (
                    <span className="ml-3 text-[11px] text-rose-400">
                      Membership not valid
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = '', mono = false }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
        {label}
      </div>
      <div
        className={`text-[15px] font-bold text-on-surface ${accent} ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value || '—'}
      </div>
    </div>
  );
}