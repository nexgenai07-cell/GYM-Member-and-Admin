// src/components/trainers/BookingPanel.jsx
// 1:1 booking: free slots come from the trainer's weekly availability (minus
// booked sessions), the price is the trainer's hourly rate, and the session is
// confirmed once paid (card / STC Pay / locker credit).
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { catalogService } from '../../services/catalogService';
import { useApi } from '../../hooks/useApi';
import PayDialog from '../payments/PayDialog';
import { errorMessage } from '../../utils/apiError';
import { formatSAR } from '../../utils/money';
import { formatGymDateTime } from '../../utils/gymTime';

const DAYS_AHEAD = 14;
const CANCEL_HOURS = 24;

const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const weekdayMon0 = (d) => (d.getDay() + 6) % 7;     // backend: 0 = Monday

export default function BookingPanel({ trainer }) {
  const [days] = useState(() => Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  }));
  const [day, setDay] = useState(null);
  const [slots, setSlots] = useState(null);
  const [meta, setMeta] = useState(null);           // { price, accepting, available_weekdays }
  const [slot, setSlot] = useState(null);
  const [focus, setFocus] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [paySession, setPaySession] = useState(null);

  const { data: sessions, refetch: refetchSessions } = useApi(() => catalogService.mySessions(), [], { showError: false });
  const mine = useMemo(
    () => (Array.isArray(sessions) ? sessions : [])
      .filter((s) => s.trainer === trainer?.id && ['scheduled', 'pending_payment'].includes(s.status))
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)),
    [sessions, trainer?.id],
  );

  // First load: which weekdays the trainer works and the price.
  useEffect(() => {
    if (!trainer?.id) return undefined;
    let alive = true;
    (async () => {
      try {
        const res = await catalogService.trainerSlots(trainer.id, isoDate(days[0]));
        if (!alive) return;
        setMeta(res);
        const first = days.find((d) => res.available_weekdays.includes(weekdayMon0(d)));
        setDay(first ? isoDate(first) : null);
      } catch (e) {
        if (alive) toast.error(errorMessage(e, 'Could not load availability'));
      }
    })();
    return () => { alive = false; };
  }, [trainer?.id, days]);

  useEffect(() => {
    if (!trainer?.id || !day) return undefined;
    let alive = true;
    (async () => {
      setSlots(null);
      setSlot(null);
      try {
        const res = await catalogService.trainerSlots(trainer.id, day);
        if (alive) setSlots(res.slots);
      } catch {
        if (alive) setSlots([]);
      }
    })();
    return () => { alive = false; };
  }, [trainer?.id, day]);

  const reloadSlots = async () => {
    if (!day) return;
    try { setSlots((await catalogService.trainerSlots(trainer.id, day)).slots); } catch { /* keep */ }
  };

  const book = async () => {
    if (!slot) return;
    setBooking(true);
    try {
      const session = await catalogService.bookSession({
        trainer_id: trainer.id,
        scheduled_at: slot.start,
        focus_area: focus,
        notes,
      });
      setPaySession(session);
    } catch (e) {
      toast.error(errorMessage(e, 'Could not book that slot'));
      reloadSlots();
    } finally {
      setBooking(false);
    }
  };

  const cancel = async (s) => {
    const paid = s.status === 'scheduled';
    const msg = paid
      ? `Cancel this session? ${formatSAR(s.amount_charged)} goes back to your locker credit.`
      : 'Cancel this unpaid booking?';
    if (!window.confirm(msg)) return;
    try {
      await catalogService.cancelSession(s.id);
      toast.success('Session cancelled');
      refetchSessions();
      reloadSlots();
    } catch (e) {
      toast.error(errorMessage(e, 'Could not cancel'));
    }
  };

  const specialties = Array.isArray(trainer?.specialties) ? trainer.specialties : [];
  const accepting = meta ? meta.accepting : trainer?.is_accepting_clients;

  return (
    <div className="flex flex-col">
      <div className="sticky top-20 bg-surface-container-lowest rounded-xl p-space-lg shadow-2xl flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase">1-on-1 session</span>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">Book a session</h2>
          </div>
          <span className="font-title-md text-title-md text-on-surface whitespace-nowrap">
            {formatSAR(meta?.price ?? trainer?.hourly_rate)}<span className="text-on-surface-variant text-[11px]"> / 60 min</span>
          </span>
        </div>

        {!accepting ? (
          <p className="text-on-surface-variant text-[13px]">This trainer isn’t taking new 1-on-1 bookings right now.</p>
        ) : meta && meta.available_weekdays.length === 0 ? (
          <p className="text-on-surface-variant text-[13px]">No booking hours have been set for this trainer yet.</p>
        ) : (
          <>
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Day</span>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {days.map((d) => {
                  const works = meta?.available_weekdays.includes(weekdayMon0(d));
                  const id = isoDate(d);
                  return (
                    <button key={id} type="button" disabled={!works} onClick={() => setDay(id)}
                      className={`shrink-0 w-14 py-2 rounded flex flex-col items-center text-[11px] font-bold uppercase transition-colors ${
                        day === id ? 'bg-primary-container text-on-primary-container'
                          : works ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                            : 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed'}`}>
                      <span>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <span className="text-[14px]">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Time</span>
              {slots === null ? (
                <div className="h-10 bg-surface-container rounded animate-pulse" />
              ) : slots.length === 0 ? (
                <p className="text-on-surface-variant text-[12px]">No free slots that day — try another day.</p>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {slots.map((s) => (
                    <button key={s.start} type="button" onClick={() => setSlot(s)}
                      className={`py-2 rounded text-[12px] font-bold ${slot?.start === s.start ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {specialties.length > 0 && (
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Focus (optional)</span>
                <div className="flex flex-wrap gap-1">
                  {specialties.map((sp) => (
                    <button key={sp} type="button" onClick={() => setFocus(focus === sp ? '' : sp)}
                      className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${focus === sp ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500}
              placeholder="Anything the trainer should know (injuries, goals)…"
              className="w-full bg-surface-container text-on-surface px-3 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary text-[13px]" />

            <button type="button" onClick={book} disabled={!slot || booking}
              className="w-full py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-bold uppercase tracking-wider text-[12px] disabled:opacity-50">
              {booking ? 'Reserving…' : slot ? `Book ${slot.label} · ${formatSAR(meta?.price ?? trainer?.hourly_rate)}` : 'Pick a time'}
            </button>
            <p className="text-on-surface-variant text-[11px]">
              Cancel up to {CANCEL_HOURS} hours before for a full refund to your locker credit.
            </p>
          </>
        )}

        {mine.length > 0 && (
          <div className="flex flex-col gap-space-xs border-t border-surface-container-high pt-space-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Your sessions</span>
            {mine.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 bg-surface-container rounded px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-on-surface text-[13px] font-bold">
                    {formatGymDateTime(s.scheduled_at)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${s.status === 'scheduled' ? 'text-emerald-400' : 'text-primary'}`}>
                    {s.status === 'scheduled' ? 'Confirmed' : 'Awaiting payment'}
                  </span>
                </div>
                <div className="flex gap-1">
                  {s.status === 'pending_payment' && (
                    <button type="button" onClick={() => setPaySession(s)}
                      className="px-2 py-1 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase">Pay</button>
                  )}
                  <button type="button" onClick={() => cancel(s)}
                    className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase hover:text-error">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PayDialog
        request={paySession ? { purpose: 'trainer_session', session_id: paySession.id } : null}
        title={paySession ? `Session with ${trainer?.user?.full_name || 'trainer'}` : ''}
        allowCredit
        onPaid={() => { toast.success('Session confirmed!'); setNotes(''); setFocus(''); }}
        onClose={() => { setPaySession(null); refetchSessions(); reloadSlots(); }}
      />
    </div>
  );
}
