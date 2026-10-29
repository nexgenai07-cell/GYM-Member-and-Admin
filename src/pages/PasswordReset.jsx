// src/pages/PasswordReset.jsx
// "Forgot password" (ask for an email link) and "Reset password" (the link from that email).
// Used by members (/forgot-password, /reset-password) and staff (/admin/…); `staff` only
// changes where "Back to sign in" goes.
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { emailError } from '../utils/validate';
import { errorMessage, fieldErrors } from '../utils/apiError';
import { tl } from '../i18n';
import LangToggle from '../i18n/LangToggle';

const inputCls = (bad) => `w-full bg-surface-container-low text-on-surface py-3 px-4 rounded-lg border focus:outline-none focus:ring-1 ${
  bad ? 'border-error focus:border-error focus:ring-error' : 'border-surface-container-high focus:border-primary focus:ring-primary'}`;

function Shell({ icon, title, intro, staff, children }) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container grid place-items-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">{icon}</span>
          </span>
          <LangToggle />
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">{title}</h1>
          <p className="text-on-surface-variant text-[14px] mt-1">{intro}</p>
        </div>
        {children}
        <Link to={staff ? '/admin/login' : '/login'} className="text-[13px] text-primary font-bold w-fit inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_back</span>{tl('Back to sign in')}
        </Link>
      </div>
    </div>
  );
}

function FieldError({ id, children }) {
  return children ? <span id={id} role="alert" className="text-[12px] text-error">{children}</span> : null;
}

export function ForgotPassword({ staff = false }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const msg = emailError(email);
    setError(msg);
    if (msg) return;
    setBusy(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      setSent(tl(res.detail));
    } catch (err) {
      setError(fieldErrors(err).email || errorMessage(err, tl('Couldn’t send the reset email. Please try again.')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell icon="lock_reset" staff={staff} title={tl('Forgot your password?')}
      intro={tl('Enter the email you sign in with. We’ll send you a link to choose a new password.')}>
      {sent ? (
        <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-[14px] text-emerald-200 flex gap-2">
          <span className="material-symbols-outlined">mark_email_read</span><span>{sent}</span>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] uppercase tracking-wider text-on-surface-variant">{tl('Email Address')}</span>
            <input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
              aria-invalid={!!error} aria-describedby={error ? 'fp-email-err' : undefined} className={inputCls(error)} />
            <FieldError id="fp-email-err">{error}</FieldError>
          </label>
          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-lg bg-primary-container text-on-primary-container font-bold uppercase tracking-wider text-[13px] disabled:opacity-60">
            {busy ? tl('Sending…') : tl('Send reset link')}
          </button>
        </form>
      )}
    </Shell>
  );
}

const RULES = [
  [(p) => p.length >= 8, 'At least 8 characters'],
  [(p) => p !== '' && !/^\d+$/.test(p), 'Not only numbers'],
];

export function ResetPassword({ staff = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';
  const [form, setForm] = useState({ next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (!uid || !token) {
    return (
      <Shell icon="link_off" staff={staff} title={tl('Link not valid')}
        intro={tl('This reset link is incomplete. Open the link from the email again, or ask for a new one.')}>
        <Link to={staff ? '/admin/forgot-password' : '/forgot-password'} className="w-full text-center py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-[13px]">
          {tl('Send a new link')}
        </Link>
      </Shell>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    const failed = RULES.find(([ok]) => !ok(form.next));
    if (!form.next) found.next = tl('Enter a new password.');
    else if (failed) found.next = tl('Password: {0}.', { 0: tl(failed[1]).toLowerCase() });
    if (form.next && form.confirm !== form.next) found.confirm = tl('The two passwords don’t match.');
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const res = await authService.resetPassword(uid, token, form.next, form.confirm);
      toast.success(tl(res.detail));
      navigate(res.login_path || (staff ? '/admin/login' : '/login'), { replace: true });
    } catch (err) {
      const f = fieldErrors(err);
      setErrors({ next: f.new_password, confirm: f.new_password_confirm, form: err?.response?.data?.detail ? tl(err.response.data.detail) : (!f.new_password && !f.new_password_confirm ? errorMessage(err) : '') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell icon="password" staff={staff} title={tl('Choose a new password')} intro={tl('Pick a password you don’t use anywhere else.')}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[12px] uppercase tracking-wider text-on-surface-variant">{tl('New password')}</span>
          <input type={show ? 'text' : 'password'} autoComplete="new-password" value={form.next}
            onChange={(e) => { setForm((x) => ({ ...x, next: e.target.value })); setErrors((x) => ({ ...x, next: '', form: '' })); }}
            aria-invalid={!!errors.next} aria-describedby={errors.next ? 'rp-next-err' : undefined} className={inputCls(errors.next)} />
          <FieldError id="rp-next-err">{errors.next}</FieldError>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] uppercase tracking-wider text-on-surface-variant">{tl('Confirm new password')}</span>
          <input type={show ? 'text' : 'password'} autoComplete="new-password" value={form.confirm}
            onChange={(e) => { setForm((x) => ({ ...x, confirm: e.target.value })); setErrors((x) => ({ ...x, confirm: '', form: '' })); }}
            aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? 'rp-confirm-err' : undefined} className={inputCls(errors.confirm)} />
          <FieldError id="rp-confirm-err">{errors.confirm}</FieldError>
        </label>
        <ul className="text-[12px] flex flex-col gap-1">
          {RULES.map(([ok, label]) => (
            <li key={label} className={`flex items-center gap-1.5 ${ok(form.next) ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined text-[16px]">{ok(form.next) ? 'check_circle' : 'radio_button_unchecked'}</span>{tl(label)}
            </li>
          ))}
        </ul>
        <label className="flex items-center gap-2 text-[13px] text-on-surface-variant">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />{tl('Show passwords')}
        </label>
        {errors.form && <div role="alert" className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-[13px] text-error">{errors.form}</div>}
        <button type="submit" disabled={busy}
          className="w-full py-3 rounded-lg bg-primary-container text-on-primary-container font-bold uppercase tracking-wider text-[13px] disabled:opacity-60">
          {busy ? tl('Saving…') : tl('Save new password')}
        </button>
      </form>
    </Shell>
  );
}
