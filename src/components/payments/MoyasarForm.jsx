// src/components/payments/MoyasarForm.jsx
// Official Moyasar payment form (moyasar-payment-form), loaded from jsDelivr.
// Card data goes straight from the browser to Moyasar — never to our backend.
import { useEffect, useRef, useState } from 'react';

const MOYASAR_VERSION = '2.3.0';
const CDN = `https://cdn.jsdelivr.net/npm/moyasar-payment-form@${MOYASAR_VERSION}/dist`;

export const CALLBACK_PATH = '/dashboard/payments/callback';

let loader = null;
const loadMoyasar = () => {
  if (window.Moyasar) return Promise.resolve(window.Moyasar);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${CDN}/moyasar.css"]`)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${CDN}/moyasar.css`;
      document.head.appendChild(css);
    }
    const js = document.createElement('script');
    js.src = `${CDN}/moyasar.umd.min.js`;
    js.async = true;
    js.onload = () => (window.Moyasar ? resolve(window.Moyasar) : reject(new Error('Moyasar failed to load.')));
    js.onerror = () => { loader = null; reject(new Error('Could not load the payment form. Check your connection and retry.')); };
    document.head.appendChild(js);
  });
  return loader;
};

/**
 * @param {object} checkout  `payment` block from POST /payments/checkout/
 *                           { publishable_key, amount (halalas), currency, description, metadata }
 * @param {function} onPaymentCreated  async (paymentId) => void — runs before any 3-D Secure redirect
 */
export default function MoyasarForm({ checkout, onPaymentCreated }) {
  const elRef = useRef(null);
  const createdRef = useRef(onPaymentCreated);
  const [error, setError] = useState('');

  useEffect(() => { createdRef.current = onPaymentCreated; }, [onPaymentCreated]);

  useEffect(() => {
    let cancelled = false;
    const el = elRef.current;

    loadMoyasar()
      .then((Moyasar) => {
        // StrictMode runs effects twice in dev — only the surviving run initialises.
        if (cancelled || !el) return;
        el.innerHTML = '';
        Moyasar.init({
          element: el,
          amount: checkout.amount,
          currency: checkout.currency,
          description: checkout.description,
          publishable_api_key: checkout.publishable_key,
          callback_url: `${window.location.origin}${CALLBACK_PATH}`,
          methods: ['creditcard', 'stcpay'],
          supported_networks: ['visa', 'mastercard', 'mada'],
          metadata: checkout.metadata,
          // Record the payment id server-side before the redirect, so the
          // purchase is linked even if the member never comes back.
          on_completed: async (payment) => {
            try {
              await createdRef.current?.(payment.id);
            } catch {
              // Non-fatal: the callback page and the webhook both verify too.
            }
          },
        });
      })
      .catch((e) => { if (!cancelled) setError(e.message); });

    return () => {
      cancelled = true;
      if (el) el.innerHTML = '';
    };
  }, [checkout]);

  return (
    <>
      <div ref={elRef} className="mysr-form" />
      {error && <p className="text-error text-[12px] mt-2" role="alert">{error}</p>}
    </>
  );
}
