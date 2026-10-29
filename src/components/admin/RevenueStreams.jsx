// src/components/admin/RevenueStreams.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

export default function RevenueStreams({ data, loading }) {
  const reduce = useReducedMotion();
  const streams = data?.streams || [];
  const paymentMethods = data?.payment_methods || [];
  const total = data?.total || 0;

  if (loading) {
    return <div className="h-96 bg-surface-container rounded-xl animate-pulse" aria-busy="true" />;
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-6"
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {data?.range_label || tl('Last 30 days')}
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            {tl('Where the money comes from')}
          </h2>
        </div>
        <span className="font-title-md text-title-md text-on-surface font-mono tabular-nums whitespace-nowrap">
          {formatSAR(total)}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {tl('By type')}
        </span>
        {streams.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-[13px]" role="status">
            {tl('No payments in this period')}
          </div>
        ) : (
          streams.map((r, i) => (
            <motion.div
              key={r.label}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={reduce ? false : { opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 + i * 0.08 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[16px]" aria-hidden="true">
                    {r.icon}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface truncate text-[13px]">
                    {r.label}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-on-surface whitespace-nowrap tabular-nums">
                  {tl('{0} · {1}%', { 0: formatSAR(r.value), 1: r.percent })}
                </span>
              </div>
              <div
                className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={r.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={r.label}
              >
                <motion.div
                  className={`${r.value < 0 ? 'bg-on-surface-variant/50' : 'bg-primary-container'} h-full rounded-full`}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${r.percent}%` }}
                  transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.2 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="h-px bg-surface-container-high" aria-hidden="true" />

      <div className="flex flex-col gap-4">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {tl('By payment method')}
        </span>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-4 text-on-surface-variant text-[12px]" role="status">
            {tl('No payment data')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((p, i) => (
              <motion.div
                key={p.label}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={reduce ? false : { opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.2 + i * 0.08 }}
                className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary text-[16px]" aria-hidden="true">
                    {p.icon}
                  </span>
                  <span className="font-label-md text-[10px] text-primary font-bold tabular-nums">
                    {p.percent}%
                  </span>
                </div>
                <span className="font-title-md text-title-md text-on-surface text-[12px] leading-tight">
                  {p.label}
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant tabular-nums">
                  {formatSAR(p.value)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}