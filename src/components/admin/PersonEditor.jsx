// src/components/admin/PersonEditor.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Drawer, ImageUploader } from '../site/SiteUi';
import { btn, inputCls, labelCls } from '../site/siteStyles';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { tl } from '../../i18n';
import SaudiPhoneInput from '../SaudiPhoneInput';

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
      <input
        type="checkbox"
        className="mt-1"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        {label}
        {hint && <span className="block text-[11px] text-on-surface-variant">{hint}</span>}
      </span>
    </label>
  );
}

export default function PersonEditor({ person: trainer, kind = 'trainer', api, onClose, onSaved }) {
  const isTrainer = kind === 'trainer';
  const noun = isTrainer ? tl('trainer') : tl('nutritionist');
  const [f, setF] = useState(() => ({ ...trainer, specialties: (trainer.specialties || []).join(', ') }));
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v?.target ? v.target.value : v }));

  const save = async () => {
    setBusy(true);
    setErrors({});
    const body = {
      first_name: f.first_name,
      last_name: f.last_name,
      phone: f.phone || '',
      title: f.title,
      credentials: f.credentials,
      bio: f.bio,
      specialties: f.specialties,
      years_experience: f.years_experience,
      hourly_rate: f.hourly_rate || 0,
      is_verified: f.is_verified,
      is_accepting_clients: f.is_accepting_clients,
      is_active: f.is_active,
      ...(isTrainer ? { offers_1on1: f.offers_1on1 } : {}),
    };
    try {
      const row = f.id ? await api.update(f.id, body) : await api.create({ ...body, email: f.email });
      toast.success(
        f.id ? tl('Saved') : tl('{0} added — you can add a photo now', { 0: row.user_name })
      );
      onSaved();
      if (f.id) onClose();
      else {
        setCreated(true);
        setF({ ...row, specialties: row.specialties.join(', ') });
      }
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl('Could not save the {0}', { 0: noun })));
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file) => {
    try {
      const row = await api.upload(f.id, file);
      setF((p) => ({ ...p, photo_url: row.photo_url }));
      toast.success(tl('Photo updated'));
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err, tl('Upload failed')));
      throw err;
    }
  };

  const remove = async () => {
    if (!window.confirm(tl('Delete {0}? This can’t be undone.', { 0: f.user_name }))) return;
    setBusy(true);
    try {
      await api.remove(f.id);
      toast.success(tl('{0} deleted', { 0: f.user_name }));
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, tl('Could not delete')), { duration: 7000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer
      open
      title={f.id ? f.user_name : tl('Add {0}', { 0: noun })}
      onClose={onClose}
      subtitle={f.id ? f.user_email : tl('They appear in the member portal once saved (unless hidden).')}
      footer={
        <>
          {f.id && api.remove && (
            <button type="button" className={btn.danger} disabled={busy} onClick={remove}>
              {tl('Delete')}
            </button>
          )}
          <div className="flex-1" />
          <button type="button" className={btn.ghost} onClick={onClose}>
            {created ? tl('Done') : tl('Cancel')}
          </button>
          <button type="button" className={btn.primary} disabled={busy} onClick={save}>
            {busy ? tl('Saving…') : tl('Save')}
          </button>
        </>
      }
    >
      {f.id ? (
        <div className="max-w-[220px]">
          <ImageUploader
            label={tl('Photo')}
            aspect="aspect-square"
            url={f.photo_url}
            customized={!!f.photo_url}
            onUpload={upload}
          />
        </div>
      ) : (
        <p className="text-[12px] text-on-surface-variant">{tl('You can add a photo after saving.')}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {!f.id && (
          <Field label={tl('Email')} error={errors.email} className="md:col-span-2">
            <input
              className={inputCls}
              type="email"
              value={f.email}
              onChange={set('email')}
              placeholder={tl('coach@example.com')}
              aria-invalid={!!errors.email}
            />
            <span className="text-[11px] text-on-surface-variant">
              {tl('If this email already has an account, it becomes the {0}’s.', { 0: noun })}
            </span>
          </Field>
        )}
        <Field label={tl('First name')} error={errors.first_name}>
          <input
            className={inputCls}
            value={f.first_name}
            onChange={set('first_name')}
            aria-invalid={!!errors.first_name}
          />
        </Field>
        <Field label={tl('Last name')} error={errors.last_name}>
          <input
            className={inputCls}
            value={f.last_name}
            onChange={set('last_name')}
            aria-invalid={!!errors.last_name}
          />
        </Field>
        <Field label={tl('Title')} error={errors.title}>
          <input
            className={inputCls}
            value={f.title}
            onChange={set('title')}
            placeholder={tl('Strength & conditioning coach')}
            aria-invalid={!!errors.title}
          />
        </Field>
        <Field label={tl('Phone')} error={errors.phone}>
          <SaudiPhoneInput
            value={f.phone || ''}
            onChange={(phone) => setF((p) => ({ ...p, phone }))}
            aria-invalid={!!errors.phone}
          />
        </Field>
        <Field label={tl('Credentials')} error={errors.credentials}>
          <input
            className={inputCls}
            value={f.credentials}
            onChange={set('credentials')}
            placeholder={tl('NASM-CPT, CSCS')}
            aria-invalid={!!errors.credentials}
          />
        </Field>
        <Field label={tl('Years of experience')} error={errors.years_experience}>
          <input
            className={inputCls}
            type="number"
            min="0"
            max="60"
            value={f.years_experience}
            onChange={set('years_experience')}
            aria-invalid={!!errors.years_experience}
          />
        </Field>
        <Field label={tl('Specialties (comma separated)')} error={errors.specialties} className="md:col-span-2">
          <input
            className={inputCls}
            value={f.specialties}
            onChange={set('specialties')}
            placeholder={tl('Powerlifting, Mobility, Weight loss')}
            aria-invalid={!!errors.specialties}
          />
        </Field>
        <Field label={tl('Bio')} error={errors.bio} className="md:col-span-2">
          <textarea
            className={inputCls}
            rows={4}
            value={f.bio}
            onChange={set('bio')}
            aria-invalid={!!errors.bio}
          />
        </Field>
        <Field
          label={isTrainer ? tl('1:1 session price per hour (SAR)') : tl('Consultation price per hour (SAR)')}
          error={errors.hourly_rate}
        >
          <input
            className={inputCls}
            inputMode="decimal"
            value={f.hourly_rate}
            onChange={set('hourly_rate')}
            aria-invalid={!!errors.hourly_rate}
          />
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <Toggle
          label={tl('Verified')}
          hint={tl('Shows a verified badge to members.')}
          checked={f.is_verified}
          onChange={set('is_verified')}
        />
        {isTrainer && (
          <Toggle
            label={tl('Offers 1:1 sessions')}
            checked={f.offers_1on1}
            onChange={set('offers_1on1')}
          />
        )}
        <Toggle
          label={tl('Taking new clients')}
          hint={
            isTrainer
              ? tl('When off, members can’t book new sessions.')
              : tl('When off, members can’t request a plan.')
          }
          checked={f.is_accepting_clients}
          onChange={set('is_accepting_clients')}
        />
        <Toggle
          label={tl('Visible to members')}
          hint={tl('Hidden {0}s keep their history but disappear from the member portal.', { 0: noun })}
          checked={f.is_active}
          onChange={set('is_active')}
        />
      </div>
      {f.id && isTrainer && (
        <Link to="/admin/trainer-hours" className="text-[12px] text-primary underline w-fit">
          {tl('Set weekly booking hours →')}
        </Link>
      )}
    </Drawer>
  );
}