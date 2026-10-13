import { motion } from 'framer-motion';
import { lockerCredit } from '../../data/payments';

export default function LockerCreditCard({ onRecharge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative flex flex-col justify-between bg-surface-container-low rounded-xl p-space-lg shadow-lg"
    >
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              account_balance_wallet
            </span>
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Locker Credit & Balance
            </span>
          </div>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-md text-label-md uppercase font-bold tracking-wider">
            Live
          </span>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-baseline gap-space-xs">
            <span className="font-display-xl text-display-xl text-on-surface leading-none">
              ${lockerCredit.balance.toFixed(2)}
            </span>
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">
              USD
            </span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Instant spend balance for Monolith Fuel Bar, Supplements & Recovery Gear
          </span>
        </div>

        <div className="flex flex-col gap-space-2xs pt-space-2xs">
          <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md uppercase">
            <span>Locker Reserve Cap (${lockerCredit.max} Max)</span>
            <span className="text-on-surface font-bold">
              {lockerCredit.allocation}% Allocation
            </span>
          </div>

          <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-container rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${lockerCredit.allocation}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>

          <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md pt-space-2xs flex-wrap gap-2">
            {lockerCredit.breakdown.map((b) => (
              <span key={b.label}>
                • {b.label}: ${b.amount.toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-space-lg">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRecharge}
          className="w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded transition-all shadow-[0_0_16px_rgba(229,25,55,0.35)] flex items-center justify-center gap-space-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Recharge Credit</span>
        </motion.button>
      </div>
    </motion.div>
  );
}