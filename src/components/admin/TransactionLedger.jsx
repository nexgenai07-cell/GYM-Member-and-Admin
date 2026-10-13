import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  transactions,
  transactionStatusColors,
  transactionTypeIcons,
} from '../../data/adminFinance';

const statusFilters = [
  { key: 'all', label: 'All', icon: 'receipt_long' },
  { key: 'settled', label: 'Settled', icon: 'check_circle' },
  { key: 'pending', label: 'Pending', icon: 'schedule' },
  { key: 'refunded', label: 'Refunded', icon: 'undo' },
];

export default function TransactionLedger({ onViewInvoice }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.member.toLowerCase().includes(s) ||
          t.id.toLowerCase().includes(s) ||
          t.description.toLowerCase().includes(s) ||
          t.memberId.toLowerCase().includes(s)
      );
    }

    return result;
  }, [activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(pageStart, pageStart + pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-surface-container-low rounded-xl shadow-md overflow-hidden"
    >
      {/* Toolbar */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              Transaction Ledger
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              Recent Payments
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => toast.success('Exported ledger to CSV')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high text-on-surface font-label-md text-[11px] uppercase tracking-wider transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === f.key
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.35)]'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
              search
            </span>
            <input
              type="text"
              placeholder="Search by member, invoice ID, or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">
              receipt_long
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase mb-1">
            No Transactions
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/50">
                {paginated.map((t, i) => {
                  const status = transactionStatusColors[t.status];
                  const icon = transactionTypeIcons[t.type];
                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="hover:bg-surface-container-high/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-primary font-bold">
                            {t.id}
                          </span>
                          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                            {t.date} · {t.time}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-title-md text-[13px] text-on-surface">
                            {t.member}
                          </span>
                          <span className="font-label-md text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                            #{t.memberId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            {icon}
                          </span>
                          <span className="font-body-md text-body-md text-on-surface text-[13px]">
                            {t.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider">
                          {t.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-title-md text-title-md font-bold ${
                            t.amount < 0 ? 'text-error' : 'text-on-surface'
                          }`}
                        >
                          {t.amount < 0 ? '-' : ''}$
                          {Math.abs(t.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewInvoice(t)}
                          className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
                          title="View invoice"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            visibility
                          </span>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center gap-3 text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
            <span>
              Showing{' '}
              <span className="text-on-surface font-bold">
                {pageStart + 1}-{Math.min(pageStart + pageSize, filtered.length)}
              </span>{' '}
              of <span className="text-on-surface font-bold">{filtered.length}</span>{' '}
              transactions
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] transition-all ${
                    currentPage === idx + 1
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_8px_rgba(229,25,55,0.4)]'
                      : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                  }`}
                  type="button"
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}