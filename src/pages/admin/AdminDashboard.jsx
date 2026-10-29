// src/pages/admin/AdminDashboard.jsx
import { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { formatSAR } from '../../utils/money';
import { adminService } from '../../services/adminService';
import ControlBar from '../../components/admin/ControlBar';
import Scorecards from '../../components/admin/Scorecards';
import FlowAndRevenue from '../../components/admin/FlowAndRevenue';
import ArenaHeatmap from '../../components/admin/ArenaHeatmap';
import AuditFeed from '../../components/admin/AuditFeed';
import FacilityNodeCard from '../../components/admin/FacilityNodeCard';
import { PageHeader } from '../../components/site/SiteUi';
import { tl } from '../../i18n';

export default function AdminDashboard() {
  const [range, setRange] = useState('30d');
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  const { data: overview, loading, refetch: refetchOverview } = useApi(
    () => adminService.overview(range), [range], { poll: 60_000 }
  );
  const { data: flowData, loading: flowLoading, refetch: refetchFlow } = useApi(
    () => adminService.flowAndRevenue(range), [range]
  );
  const { data: heatmap, loading: heatmapLoading, refetch: refetchHeatmap } = useApi(
    () => adminService.arenaHeatmap(), []
  );
  const { data: audit, loading: auditLoading, refetch: refetchAudit } = useApi(
    () => adminService.auditFeed(20), []
  );
  const { data: nodes, loading: nodesLoading, refetch: refetchNodes } = useApi(
    () => adminService.facilityNodes(), []
  );

  // Await all refetches so the spinner is accurate and failures surface.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refetchOverview(), refetchFlow(), refetchHeatmap(), refetchAudit(), refetchNodes(),
      ]);
      setUpdatedAt(new Date());
    } finally {
      setRefreshing(false);
    }
  }, [refetchOverview, refetchFlow, refetchHeatmap, refetchAudit, refetchNodes]);

  const exportCsv = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportTransactions(range);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-gym-transactions-${range}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Let the browser commit the download before revoking.
      setTimeout(() => URL.revokeObjectURL(url), 0);
      toast.success(tl('Export ready'));
    } catch {
      toast.error(tl('Export failed'));
    } finally {
      setExporting(false);
    }
  }, [range]);

  return (
    <main className="w-full p-space-xl flex flex-col gap-space-lg">
      <PageHeader
        title={tl('Dashboard')}
        subtitle={tl('Live operations, revenue, and member activity.')}
      />

      <ControlBar
        range={range}
        onRange={setRange}
        updatedAt={updatedAt}
        onRefresh={refresh}
        refreshing={refreshing}
        onExport={exportCsv}
        exporting={exporting}
      />

      <LiveKPIs overview={overview} loading={loading} range={range} />

      <Scorecards overview={overview} loading={loading} />

      <FlowAndRevenue data={flowData} loading={flowLoading} />

      <ArenaHeatmap data={heatmap} loading={heatmapLoading} />

      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg"
        aria-label={tl('Activity & facilities')}
      >
        <div className="lg:col-span-8 min-w-0">
          <AuditFeed events={audit} loading={auditLoading} />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <FacilityNodeCard nodes={nodes} loading={nodesLoading} />
        </div>
      </section>
    </main>
  );
}

/* ============================================
   LIVE KPIS
   ============================================ */

// Skeleton that holds the same footprint as the loaded number, preventing
// layout shift when data arrives.
function ValueSkeleton() {
  return <span className="inline-block w-16 h-5 rounded bg-surface-container-highest animate-pulse align-middle" />;
}

function KpiCard({ icon, label, value, sub, subTone = 'default', footer, loading, delay, href }) {
  const reduce = useReducedMotion();
  const tone =
    subTone === 'accent'
      ? 'text-primary font-bold'
      : subTone === 'warning'
      ? 'text-amber-400 font-bold'
      : 'text-on-surface-variant';

  const Wrapper = href ? Link : 'div';
  const wrapperProps = href
    ? { to: href, 'aria-label': `${label} — ${footer || ''}`.trim() }
    : {};

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : delay }}
    >
      <Wrapper
        {...wrapperProps}
        className={`group h-full bg-surface-container p-4 rounded-lg flex flex-col gap-2 hover:bg-surface-container-high transition-colors ${
          href ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
            {label}
          </span>
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0" aria-hidden="true">
            {icon}
          </span>
        </div>

        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-headline-md text-headline-md text-on-surface leading-none tabular-nums truncate">
            {loading ? <ValueSkeleton /> : value}
          </span>
          {sub && <span className={`font-label-md text-[10px] ${tone} truncate`}>{sub}</span>}
        </div>

        {footer && (
          <span className="font-label-md text-[10px] text-on-surface-variant truncate mt-auto">
            {footer}
          </span>
        )}
      </Wrapper>
    </motion.div>
  );
}

function LiveKPIs({ overview, loading, range }) {
  const expiringSoon = overview?.members?.expiring_soon ?? 0;
  const pendingApprovals = overview?.content?.pending_approvals ?? 0;

  const kpis = useMemo(() => [
    {
      key: 'check_ins',
      label: tl('Check-ins'),
      value: overview?.activity?.check_ins_today ?? '—',
      sub: tl('today'),
      subTone: 'accent',
      footer: tl('Gate + desk check-ins'),
      icon: 'door_sliding',
    },
    {
      key: 'active_members',
      label: tl('Active Members'),
      value: overview?.members?.active_memberships ?? '—',
      sub: tl('{0} total', { 0: overview?.members?.total ?? 0 }),
      subTone: 'default',
      footer: expiringSoon > 0
        ? tl('{0} expiring soon', { 0: expiringSoon })
        : tl('No expiries this period'),
      footerTone: expiringSoon > 0 ? 'warning' : 'default',
      href: expiringSoon > 0 ? '/admin/members?filter=expiring' : undefined,
      icon: 'group',
    },
    {
      key: 'revenue',
      label: tl('Revenue'),
      value: overview ? formatSAR(overview.revenue.last_30d) : '—',
      sub: tl('{0} payments', { 0: overview?.revenue?.transaction_count ?? 0 }),
      subTone: 'accent',
      footer: overview?.revenue?.range_label || '',
      icon: 'payments',
    },
    {
      key: 'content',
      label: tl('Content'),
      value: overview?.content?.active_courses ?? '—',
      sub: pendingApprovals > 0
        ? tl('{0} pending', { 0: pendingApprovals })
        : tl('Up to date'),
      subTone: pendingApprovals > 0 ? 'warning' : 'default',
      footer: tl('Active courses'),
      href: pendingApprovals > 0 ? '/admin/trainers' : undefined,
      icon: 'school',
    },
  ], [overview, expiringSoon, pendingApprovals]);

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
      aria-label={tl('Live KPIs')}
      aria-busy={loading}
      aria-live="polite"
    >
      {kpis.map((kpi, i) => (
        <KpiCard
          key={kpi.key}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          sub={kpi.sub}
          subTone={kpi.subTone}
          footer={kpi.footer}
          footerTone={kpi.footerTone}
          loading={loading && !overview}
          delay={i * 0.08}
          href={kpi.href}
        />
      ))}
    </section>
  );
}