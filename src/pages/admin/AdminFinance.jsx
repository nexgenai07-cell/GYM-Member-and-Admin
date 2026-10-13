// src/pages/admin/AdminFinance.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import RevenueChart from '../../components/admin/RevenueChart';
import RevenueStreams from '../../components/admin/RevenueStreams';
import TopMembersCard from '../../components/admin/TopMembersCard';
import InvoiceDrawer from '../../components/admin/InvoiceDrawer';

export default function AdminFinance() {
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const { data: overview, loading: loadingOv } = useApi(
    () => adminService.financeOverview(),
    []
  );

  const { data: txData, loading: loadingTx } = useApi(
    () => adminService.transactions({ page }),
    [page]
  );

  const { data: monthly, loading: loadingMonthly } = useApi(
    () => adminService.revenueMonthly(12),
    []
  );

  const { data: streams, loading: loadingStreams } = useApi(
    () => adminService.revenueStreams(),
    []
  );

  const { data: topMembers, loading: loadingTop } = useApi(
    () => adminService.topMembers(5),
    []
  );

  const transactions = txData?.results || [];
  const total = txData?.total || 0;

  const handleViewInvoice = async (txn) => {
    try {
      const detail = await adminService.transactionDetail(txn.id);
      setSelectedTxn(detail);
    } catch (e) {
      toast.error('Failed to load invoice');
    }
  };

  const loading = loadingOv;

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">payments</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Financial Command Center
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Revenue & Invoicing
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Real-time revenue telemetry across all transactions.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <FinanceStat
          label="Monthly Recurring Revenue"
          value={loading ? '—' : `$${Number(overview?.mrr ?? 0).toLocaleString()}`}
          delta="Rolling month"
          icon="payments"
          accent
        />
        <FinanceStat
          label="Annual Run Rate"
          value={loading ? '—' : `$${Number(overview?.arr ?? 0).toLocaleString()}`}
          delta="ARR projection"
          icon="trending_up"
        />
        <FinanceStat
          label="Pending"
          value={loading ? '—' : `$${Number(overview?.pending_amount ?? 0).toLocaleString()}`}
          delta={`${overview?.pending_count ?? 0} invoices`}
          icon="schedule"
          accent
        />
        <FinanceStat
          label="Refunds (30d)"
          value={loading ? '—' : `$${Number(overview?.refunds_30d ?? 0).toLocaleString()}`}
          delta="Rolling 30 days"
          icon="undo"
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart data={monthly} loading={loadingMonthly} />

      {/* Streams + Top Members */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueStreams data={streams} loading={loadingStreams} />
        </div>
        <div className="lg:col-span-4">
          <TopMembersCard data={topMembers} loading={loadingTop} />
        </div>
      </section>

      {/* Transactions ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low rounded-xl overflow-hidden shadow-md"
      >
        <div className="p-5 border-b border-surface-container-high flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase">
            Transaction Ledger
          </h2>
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
            {total} transactions
          </span>
        </div>

        {loadingTx ? (
          <div className="p-4 flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-surface-container rounded animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              receipt_long
            </span>
            <p className="font-title-md text-title-md text-on-surface mt-3">
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Transaction</th>
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/50">
                {transactions.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface-container-high/60 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-primary font-bold">
                          {t.transaction_id}
                        </span>
                        <span className="font-label-md text-[9px] text-on-surface-variant">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-title-md text-[12px] text-on-surface">
                          {t.member_name}
                        </span>
                        <span className="font-label-md text-[10px] text-on-surface-variant">
                          {t.member_email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-body-md text-[12px] text-on-surface">
                        {t.description}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-title-md text-title-md font-bold ${
                          Number(t.amount) < 0 ? 'text-error' : 'text-on-surface'
                        }`}
                      >
                        {Number(t.amount) < 0 ? '-' : ''}$
                        {Math.abs(Number(t.amount)).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase ${
                          t.status === 'settled'
                            ? 'bg-emerald-400/15 text-emerald-400'
                            : t.status === 'pending'
                            ? 'bg-primary-container/20 text-primary'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewInvoice(t)}
                        className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
                        type="button"
                        title="View invoice"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loadingTx && transactions.length > 0 && (
          <div className="p-4 bg-surface-container-lowest flex items-center justify-between">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
              Page {page} · {total} transactions
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-[11px] font-bold uppercase disabled:opacity-30"
                type="button"
              >
                Prev
              </button>
              <span className="px-3 py-1 rounded bg-primary-container text-on-primary-container text-[11px] font-bold">
                {page}
              </span>
              <button
                disabled={transactions.length < 20}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-[11px] font-bold uppercase disabled:opacity-30"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Invoice Drawer */}
      <AnimatePresence>
        {selectedTxn && (
          <InvoiceDrawer
            transaction={selectedTxn}
            onClose={() => setSelectedTxn(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FinanceStat({ label, value, delta, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
        accent
          ? 'bg-primary-container/10 border border-primary-container/30'
          : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className="relative flex items-start justify-between mb-3">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">
          {label}
        </span>
        <span
          className={`material-symbols-outlined text-[20px] ${
            accent ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="relative">
        <span
          className={`font-headline-lg text-headline-lg leading-none ${
            accent ? 'text-primary' : 'text-on-surface'
          }`}
        >
          {value}
        </span>
        <span className="font-label-md text-[10px] text-on-surface-variant mt-2 block">
          {delta}
        </span>
      </div>
    </motion.div>
  );
}