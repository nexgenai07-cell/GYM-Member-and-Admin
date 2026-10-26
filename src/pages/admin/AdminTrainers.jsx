// src/pages/admin/AdminTrainers.jsx
// Trainers (profiles shown to members, verification, visibility) and the course catalogue
// (draft → published → archived, lessons, cover). Weekly hours live on Trainer Hours.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { Drawer, Empty, ImageUploader, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { formatSAR } from '../../utils/money';
import PersonEditor from '../../components/admin/PersonEditor';

const TRAINER_API = {
  create: (b) => adminService.createTrainer(b),
  update: (id, b) => adminService.updateTrainer(id, b),
  upload: (id, f) => adminService.uploadTrainerPhoto(id, f),
};
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { tl } from '../../i18n';

const TRAINER_FILTERS = [['', tl("All")], ['verified', tl("Verified")], ['unverified', tl("Not verified")], ['hidden', tl("Hidden")]];
const COURSE_FILTERS = [['', tl("All")], ['published', tl("Published")], ['draft', tl("Drafts")], ['pending', tl("In review")], ['archived', tl("Archived")]];
const LEVELS = [['beginner', tl("Beginner")], ['intermediate', tl("Intermediate")], ['advanced', tl("Advanced")], ['all_levels', tl("All levels")]];
const STATUS_TONE = {
  published: 'bg-emerald-500/15 text-emerald-400', draft: 'bg-neutral-500/20 text-on-surface-variant',
  pending: 'bg-amber-500/15 text-amber-400', archived: 'bg-rose-500/15 text-rose-400',
};

export default function AdminTrainers() {
  const [tab, setTab] = useState('trainers');
  const { data: tStats, refetch: refetchTStats } = useApi(() => adminService.trainerStats(), []);
  const { data: cStats, refetch: refetchCStats } = useApi(() => adminService.courseStats(), []);

  const tiles = [
    [tl("Trainers"), tStats?.total], [tl("Verified"), tStats?.verified], [tl("Taking clients"), tStats?.accepting],
    [tl("Published courses"), cStats?.published], [tl("Enrolments"), cStats?.enrollments],
    [tl("Course sales"), cStats ? formatSAR(cStats.course_revenue) : undefined],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title={tl("Trainers & Courses")} subtitle={tl("Who members can book, and the programmes they can buy.")}>
        <Link to="/admin/trainer-hours" className={btn.ghost}>{tl("Weekly hours & 1:1 prices")}</Link>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3">
            <div className="text-[22px] font-bold text-on-surface">{value ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-[#0e0e0f] border border-[#1a1a1e] p-1 rounded-lg w-fit" role="tablist">
        {[['trainers', tl("Trainers")], ['courses', tl("Courses")]].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider ${
              tab === id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'trainers'
        ? <TrainersTab onChanged={refetchTStats} />
        : <CoursesTab onChanged={refetchCStats} />}
    </div>
  );
}

function Chips({ options, value, onChange }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map(([id, label]) => (
        <button key={id || 'all'} type="button" onClick={() => onChange(id)}
          className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
            value === id ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'}`}>
          {label}
        </button>
      ))}
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

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-start gap-2 text-[13px] text-on-surface">
      <input type="checkbox" className="mt-1" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}{hint && <span className="block text-[11px] text-on-surface-variant">{hint}</span>}</span>
    </label>
  );
}

// ============================================================
// TRAINERS
// ============================================================
const NEW_TRAINER = {
  email: '', first_name: '', last_name: '', phone: '', title: '', credentials: '', bio: '', specialties: [],
  years_experience: 0, hourly_rate: '', is_verified: false, is_accepting_clients: true, offers_1on1: true, is_active: true,
};

