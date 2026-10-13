import { motion } from 'framer-motion';
import { paymentMethod } from '../../data/payments';

export default function CardMethod() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative flex flex-col justify-between bg-surface-container-low rounded-xl p-space-lg shadow-lg"
    >
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              credit_card
            </span>
            <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
              Settlement Channel
            </span>
          </div>
          <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase font-bold tracking-wider">
            Primary
          </span>
        </div>

        {/* Card visual */}
        <div className="relative p-space-md rounded-lg bg-surface-container-lowest overflow-hidden shadow-inner flex flex-col justify-between h-40">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <span className="font-label-md text-label-md tracking-widest text-primary uppercase font-bold">
              Smart Vault Card
            </span>
            <span className="font-headline-md text-headline-md tracking-wider text-on-surface italic">
              {paymentMethod.brand}
            </span>
          </div>

          <div className="z-10 flex flex-col">
            <span className="font-headline-md text-headline-md tracking-widest text-on-surface">
              •••• •••• •••• {paymentMethod.last4}
            </span>
            <div className="flex items-center justify-between text-on-surface-variant mt-space-2xs">
              <span className="font-label-md text-label-md uppercase tracking-wider">
                {paymentMethod.cardholder}
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider">
                Exp {paymentMethod.expiry}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-container-lowest p-space-sm rounded">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">
              verified_user
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              {paymentMethod.securityLabel}
            </span>
          </div>
          <span className="font-label-md text-label-md text-primary uppercase font-bold">
            {paymentMethod.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-space-xs pt-space-lg">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded transition-all flex items-center justify-center gap-space-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          <span>Update</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider py-space-sm rounded transition-all flex items-center justify-center gap-space-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_card</span>
          <span>Add Backup</span>
        </motion.button>
      </div>
    </motion.div>
  );
}