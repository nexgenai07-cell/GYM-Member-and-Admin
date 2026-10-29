// src/components/auth/LoginForm.jsx
// Member sign-in: email + password with errors shown under each field, and a working
// "Forgot?" link. Memberships are bought on the public website, so "Join" links there.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tl } from '../../i18n';
import LangToggle from '../../i18n/LangToggle';
import { emailError, onlyErrors } from '../../utils/validate';

const EASE = [0.22, 1, 0.36, 1];
const PUBLIC_SITE = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://smart-gym-three.vercel.app';

const lineUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
};

/**
 * @param {function} onSubmit  ({ email, password }) => Promise
 * @param {boolean} loading
 * @param {string} serverError  message from the last failed sign-in (shown above the button)
 */
export default function LoginForm({ onSubmit, loading = false, serverError = '' }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const change = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = onlyErrors({
      email: emailError(form.email),
      password: form.password ? '' : tl('Password is required.'),
    });
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit?.({ email: form.email.trim(), password: form.password });
  };

  const inputBase = 'w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg py-3 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-on-surface-variant/40 transition-all duration-300';
  const tone = (bad) => (bad ? 'border-error focus:border-error focus:ring-error' : 'border-surface-container-high focus:border-primary focus:ring-primary');

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="w-full">
      <div className="mb-space-xl">
        <motion.span variants={lineUp}
          className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md tracking-widest uppercase mb-space-sm">
          <span className="material-symbols-outlined text-[14px]">lock</span>{tl("Secure Sign In")}
        </motion.span>
        <motion.h1 variants={lineUp} className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider leading-none mb-space-xs m-0">
          {tl("Welcome Back,")}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-primary-container">{tl("Athlete")}</span>
        </motion.h1>
        <motion.p variants={lineUp} className="font-body-md text-body-md text-on-surface-variant">
          {tl("Sign in with your member credentials to access your performance dashboard.")}
        </motion.p>
      </div>

      <div className="flex justify-end mb-2"><LangToggle /></div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-md">
        <motion.div variants={lineUp} className="flex flex-col gap-space-2xs">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="email">{tl("Email Address")}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px] pointer-events-none z-10">alternate_email</span>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => change('email', e.target.value)}
              placeholder={tl("athlete@smartgym.com")} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
              className={`${inputBase} ${tone(errors.email)} ps-11 pe-4`} />
          </div>
          {errors.email && <span id="email-error" role="alert" className="text-[12px] text-error">{errors.email}</span>}
        </motion.div>

        <motion.div variants={lineUp} className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="password">{tl("Password")}</label>
            <Link to="/forgot-password" className="font-label-md text-label-md text-primary uppercase tracking-wider hover:underline">{tl("Forgot?")}</Link>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px] pointer-events-none z-10">key</span>
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password}
              onChange={(e) => change('password', e.target.value)} placeholder={tl("Enter your secure password")}
              aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
              className={`${inputBase} ${tone(errors.password)} ps-11 pe-12`} />
            <button type="button" onClick={() => setShowPassword((s) => !s)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label={showPassword ? tl("Hide password") : tl("Show password")}>
              <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.password && <span id="password-error" role="alert" className="text-[12px] text-error">{errors.password}</span>}
        </motion.div>

        <AnimatePresence>
          {serverError && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert"
              className="flex items-start gap-2 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-[13px] text-error">
              <span className="material-symbols-outlined text-[18px]">error</span><span>{serverError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button variants={lineUp} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
          className="relative w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest py-space-md rounded-lg shadow-[0_0_20px_rgba(229,25,55,0.4)] transition-colors flex items-center justify-center gap-space-xs mt-space-2xs disabled:opacity-60">
          <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'login'}</span>
          <span>{loading ? tl("Signing in…") : tl("Access Dashboard")}</span>
        </motion.button>
      </form>

      <motion.div variants={lineUp} className="text-center mt-space-xl font-body-md text-body-md text-on-surface-variant">
        {tl("New to Smart Gym?")}{' '}
        <a href={`${PUBLIC_SITE}/join`} className="text-primary font-title-md text-title-md uppercase tracking-wider hover:underline underline-offset-4">
          {tl("Get a membership")}
        </a>
      </motion.div>

      <motion.div variants={lineUp} className="flex items-center justify-center gap-space-sm mt-space-xl pt-space-lg border-t border-surface-container-high">
        <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{tl("Encrypted connection")}</span>
      </motion.div>
    </motion.div>
  );
}
