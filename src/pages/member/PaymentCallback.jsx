// src/pages/member/PaymentCallback.jsx
// Moyasar redirects here after 3-D Secure / STC Pay: /dashboard/payments/callback?id=...&status=...
// The `status` query param is user-editable and ignored — only the backend's
// verification (which re-fetches the payment from Moyasar) counts.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentsService } from '../../services/paymentsService';
import { errorMessage } from '../../utils/apiError';
import { formatSAR } from '../../utils/money';
import { RETURN_KEY } from '../../components/payments/PayDialog';
import { tl } from '../../i18n';

const MAX_POLLS = 6;
const POLL_MS = 3000;

const readReturn = () => {
  try { return JSON.parse(sessionStorage.getItem(RETURN_KEY) || 'null'); } catch { return null; }
};

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const paymentId = params.get('id');
  const [intent, setIntent] = useState(null);
  const [state, setState] = useState(paymentId ? 'verifying' : 'error');   // verifying | paid | pending | failed | review | error
  const [message, setMessage] = useState(paymentId ? '' : 'No payment reference was returned.');
  const [back] = useState(readReturn);

  useEffect(() => {
    if (!paymentId) return undefined;
    let alive = true;
    let timer;
    const attempt = async (n) => {
      try {
        const data = await paymentsService.verifyPayment(paymentId);
        if (!alive) return;
        setIntent(data);
        if (['paid', 'failed', 'review'].includes(data.status)) {
          setState(data.status);
          setMessage(data.failure_reason || '');
          if (data.status === 'paid') {
            try { sessionStorage.removeItem(RETURN_KEY); } catch { /* ignore */ }
          }
          return;
        }
      } catch (err) {
        if (!alive) return;
        setMessage(errorMessage(err, tl("Could not verify the payment.")));
      }
      if (n + 1 < MAX_POLLS) timer = setTimeout(() => attempt(n + 1), POLL_MS);
      else setState('pending');
    };
    attempt(0);
    return () => { alive = false; clearTimeout(timer); };
  }, [paymentId]);

  const heading = {
    verifying: 'Confirming payment…',
    paid: 'Payment complete',
    pending: 'Payment processing',
    failed: 'Payment not completed',
    review: 'Payment received — our team will follow up',
    error: 'Something went wrong',
  }[state];

  const sub = {
    verifying: 'Checking your payment with Moyasar. Please don’t close this page.',
    paid: intent ? `${intent.description} — ${formatSAR(intent.amount)}` : '',
    pending: 'We are still confirming your payment. You will get a notification once it is confirmed — no need to pay again.',
    failed: message || 'The payment was declined. You have not been charged.',
    review: message || 'We received your payment but need to check something before completing your purchase.',
    error: message,
  }[state];

  const icon = { paid: 'check_circle', failed: 'cancel', review: 'report', error: 'error', pending: 'schedule', verifying: 'sync' }[state];
  const backPath = back?.path || '/dashboard/payments';

  return (
    <div className="w-full px-space-xl py-space-2xl flex justify-center">
      <div className="w-full max-w-lg bg-surface-container rounded-xl p-space-xl shadow-lg flex flex-col items-center text-center gap-space-md">
        <span className={`material-symbols-outlined text-[48px] ${state === 'paid' ? 'text-emerald-400' : state === 'failed' || state === 'error' ? 'text-error' : 'text-primary'} ${state === 'verifying' ? 'animate-spin' : ''}`}>
          {icon}
        </span>
        <h1 className="font-headline-md text-headline-md text-on-surface uppercase">{heading}</h1>
        {sub && <p className="font-body-md text-body-md text-on-surface-variant">{sub}</p>}
        {state !== 'verifying' && (
          <div className="flex gap-2 flex-wrap justify-center">
            <Link to={backPath} className="px-5 py-2 rounded bg-primary-container text-on-primary-container font-bold uppercase text-[11px]">
              {state === 'failed' ? tl("Try again") : tl("Back to {0}", { 0: back?.title || 'payments' })}
            </Link>
            <Link to="/dashboard/payments" className="px-5 py-2 rounded bg-surface-container-high text-on-surface font-bold uppercase text-[11px]">
              {tl("Payment history")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
