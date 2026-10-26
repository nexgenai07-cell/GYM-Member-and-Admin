// src/pages/member/Classes.jsx
// The weekly class timetable. Booking keeps your spot every week; full classes put you on a
// waitlist and you're notified when a spot opens.
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { classesService } from '../../services/classesService';
import { errorMessage } from '../../utils/apiError';
import { tl } from '../../i18n';

const TODAY = (new Date().getDay() + 6) % 7;   // Mon = 0, like the timetable

export default function Classes() {
  const [day, setDay] = useState(TODAY);
  const [busyId, setBusyId] = useState(null);
  const { data, loading, refetch } = useApi(() => classesService.list(), []);
  const days = data?.days || [];
  const classes = data?.classes || [];
  const mine = classes.filter((c) => c.my_status);
  const shown = classes.filter((c) => c.day_of_week === day);

  const act = async (c) => {
    setBusyId(c.id);
    try {
      const res = c.my_status ? await classesService.cancel(c.id) : await classesService.book(c.id);
      toast.success(res.detail);
      refetch();
    } catch (err) {
      toast.error(errorMessage(err, tl("Something went wrong")));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-space-xs text-primary">
          <span className="material-symbols-outlined text-[16px]">event</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">{tl("Group classes")}</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">{tl("Classes")}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
          {tl("Book a class once and your spot is kept every week. Full? Join the waitlist — we’ll notify you when a spot opens.")}
        </p>
      </motion.div>

      {mine.length > 0 && (
        <section className="bg-surface-container rounded-xl p-5 flex flex-col gap-3">
          <h2 className="font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant">{tl("My classes")}</h2>
          <div className="flex flex-wrap gap-2">
            {mine.map((c) => (
              <button key={c.id} type="button" onClick={() => setDay(c.day_of_week)}
                className="px-3 py-2 rounded-lg bg-surface-container-high text-left text-[13px] text-on-surface hover:bg-surface-bright">
                <span className="font-bold">{c.name}</span>
                <span className="block text-[11px] text-on-surface-variant">
                  {c.day.slice(0, 3)} {c.start_time}{c.my_status === 'waitlist' && tl(" · waitlist #{0}", { 0: c.my_waitlist_position })}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label={tl("Day")}>
        {days.map((d, i) => {
          const n = classes.filter((c) => c.day_of_week === i).length;
          return (
            <button key={d} type="button" role="tab" aria-selected={day === i} onClick={() => setDay(i)}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider whitespace-nowrap ${
                day === i ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}>
              {d.slice(0, 3)}{i === TODAY && tl(" · today")}<span className="ml-1 opacity-70">({n})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-surface-container rounded-xl animate-pulse" />)}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl text-on-surface-variant">
          {tl("No classes on")}{' '}{days[day] || tl("this day")}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {shown.map((c) => (
            <div key={c.id} className="bg-surface-container rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-primary font-bold">{c.start_time}–{c.end_time}</div>
                  <h3 className="font-title-lg text-title-lg text-on-surface">{c.name}</h3>
                  <div className="text-[12px] text-on-surface-variant">
                    {tl(c.category_label)} · {c.level_label}{c.trainer && ` · ${c.trainer}`}{c.location && ` · ${c.location}`}
                  </div>
                </div>
                {c.my_status && (
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ${
                    c.my_status === 'enrolled' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400'}`}>
                    {c.my_status === 'enrolled' ? tl("Booked") : tl("Waitlist #{0}", { 0: c.my_waitlist_position })}
                  </span>
                )}
              </div>
              {c.description && <p className="text-[13px] text-on-surface-variant line-clamp-3">{c.description}</p>}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-container-high">
                <span className="text-[12px] text-on-surface-variant">
                  {c.spots_left > 0 ? tl("{0} of {1} spots left", { 0: c.spots_left, 1: c.capacity }) : tl("Full{0}", { 0: c.waitlisted ? ` · ${c.waitlisted} waiting` : '' })}
                </span>
                <button type="button" disabled={busyId === c.id} onClick={() => act(c)}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 ${
                    c.my_status ? 'bg-surface-container-high text-on-surface hover:bg-error/20'
                      : 'bg-primary-container text-on-primary-container hover:opacity-90'}`}>
                  {busyId === c.id ? '…' : c.my_status === 'enrolled' ? tl("Cancel") : c.my_status === 'waitlist' ? tl("Leave waitlist")
                    : c.spots_left > 0 ? tl("Book") : tl("Join waitlist")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
