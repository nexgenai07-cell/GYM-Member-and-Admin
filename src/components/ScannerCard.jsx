import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 400, damping: 22 };

export default function ScannerCard({ onStartWorkout, starting = false }) {
  const [rigCode, setRigCode] = useState('');
  const [synced, setSynced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSynced(true);
    setTimeout(() => {
      setSynced(false);
      setRigCode('');
    }, 2000);
  };

  const corners = [
    'top-0 left-0 border-t-2 border-l-2',
    'top-0 right-0 border-t-2 border-r-2',
    'bottom-0 left-0 border-b-2 border-l-2',
    'bottom-0 right-0 border-b-2 border-r-2',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="lg:col-span-4 flex flex-col justify-between bg-surface-container-low rounded-xl p-space-lg relative overflow-hidden shadow-xl"
    >
      {/* Breathing ambient glow */}
      <motion.div
        className="absolute -right-16 -top-16 w-44 h-44 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="flex flex-col gap-space-md relative z-10">
        <div className="flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
            className="font-label-md text-label-md uppercase tracking-widest text-primary"
          >
            Instant Terminal Access
          </motion.span>
          <span className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-space-xs py-space-2xs rounded">
            <motion.span
              className="w-2 h-2 rounded-full bg-primary-container"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            LIVE
          </span>
        </div>

        <div className="flex flex-col">
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide m-0">
            Floor Telemetry &amp; Scanner
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Pair with any Titan Smart Rack or Kiosk within 3 meters.
          </p>
        </div>

        {/* Beacon */}
        <div className="relative w-full bg-surface-container-lowest p-space-md rounded-lg flex flex-col items-center justify-center gap-space-sm text-center overflow-hidden">
          {/* Viewfinder corners */}
          {corners.map((pos) => (
            <motion.span
              key={pos}
              className={`absolute w-4 h-4 border-primary-container/50 ${pos}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
            />
          ))}
          {/* Scanning sweep line */}
          <motion.div
            className="absolute top-2 bottom-2 w-16 bg-gradient-to-r from-transparent via-primary-container/15 to-transparent pointer-events-none"
            animate={{ left: ['-15%', '105%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative flex items-center justify-center my-space-xs">
            <span className="absolute w-16 h-16 rounded-full bg-primary-container/20 animate-ping" />
            <span
              className="absolute w-16 h-16 rounded-full bg-primary-container/10 animate-ping"
              style={{ animationDelay: '0.7s' }}
            />
            <motion.span
              className="absolute w-24 h-24 rounded-full border border-dashed border-primary-container/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span
              className="absolute w-28 h-28 rounded-full border border-primary-container/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(229,25,55,0.35)',
                  '0 0 26px 6px rgba(229,25,55,0.25)',
                  '0 0 0 0 rgba(229,25,55,0.35)',
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-md">
                qr_code_scanner
              </span>
            </motion.button>
          </div>
          <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
            Launch Optical Reader
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant">
            Tap sensor or enter 4-digit rig code below
          </span>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-space-xs" onSubmit={handleSubmit}>
          <label
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            htmlFor="rigCodeInput"
          >
            Manual Rig ID
          </label>
          <div className="flex gap-space-xs">
            <div className="relative flex-1">
              <input
                id="rigCodeInput"
                type="text"
                maxLength={6}
                placeholder={synced ? 'SYNCED: TR-402' : 'e.g. TR-402'}
                value={rigCode}
                onChange={(e) => setRigCode(e.target.value)}
                className={`w-full bg-surface-container-lowest text-on-surface font-title-md text-title-md px-space-sm py-space-xs rounded focus:outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container/50 uppercase placeholder:text-surface-container-highest tracking-widest transition-all ${
                  synced ? 'ring-2 ring-primary-container shadow-[0_0_16px_rgba(229,25,55,0.25)]' : ''
                }`}
              />
              <AnimatePresence mode="wait">
                {synced ? (
                  <motion.span
                    key="ok"
                    initial={{ scale: 0, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={SPRING}
                    className="material-symbols-outlined absolute right-space-xs top-2.5 text-primary text-title-md"
                  >
                    check_circle
                  </motion.span>
                ) : (
                  <motion.span
                    key="pin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="material-symbols-outlined absolute right-space-xs top-2.5 text-on-surface-variant text-title-md"
                  >
                    pin
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-space-md py-space-xs bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider rounded hover:opacity-90 shadow-[0_4px_16px_rgba(229,25,55,0.25)] transition-all"
            >
              Connect
            </motion.button>
          </div>
        </form>
      </div>

      {/* Footer links */}
      <div className="pt-space-md mt-space-md flex items-center justify-between relative z-10">
        <button
          type="button"
          className="group flex items-center gap-space-2xs text-on-surface-variant hover:text-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-body-lg transition-transform duration-200 group-hover:scale-110">
            sensors
          </span>
          Auto-NFC Tag
        </button>
        <button
          type="button"
          className="group flex items-center gap-space-2xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-body-lg transition-transform duration-200 group-hover:scale-110">
            help_outline
          </span>
          Kiosk Guide
        </button>
      </div>
    </motion.div>
  );
}