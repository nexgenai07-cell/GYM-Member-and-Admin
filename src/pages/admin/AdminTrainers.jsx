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
import { errorMessage, fieldErrors } from '../../utils/apiError';

const TRAINER_FILTERS = [['', 'All'], ['verified', 'Verified'], ['unverified', 'Not verified'], ['hidden', 'Hidden']];
const COURSE_FILTERS = [['', 'All'], ['published', 'Published'], ['draft', 'Drafts'], ['pending', 'In review'], ['archived', 'Archived']];
const LEVELS = [['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced'], ['all_levels', 'All levels']];
const STATUS_TONE = {
  published: 'bg-emerald-500/15 text-emerald-400', draft: 'bg-neutral-500/20 text-on-surface-variant',
  pending: 'bg-amber-500/15 text-amber-400', archived: 'bg-rose-500/15 text-rose-400',
};

export default function AdminTrainers() {
  const [tab, setTab] = useState('trainers');
  const { data: tStats, refetch: refetchTStats } = useApi(() => adminService.trainerStats(), []);
  const { data: cStats, refetch: refetchCStats } = useApi(() => adminService.courseStats(), []);

  const tiles = [
    ['Trainers', tStats?.total], ['Verified', tStats?.verified], ['Taking clients', tStats?.accepting],
    ['Published courses', cStats?.published], ['Enrolments', cStats?.enrollments],
    ['Course sales', cStats ? formatSAR(cStats.course_revenue) : undefined],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title="Trainers & Courses" subtitle="Who members can book, and the programmes they can buy.">
        <Link to="/admin/trainer-hours" className={btn.ghost}>Weekly hours & 1:1 prices</Link>
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
        {[['trainers', 'Trainers'], ['courses', 'Courses']].map(([id, label]) => (
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
          placeholder="Search name, email, title…" aria-label="Search trainers" />
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW_TRAINER)}>+ Add trainer</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty>{search || status ? 'No trainers match.' : 'No trainers yet — add your first one.'}</Empty>
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
                    {t.is_verified && <span className="material-symbols-outlined text-primary text-[16px]" title="Verified">verified</span>}
                  </div>
                  <div className="text-[11px] text-on-surface-variant truncate">{t.title}</div>
                </div>
                {!t.is_active && <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[9px] font-bold uppercase">Hidden</span>}
              </div>
              {t.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.specialties.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-[#131316] text-on-surface-variant text-[10px]">{s}</span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-3 mt-auto border-t border-[#1a1a1e] text-[12px]">
                <Mini label="1:1 rate" value={t.offers_1on1 ? `${formatSAR(t.hourly_rate)}/h` : 'No 1:1'} />
                <Mini label="Courses" value={t.courses} />
                <Mini label="Upcoming" value={t.upcoming_sessions} />
              </div>
              <div className="text-[11px] text-on-surface-variant">
                {t.total_reviews ? `★ ${t.rating.toFixed(1)} · ${t.total_reviews} reviews` : 'No reviews yet'}
                {!t.is_accepting_clients && ' · not taking new clients'}
              </div>
            </button>
          ))}
        </div>
      )}

      {editing && <TrainerEditor trainer={editing} onClose={() => setEditing(null)} onSaved={saved} />}
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

function TrainerEditor({ trainer, onClose, onSaved }) {
  const [f, setF] = useState(() => ({ ...trainer, specialties: (trainer.specialties || []).join(', ') }));
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v?.target ? v.target.value : v }));

  const save = async () => {
    setBusy(true);
    setErrors({});
    const body = {
      first_name: f.first_name, last_name: f.last_name, phone: f.phone || '', title: f.title, credentials: f.credentials,
      bio: f.bio, specialties: f.specialties, years_experience: f.years_experience, hourly_rate: f.hourly_rate || 0,
      is_verified: f.is_verified, is_accepting_clients: f.is_accepting_clients, offers_1on1: f.offers_1on1, is_active: f.is_active,
    };
    try {
      const row = f.id ? await adminService.updateTrainer(f.id, body) : await adminService.createTrainer({ ...body, email: f.email });
      toast.success(f.id ? 'Trainer saved' : `${row.user_name} added — you can add a photo now`);
      onSaved();
      if (f.id) onClose();
      else { setCreated(true); setF({ ...row, specialties: row.specialties.join(', ') }); }   // stay open for the photo
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, 'Could not save the trainer'));
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file) => {
    try {
      const row = await adminService.uploadTrainerPhoto(f.id, file);
      setF((p) => ({ ...p, photo_url: row.photo_url }));
      toast.success('Photo updated');
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
      throw err;
    }
  };

  return (
    <Drawer open title={f.id ? f.user_name || 'Trainer' : 'Add trainer'} onClose={onClose}
      subtitle={f.id ? f.user_email : 'They appear in the member portal once saved (unless hidden).'}
      footer={<>
        <button type="button" className={btn.ghost} onClick={onClose}>{created ? 'Done' : 'Cancel'}</button>
        <button type="button" className={btn.primary} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </>}>
      {f.id ? (
        <div className="max-w-[220px]">
          <ImageUploader label="Photo" aspect="aspect-square" url={f.photo_url} customized={!!f.photo_url} onUpload={upload} />
        </div>
      ) : (
        <p className="text-[12px] text-on-surface-variant">You can add a photo after saving.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {!f.id && (
          <Field label="Email" error={errors.email} className="md:col-span-2">
            <input className={inputCls} type="email" value={f.email} onChange={set('email')} placeholder="coach@example.com" />
            <span className="text-[11px] text-on-surface-variant">If this email already has an account, it becomes the trainer’s.</span>
          </Field>
        )}
        <Field label="First name" error={errors.first_name}><input className={inputCls} value={f.first_name} onChange={set('first_name')} /></Field>
        <Field label="Last name" error={errors.last_name}><input className={inputCls} value={f.last_name} onChange={set('last_name')} /></Field>
        <Field label="Title" error={errors.title}><input className={inputCls} value={f.title} onChange={set('title')} placeholder="Strength & conditioning coach" /></Field>
        <Field label="Phone" error={errors.phone}><input className={inputCls} value={f.phone || ''} onChange={set('phone')} /></Field>
        <Field label="Credentials" error={errors.credentials}><input className={inputCls} value={f.credentials} onChange={set('credentials')} placeholder="NASM-CPT, CSCS" /></Field>
        <Field label="Years of experience" error={errors.years_experience}>
          <input className={inputCls} type="number" min="0" max="60" value={f.years_experience} onChange={set('years_experience')} /></Field>
        <Field label="Specialties (comma separated)" error={errors.specialties} className="md:col-span-2">
          <input className={inputCls} value={f.specialties} onChange={set('specialties')} placeholder="Powerlifting, Mobility, Weight loss" /></Field>
        <Field label="Bio" error={errors.bio} className="md:col-span-2">
          <textarea className={inputCls} rows={4} value={f.bio} onChange={set('bio')} /></Field>
        <Field label="1:1 session price per hour (SAR)" error={errors.hourly_rate}>
          <input className={inputCls} inputMode="decimal" value={f.hourly_rate} onChange={set('hourly_rate')} /></Field>
      </div>
      <div className="flex flex-col gap-2">
        <Toggle label="Verified" hint="Shows a verified badge to members." checked={f.is_verified} onChange={set('is_verified')} />
        <Toggle label="Offers 1:1 sessions" checked={f.offers_1on1} onChange={set('offers_1on1')} />
        <Toggle label="Taking new clients" hint="When off, members can’t book new sessions." checked={f.is_accepting_clients} onChange={set('is_accepting_clients')} />
        <Toggle label="Visible to members" hint="Hidden trainers keep their history but disappear from the member portal." checked={f.is_active} onChange={set('is_active')} />
      </div>
      {f.id && <Link to="/admin/trainer-hours" className="text-[12px] text-primary underline w-fit">Set weekly booking hours →</Link>}
    </Drawer>
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
      toast.error(errorMessage(err, 'Could not open the course'));
    }
  };
  const saved = () => { refetch(); onChanged(); };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Chips options={COURSE_FILTERS} value={status} onChange={setStatus} />
        <div className="flex-1" />
        <input className={`${inputCls} md:w-64`} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, category…" aria-label="Search courses" />
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW_COURSE)}
          disabled={!trainers?.length} title={trainers?.length ? undefined : 'Add a trainer first'}>+ New course</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-60 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty>{q || status ? 'No courses match.' : 'No courses yet.'}</Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => (
            <button key={c.id} type="button" onClick={() => open(c)}
              className="text-left bg-[#0e0e0f] border border-[#1a1a1e] hover:border-primary-container/60 rounded-lg overflow-hidden flex flex-col">
              <div className="relative h-36 bg-[#131316]">
                {c.cover_image_url && <img src={c.cover_image_url} alt="" className="w-full h-full object-cover" />}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${STATUS_TONE[c.status]}`}>{c.status_label}</span>
                {c.is_featured && <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[9px] font-bold uppercase">Featured</span>}
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <div className="text-on-surface font-bold">{c.title}</div>
                <div className="text-[11px] text-on-surface-variant">{c.category} · {c.level_label} · {c.trainer_name}</div>
                <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#1a1a1e] text-[12px]">
                  <span className="text-primary font-bold">{Number(c.price) > 0 ? formatSAR(c.price) : 'Free'}{c.is_included_with_pro && ' · in plan'}</span>
                  <span className="text-on-surface-variant">{c.module_count} lessons · {c.total_enrolled} enrolled</span>
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
      toast.success(f.id && status !== f.status ? `Course ${row.status_label.toLowerCase()}` : 'Course saved');
      setF(row);
      onSaved();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, 'Could not save the course'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete “${f.title}”? This can’t be undone.`)) return;
    try {
      await adminService.deleteCourse(f.id);
      toast.success('Course deleted');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the course'));
    }
  };

  const upload = async (file) => {
    try {
      const row = await adminService.uploadCourseCover(f.id, file);
      setF((p) => ({ ...p, cover_image_url: row.cover_image_url }));
      toast.success('Cover updated');
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
      throw err;
    }
  };

  return (
    <Drawer open title={f.id ? f.title : 'New course'} onClose={onClose}
      subtitle={f.id ? `${f.status_label} · ${f.total_enrolled} enrolled` : 'Saved as a draft — members see it once you publish.'}
      footer={<>
        {f.id && f.total_enrolled === 0 && <button type="button" className={btn.danger} onClick={remove}>Delete</button>}
        <div className="flex-1" />
        {f.id && f.status === 'published' && <button type="button" className={btn.ghost} disabled={busy} onClick={() => save('archived')}>Archive</button>}
        {f.id && f.status === 'archived' && <button type="button" className={btn.ghost} disabled={busy} onClick={() => save('draft')}>Back to draft</button>}
        <button type="button" className={btn.ghost} disabled={busy} onClick={() => save()}>{busy ? 'Saving…' : 'Save'}</button>
        {f.id && f.status !== 'published' && <button type="button" className={btn.primary} disabled={busy} onClick={() => save('published')}>Publish</button>}
      </>}>
      {f.id ? (
        <ImageUploader label="Cover" url={f.cover_image_url} customized={!!f.cover_image_url} onUpload={upload} />
      ) : (
        <p className="text-[12px] text-on-surface-variant">You can add a cover image after the first save.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Title" error={errors.title} className="md:col-span-2"><input className={inputCls} value={f.title} onChange={set('title')} /></Field>
        <Field label="Subtitle" error={errors.subtitle} className="md:col-span-2"><input className={inputCls} value={f.subtitle} onChange={set('subtitle')} /></Field>
        <Field label="Description" error={errors.description} className="md:col-span-2">
          <textarea className={inputCls} rows={4} value={f.description} onChange={set('description')} /></Field>
        <Field label="Trainer" error={errors.trainer_id}>
          <select className={inputCls} value={f.trainer_id} onChange={set('trainer_id')}>
            {trainers.map((t) => <option key={t.id} value={t.id}>{t.user_name}{t.is_active ? '' : ' (hidden)'}</option>)}
          </select></Field>
        <Field label="Category" error={errors.category}><input className={inputCls} value={f.category} onChange={set('category')} placeholder="Strength" /></Field>
        <Field label="Level" error={errors.level}>
          <select className={inputCls} value={f.level} onChange={set('level')}>
            {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select></Field>
        <Field label="Price (SAR, 0 = free)" error={errors.price}><input className={inputCls} inputMode="decimal" value={f.price} onChange={set('price')} /></Field>
        <Field label="Weeks" error={errors.duration_weeks}><input className={inputCls} type="number" min="1" max="104" value={f.duration_weeks} onChange={set('duration_weeks')} /></Field>
        <Field label="Days per week" error={errors.days_per_week}><input className={inputCls} type="number" min="1" max="7" value={f.days_per_week} onChange={set('days_per_week')} /></Field>
        <Field label="Minutes per session" error={errors.estimated_minutes_per_session}>
          <input className={inputCls} type="number" min="5" max="300" value={f.estimated_minutes_per_session} onChange={set('estimated_minutes_per_session')} /></Field>
        <Field label="Promo video link" error={errors.promo_video_url}><input className={inputCls} value={f.promo_video_url} onChange={set('promo_video_url')} placeholder="https://…" /></Field>
      </div>
      <div className="flex flex-col gap-2">
        <Toggle label="Included with plans that include courses" hint="Those members enrol without paying." checked={f.is_included_with_pro} onChange={set('is_included_with_pro')} />
        <Toggle label="Featured" hint="Shown first in the member portal." checked={f.is_featured} onChange={set('is_featured')} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={labelCls}>Lessons ({f.modules.length})</span>
          <button type="button" className={btn.ghost}
            onClick={() => setF((p) => ({ ...p, modules: [...p.modules, { title: '', description: '', week_number: 1, day_number: 1, duration_minutes: 30, video_url: '', pdf_url: '' }] }))}>
            + Add lesson
          </button>
        </div>
        {errors.modules && <span className="text-[11px] text-rose-400">{errors.modules}</span>}
        {f.modules.length === 0 && <p className="text-[12px] text-on-surface-variant">A course needs at least one lesson before it can be published.</p>}
        {f.modules.map((m, i) => (
          <div key={m.id ?? `new-${i}`} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-3 grid grid-cols-6 gap-2">
            <Field label={`Lesson ${i + 1}`} className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.title} onChange={(e) => setLesson(i, 'title', e.target.value)} /></Field>
            <Field label="Week"><input className={inputCls} type="number" min="1" value={m.week_number} onChange={(e) => setLesson(i, 'week_number', e.target.value)} /></Field>
            <Field label="Day"><input className={inputCls} type="number" min="1" max="7" value={m.day_number} onChange={(e) => setLesson(i, 'day_number', e.target.value)} /></Field>
            <Field label="Min"><input className={inputCls} type="number" min="1" value={m.duration_minutes} onChange={(e) => setLesson(i, 'duration_minutes', e.target.value)} /></Field>
            <Field label="Video link" className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.video_url} onChange={(e) => setLesson(i, 'video_url', e.target.value)} placeholder="https://…" /></Field>
            <Field label="PDF link" className="col-span-6 md:col-span-3">
              <input className={inputCls} value={m.pdf_url} onChange={(e) => setLesson(i, 'pdf_url', e.target.value)} placeholder="https://…" /></Field>
            <Field label="Notes" className="col-span-6">
              <textarea className={inputCls} rows={2} value={m.description} onChange={(e) => setLesson(i, 'description', e.target.value)} /></Field>
            <div className="col-span-6 flex gap-2 justify-end">
              <button type="button" className={btn.ghost} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move lesson up">↑</button>
              <button type="button" className={btn.ghost} disabled={i === f.modules.length - 1} onClick={() => move(i, 1)} aria-label="Move lesson down">↓</button>
              <button type="button" className={btn.danger}
                onClick={() => setF((p) => ({ ...p, modules: p.modules.filter((_, j) => j !== i) }))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
