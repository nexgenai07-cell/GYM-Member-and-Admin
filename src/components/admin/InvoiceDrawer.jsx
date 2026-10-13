// src/components/admin/InvoiceDrawer.jsx
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MAP = {
  settled: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: 'SETTLED', icon: 'check_circle' },
  pending: { bg: 'bg-primary-container/10', text: 'text-primary', label: 'PENDING', icon: 'schedule' },
  refunded: { bg: 'bg-error/10', text: 'text-error', label: 'REFUNDED', icon: 'undo' },
};

export default function InvoiceDrawer({ transaction, onClose }) {
  if (!transaction) return null;

  const status = STATUS_MAP[transaction.status] || STATUS_MAP.pending;
  const amount = Math.abs(Number(transaction.amount));
  const subtotal = amount * 0.95;
  const tax = amount * 0.05;

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
        <div className="p-6 border-b border-surface-container-high flex items-start justify-between">
          <div>
            <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
              Invoice Details
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide">
              {transaction.transaction_id}
            </h3>
            <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              {new Date(transaction.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className={`flex items-center justify-between p-4 rounded-xl ${status.bg} border border-current/20`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-[24px] ${status.text}`}>
                {status.icon}
              </span>
              <div className="flex flex-col">
                <span className={`font-title-md text-title-md uppercase tracking-wider font-bold ${status.text}`}>
                  {status.label}
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {transaction.status === 'settled'
                    ? 'Payment processed successfully'
                    : transaction.status === 'pending'
                    ? 'Awaiting payment confirmation'
                    : 'Refund issued'}
                </span>
              </div>
            </div>
            <span className={`font-display-xl text-display-xl ${status.text}`}>
              ${amount.toFixed(2)}
            </span>
          </div>

          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-2">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              Customer
            </span>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface">
                  {transaction.member}
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                  {transaction.member_email} · #{transaction.member_id}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-4">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              Line Items
            </span>

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  receipt_long
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md text-title-md text-on-surface">
                    {transaction.description}
                  </span>
                  <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Type: {transaction.type || 'payment'}
                  </span>
                </div>
              </div>
              <span className="font-title-md text-title-md text-on-surface whitespace-nowrap">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="h-px bg-surface-container-high" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>VAT (5%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-surface-container-high my-1" />
              <div className="flex justify-between font-title-lg text-title-lg text-on-surface">
                <span>Total</span>
                <span className="font-mono text-primary">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-2">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              Payment Method
            </span>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">
                credit_card
              </span>
              <span className="font-title-md text-title-md text-on-surface">
                {transaction.method || 'Card'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download PDF Receipt</span>
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span>Email Receipt</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}