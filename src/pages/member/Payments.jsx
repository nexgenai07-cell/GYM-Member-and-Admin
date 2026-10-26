import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { paymentsService } from '../../services/paymentsService';
import { membersService } from '../../services/membersService';
import PayDialog from '../../components/payments/PayDialog';
import { formatSAR } from '../../utils/money';
import { formatDate, formatRemaining } from '../../utils/membershipTime';

const TOPUP_AMOUNTS = [25, 50, 100];
const RENEW_MONTHS = [1, 3, 6, 12];

// Same rule as the server (apps.public_api.serializers.plan_amount) — display only;
// the server always decides what is charged.
const planPrice = (plan, months) =>
  months >= 12 ? (Number(plan.price_annual) * months) / 12 : Number(plan.price_monthly) * months;

const TYPE_ICON = {
  subscription: 'card_membership',
  retail: 'shopping_bag',
  coaching: 'sports',
  refund: 'undo',
  topup: 'account_balance_wallet',
};

export default function Payments() {
  const [search, setSearch] = useState('');
  const [pay, setPay] = useState(null);           // { request, title, allowCredit }
  const [renewPlan, setRenewPlan] = useState(null);
  const [renewMonths, setRenewMonths] = useState(3);

  const { data: summary, refetch: refetchSummary } = useApi(() => paymentsService.summary(), []);
  const { data: transactions, loading, refetch: refetchTx } = useApi(() => paymentsService.transactions(), []);
  const { data: methods } = useApi(() => paymentsService.paymentMethods(), [], { showError: false });
  const { data: membership, refetch: refetchMembership } = useApi(() => membersService.myMembership(), [], { showError: false });
  const { data: plans } = useApi(() => membersService.plans(), [], { showError: false });
  const { data: facilities, refetch: refetchFacilities } = useApi(() => membersService.facilities(), [], { showError: false });

  const list = transactions || [];
  const filtered = search
    ? list.filter((t) => `${t.description} ${t.transaction_id}`.toLowerCase().includes(search.toLowerCase()))
    : list;

  const credit = summary?.locker_credit;
  const balance = Number(credit?.balance ?? 0);
  const room = Math.max(0, Number(credit?.max_cap ?? 0) - balance);

  const activePlans = useMemo(() => (plans || []).filter((p) => p.is_active !== false), [plans]);
  const selectedPlan = renewPlan ?? membership?.plan?.id ?? activePlans[0]?.id;
  const planObj = activePlans.find((p) => p.id === selectedPlan);

  const refreshAll = () => {
    refetchSummary();
    refetchTx();
    refetchMembership();
    refetchFacilities();
  };

  const startFacility = (f) => {
    setPay({
      request: { purpose: 'facility_addon', facility_id: f.id },
      title: `${f.name} · ${f.months_remaining} mo`,
      allowCredit: true,
    });
  };

  const startTopup = (amount) => {
    if (amount > room) {
      toast.error(`Your locker credit is capped — you can add up to ${formatSAR(room)}.`);
      return;
    }
    setPay({ request: { purpose: 'locker_topup', amount }, title: `Top up ${formatSAR(amount)}`, allowCredit: false });
  };

  const startRenewal = () => {
    if (!planObj) return;
    setPay({
      request: { purpose: 'renewal', plan_id: planObj.id, months: renewMonths },
      title: `Renew ${planObj.display_name} · ${renewMonths} mo`,
      allowCredit: true,
    });
  };

  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">payments</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">Billing</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">Billing & Payments</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Renew your membership, top up locker credit and see every payment you’ve made.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile label="Total paid" value={formatSAR(summary?.total_spent)} icon="payments" accent />
        <StatTile label="Locker credit" value={formatSAR(balance)} icon="account_balance_wallet" accent />
        <StatTile label="Membership left" value={formatRemaining(membership?.time_remaining)} icon="hourglass_bottom" />
        <StatTile label="Refunded" value={formatSAR(summary?.refunded_amount)} icon="undo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Membership + renewal */}
          <Card label="Membership">
            {membership ? (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-headline-md text-headline-md text-on-surface">{membership.plan?.display_name}</span>
                  <span className={`text-[10px] font-bold uppercase ${membership.time_remaining?.expired ? 'text-error' : 'text-primary'}`}>
                    {membership.time_remaining?.expired ? 'Expired' : membership.status}
                  </span>
                </div>
                <p className="text-on-surface-variant text-[12px] mt-1">
                  Valid until {formatDate(membership.expiry_date)} · {formatRemaining(membership.time_remaining)}
                </p>
              </>
            ) : (
              <p className="text-on-surface-variant text-[13px]">No membership found.</p>
            )}

            {membership && activePlans.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 border-t border-surface-container-high pt-4">
                <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">Renew / extend</span>
                <select value={selectedPlan ?? ''} onChange={(e) => setRenewPlan(Number(e.target.value))}
                  className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded border border-surface-container-high">
                  {activePlans.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
                </select>
                <div className="grid grid-cols-4 gap-1">
                  {RENEW_MONTHS.map((m) => (
                    <button key={m} type="button" onClick={() => setRenewMonths(m)}
                      className={`py-2 rounded text-[11px] font-bold uppercase ${renewMonths === m ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {m} mo
                    </button>
                  ))}
                </div>
                {planObj && (
                  <button type="button" onClick={startRenewal}
                    className="w-full py-3 rounded bg-primary-container hover:bg-secondary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wider">
                    Pay {formatSAR(planPrice(planObj, renewMonths))}
                  </button>
                )}
                <p className="text-on-surface-variant text-[11px]">
                  Time is added after your current expiry date (or from today if it has expired).
                </p>
              </div>
            )}
          </Card>

          {/* Facility add-ons */}
          {Array.isArray(facilities) && facilities.length > 0 && (
            <Card label="Facility add-ons">
              <div className="flex flex-col gap-2">
                {facilities.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-2 bg-surface-container-low rounded px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-on-surface text-[13px] font-bold truncate">{f.name}</div>
                      <div className="text-on-surface-variant text-[11px]">
                        {f.owned ? `Included until ${formatDate(f.expires_on)}` : `${formatSAR(f.monthly_price)} / month`}
                      </div>
                    </div>
                    {f.owned ? (
                      <span className="px-2 py-1 rounded bg-emerald-400/15 text-emerald-400 text-[10px] font-bold uppercase">Active</span>
                    ) : f.addon_price ? (
                      <button type="button" onClick={() => startFacility(f)}
                        className="px-3 py-1.5 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase whitespace-nowrap">
                        Add · {formatSAR(f.addon_price)}
                      </button>
                    ) : (
                      <span className="text-on-surface-variant text-[10px] uppercase">Renew first</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-on-surface-variant text-[11px] mt-3">
                Added facilities cost the monthly price × months left on your membership (a started month counts),
                and end when your membership does.
              </p>
            </Card>
          )}

          {/* Locker credit */}
          <Card label="Locker credit">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-display-xl text-display-xl text-on-surface">{formatSAR(balance)}</span>
            </div>
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden mb-2">
              <motion.div className="h-full rounded-full bg-primary-container" initial={{ width: 0 }}
                animate={{ width: `${credit?.percent_of_cap ?? 0}%` }} transition={{ duration: 1 }} />
            </div>
            <p className="text-on-surface-variant text-[11px] mb-3">
              Cap {formatSAR(credit?.max_cap)} · use it in the shop and for sessions, courses and renewals.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TOPUP_AMOUNTS.map((a) => (
                <button key={a} type="button" onClick={() => startTopup(a)} disabled={a > room}
                  className="py-2 rounded bg-primary-container hover:bg-secondary-container text-on-primary-container text-[11px] font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed">
                  +{a}
                </button>
              ))}
            </div>
          </Card>

          {/* How you can pay */}
          <Card label="Payment methods">
            <div className="flex flex-wrap gap-1">
              {(methods?.accepted || ['mada', 'Visa', 'Mastercard', 'STC Pay', 'Locker credit']).map((m) => (
                <span key={m} className="px-2 py-1 rounded bg-surface-container-high text-on-surface text-[10px] font-bold uppercase">{m}</span>
              ))}
            </div>
            {methods?.recent?.length > 0 && (
              <p className="text-on-surface-variant text-[11px] mt-3">Recently used: {methods.recent.join(' · ')}</p>
            )}
            <p className="text-on-surface-variant text-[11px] mt-2">
              Cards are entered on Moyasar’s secure form at checkout and never stored by Smart Gym.
            </p>
          </Card>
        </div>

        {/* Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-container rounded-xl shadow-md overflow-hidden">
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container-high">
            <div>
              <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">Ledger</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">Payment history</h2>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">search</span>
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-surface-container-lowest text-on-surface text-body-md pl-9 pr-3 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary w-full md:w-64" />
            </div>
          </div>

          {loading ? (
            <div className="p-5 flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-surface-container-low rounded animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">receipt_long</span>
              <p className="font-title-md text-title-md text-on-surface mt-3">No payments yet</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-container-high/50">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">{TYPE_ICON[t.transaction_type] || 'payments'}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-on-surface truncate">{t.description}</span>
                      <span className="font-label-md text-[10px] text-on-surface-variant uppercase truncate">
                        {t.transaction_id} · {new Date(t.created_at).toLocaleDateString()}
                        {t.payment_method_label && ` · ${t.payment_method_label}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-title-md text-title-md font-bold whitespace-nowrap ${Number(t.amount) < 0 ? 'text-emerald-400' : 'text-on-surface'}`}>
                      {formatSAR(t.amount)}
                    </span>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      t.status === 'settled' ? 'bg-emerald-400/15 text-emerald-400'
                        : t.status === 'pending' ? 'bg-primary-container/20 text-primary'
                          : t.status === 'refunded' ? 'bg-error/20 text-error'
                            : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {t.status === 'settled' ? 'paid' : t.status}
                    </span>
                    {t.receipt_url && (
                      <a href={t.receipt_url} target="_blank" rel="noreferrer" title="Receipt · إيصال"
                        className="w-8 h-8 rounded bg-surface-container-high hover:bg-primary-container/30 text-on-surface-variant hover:text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <PayDialog
        request={pay?.request || null}
        title={pay?.title || ''}
        allowCredit={pay?.allowCredit}
        onPaid={() => { toast.success('Payment complete'); refreshAll(); }}
        onClose={() => { setPay(null); refreshAll(); }}
      />
    </div>
  );
}

function Card({ label, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container rounded-xl p-5 shadow-md">
      <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold block mb-4">{label}</span>
      {children}
    </motion.div>
  );
}

function StatTile({ label, value, icon, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 flex items-center gap-4 shadow-md overflow-hidden ${accent ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container'}`}>
      <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center ${accent ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="relative flex flex-col">
        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className={`font-headline-md text-headline-md leading-none mt-1 ${accent ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
      </div>
    </motion.div>
  );
}
