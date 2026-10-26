import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { workoutsService } from '../services/workoutsService';
import QrScanner from './QrScanner';
import { machineTagFrom } from '../utils/machineQr';
import { tl } from '../i18n';

const EASE = [0.22, 1, 0.36, 1];

// Every machine carries a QR sticker (admin → Machines). Scanning it, or typing
// its code, opens that machine's guide and set logger.
export default function ScannerCard() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [looking, setLooking] = useState(false);

  const openMachine = useCallback(async (raw) => {
    const tag = machineTagFrom(raw);
    if (!tag) return;
    setScanning(false);
    setLooking(true);
    try {
      const ex = await workoutsService.exerciseByQR(tag);
      toast.success(tl("Found: {0}", { 0: ex.name }));
      navigate(`/dashboard/machine-guide?qr=${encodeURIComponent(tag)}`);
    } catch {
      toast.error(tl("No machine matches that code"));
    } finally {
      setLooking(false);
    }
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="lg:col-span-4 flex flex-col justify-between bg-surface-container-low rounded-xl p-space-lg relative overflow-hidden shadow-xl gap-space-md"
    >
      <div className="absolute -right-16 -top-16 w-44 h-44 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-1 relative z-10">
        <span className="font-label-md text-label-md uppercase tracking-widest text-primary">{tl("Machine Scanner")}</span>
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide m-0">{tl("Scan a machine")}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {tl("Scan the QR sticker on any machine to open its guide and log your sets.")}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setScanning(true)}
        disabled={looking}
        className="relative z-10 w-full bg-surface-container-lowest p-space-md rounded-lg flex flex-col items-center justify-center gap-space-sm text-center hover:bg-surface-container transition-colors"
      >
        <span className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_24px_rgba(229,25,55,0.35)]">
          <span className="material-symbols-outlined text-[32px]">{looking ? 'sync' : 'qr_code_scanner'}</span>
        </span>
        <span className="font-title-md text-title-md text-on-surface uppercase tracking-wider">
          {looking ? tl("Looking up…") : tl("Open camera")}
        </span>
      </button>

      <form
        className="relative z-10 flex flex-col gap-space-xs"
        onSubmit={(e) => { e.preventDefault(); openMachine(code); }}
      >
        <label htmlFor="machineCode" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
          {tl("Or type the machine code")}
        </label>
        <div className="flex gap-space-xs">
          <input
            id="machineCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={tl("Code printed under the QR")}
            autoComplete="off"
            className="flex-1 min-w-0 bg-surface-container-lowest text-on-surface px-space-sm py-space-xs rounded border border-surface-container-high focus:outline-none focus:border-primary"
          />
          <button type="submit" disabled={looking || !code.trim()}
            className="px-space-md rounded bg-primary-container text-on-primary-container font-label-lg uppercase tracking-wider font-bold disabled:opacity-50">
            {tl("Open")}
          </button>
        </div>
      </form>

      <div className="relative z-10 flex items-center justify-between text-on-surface-variant font-label-md text-label-md uppercase">
        <Link to="/dashboard/profile#pass" className="flex items-center gap-1 hover:text-primary">
          <span className="material-symbols-outlined text-[16px]">badge</span>{' '}{tl("My entry pass")}
        </Link>
        <Link to="/dashboard/machine-guide" className="flex items-center gap-1 hover:text-primary">
          <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>{' '}{tl("All machines")}
        </Link>
      </div>

      <QrScanner
        open={scanning}
        title={tl("Scan machine QR")}
        manualLabel={tl("Or type the machine code")}
        onResult={openMachine}
        onClose={() => setScanning(false)}
      />
    </motion.div>
  );
}
