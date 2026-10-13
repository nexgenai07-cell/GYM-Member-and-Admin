// src/components/shop/ShopHero.jsx
import { motion } from 'framer-motion';

export default function ShopHero({ cartCount = 0, cartTotal = 0, onCheckout }) {
  const safeCount = Number(cartCount) || 0;
  const safeTotal = Number(cartTotal) || 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-space-xl pt-space-xl pb-space-lg bg-surface"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="max-w-3xl flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary-container font-bold">
              Apothecary &amp; Equipment Ordnance
            </span>
            <span className="text-surface-container-highest">/</span>
            <span className="font-label-md text-label-md uppercase text-outline tracking-wider">
              Locker Station 01 Direct
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg uppercase tracking-wide text-on-surface leading-none m-0">
            Titan Apothecary &amp; High-Performance Gear
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-2xs">
            Bio-calibrated supplements, elite lifting gear, and Smart Gym apparel
            available for immediate locker delivery or counter pickup.
          </p>
        </div>

        <div className="w-full lg:w-auto flex-shrink-0">
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-xl flex items-center justify-between sm:justify-start gap-space-lg relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-space-md relative">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-container relative">
                <span className="material-symbols-outlined text-2xl">
                  local_mall
                </span>
                {safeCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(229,25,55,0.8)]">
                    {safeCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-label-md text-label-md uppercase text-on-surface tracking-wider font-bold">
                    Locker Pickup: Station 01
                  </span>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Ready in 10 mins •{' '}
                  <strong className="text-on-surface">
                    {safeCount} Items (${safeTotal.toFixed(2)})
                  </strong>
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCheckout}
              className="bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase px-space-md py-space-sm rounded transition-all shadow-[0_0_16px_rgba(229,25,55,0.35)] flex items-center gap-space-2xs relative"
              type="button"
            >
              <span>Checkout</span>
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}