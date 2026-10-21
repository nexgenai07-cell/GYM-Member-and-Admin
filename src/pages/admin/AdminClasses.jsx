// src/pages/admin/AdminClasses.jsx
// The weekly class timetable. Members book a standing weekly spot from their portal
// (Classes page); full classes take a waitlist that moves up automatically.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { classesService } from '../../services/classesService';
import { Drawer, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { errorMessage, fieldErrors } from '../../utils/apiError';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES = [['strength', 'Strength'], ['hiit', 'HIIT'], ['combat', 'Combat'], ['mobility', 'Mobility'],
  ['endurance', 'Endurance'], ['olympic', 'Olympic lifting'], ['recovery', 'Recovery']];
const LEVELS = [['all_levels', 'All levels'], ['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']];
const NEW = { name: '', category: 'strength', level: 'all_levels', description: '', trainer_id: '', day_of_week: 0,
  start_time: '18:00', duration_minutes: 60, capacity: 12, location: '', is_active: true };

export default function AdminClasses() {
  const [showPaused, setShowPaused] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data, loading, refetch } = useApi(() => classesService.adminList(showPaused ? { include_paused: 1 } : {}), [showPaused]);
  const { data: stats, refetch: refetchStats } = useApi(() => classesService.stats(), []);
  const { data: trainers } = useApi(() => adminService.trainersAdmin(), []);
  const list = Array.isArray(data) ? data : [];
  const saved = () => { refetch(); refetchStats(); };

  const times = [...new Set(list.map((c) => c.start_time))].sort();
  const at = (day, t) => list.filter((c) => c.day_of_week === day && c.start_time === t);

  const tiles = [
    ['Classes a week', stats?.total_classes], ['Spots booked', stats?.active_enrollments],
    ['Fill rate', stats ? `${stats.fill_rate}%` : undefined], ['Full classes', stats?.full_classes],
    ['On waitlists', stats?.waitlisted], ['Members booked', stats?.members_booked],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title="Classes" subtitle="Weekly timetable (gym time). Members book a standing spot from their portal.">
        <label className="flex items-center gap-2 text-[12px] text-on-surface-variant">
          <input type="checkbox" checked={showPaused} onChange={(e) => setShowPaused(e.target.checked)} /> Show paused
        </label>
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW)}>+ Add class</button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3">
            <div className="text-[22px] font-bold text-on-surface">{value ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="h-96 bg-[#0e0e0f] rounded-lg animate-pulse" />
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg text-on-surface-variant text-[13px] flex flex-col items-center gap-3">
          No classes on the timetable yet.
          <button type="button" className={btn.primary} onClick={() => setEditing(NEW)}>Add the first class</button>
        </div>
      ) : (
        <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1e] text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="px-3 py-3 text-left w-20">Time</th>
                {DAYS.map((d) => <th key={d} className="px-2 py-3 text-center">{d.slice(0, 3)}</th>)}
              </tr>
            </thead>
            <tbody>
              {times.map((t) => (
                <tr key={t} className="border-b border-[#1a1a1e] last:border-0 align-top">
                  <td className="px-3 py-2 font-mono text-[13px] text-primary font-bold">{t}</td>
                  {DAYS.map((_, d) => (
                    <td key={d} className="px-1 py-2">
                      <div className="flex flex-col gap-1">
                        {at(d, t).map((c) => (
                          <button key={c.id} type="button" onClick={() => setEditing(c)}
                            className={`text-left p-2 rounded border-l-2 bg-[#131316] hover:bg-[#1a1a1e] ${
                              !c.is_active ? 'border-neutral-600 opacity-50' : c.status === 'full' ? 'border-rose-500' : 'border-emerald-500'}`}>
                            <span className="block text-[12px] text-on-surface font-bold leading-tight">{c.name}</span>
                            <span className="block text-[10px] text-on-surface-variant truncate">{c.trainer || 'No trainer'}{c.location && ` · ${c.location}`}</span>
                            <span className="block text-[10px] text-on-surface-variant mt-0.5">
                              {c.booked}/{c.capacity}{c.waitlisted > 0 && ` · ${c.waitlisted} waiting`}{!c.is_active && ' · paused'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <ClassEditor cls={editing} trainers={Array.isArray(trainers) ? trainers : []}
        onClose={() => setEditing(null)} onSaved={saved} />}
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </label>
  );
}

function ClassEditor({ cls, trainers, onClose, onSaved }) {
  const isNew = !cls.id;
  const [f, setF] = useState({ ...cls, trainer_id: cls.trainer_id ?? '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const { data: roster, refetch: refetchRoster } = useApi(
    () => (isNew ? Promise.resolve(null) : classesService.roster(cls.id)), [cls.id], { showError: false });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async () => {
    setBusy(true);
    setErrors({});
    const body = {
      name: f.name, category: f.category, level: f.level, description: f.description, trainer_id: f.trainer_id || null,
      day_of_week: Number(f.day_of_week), start_time: f.start_time, duration_minutes: f.duration_minutes,
      capacity: f.capacity, location: f.location, is_active: f.is_active,
    };
    try {
      await (isNew ? classesService.create(body) : classesService.update(cls.id, body));
      toast.success(isNew ? 'Class added — members can book it now' : 'Class saved');
      onSaved();
      onClose();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, 'Could not save the class'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const n = (cls.booked || 0) + (cls.waitlisted || 0);
    if (!window.confirm(`Remove ${cls.name} from the timetable?${n ? ` ${n} booked/waitlisted members will be notified.` : ''}`)) return;
    try {
      await classesService.remove(cls.id);
      toast.success('Class removed');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not remove the class'));
    }
  };

  const kick = async (e) => {
    if (!window.confirm(`Remove ${e.name} from this class? They’ll be notified.`)) return;
    try {
      toast.success((await classesService.removeFromRoster(cls.id, e.id)).detail);
      refetchRoster();
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not remove them'));
    }
  };

  const people = roster?.roster || [];

  return (
    <Drawer open title={isNew ? 'Add class' : cls.name} onClose={onClose}
      subtitle={isNew ? 'Repeats every week at the same time.' : `${cls.day}s ${cls.start_time}–${cls.end_time} · ${cls.booked}/${cls.capacity} booked`}
      footer={<>
        {!isNew && <button type="button" className={btn.danger} onClick={remove}>Remove</button>}
        <div className="flex-1" />
        <button type="button" className={btn.ghost} onClick={onClose}>Cancel</button>
        <button type="button" className={btn.primary} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Name" error={errors.name} className="md:col-span-2"><input className={inputCls} value={f.name} onChange={set('name')} placeholder="Morning HIIT" /></Field>
        <Field label="Day" error={errors.day_of_week}>
          <select className={inputCls} value={f.day_of_week} onChange={set('day_of_week')}>
            {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select></Field>
        <Field label="Starts (gym time)" error={errors.start_time}><input className={inputCls} type="time" value={f.start_time} onChange={set('start_time')} /></Field>
        <Field label="Length (minutes)" error={errors.duration_minutes}><input className={inputCls} type="number" min="10" max="300" value={f.duration_minutes} onChange={set('duration_minutes')} /></Field>
        <Field label="Spots" error={errors.capacity}><input className={inputCls} type="number" min="1" max="500" value={f.capacity} onChange={set('capacity')} /></Field>
        <Field label="Category" error={errors.category}>
          <select className={inputCls} value={f.category} onChange={set('category')}>{CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Level" error={errors.level}>
          <select className={inputCls} value={f.level} onChange={set('level')}>{LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Trainer" error={errors.trainer_id}>
          <select className={inputCls} value={f.trainer_id} onChange={set('trainer_id')}>
            <option value="">No trainer</option>
            {trainers.map((t) => <option key={t.id} value={t.id}>{t.user_name}</option>)}
          </select></Field>
        <Field label="Room" error={errors.location}><input className={inputCls} value={f.location} onChange={set('location')} placeholder="Studio 1" /></Field>
        <Field label="Description" error={errors.description} className="md:col-span-2">
          <textarea className={inputCls} rows={3} value={f.description} onChange={set('description')} /></Field>
      </div>
      <label className="flex items-start gap-2 text-[13px] text-on-surface">
        <input type="checkbox" className="mt-1" checked={!!f.is_active} onChange={set('is_active')} />
        <span>On the timetable<span className="block text-[11px] text-on-surface-variant">Untick to pause it: members keep their spots but can’t see or book it until you turn it back on.</span></span>
      </label>

      {!isNew && (
        <div className="flex flex-col gap-2">
          <span className={labelCls}>Roster ({people.filter((p) => p.status === 'booked').length} booked, {people.filter((p) => p.status === 'waitlist').length} waiting)</span>
          {people.length === 0 ? (
            <p className="text-[12px] text-on-surface-variant">Nobody has booked yet.</p>
          ) : people.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2 bg-[#0e0e0f] border border-[#1a1a1e] rounded px-3 py-2 text-[13px]">
              <div className="min-w-0">
                <div className="text-on-surface truncate">{p.name}</div>
                <div className="text-[11px] text-on-surface-variant truncate">{p.email} · since {new Date(p.since).toLocaleDateString()}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${p.status === 'booked' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                {p.status === 'booked' ? 'Booked' : 'Waitlist'}</span>
              <button type="button" className={btn.ghost} onClick={() => kick(p)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
