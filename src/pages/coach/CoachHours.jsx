// src/pages/coach/CoachHours.jsx — the weekly hours members can book 1-on-1 sessions in.
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { coachService } from '../../services/coachService';
import { PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls } from '../../components/site/siteStyles';
import { formatSAR } from '../../utils/money';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { tl } from '../../i18n';
import { card, Page, Skeleton } from './ui';

const DAYS = [tl('Monday'), tl('Tuesday'), tl('Wednesday'), tl('Thursday'), tl('Friday'), tl('Saturday'), tl('Sunday')];

export default function CoachHours() {
  const [f, setF] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    coachService.hours().then(setF).catch((err) => toast.error(errorMessage(err)));
  }, []);

  if (!f) return <Page><Skeleton rows={4} /></Page>;
  const setW = (i, patch) => setF((x) => ({ ...x, windows: x.windows.map((w, j) => (j === i ? { ...w, ...patch } : w)) }));
  const addW = (day) => setF((x) => ({ ...x, windows: [...x.windows, { day_of_week: day, start_time: '09:00', end_time: '12:00' }] }));
  const delW = (i) => setF((x) => ({ ...x, windows: x.windows.filter((_, j) => j !== i) }));

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      setF(await coachService.saveHours({
        is_accepting_clients: f.is_accepting_clients, offers_1on1: f.offers_1on1,
        windows: f.windows.map(({ day_of_week, start_time, end_time }) => ({ day_of_week, start_time, end_time })),
      }));
      toast.success(tl('Hours saved'));
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl('Fix the highlighted hours')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <PageHeader title={tl('My hours')}
        subtitle={tl('Members book 60-minute slots inside these hours (gym time). The price per session ({0}) is set by the gym.', { 0: formatSAR(f.hourly_rate) })}>
        <button type="button" className={btn.primary} disabled={saving} onClick={save}>{saving ? tl('Saving…') : tl('Save hours')}</button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[['is_accepting_clients', tl('Taking new clients'), tl('Off = members can’t book you for now.')],
          ['offers_1on1', tl('Offer 1-on-1 sessions'), tl('Off = no session booking at all.')]].map(([k, label, hint]) => (
          <button key={k} type="button" role="switch" aria-checked={!!f[k]} onClick={() => setF((x) => ({ ...x, [k]: !x[k] }))}
            className={`${card} p-4 text-left flex items-center justify-between gap-3`}>
            <span>
              <span className="block text-on-surface font-bold">{label}</span>
              <span className="block text-[12px] text-on-surface-variant">{hint}</span>
            </span>
            <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase ${f[k] ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'}`}>
              {f[k] ? tl('On') : tl('Off')}
            </span>
          </button>
        ))}
      </div>

      <div className={`${card} p-4 sm:p-5 flex flex-col divide-y divide-[#1a1a1e]`}>
        {DAYS.map((day, d) => {
          const rows = f.windows.map((w, i) => [w, i]).filter(([w]) => w.day_of_week === d);
          return (
            <div key={day} className="py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-on-surface font-bold text-[13px]">{day}</span>
                <button type="button" className={btn.ghost} onClick={() => addW(d)}>{tl('+ Add hours')}</button>
              </div>
              {!rows.length && <span className="text-[12px] text-on-surface-variant">{tl('Not bookable')}</span>}
              {rows.map(([w, i]) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input type="time" className={`${inputCls} w-32`} value={w.start_time} aria-label={tl('{0} start', { 0: day })}
                    onChange={(e) => setW(i, { start_time: e.target.value })} />
                  <span className="text-on-surface-variant">{tl('to')}</span>
                  <input type="time" className={`${inputCls} w-32`} value={w.end_time} aria-label={tl('{0} end', { 0: day })}
                    onChange={(e) => setW(i, { end_time: e.target.value })} />
                  <button type="button" className={btn.ghost} onClick={() => delW(i)} aria-label={tl('Remove')}>✕</button>
                  {errors[`windows.${i}`] && <span role="alert" className="text-rose-400 text-[11px] w-full">{errors[`windows.${i}`]}</span>}
                </div>
              ))}
              {errors[`day.${d}`] && <span role="alert" className="text-rose-400 text-[11px]">{errors[`day.${d}`]}</span>}
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-on-surface-variant">{tl('Changing hours never cancels sessions that are already booked.')}</p>
    </Page>
  );
}