function TrainersTab({ onChanged }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);   // trainer row, or NEW_TRAINER
  const { data, loading, refetch } = useApi(
    () => adminService.trainersAdmin({ search: search || undefined, status: status || undefined }), [search, status]);
  const list = Array.isArray(data) ? data : [];

  const saved = () => { refetch(); onChanged(); };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Chips options={TRAINER_FILTERS} value={status} onChange={setStatus} />
        <div className="flex-1" />
        <input className={`${inputCls} md:w-64`} value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={tl("Search name, email, title…")} aria-label={tl("Search trainers")} />
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW_TRAINER)}>{tl("+ Add trainer")}</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty>{search || status ? tl("No trainers match.") : tl("No trainers yet — add your first one.")}</Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((t) => (
            <button key={t.id} type="button" onClick={() => setEditing(t)}
              className={`text-left bg-[#0e0e0f] border border-[#1a1a1e] hover:border-primary-container/60 rounded-lg p-4 flex flex-col gap-3 ${t.is_active ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-3">
                {t.photo_url
                  ? <img src={t.photo_url} alt="" className="w-12 h-12 rounded object-cover" />
                  : <div className="w-12 h-12 rounded bg-primary-container/20 text-primary grid place-items-center font-bold">{t.initials}</div>}
                <div className="min-w-0 flex-1">
                  <div className="text-on-surface font-bold truncate flex items-center gap-1">
                    {t.user_name}
                    {t.is_verified && <span className="material-symbols-outlined text-primary text-[16px]" title={tl("Verified")}>verified</span>}
                  </div>
                  <div className="text-[11px] text-on-surface-variant truncate">{t.title}</div>
                </div>
                {!t.is_active && <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[9px] font-bold uppercase">{tl("Hidden")}</span>}
              </div>
              {t.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.specialties.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-[#131316] text-on-surface-variant text-[10px]">{s}</span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-3 mt-auto border-t border-[#1a1a1e] text-[12px]">
                <Mini label={tl("1:1 rate")} value={t.offers_1on1 ? `${formatSAR(t.hourly_rate)}/h` : 'No 1:1'} />
                <Mini label={tl("Courses")} value={t.courses} />
                <Mini label={tl("Upcoming")} value={t.upcoming_sessions} />
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t.total_reviews ? tl("★ {0} · {1} reviews", { 0: t.rating.toFixed(1), 1: t.total_reviews }) : tl("No reviews yet")}
                {!t.is_accepting_clients && tl(" · not taking new clients")}
              </div>
            </button>
          ))}
        </div>
      )}

      {editing && <PersonEditor person={editing} kind="trainer" api={TRAINER_API} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-on-surface-variant">{label}</div>
      <div className="text-on-surface font-bold">{value}</div>
    </div>
  );
}

// ============================================================
// COURSES
// ============================================================
const NEW_COURSE = {
  title: '', subtitle: '', description: '', category: '', level: 'all_levels', trainer_id: '', duration_weeks: 8,
  days_per_week: 3, estimated_minutes_per_session: 60, price: '0', is_included_with_pro: false, is_featured: false,
  promo_video_url: '', status: 'draft', status_label: 'Draft', total_enrolled: 0, modules: [],
};

function CoursesTab({ onChanged }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);
  const { data, loading, refetch } = useApi(
    () => adminService.coursesAdmin({ q: q || undefined, status: status || undefined }), [q, status]);
  const { data: trainers } = useApi(() => adminService.trainersAdmin(), []);
  const list = Array.isArray(data) ? data : [];

  const open = async (c) => {
    try {
      setEditing(await adminService.courseAdmin(c.id));
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not open the course")));
    }
  };
  const saved = () => { refetch(); onChanged(); };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Chips options={COURSE_FILTERS} value={status} onChange={setStatus} />
        <div className="flex-1" />
        <input className={`${inputCls} md:w-64`} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={tl("Search title, category…")} aria-label={tl("Search courses")} />
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW_COURSE)}
          disabled={!trainers?.length} title={trainers?.length ? undefined : tl("Add a trainer first")}>{tl("+ New course")}</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-60 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty>{q || status ? tl("No courses match.") : tl("No courses yet.")}</Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => (
            <button key={c.id} type="button" onClick={() => open(c)}
              className="text-left bg-[#0e0e0f] border border-[#1a1a1e] hover:border-primary-container/60 rounded-lg overflow-hidden flex flex-col">
              <div className="relative h-36 bg-[#131316]">
                {c.cover_image_url && <img src={c.cover_image_url} alt="" className="w-full h-full object-cover" />}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${STATUS_TONE[c.status]}`}>{tl(c.status_label)}</span>
                {c.is_featured && <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[9px] font-bold uppercase">{tl("Featured")}</span>}
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <div className="text-on-surface font-bold">{c.title}</div>
                <div className="text-[11px] text-on-surface-variant">{c.category} · {c.level_label} · {c.trainer_name}</div>
                <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#1a1a1e] text-[12px]">
                  <span className="text-primary font-bold">{Number(c.price) > 0 ? formatSAR(c.price) : tl("Free")}{c.is_included_with_pro && tl(" · in plan")}</span>
                  <span className="text-on-surface-variant">{c.module_count}{' '}{tl("lessons ·")}{' '}{c.total_enrolled} enrolled</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {editing && <CourseEditor course={editing} trainers={trainers || []} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}

function CourseEditor({ course, trainers, onClose, onSaved }) {
  const [f, setF] = useState(() => ({ ...course, trainer_id: course.trainer_id || trainers[0]?.id || '' }));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v?.target ? v.target.value : v }));
  const setLesson = (i, k, v) => setF((p) => ({ ...p, modules: p.modules.map((m, j) => (j === i ? { ...m, [k]: v } : m)) }));
  const move = (i, d) => setF((p) => {
    const m = [...p.modules];
    [m[i], m[i + d]] = [m[i + d], m[i]];
    return { ...p, modules: m };
  });

  const save = async (status = f.status) => {
    setBusy(true);
    setErrors({});
    const body = {
      title: f.title, subtitle: f.subtitle, description: f.description, category: f.category, level: f.level,
      trainer_id: f.trainer_id, duration_weeks: f.duration_weeks, days_per_week: f.days_per_week,
      estimated_minutes_per_session: f.estimated_minutes_per_session, price: f.price || 0,
      is_included_with_pro: f.is_included_with_pro, is_featured: f.is_featured, promo_video_url: f.promo_video_url,
      modules: f.modules.map(({ id, title, description, week_number, day_number, duration_minutes, video_url, pdf_url }) => ({
        id, title, description, week_number, day_number, duration_minutes, video_url, pdf_url })),
    };
    try {
      const row = f.id ? await adminService.updateCourse(f.id, { ...body, status }) : await adminService.createCourse(body);
      toast.success(f.id && status !== f.status ? tl("Course {0}", { 0: row.status_label.toLowerCase() }) : 'Course saved');
      setF(row);
      onSaved();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl("Could not save the course")));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(tl("Delete “{0}”? This can’t be undone.", { 0: f.title }))) return;
    try {
      await adminService.deleteCourse(f.id);
      toast.success(tl("Course deleted"));
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not delete the course")));
    }
  };

  const upload = async (file) => {
    try {
      const row = await adminService.uploadCourseCover(f.id, file);
      setF((p) => ({ ...p, cover_image_url: row.cover_image_url }));
      toast.success(tl("Cover updated"));
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, tl("Upload failed")));
      throw err;
    }
  };

  return (
    <Drawer open title={f.id ? f.title : tl("New course")} onClose={onClose}
      subtitle={f.id ? tl("{0} · {1} enrolled", { 0: f.status_label, 1: f.total_enrolled }) : tl("Saved as a draft — members see it once you publish.")}
      footer={<>
        {f.id && f.total_enrolled === 0 && <button type="button" className={btn.danger} onClick={remove}>{tl("Delete")}</button>}
        <div className="flex-1" />
        {f.id && f.status === 'published' && <button type="button" className={btn.ghost} disabled={busy} onClick={() => save('archived')}>{tl("Archive")}</button>}
        {f.id && f.status === 'archived' && <button type="button" className={btn.ghost} disabled={busy} onClick={() => save('draft')}>{tl("Back to draft")}</button>}
        <button type="button" className={btn.ghost} disabled={busy} onClick={() => save()}>{busy ? tl("Saving…") : tl("Save")}</button>
        {f.id && f.status !== 'published' && <button type="button" className={btn.primary} disabled={busy} onClick={() => save('published')}>{tl("Publish")}</button>}
      </>}>
      {f.id ? (
        <ImageUploader label={tl("Cover")} url={f.cover_image_url} customized={!!f.cover_image_url} onUpload={upload} />
      ) : (
        <p className="text-[12px] text-on-surface-variant">{tl("You can add a cover image after the first save.")}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label={tl("Title")} error={errors.title} className="md:col-span-2"><input className={inputCls} value={f.title} onChange={set('title')} /></Field>
        <Field label={tl("Subtitle")} error={errors.subtitle} className="md:col-span-2"><input className={inputCls} value={f.subtitle} onChange={set('subtitle')} /></Field>
        <Field label={tl("Description")} error={errors.description} className="md:col-span-2">
          <textarea className={inputCls} rows={4} value={f.description} onChange={set('description')} /></Field>
        <Field label={tl("Trainer")} error={errors.trainer_id}>
          <select className={inputCls} value={f.trainer_id} onChange={set('trainer_id')}>
            {trainers.map((t) => <option key={t.id} value={t.id}>{t.user_name}{t.is_active ? '' : tl(" (hidden)")}</option>)}
          </select></Field>
        <Field label={tl("Category")} error={errors.category}><input className={inputCls} value={f.category} onChange={set('category')} placeholder={tl("Strength")} /></Field>
        <Field label={tl("Level")} error={errors.level}>
          <select className={inputCls} value={f.level} onChange={set('level')}>
            {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select></Field>
        <Field label={tl("Price (SAR, 0 = free)")} error={errors.price}><input className={inputCls} inputMode="decimal" value={f.price} onChange={set('price')} /></Field>
        <Field label={tl("Weeks")} error={errors.duration_weeks}><input className={inputCls} type="number" min="1" max="104" value={f.duration_weeks} onChange={set('duration_weeks')} /></Field>
        <Field label={tl("Days per week")} error={errors.days_per_week}><input className={inputCls} type="number" min="1" max="7" value={f.days_per_week} onChange={set('days_per_week')} /></Field>
        <Field label={tl("Minutes per session")} error={errors.estimated_minutes_per_session}>
          <input className={inputCls} type="number" min="5" max="300" value={f.estimated_minutes_per_session} onChange={set('estimated_minutes_per_session')} /></Field>
        <Field label={tl("Promo video link")} error={errors.promo_video_url}><input className={inputCls} value={f.promo_video_url} onChange={set('promo_video_url')} placeholder="https://…" /></Field>
      </div>
      <div className="flex flex-col gap-2">
        <Toggle label={tl("Included with plans that include courses")} hint={tl("Those members enrol without paying.")} checked={f.is_included_with_pro} onChange={set('is_included_with_pro')} />
        <Toggle label={tl("Featured")} hint={tl("Shown first in the member portal.")} checked={f.is_featured} onChange={set('is_featured')} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={labelCls}>{tl("Lessons (")}{f.modules.length})</span>
          <button type="button" className={btn.ghost}
            onClick={() => setF((p) => ({ ...p, modules: [...p.modules, { title: '', description: '', week_number: 1, day_number: 1, duration_minutes: 30, video_url: '', pdf_url: '' }] }))}>
            {tl("+ Add lesson")}
          </button>
        </div>
        {errors.modules && <span className="text-[11px] text-rose-400">{errors.modules}</span>}
        {f.modules.length === 0 && <p className="text-[12px] text-on-surface-variant">{tl("A course needs at least one lesson before it can be published.")}</p>}
        {f.modules.map((m, i) => (
          <div key={m.id ?? `new-${i}`} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-3 grid grid-cols-6 gap-2">
            <Field label={tl("Lesson {0}", { 0: i + 1 })} className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.title} onChange={(e) => setLesson(i, 'title', e.target.value)} /></Field>
            <Field label={tl("Week")}><input className={inputCls} type="number" min="1" value={m.week_number} onChange={(e) => setLesson(i, 'week_number', e.target.value)} /></Field>
            <Field label={tl("Day")}><input className={inputCls} type="number" min="1" max="7" value={m.day_number} onChange={(e) => setLesson(i, 'day_number', e.target.value)} /></Field>
            <Field label={tl("Min")}><input className={inputCls} type="number" min="1" value={m.duration_minutes} onChange={(e) => setLesson(i, 'duration_minutes', e.target.value)} /></Field>
            <Field label={tl("Video link")} className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.video_url} onChange={(e) => setLesson(i, 'video_url', e.target.value)} placeholder="https://…" /></Field>
            <Field label={tl("PDF link")} className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.pdf_url} onChange={(e) => setLesson(i, 'pdf_url', e.target.value)} placeholder="https://…" /></Field>
            <Field label={tl("Notes")} className="col-span-6">
              <textarea className={inputCls} rows={2} value={m.description} onChange={(e) => setLesson(i, 'description', e.target.value)} /></Field>
            <div className="col-span-6 flex gap-2 justify-end">
              <button type="button" className={btn.ghost} disabled={i === 0} onClick={() => move(i, -1)} aria-label={tl("Move lesson up")}>↑</button>
              <button type="button" className={btn.ghost} disabled={i === f.modules.length - 1} onClick={() => move(i, 1)} aria-label={tl("Move lesson down")}>↓</button>
              <button type="button" className={btn.danger}
                onClick={() => setF((p) => ({ ...p, modules: p.modules.filter((_, j) => j !== i) }))}>{tl("Remove")}</button>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
