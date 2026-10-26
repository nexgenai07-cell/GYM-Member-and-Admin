// src/components/admin/InvoiceDrawer.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { formatSAR } from '../../utils/money';

const STATUS_MAP = {
  settled: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: 'SETTLED', icon: 'check_circle' },
  pending: { bg: 'bg-primary-container/10', text: 'text-primary', label: 'PENDING', icon: 'schedule' },
  refunded: { bg: 'bg-error/10', text: 'text-error', label: 'REFUNDED', icon: 'undo' },
};

// A printable receipt in a new window; the browser's print dialog can save it as PDF.
function printReceipt(t) {
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const w = window.open('', '_blank', 'width=520,height=720');
  if (!w) { toast.error('Allow pop-ups to print the receipt'); return; }
  const row = (k, v) => `<tr><td>${esc(k)}</td><td style="text-align:right">${esc(v)}</td></tr>`;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${esc(t.invoice?.number || t.transaction_id)}</title>
    <style>body{font-family:system-ui,sans-serif;margin:32px;color:#111}h1{font-size:20px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:16px}
    td{padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.total td{font-weight:700;border-bottom:0;font-size:15px}.muted{color:#666;font-size:12px}</style></head>
    <body><h1>Smart Gym — Receipt</h1><div class="muted">${esc(t.invoice?.number || t.transaction_id)} · ${esc(new Date(t.settled_at || t.created_at).toLocaleString())}</div>
    <table>${row('Member', `${t.member} (${t.member_email})`)}${row('Item', t.description)}${row('Type', t.type)}${row('Paid with', t.method)}
    ${t.tax_amount ? row('Subtotal', formatSAR(t.subtotal)) + row('VAT', formatSAR(t.tax_amount)) : ''}
    <tr class="total"><td>Total</td><td style="text-align:right">${esc(formatSAR(t.amount))}</td></tr></table>
    ${t.gateway_reference ? `<p class="muted">Payment reference: ${esc(t.gateway_reference)}</p>` : ''}
    </body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

export default function InvoiceDrawer({ transaction, onClose }) {
  const [sending, setSending] = useState(false);
  if (!transaction) return null;

  const status = STATUS_MAP[transaction.status] || STATUS_MAP.pending;
  const amount = Number(transaction.amount);
  const subtotal = Number(transaction.subtotal ?? transaction.amount);
  const tax = Number(transaction.tax_amount ?? 0);

  const emailReceipt = async () => {
    setSending(true);
    try {
      const res = await adminService.emailReceipt(transaction.id);
      toast.success(res.detail);
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Could not email the receipt');
    } finally {
      setSending(false);
    }
  };

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
              {formatSAR(amount)}
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
                {formatSAR(subtotal)}
              </span>
            </div>

            <div className="h-px bg-surface-container-high" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">{formatSAR(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>VAT (5%)</span>
                <span className="font-mono">{formatSAR(tax)}</span>
              </div>
              <div className="h-px bg-surface-container-high my-1" />
              <div className="flex justify-between font-title-lg text-title-lg text-on-surface">
                <span>Total</span>
                <span className="font-mono text-primary">{formatSAR(amount)}</span>
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
                {transaction.method || '—'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => (transaction.receipt_url ? window.open(transaction.receipt_url, '_blank', 'noopener') : printReceipt(transaction))}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / save as PDF</span>
            </button>
            <button
              onClick={emailReceipt}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all disabled:opacity-60"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span>{sending ? 'Sending…' : 'Email receipt to member'}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}