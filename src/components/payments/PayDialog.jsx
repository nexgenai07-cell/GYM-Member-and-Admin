// src/components/payments/PayDialog.jsx
// One dialog for every member payment. The server prices the request
// (paymentsService.checkout); the member pays by card / STC Pay on Moyasar's
// form or, where allowed, from locker credit. Card payments end on
// /dashboard/payments/callback (after 3-D Secure), which returns here.
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { paymentsService } from '../../services/paymentsService';
import { errorMessage } from '../../utils/apiError';
import { formatSAR } from '../../utils/money';
import MoyasarForm from './MoyasarForm';
import { tl } from '../../i18n';

export const RETURN_KEY = 'sg.payment.return';

/**
 * @param {object|null} request  checkout body, e.g. { purpose: 'shop_order', order_number }; null = closed
 * @param {string} title
 * @param {boolean} allowCredit  offer "Pay with locker credit"
 * @param {function} onPaid  (intent) => void — locker-credit payments finish here
 * @param {function} onClose
 */
export default function PayDialog({ request, title, allowCredit = false, onPaid, onClose }) {
  const open = !!request;
  const [step, setStep] = useState('choose');      // choose | card | working | done
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState('');
  const [credit, setCredit] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    (async () => {
      setStep(allowCredit ? 'choose' : 'working');
      setIntent(null);
      setError('');
      if (allowCredit) {
        try {
          const c = await paymentsService.lockerCredit();
          if (alive) setCredit(Number(c.balance));
        } catch { if (alive) setCredit(null); }
        return;
      }
      await startCard(alive);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function startCard(alive = true) {
    setStep('working');
    setError('');
    try {
      const data = await paymentsService.checkout(request);
      if (!alive) return;
      setIntent(data);
      // Where to come back to after the 3-D Secure redirect.
      try {
        sessionStorage.setItem(RETURN_KEY, JSON.stringify({ path: window.location.pathname + window.location.search, title }));
      } catch { /* storage blocked */ }
      setStep('card');
    } catch (err) {
      if (alive) { setError(errorMessage(err, tl("Could not start the payment."))); setStep('choose'); }
    }
  }

  async function payWithCredit() {
    setStep('working');
    setError('');
    try {
      const data = await paymentsService.checkout({ ...request, method: 'locker_credit' });
      setIntent(data);
      setStep('done');
      onPaid?.(data);
    } catch (err) {
      setError(errorMessage(err, tl("Payment failed.")));
      setStep('choose');
    }
  }

  const amount = intent ? Number(intent.amount) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget && step !== 'working') onClose?.(); }}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <motion.div
            className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-surface-container-lowest rounded-xl shadow-2xl p-5 flex flex-col gap-4"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">{tl("Secure payment")}</span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase leading-tight">{title}</h3>
                {amount !== null && (
                  <p className="font-title-md text-title-md text-on-surface mt-1">{formatSAR(amount)}</p>
                )}
              </div>
              <button type="button" onClick={onClose} disabled={step === 'working'} aria-label={tl("Close")}
                className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {error && <p className="text-error text-[13px]" role="alert">{error}</p>}

            {step === 'choose' && (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => startCard()}
                  className="w-full py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-bold uppercase tracking-wider text-[12px] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  {tl("Card (mada / Visa / Mastercard) or STC Pay")}
                </button>
                {allowCredit && (
                  <button type="button" onClick={payWithCredit} disabled={credit === null}
                    className="w-full py-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold uppercase tracking-wider text-[12px] flex items-center justify-center gap-2 disabled:opacity-50">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                    {tl("Locker credit")}{credit !== null && tl(" (balance {0})", { 0: formatSAR(credit) })}
                  </button>
                )}
              </div>
            )}

            {step === 'working' && (
              <p className="text-on-surface-variant text-[13px] py-6 text-center">{tl("Preparing payment…")}</p>
            )}

            {step === 'card' && intent?.payment && (
              <>
                <MoyasarForm
                  checkout={intent.payment}
                  onPaymentCreated={(paymentId) => paymentsService.attachPayment(intent.id, paymentId)}
                />
                <p className="text-on-surface-variant text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  {tl("Card details go straight to Moyasar and never reach our servers.")}
                </p>
              </>
            )}

            {step === 'done' && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <span className="material-symbols-outlined text-[40px] text-emerald-400">check_circle</span>
                <p className="font-title-md text-title-md text-on-surface">
                  {intent?.status === 'paid' ? tl("Payment complete") : tl("Payment received — our team will follow up")}
                </p>
                <button type="button" onClick={onClose}
                  className="px-5 py-2 rounded bg-primary-container text-on-primary-container font-bold uppercase text-[11px]">
                  {tl("Done")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
