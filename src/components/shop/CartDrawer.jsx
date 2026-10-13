// src/components/shop/CartDrawer.jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  subtotal = 0,
  onCheckout,
  onUpdateQuantity,
  onRemove,
  isCheckingOut = false,
}) {
  const safeSubtotal = Number(subtotal) || 0;
  const discountPercent = items.length > 0 ? 15 : 0;
  const discount = (safeSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, safeSubtotal - discount);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-container-lowest z-50 shadow-2xl flex flex-col justify-between"
          >
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-lg">
                    inventory_2
                  </span>
                </div>
                <div>
                  <h3 className="font-title-md text-title-md uppercase text-on-surface tracking-wider">
                    Active Bay Dispatch
                  </h3>
                  <span className="font-label-md text-label-md text-primary uppercase">
                    Metro Campus • Station 01
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-space-lg flex flex-col gap-space-md">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-space-2xl text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-space-sm">
                    shopping_cart
                  </span>
                  <p className="font-title-md text-title-md text-on-surface-variant">
                    Your cart is empty
                  </p>
                  <p className="font-body-md text-body-md text-outline">
                    Add products to see them here
                  </p>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg gap-2"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-title-md text-title-md text-on-surface truncate">
                        {item.product?.name}
                      </span>
                      <span className="font-label-md text-label-md text-primary uppercase font-bold">
                        ${Number(item.product?.price || 0).toFixed(2)} each
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center"
                          type="button"
                        >
                          −
                        </button>
                        <span className="font-title-md text-title-md text-on-surface min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center"
                          type="button"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemove?.(item.id)}
                          className="ml-2 text-error text-[10px] uppercase font-bold hover:underline"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface tabular-nums">
                      ${Number(item.line_total).toFixed(2)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-space-lg bg-surface-container-low flex flex-col gap-space-md">
              <div className="p-space-sm bg-surface-container rounded flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-xl">
                    schedule
                  </span>
                  <span className="font-label-md text-label-md text-on-surface uppercase">
                    Estimated Staging
                  </span>
                </div>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  8-10 MINS
                </span>
              </div>

              <div className="flex flex-col gap-space-2xs text-on-surface-variant font-body-md">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface">${safeSubtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary font-bold">
                      Pro Member Credit (PRO15)
                    </span>
                    <span className="text-primary font-bold">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface font-title-lg text-title-lg pt-space-xs">
                  <span>Total</span>
                  <span className="text-primary font-bold">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onCheckout}
                disabled={items.length === 0 || isCheckingOut}
                className={`w-full font-label-lg text-label-lg uppercase py-space-md rounded transition-all flex items-center justify-center gap-space-xs ${
                  items.length === 0 || isCheckingOut
                    ? 'bg-surface-container-high text-outline cursor-not-allowed'
                    : 'bg-primary-container hover:bg-secondary-container text-on-primary-container shadow-[0_0_20px_rgba(229,25,55,0.4)]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined">send</span>
                <span>
                  {isCheckingOut ? 'Placing Order...' : 'Confirm Locker Dispatch'}
                </span>
              </motion.button>

              <span className="text-center font-label-md text-label-md text-outline uppercase tracking-wider">
                Charges apply directly to membership account
              </span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}