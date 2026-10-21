import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SessionSummaryDock({ onLog, logged }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full bg-surface-container-lowest rounded-xl p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-xs shadow-md"
    >
      <div className="flex items-center gap-space-md">
        <div className="w-12 h-12 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-headline-md">fact_check</span>
        </div>
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-on-surface">
            Train this module
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Start a workout, then log your sets on the dashboard or by scanning each machine.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-sm w-full sm:w-auto">
        <Link
          to="/dashboard/machine-guide"
          className="flex-1 sm:flex-initial px-space-lg py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors font-label-lg text-label-lg uppercase text-center"
        >
          Machine guide
        </Link>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onLog}
          className={`flex-1 sm:flex-initial px-space-2xl py-space-sm rounded-lg transition-all shadow-lg font-label-lg text-label-lg uppercase flex items-center justify-center gap-space-xs ${
            logged
              ? 'bg-surface-container-highest text-primary'
              : 'bg-primary-container hover:bg-secondary-container text-on-primary-container'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-title-md"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {logged ? 'done_all' : 'cloud_upload'}
          </span>
          <span>{logged ? 'Session Logged!' : 'Log Workout'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}