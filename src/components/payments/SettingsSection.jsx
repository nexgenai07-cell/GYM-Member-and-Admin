import { motion } from 'framer-motion';
import { settings } from '../../data/payments';

function Toggle({ enabled, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
    </label>
  );
}

export default function SettingsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
      {/* Auto-Renew */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-surface-container-low rounded-xl p-space-lg shadow-lg flex flex-col justify-between gap-space-md"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">
                autorenew
              </span>
              <span className="font-title-md text-title-md text-on-surface">
                Auto-Renew Engine
              </span>
            </div>
            <Toggle enabled={settings.autoRenew.enabled} />
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
            {settings.autoRenew.description}
          </p>
        </div>

        <div className="flex items-center justify-between bg-surface-container p-space-sm rounded">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase">
            Grace Period Protection
          </span>
          <span className="font-label-md text-label-md text-primary font-bold uppercase">
            {settings.autoRenew.gracePeriod}
          </span>
        </div>
      </motion.div>

      {/* Biometric */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="bg-surface-container-low rounded-xl p-space-lg shadow-lg flex flex-col justify-between gap-space-md"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">
                fingerprint
              </span>
              <span className="font-title-md text-title-md text-on-surface">
                Biometric Turnstile Link
              </span>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-label-md text-label-md uppercase font-bold">
              Synced
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
            {settings.biometric.description}
          </p>
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between font-label-md text-label-md uppercase text-on-surface-variant">
            <span>Terminal Access Key</span>
            <span className="text-on-surface font-mono">
              {settings.biometric.terminalKey}
            </span>
          </div>

          <button className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider py-space-xs rounded transition-all flex items-center justify-center gap-space-2xs">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Re-verify Biometric Sync</span>
          </button>
        </div>
      </motion.div>

      {/* Corporate Tax */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-surface-container-low rounded-xl p-space-lg shadow-lg flex flex-col justify-between gap-space-md"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">
                domain
              </span>
              <span className="font-title-md text-title-md text-on-surface">
                Corporate Tax Invoicing
              </span>
            </div>
            <Toggle enabled={settings.corporateTax.enabled} />
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
            {settings.corporateTax.description}
          </p>
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between font-label-md text-label-md uppercase text-on-surface-variant">
            <span>Tax ID / Entity</span>
            <span className="text-on-surface-variant italic">
              Not Configured
            </span>
          </div>

          <button className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider py-space-xs rounded transition-all flex items-center justify-center gap-space-2xs">
            <span className="material-symbols-outlined text-[16px]">add_business</span>
            <span>Configure Tax Profile</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}