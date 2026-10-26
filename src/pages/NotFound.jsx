import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tl } from '../i18n';

export default function NotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-space-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-lg relative"
      >
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
        </div>

        <span className="font-display-xl text-[120px] md:text-[160px] leading-none text-primary-container tracking-tight">
          404
        </span>

        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-widest mt-2">
          {tl("Signal Lost")}
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-md">
          {tl("This path doesn't exist in the Titan Core network. Return to the dashboard to continue your training.")}
        </p>

        <div className="flex items-center gap-space-sm mt-space-xl flex-wrap justify-center">
          <Link
            to="/"
            className="px-space-lg py-space-sm rounded bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(229,25,55,0.4)] flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>{tl("Return Dashboard")}</span>
          </Link>
          <Link
            to="/login"
            className="px-space-lg py-space-sm rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-widest transition-all flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>{tl("Sign Out")}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}