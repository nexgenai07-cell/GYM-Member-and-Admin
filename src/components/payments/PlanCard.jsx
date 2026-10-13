import { motion } from 'framer-motion';
import { currentPlan } from '../../data/payments';

export default function PlanCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative flex flex-col justify-between bg-surface-container-low rounded-xl p-space-lg shadow-lg overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />

      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              workspace_premium
            </span>
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Current Tier
            </span>
          </div>
          <span className="px-space-xs py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-label-md uppercase font-bold tracking-widest">
            {currentPlan.status}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {currentPlan.name}
            </span>
            <span className="font-headline-md text-headline-md text-primary">
              ${currentPlan.price}
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              / {currentPlan.interval}
            </span>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            {currentPlan.description}
          </span>
        </div>

        <div className="flex flex-col gap-space-xs pt-space-xs">
          {currentPlan.features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-space-xs text-on-surface font-body-md text-body-md"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                check_circle
              </span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-space-xs pt-space-lg">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded transition-all shadow-[0_0_16px_rgba(229,25,55,0.35)] flex items-center justify-center gap-space-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">upgrade</span>
          <span>Change Plan</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded transition-all flex items-center justify-center gap-space-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">pause</span>
          <span>Freeze Pass</span>
        </motion.button>
      </div>
    </motion.div>
  );
}