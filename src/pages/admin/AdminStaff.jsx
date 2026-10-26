// src/pages/admin/AdminStaff.jsx
// The team roster: roles, departments, shift hours, status. Admins and managers can sign in to
// this portal (they're emailed a temporary password); other roles are listed for scheduling.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Drawer, Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { tl, locale } from '../../i18n';

const ROLES = [['admin', tl("Admin")], ['manager', tl("Manager")], ['trainer', tl("Trainer")], ['nutritionist', tl("Nutritionist")], ['receptionist', tl("Receptionist")]];
const DEPARTMENTS = [['executive', tl("Executive")], ['operations', tl("Operations")], ['coaching', tl("Coaching")], ['clinical', tl("Clinical")], ['front_desk', tl("Front desk")], ['facility', tl("Facility")]];
const STATUSES = [['active', tl("Active")], ['off_shift', tl("Off shift")], ['on_leave', tl("On leave")], ['suspended', tl("Suspended")]];
const DEFAULT_DEPT = { admin: 'executive', manager: 'operations', trainer: 'coaching', nutritionist: 'clinical', receptionist: 'front_desk' };
const STATUS_TONE = {
  active: 'bg-emerald-500/15 text-emerald-400', off_shift: 'bg-neutral-500/20 text-on-surface-variant',
  on_leave: 'bg-amber-500/15 text-amber-400', suspended: 'bg-rose-500/15 text-rose-400',
};
const NEW = { email: '', first_name: '', last_name: '', phone: '', role: 'receptionist', department: 'front_desk',
  status: 'active', shift_start: '', shift_end: '', joined_at: '', notes: '' };

