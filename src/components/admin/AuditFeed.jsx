// src/components/admin/AuditFeed.jsx
import { motion } from 'framer-motion';
import { tl } from '../../i18n';

const statusStyles = {
  ok: 'bg-surface-container-high text-primary',
  error: 'bg-error/20 text-error',
  default: 'bg-surface-container-high text-on-surface',
};

export default function AuditFeed({ events = [], loading }) {
  const rows = Array.isArray(events) ? events : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {tl("Live Operations Audit")}
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            {tl("Recent Platform Events")}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-[10px]">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span>{rows.length} events</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-surface-container-lowest rounded animate-pulse"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant text-[13px]">
          <span className="material-symbols-outlined text-3xl opacity-40">
            event_note
          </span>
          <p className="mt-2">{tl("No recent events")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-md text-body-md">
            <thead>
              <tr className="bg-surface-container-lowest/80 text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">{tl("Time")}</th>
                <th className="py-3 px-4">{tl("Node")}</th>
                <th className="py-3 px-4">{tl("Event")}</th>
                <th className="py-3 px-4 rounded-r-lg text-right">{tl("Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest text-on-surface">
              {rows.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
                  className={`hover:bg-surface-container-high transition-colors ${
                    row.isAlert ? 'bg-error-container/10' : ''
                  }`}
                >
                  <td
                    className={`py-3 px-4 font-mono text-[12px] whitespace-nowrap ${
                      row.isAlert ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {row.time}
                  </td>
                  <td
                    className={`py-3 px-4 font-bold whitespace-nowrap text-[13px] ${
                      row.isAlert ? 'text-error' : ''
                    }`}
                  >
                    {row.node}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[13px] ${
                        row.isAlert ? 'font-semibold' : ''
                      }`}
                    >
                      {row.event}
                    </span>
                    <span
                      className={`block font-label-md text-[10px] ${
                        row.isAlert ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      {row.detail}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded font-label-md text-[10px] font-bold uppercase ${
                        statusStyles[row.statusType] || statusStyles.default
                      }`}
                    >
                      {tl(row.status)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}