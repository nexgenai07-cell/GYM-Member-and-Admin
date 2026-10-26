import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tl } from '../../i18n';
import LangToggle from '../../i18n/LangToggle';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 420, damping: 30 };

const lineUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE },
  },
};

const fieldSwap = {
  initial: { opacity: 0, y: -10, height: 0, marginTop: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
    marginTop: 0,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.22, ease: EASE },
  },
};

const modes = [
  { key: 'password', label: tl("Password") },
  { key: 'otp', label: tl("OTP") },
];

export default function LoginForm({ onSubmit }) {
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    remember: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const inputBase =
    'w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg py-3 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_20px_rgba(229,25,55,0.12)] placeholder:text-on-surface-variant/40 transition-all duration-300';

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-space-2xl">
        <motion.span
          variants={lineUp}
          className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md tracking-widest uppercase mb-space-sm"
        >
          <motion.span
            className="material-symbols-outlined text-[14px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            lock
          </motion.span>
          {tl("Secure Sign In")}
        </motion.span>

        <motion.h1
          variants={lineUp}
          className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider leading-none mb-space-xs m-0"
        >
          {tl("Welcome Back,")}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-primary-container">
            {tl("Athlete")}
          </span>
        </motion.h1>
        <motion.p variants={lineUp} className="font-body-md text-body-md text-on-surface-variant">
          {tl("Sign in with your member credentials to access your performance dashboard.")}
        </motion.p>
      </div>

      {/* Mode toggle — shared sliding pill */}
      <motion.div
        variants={lineUp}
        className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg mb-space-lg"
      >
        {modes.map((m) => {
          const isActive = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`relative flex-1 py-space-xs rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="auth-mode-pill"
                  transition={SPRING}
                  className="absolute inset-0 rounded bg-primary-container shadow-[0_0_14px_rgba(229,25,55,0.35)]"
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Form */}
      <div className="flex justify-end"><LangToggle /></div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        {/* Email */}
        <motion.div variants={lineUp} className="flex flex-col gap-space-2xs">
          <label
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            htmlFor="email"
          >
            {tl("Email Address")}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px] pointer-events-none z-10 transition-colors duration-300">
              alternate_email
            </span>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={tl("athlete@smartgym.com")}
              className={`${inputBase} pl-11 pr-4`}
            />
          </div>
        </motion.div>

        {/* Password / OTP — animated swap */}
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'password' ? (
            <motion.div
              key="password-mode"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-space-2xs"
            >
              <div className="flex items-center justify-between">
                <label
                  className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
                  htmlFor="password"
                >
                  {tl("Password")}
                </label>
                <Link
                  to="/forgot-password"
                  className="font-label-md text-label-md text-primary uppercase tracking-wider hover:underline"
                >
                  {tl("Forgot?")}
                </Link>
              </div>
              <div className="relative group">
                <motion.span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary text-[20px] pointer-events-none z-10 transition-colors duration-300"
                  animate={showPassword ? { rotate: [0, -12, 0] } : {}}
                >
                  key
                </motion.span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={tl("Enter your secure password")}
                  className={`${inputBase} pl-11 pr-12`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  whileTap={{ scale: 0.85 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label={showPassword ? tl("Hide password") : tl("Show password")}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? 'off' : 'on'}
                      initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
                      transition={{ duration: 0.18 }}
                      className="material-symbols-outlined text-[20px] inline-block"
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp-mode"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-space-2xs"
            >
              <label
                className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
                htmlFor="otp"
              >
                {tl("One-Time Code (6 digits)")}
              </label>
              <div className="relative group">
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => handleChange('otp', e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className={`${inputBase} font-headline-md text-headline-md text-center tracking-[0.5em] placeholder:animate-pulse`}
                />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {tl("A 6-digit code will be sent to your registered email")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remember + Biometric */}
        <motion.div
          variants={lineUp}
          className="flex items-center justify-between flex-wrap gap-2"
        >
          <label className="group flex items-center gap-space-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => handleChange('remember', e.target.checked)}
              className="peer sr-only"
            />
            <motion.span
              whileTap={{ scale: 0.85 }}
              className="w-[18px] h-[18px] rounded-sm border-2 border-surface-container-highest bg-surface-container-low flex items-center justify-center peer-checked:bg-primary-container peer-checked:border-primary-container peer-checked:shadow-[0_0_10px_rgba(229,25,55,0.4)] transition-all duration-200"
            >
              <AnimatePresence>
                {formData.remember && (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={SPRING}
                    className="material-symbols-outlined text-[14px] text-on-primary-container font-bold"
                  >
                    check
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
              {tl("Keep me signed in")}
            </span>
          </label>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-space-2xs font-label-md text-label-md text-primary uppercase tracking-wider hover:underline"
          >
            <motion.span
              className="material-symbols-outlined text-[16px]"
              animate={{ y: [0, -1.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              fingerprint
            </motion.span>
            <span>{tl("Use Biometric")}</span>
          </motion.button>
        </motion.div>

        {/* Submit — pulse ring + shine sweep */}
        <motion.button
          variants={lineUp}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="relative w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest py-space-md rounded-lg shadow-[0_0_20px_rgba(229,25,55,0.4)] transition-colors flex items-center justify-center gap-space-xs mt-space-2xs overflow-hidden group"
        >
          <motion.span
            className="absolute inset-0 rounded-lg bg-primary-container/50 pointer-events-none"
            animate={{ scale: [1, 1.12], opacity: [0.35, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[320%] transition-transform duration-700 ease-out" />
          <motion.span
            className="material-symbols-outlined text-[20px] relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            login
          </motion.span>
          <span className="relative z-10">{tl("Access Dashboard")}</span>
        </motion.button>
      </form>

      {/* Divider — draws outward from center */}
      <motion.div
        variants={lineUp}
        className="flex items-center gap-space-md my-space-lg"
      >
        <motion.div
          className="flex-1 h-px bg-surface-container-high origin-right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        />
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
          {tl("Or Continue With")}
        </span>
        <motion.div
          className="flex-1 h-px bg-surface-container-high origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        />
      </motion.div>

      {/* Social login */}
      <motion.div
        variants={lineUp}
        className="grid grid-cols-2 gap-space-sm"
      >
        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="group flex items-center justify-center gap-space-xs py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high hover:border-surface-container-highest text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all duration-200"
        >
          <motion.svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </motion.svg>
          <span>{tl("Apple")}</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="group flex items-center justify-center gap-space-xs py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high hover:border-surface-container-highest text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>{tl("Google")}</span>
        </motion.button>
      </motion.div>

      {/* Sign up */}
      <motion.div
        variants={lineUp}
        className="text-center mt-space-xl font-body-md text-body-md text-on-surface-variant"
      >
        {tl("New to Smart Gym?")}{' '}
        <Link
          to="/signup"
          className="text-primary font-title-md text-title-md uppercase tracking-wider hover:underline underline-offset-4 decoration-primary-container/50"
        >
          {tl("Create Account")}
        </Link>
      </motion.div>

      {/* Security footer — with scanning shield */}
      <motion.div
        variants={lineUp}
        className="flex items-center justify-center gap-space-sm mt-space-xl pt-space-lg border-t border-surface-container-high"
      >
        <span className="relative inline-flex">
          <motion.span
            className="material-symbols-outlined text-primary text-[16px]"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            verified_user
          </motion.span>
          <motion.span
            className="absolute inset-0 rounded-full border border-primary/40"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        </span>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {tl("256-bit SSL Encrypted · 2FA Supported")}
        </span>
      </motion.div>
    </motion.div>
  );
}