// src/components/admin/RevenueStreams.jsx
import { motion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';
export default function RevenueStreams({ data, loading }) {
  const streams = data?.streams || [];
  const paymentMethods = data?.payment_methods || [];
  const total = data?.total || 0;

  if (loading) {
    return <div className="h-96 bg-surface-container rounded-xl animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {data?.range_label || tl("Last 30 days")}
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            {tl("Where the money comes from")}
          </h2>
        </div>
        <span className="font-title-md text-title-md text-on-surface font-mono">
          {formatSAR(total)}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {tl("By type")}
        </span>
        {streams.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-[13px]">
            {tl("No payments in this period")}
          </div>
        ) : (
          streams.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    {r.icon}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface truncate text-[13px]">
                    {r.label}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-on-surface whitespace-nowrap">
                  {formatSAR(r.value)} · {r.percent}%
                </span>
              </div>
              <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`${r.value < 0 ? 'bg-on-surface-variant/50' : 'bg-primary-container'} h-full rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.percent}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="h-px bg-surface-container-high" />

      <div className="flex flex-col gap-4">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {tl("By payment method")}
        </span>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-4 text-on-surface-variant text-[12px]">
            {tl("No payment data")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    {p.icon}
                  </span>
                  <span className="font-label-md text-[10px] text-primary font-bold">
                    {p.percent}%
                  </span>
                </div>
                <span className="font-title-md text-title-md text-on-surface text-[12px] leading-tight">
                  {p.label}
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">
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