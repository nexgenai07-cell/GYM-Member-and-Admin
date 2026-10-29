// src/pages/member/ChangePassword.jsx
// Lets a member change their password. Also shown standalone ("forced") when the
// account has must_change_password set, e.g. after an admin reset.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { tl } from '../../i18n';
import { homeFor, loginFor } from '../../utils/roleHome';

const MIN_LENGTH = 8;   // backend: Django MinimumLengthValidator

const inputBase =
  'w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg py-3 pl-11 pr-12 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all duration-300';

const EMPTY = { current: '', next: '', confirm: '' };

// DRF returns { field: ["msg", …] } or { field: "msg" } or { detail: "msg" }.
const firstMessage = (value) => (Array.isArray(value) ? value.join(' ') : value || '');

function PasswordField({ id, label, value, onChange, show, autoComplete, error }) {
  return (
    <div className="flex flex-col gap-space-2xs">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
          key
        </span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className={`${inputBase} ${error ? 'border-error focus:border-error focus:ring-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="font-body-sm text-[12px] text-error">{error}</span>
      )}
    </div>
  );
}

/**
 * @param {boolean} forced  rendered standalone (no member layout) while the account
 *                          has must_change_password set
 */
export default function ChangePassword({ forced = false }) {
  const { refreshUser, logout, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '', form: '' }));
  };

  const rules = [
    { ok: form.next.length >= MIN_LENGTH, label: tl("At least {0} characters", { 0: MIN_LENGTH }) },
    { ok: form.next !== '' && !/^\d+$/.test(form.next), label: tl("Not only numbers") },
    { ok: form.next !== '' && form.next !== form.current, label: tl("Different from the current password") },
    { ok: form.confirm !== '' && form.confirm === form.next, label: tl("Both new passwords match") },
  ];
  const ready = form.current !== '' && rules.every((r) => r.ok);

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || saving) return;
    setSaving(true);
    setErrors({});
    try {
      await authService.changePassword(form.current, form.next, form.confirm);
      setForm(EMPTY);
      toast.success(tl("Password changed"));
      if (forced) {
        try {
          const me = await refreshUser();        // clears must_change_password → the portal unlocks
          navigate(homeFor(me), { replace: true });
        } catch {
          window.location.assign('/');   // password IS changed; the root sends each account to its portal
        }
        return;
      }
      setDone(true);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        setErrors({
          current: firstMessage(data.old_password),
          next: firstMessage(data.new_password),
          confirm: firstMessage(data.new_password_confirm),
          form: firstMessage(data.detail),
        });
      } else {
        setErrors({ form: 'Could not change the password. Check your connection and try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    const where = loginFor(user);
    await logout();
    navigate(where, { replace: true });
  };

  return (
    <div className={`w-full px-space-xl pb-space-2xl pt-space-xl flex justify-center ${forced ? 'min-h-screen items-center bg-background' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[560px] bg-surface-container rounded-lg shadow-md p-space-xl flex flex-col gap-space-lg"
      >
        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[28px]">lock_reset</span>
          <div>
            <h1 className="font-headline-md text-[22px] text-on-surface uppercase tracking-wider">{tl("Change password")}</h1>
            <p className="font-body-sm text-on-surface-variant text-[13px] mt-space-2xs">
              {forced
                ? tl("For your security, please choose a new password before continuing.")
                : tl("Enter your current password, then choose a new one.")}
            </p>
          </div>
        </div>

        {done ? (
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm p-space-md rounded-lg bg-primary-container/10 border border-primary-container/30">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <span className="font-body-md text-on-surface">
                {tl("Your password has been changed. Use the new one next time you log in.")}
              </span>
            </div>
            <Link to={homeFor(user) === '/dashboard' ? '/dashboard/profile' : homeFor(user)}
              className="font-label-md text-label-md uppercase tracking-widest text-primary hover:underline">
              {homeFor(user) === '/dashboard' ? tl("Back to profile") : tl("Back to dashboard")}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-space-md" noValidate>
            <PasswordField id="current-password" label={tl("Current password")} value={form.current}
              onChange={set('current')} show={show} autoComplete="current-password" error={errors.current} />
            <PasswordField id="new-password" label={tl("New password")} value={form.next}
              onChange={set('next')} show={show} autoComplete="new-password" error={errors.next} />
            <PasswordField id="confirm-password" label={tl("Confirm new password")} value={form.confirm}
              onChange={set('confirm')} show={show} autoComplete="new-password" error={errors.confirm} />

            <label className="flex items-center gap-space-xs font-body-sm text-[13px] text-on-surface-variant cursor-pointer w-fit">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-primary" />
              {tl("Show passwords")}
            </label>

            <ul className="flex flex-col gap-space-2xs" aria-label={tl("Password requirements")}>
              {rules.map((r) => (
                <li key={r.label} className={`flex items-center gap-space-xs font-body-sm text-[12px] ${r.ok ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined text-[16px] ${r.ok ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                    {r.ok ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {r.label}
                </li>
              ))}
              <li className="font-body-sm text-[12px] text-on-surface-variant/70 pl-[22px]">
                {tl("Very common passwords, or ones too close to your name or email, are also rejected.")}
              </li>
            </ul>

            {errors.form && (
              <div role="alert" className="font-body-sm text-[13px] text-error">{errors.form}</div>
            )}

            <button
              type="submit"
              disabled={!ready || saving}
              className="w-full bg-primary-container hover:bg-secondary-container disabled:opacity-40 disabled:cursor-not-allowed text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest py-space-md rounded-lg transition-colors"
            >
              {saving ? tl("Saving…") : tl("Change password")}
            </button>

            {forced && (
              <button
                type="button"
                onClick={signOut}
                className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {tl("Log out")}
              </button>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
