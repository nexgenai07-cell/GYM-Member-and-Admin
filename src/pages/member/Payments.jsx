import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { paymentsService } from '../../services/paymentsService';

export default function Payments() {
  const [search, setSearch] = useState('');

  const { data: summary } = useApi(() => paymentsService.summary(), []);
  const { data: transactions, loading } = useApi(() => paymentsService.transactions(), []);
  const { data: methods, refetch: refetchMethods } = useApi(() => paymentsService.paymentMethods(), []);

  const list = transactions || [];
  const methodList = methods || [];

  const filtered = search
    ? list.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.transaction_id.toLowerCase().includes(search.toLowerCase())
      )
    : list;

  const handleTopup = async () => {
    try {
      await paymentsService.topupLockerCredit(50);
      toast.success('$50 added to locker credit');
      window.location.reload();
    } catch (e) {
      toast.error('Failed to top up');
    }
  };

  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">payments</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Financial Command Center
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Billing & Payments
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Manage your subscription, payment methods, invoices, and locker credit.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Total Spent"
          value={`$${Number(summary?.total_spent ?? 0).toFixed(2)}`}
          icon="payments"
          accent
        />
        <StatTile
          label="Pending"
          value={`$${Number(summary?.pending_amount ?? 0).toFixed(2)}`}
          icon="schedule"
        />
        <StatTile
          label="Locker Credit"
          value={`$${Number(summary?.locker_credit?.balance ?? 0).toFixed(2)}`}
          icon="account_balance_wallet"
          accent
        />
        <StatTile
          label="Refunded (30d)"
          value={`$${Number(summary?.refunded_amount ?? 0).toFixed(2)}`}
          icon="undo"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment methods + Locker credit */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container rounded-xl p-5 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                Payment Method
              </span>
            </div>

            {methodList.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">
                  credit_card
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  No card on file
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#1a1a1e] to-[#0e0e0f] border border-surface-container-high">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                    Smart Vault Card
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface italic">
                    {methodList[0].brand || 'VISA'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-lg text-title-lg text-on-surface tracking-widest">
                    •••• •••• •••• {methodList[0].last4}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase mt-2">
                    <span>Exp {methodList[0].expiry_month}/{methodList[0].expiry_year}</span>
                    {methodList[0].is_default && (
                      <span className="text-primary font-bold">Default</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-container rounded-xl p-5 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                Locker Credit
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[9px] font-bold uppercase">
                Live
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-display-xl text-display-xl text-on-surface">
                ${Number(summary?.locker_credit?.balance ?? 0).toFixed(2)}
              </span>
              <span className="font-label-md text-[10px] text-primary uppercase font-bold">USD</span>
            </div>

            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full bg-primary-container"
                initial={{ width: 0 }}
                animate={{
                  width: `${summary?.locker_credit?.percent_of_cap ?? 0}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>

            <button
              onClick={handleTopup}
              className="w-full py-3 rounded bg-primary-container hover:bg-secondary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Top-Up $50
            </button>
          </motion.div>
        </div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-container rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container-high">
            <div>
              <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                Transaction Ledger
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">
                Recent Transactions
              </h2>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-surface-container-lowest text-on-surface text-body-md pl-9 pr-3 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary w-full md:w-64"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-5 flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-surface-container-low rounded animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                receipt_long
              </span>
              <p className="font-title-md text-title-md text-on-surface mt-3">
                No transactions
              </p>
            </div>
          ) : (
            <div className="divide-y divide-surface-container-high/50">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {t.transaction_type === 'subscription'
                          ? 'card_membership'
                          : t.transaction_type === 'retail'
                          ? 'shopping_bag'
                          : t.transaction_type === 'refund'
                          ? 'undo'
                          : 'payments'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-on-surface truncate">
                        {t.description}
                      </span>
                      <span className="font-label-md text-[10px] text-on-surface-variant uppercase truncate">
                        {t.transaction_id} · {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-title-md text-title-md font-bold whitespace-nowrap ${
                        Number(t.amount) < 0 ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {Number(t.amount) < 0 ? '-' : ''}$
                      {Math.abs(Number(t.amount)).toFixed(2)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        t.status === 'settled'
                          ? 'bg-emerald-400/15 text-emerald-400'
                          : t.status === 'pending'
                          ? 'bg-primary-container/20 text-primary'
                          : t.status === 'refunded'
                          ? 'bg-error/20 text-error'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 flex items-center gap-4 shadow-md overflow-hidden ${
        accent ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>

      <div className="relative flex flex-col">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span className={`font-headline-md text-headline-md leading-none mt-1 ${accent ? 'text-primary' : 'text-on-surface'}`}>
          {value}
        </span>
      </div>
    </motion.div>
  );
}