export default function AdminStaff() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);

  const { data, loading, refetch } = useApi(
    () => adminService.staffAdmin({ role: role || undefined, search: search || undefined, status: status || undefined }),
    [role, search, status]);
  const { data: stats, refetch: refetchStats } = useApi(() => adminService.staffStats(), []);
  const list = Array.isArray(data) ? data : [];
  const isAdmin = user?.role === 'admin';
  const saved = () => { refetch(); refetchStats(); };

  const tiles = [
    [tl("Team"), stats?.total], [tl("On shift now"), stats?.on_shift_now], [tl("On leave"), stats?.on_leave],
    [tl("Hours not set"), stats?.hours_not_set], [tl("Avg time with us"), stats ? `${stats.avg_tenure_years} yrs` : undefined],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title={tl("Staff")} subtitle={tl("Your team, their shifts, and who can sign in to this admin portal.")}>
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW)}>{tl("+ Add staff")}</button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3">
            <div className="text-[22px] font-bold text-on-surface">{value ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {[['', tl("All roles")], ...ROLES].map(([id, label]) => (
            <button key={id || 'all'} type="button" onClick={() => setRole(id)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                role === id ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <select className={`${inputCls} lg:w-44`} value={status} onChange={(e) => setStatus(e.target.value)} aria-label={tl("Status")}>
          <option value="">{tl("Any status")}</option>
          <option value="on_shift">{tl("On shift now")}</option>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input className={`${inputCls} lg:w-64`} value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={tl("Search name, email, phone…")} aria-label={tl("Search staff")} />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-[#0e0e0f] rounded animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <Empty>{search || role || status ? tl("No one matches.") : tl("No staff yet.")}</Empty>
      ) : (
        <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1a1a1e] text-left text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3">{tl("Name")}</th><th className="px-4 py-3">{tl("Role")}</th><th className="px-4 py-3">{tl("Department")}</th>
                <th className="px-4 py-3">{tl("Shift")}</th><th className="px-4 py-3">{tl("Status")}</th><th className="px-4 py-3">{tl("Admin sign-in")}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} onClick={() => setEditing(s)} className="border-b border-[#1a1a1e] last:border-0 hover:bg-[#131316] cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#1a1a1e] text-on-surface-variant grid place-items-center font-bold text-[12px] shrink-0">{s.initials}</div>
                      <div className="min-w-0">
                        <button type="button" className="text-on-surface font-bold truncate hover:underline text-left" onClick={(e) => { e.stopPropagation(); setEditing(s); }}>
                          {s.user_name}{s.id === user?.id && <span className="text-on-surface-variant font-normal">{' '}{tl("(you)")}</span>}
                        </button>
                        <div className="text-[11px] text-on-surface-variant truncate">{s.user_email}{s.phone && ` · ${s.phone}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{tl(s.role_label)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{tl(s.department_label)}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-on-surface-variant whitespace-nowrap">
                    {s.shift_display}
                    {s.on_shift && <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-bold uppercase font-sans">{tl("On now")}</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${STATUS_TONE[s.status]}`}>{tl(s.status_label)}</span></td>
                  <td className="px-4 py-3 text-[12px] text-on-surface-variant">
                    {s.can_sign_in ? (s.last_login ? tl("Last {0}", { 0: new Date(s.last_login).toLocaleDateString(locale) }) : tl("Invited")) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <StaffEditor person={editing} me={user} isAdmin={isAdmin} onClose={() => setEditing(null)} onSaved={saved} />}
    </div>
  );
}

function Field({ label, error, hint, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
      {hint && <span className="text-[11px] text-on-surface-variant">{hint}</span>}
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </label>
  );
}

function StaffEditor({ person, me, isAdmin, onClose, onSaved }) {
  const isNew = !person.id;
  const isMe = person.id === me?.id;
  const locked = !isAdmin && ['admin', 'manager'].includes(person.role);   // managers can't edit admins/managers
  const [f, setF] = useState(person);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const roles = isAdmin ? ROLES : ROLES.filter(([r]) => !['admin', 'manager'].includes(r));

  const save = async () => {
    setBusy(true);
    setErrors({});
    const body = {
      first_name: f.first_name, last_name: f.last_name, phone: f.phone, role: f.role,
      status: f.status, shift_start: f.shift_start || null, shift_end: f.shift_end || null,
      joined_at: f.joined_at || null, notes: f.notes,
    };
    try {
      const row = isNew ? await adminService.createStaff({ ...body, email: f.email }) : await adminService.updateStaff(person.id, body);
      if (row.warning) toast.error(row.warning, { duration: 8000 });
      else if (row.can_sign_in && (isNew || !person.can_sign_in)) toast.success(tl("Saved — sign-in details emailed to {0}", { 0: row.user_email }));
      else toast.success(isNew ? tl("{0} added", { 0: row.user_name }) : 'Saved');
      onSaved();
      onClose();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl("Could not save")));
    } finally {
      setBusy(false);
    }
  };

  const sendSignIn = async () => {
    setBusy(true);
    try {
      toast.success((await adminService.sendStaffSignIn(person.id)).detail);
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not send the email")));
    } finally {
      setBusy(false);
    }
  };

  const portalRole = ['admin', 'manager'].includes(f.role);

  return (
    <Drawer open title={isNew ? tl("Add staff") : person.user_name} onClose={onClose}
      subtitle={isNew ? tl("Admins and managers get an email to sign in here.") : person.user_email}
      footer={locked ? <button type="button" className={btn.ghost} onClick={onClose}>{tl("Close")}</button> : <>
        {!isNew && portalRole && person.status !== 'suspended' && (
          <button type="button" className={btn.ghost} disabled={busy} onClick={sendSignIn}>
            {person.can_sign_in ? tl("Reset password by email") : tl("Send sign-in email")}
          </button>
        )}
        <div className="flex-1" />
        <button type="button" className={btn.ghost} onClick={onClose}>{tl("Cancel")}</button>
        <button type="button" className={btn.primary} disabled={busy} onClick={save}>{busy ? tl("Saving…") : tl("Save")}</button>
      </>}>
      {locked && <p className="text-[12px] text-amber-300">{tl("Only an admin can change admins and managers.")}</p>}
      <fieldset disabled={locked} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isNew && (
          <Field label={tl("Email")} error={errors.email} className="md:col-span-2"
            hint={tl("If this email already has a member account, it’s moved onto the team.")}>
            <input className={inputCls} type="email" value={f.email} onChange={set('email')} />
          </Field>
        )}
        <Field label={tl("First name")} error={errors.first_name}><input className={inputCls} value={f.first_name} onChange={set('first_name')} /></Field>
        <Field label={tl("Last name")} error={errors.last_name}><input className={inputCls} value={f.last_name} onChange={set('last_name')} /></Field>
        <Field label={tl("Phone")} error={errors.phone}><input className={inputCls} value={f.phone} onChange={set('phone')} /></Field>
        <Field label={tl("Role")} error={errors.role}
          hint={portalRole ? tl("Can sign in to this admin portal.") : tl("Listed for scheduling — no admin sign-in.")}>
          <select className={inputCls} value={f.role} disabled={isMe}
            onChange={(e) => setF((p) => ({ ...p, role: e.target.value, department: DEFAULT_DEPT[e.target.value] }))}>
            {(roles.some(([r]) => r === f.role) ? roles : ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label={tl("Department")} hint={tl("Set by the role.")}>
          <input className={`${inputCls} opacity-70 cursor-not-allowed`} readOnly aria-readonly="true" tabIndex={-1}
            value={(DEPARTMENTS.find(([v]) => v === (DEFAULT_DEPT[f.role] || f.department)) || [])[1] || ''} />
        </Field>
        <Field label={tl("Status")} error={errors.status} hint={f.status === 'suspended' ? tl("Suspended accounts can’t sign in.") : undefined}>
          <select className={inputCls} value={f.status} onChange={set('status')} disabled={isMe}>
            {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label={tl("Shift starts (gym time)")} error={errors.shift_start}><input className={inputCls} type="time" value={f.shift_start} onChange={set('shift_start')} /></Field>
        <Field label={tl("Shift ends")} error={errors.shift_end} hint={tl("Overnight shifts can end the next morning.")}><input className={inputCls} type="time" value={f.shift_end} onChange={set('shift_end')} /></Field>
        <Field label={tl("Started on")} error={errors.joined_at}><input className={inputCls} type="date" value={f.joined_at || ''} onChange={set('joined_at')} /></Field>
        <Field label={tl("Notes (staff only)")} error={errors.notes} className="md:col-span-2">
          <textarea className={inputCls} rows={3} value={f.notes} onChange={set('notes')} />
        </Field>
      </fieldset>
      {!isNew && f.role === 'trainer' && (
        <Link to="/admin/trainers" className="text-[12px] text-primary underline w-fit">
          {person.has_trainer_profile ? tl("Edit their trainer profile →") : tl("Set up their trainer profile so members can book them →")}
        </Link>
      )}
    </Drawer>
  );
}
