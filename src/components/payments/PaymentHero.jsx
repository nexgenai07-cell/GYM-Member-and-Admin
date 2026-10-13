import { motion } from 'framer-motion';
import { currentPlan } from '../../data/payments';

export default function PaymentHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-surface-container-low rounded-xl p-space-xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-space-lg"
    >
      <div className="absolute -right-16 -top-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-64 h-32 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-space-xs z-10">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-md text-label-md tracking-widest uppercase font-bold">
            Encrypted Ledger
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Athlete ID #8841-TK
          </span>
        </div>

        <div className="flex items-baseline gap-space-md flex-wrap">
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider m-0">
            Billing & Financial Architecture
          </h1>
          <span className="text-primary font-headline-md text-headline-md uppercase tracking-wider">
            / Cycle 2024-2025
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Real-time payment routing, multi-node terminal syncing, automated locker-credit
          disbursements, and tax invoicing logs.
        </p>
      </div>

      <div className="z-10 flex flex-col items-start md:items-end bg-surface-container-lowest px-space-lg py-space-md rounded-lg shadow-md">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          Active Subscription
        </span>
        <div className="flex items-center gap-space-xs mt-space-2xs">
          <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
            {currentPlan.name} Tier
          </span>
          <span className="text-primary font-title-lg text-title-lg">
            ${currentPlan.price.toFixed(2)}
          </span>
          <span className="text-on-surface-variant font-body-md text-body-md">
            /{currentPlan.interval}
          </span>
        </div>
        <div className="flex items-center gap-space-2xs mt-space-2xs">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-md text-label-md text-primary tracking-wide uppercase">
            Auto-Renews Nov 15, 2025
          </span>
        </div>
      </div>
    </motion.div>
  );
}