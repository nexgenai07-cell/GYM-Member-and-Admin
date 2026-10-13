import { motion, AnimatePresence } from 'framer-motion';
import { machineStatusColors, machineCategoryColors } from '../../data/adminMachines';

export default function MachineDetailsDrawer({ machine, onClose, onViewQR }) {
  if (!machine) return null;

  const status = machineStatusColors[machine.status];
  const category = machineCategoryColors[machine.category];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-screen w-full max-w-xl bg-surface-container-lowest border-l border-surface-container-high z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-container-high flex items-start justify-between">
          <div>
            <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
              Machine Details
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide">
              {machine.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status.label}
              </span>
              <span
                className={`inline-block px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${category.bg} ${category.text}`}
              >
                {category.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Image */}
          <div className="relative h-56 rounded-xl overflow-hidden bg-surface-container">
            <img
              src={machine.image}
              alt={machine.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Machine ID" value={machine.id} mono />
            <InfoRow label="QR Tag ID" value={machine.qrId} mono />
            <InfoRow label="Sector" value={machine.sector} />
            <InfoRow label="Station" value={machine.station} />
            <InfoRow label="Last Maintenance" value={machine.lastMaintenance} />
            <InfoRow
              label="Next Maintenance"
              value={machine.nextMaintenance}
              accent={machine.nextMaintenance.includes('Overdue') || machine.nextMaintenance.includes('Awaiting')}
            />
          </div>

          {/* Utilization */}
          <div className="bg-surface-container rounded-xl p-4">
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                Utilization Rate
              </span>
              <span className="font-headline-md text-headline-md text-primary">
                {machine.utilization}%
              </span>
            </div>
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-primary-container h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${machine.utilization}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Scan stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container rounded-lg p-4">
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider block">
                24h Scans
              </span>
              <span className="font-display-xl text-display-xl text-on-surface mt-1 block">
                {machine.scans24h}
              </span>
            </div>
            <div className="bg-surface-container rounded-lg p-4">
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider block">
                7d Scans
              </span>
              <span className="font-display-xl text-display-xl text-on-surface mt-1 block">
                {machine.scans7d}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onViewQR(machine)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                qr_code_2
              </span>
              <span>View QR Code</span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                construction
              </span>
              <span>Log Maintenance</span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Recalibrate Sensors</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function InfoRow({ label, value, mono, accent }) {
  return (
    <div className="bg-surface-container rounded-lg p-3">
      <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider block">
        {label}
      </span>
      <span
        className={`font-title-md text-title-md mt-1 block ${
          mono ? 'font-mono text-[13px]' : ''
        } ${accent ? 'text-primary' : 'text-on-surface'}`}
      >
        {value}
      </span>
    </div>
  );
}