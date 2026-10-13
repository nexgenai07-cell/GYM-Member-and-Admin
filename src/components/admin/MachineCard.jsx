import { motion } from 'framer-motion';
import { machineStatusColors, machineCategoryColors } from '../../data/adminMachines';

export default function MachineCard({ machine, onViewQR, onViewDetails, index }) {
  const status = machineStatusColors[machine.status];
  const category = machineCategoryColors[machine.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group bg-surface-container rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-surface-container-lowest">
        <img
          src={machine.image}
          alt={machine.name}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />

        {/* Status pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${machine.status === 'online' ? 'animate-pulse' : ''}`} />
            {status.label}
          </span>
        </div>

        {/* Category pill */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${category.bg} ${category.text}`}
          >
            {category.label}
          </span>
        </div>

        {/* QR badge bottom */}
        <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[14px]">
            qr_code_2
          </span>
          <span className="font-label-md text-[10px] text-on-surface tracking-wider">
            {machine.qrId}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              {machine.sector} · {machine.station}
            </span>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface leading-tight group-hover:text-primary transition-colors">
            {machine.name}
          </h3>
          <span className="font-label-md text-[10px] text-on-surface-variant/70 uppercase tracking-wider">
            ID: {machine.id}
          </span>
        </div>

        {/* Utilization bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              Utilization
            </span>
            <span
              className={`font-title-md text-title-md ${
                machine.utilization > 80
                  ? 'text-primary'
                  : machine.utilization > 50
                  ? 'text-on-surface'
                  : 'text-on-surface-variant'
              }`}
            >
              {machine.utilization}%
            </span>
          </div>
          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                machine.utilization > 80
                  ? 'bg-primary-container'
                  : machine.utilization > 50
                  ? 'bg-primary'
                  : 'bg-surface-bright'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${machine.utilization}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-container-lowest rounded-lg p-2">
            <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
              24h Scans
            </span>
            <span className="font-title-md text-title-md text-on-surface">
              {machine.scans24h}
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-lg p-2">
            <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
              7d Scans
            </span>
            <span className="font-title-md text-title-md text-on-surface">
              {machine.scans7d}
            </span>
          </div>
        </div>

        {/* Calibration row */}
        <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            Calibration
          </span>
          <span
            className={`font-label-md text-[10px] font-bold uppercase tracking-wider ${
              machine.calibration.includes('⚠️') ? 'text-error' : 'text-primary'
            }`}
          >
            {machine.calibration}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onViewQR(machine)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>View QR</span>
          </button>
          <button
            onClick={() => onViewDetails(machine)}
            className="w-10 h-10 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors"
            title="Details"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}