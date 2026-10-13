import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { transactions } from '../../data/payments';

export default function TransactionLedger() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return transactions;
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex flex-col bg-surface-container-low rounded-xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-space-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-headline-md text-headline-md uppercase tracking-wider text-on-surface">
              Invoice History & Transaction Ledger
            </span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase">
              {filtered.length} Records
            </span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Cryptographically signed invoices with timestamp verification
          </span>
        </div>

        <div className="flex items-center gap-space-sm w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-64">
  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
    search
  </span>
  <input
    type="text"
    placeholder="Search ledger..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-surface-container-lowest text-on-surface text-body-md font-body-md pl-10 pr-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
  />
</div>

          <button className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-space-md py-2 rounded font-label-lg text-label-lg uppercase flex items-center gap-space-2xs transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter</span>
          </button>
          <button className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-space-md py-2 rounded font-label-lg text-label-lg uppercase flex items-center gap-space-2xs transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
              <th className="py-space-md px-space-lg">Invoice ID</th>
              <th className="py-space-md px-space-md">Date</th>
              <th className="py-space-md px-space-md">Description</th>
              <th className="py-space-md px-space-md">Payment Method</th>
              <th className="py-space-md px-space-md">Amount</th>
              <th className="py-space-md px-space-md">Status</th>
              <th className="py-space-md px-space-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-body-md font-body-md text-on-surface">
            {filtered.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-surface-container transition-colors"
              >
                <td className="py-space-md px-space-lg font-title-md text-title-md text-primary tracking-wider">
                  {t.id}
                </td>
                <td className="py-space-md px-space-md text-on-surface-variant">
                  {t.date}
                </td>
                <td className="py-space-md px-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {t.icon}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface">
                      {t.description}
                    </span>
                  </div>
                </td>
                <td className="py-space-md px-space-md text-on-surface-variant">
                  <div className="flex items-center gap-space-2xs">
                    <span
                      className={`font-label-md text-label-md uppercase font-bold ${
                        t.method.type === 'Locker Balance'
                          ? 'text-primary'
                          : 'text-on-surface'
                      }`}
                    >
                      {t.method.type}
                    </span>
                    {t.method.label && <span>{t.method.label}</span>}
                  </div>
                </td>
                <td className="py-space-md px-space-md font-title-md text-title-md text-on-surface">
                  ${t.amount.toFixed(2)}
                </td>
                <td className="py-space-md px-space-md">
                  <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-label-md uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    {t.status}
                  </span>
                </td>
                <td className="py-space-md px-space-lg text-right">
                  <button className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-space-sm py-1 rounded font-label-md text-label-md uppercase transition-colors inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      download
                    </span>
                    <span>PDF Receipt</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-space-md bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center gap-space-sm text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
        <span>Showing 1 to 5 of 18 invoices</span>
        <div className="flex items-center gap-space-xs">
          <button className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors">
            Prev
          </button>
          <span className="px-space-sm py-1 rounded bg-primary-container text-on-primary-container font-bold">
            1
          </span>
          <button className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors">
            2
          </button>
          <button className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors">
            3
          </button>
          <button className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors">
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}