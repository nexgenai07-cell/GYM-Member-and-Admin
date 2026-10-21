// src/pages/admin/AdminDashboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
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

export default function AdminDashboard() {
  const [range, setRange] = useState('30d');
  const [exporting, setExporting] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const { data: overview, loading, refetch: refetchOverview } = useApi(() => adminService.overview(range), [range]);
  const { data: flowData, loading: flowLoading, refetch: refetchFlow } = useApi(
    () => adminService.flowAndRevenue(range),
    [range]
  );
  const { data: heatmap, loading: heatmapLoading, refetch: refetchHeatmap } = useApi(
    () => adminService.arenaHeatmap(),
    []
  );
  const { data: audit, loading: auditLoading, refetch: refetchAudit } = useApi(
    () => adminService.auditFeed(20),
    []
  );
  const { data: nodes, loading: nodesLoading, refetch: refetchNodes } = useApi(
    () => adminService.facilityNodes(),
    []
  );

  const refresh = () => {
    refetchOverview(); refetchFlow(); refetchHeatmap(); refetchAudit(); refetchNodes();
    setUpdatedAt(new Date());
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportTransactions(range);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-gym-transactions-${range}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <ControlBar range={range} onRange={setRange} updatedAt={updatedAt} onRefresh={refresh}
        onExport={exportCsv} exporting={exporting} />

      <LiveKPIs overview={overview} loading={loading} />

      <Scorecards overview={overview} loading={loading} />

      <FlowAndRevenue data={flowData} loading={flowLoading} />

      <ArenaHeatmap data={heatmap} loading={heatmapLoading} />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AuditFeed events={audit} loading={auditLoading} />
        </div>
        <div className="lg:col-span-4">
          <FacilityNodeCard nodes={nodes} loading={nodesLoading} />
        </div>
      </section>
    </div>
  );
}

/* ============================================
   LIVE KPIS
   ============================================ */
function LiveKPIs({ overview, loading }) {
  const kpis = [
    {
      label: 'Check-ins',
      value: overview?.activity?.check_ins_today ?? '—',
      sub: 'today',
      subAccent: true,
      footer: 'Gate + desk check-ins',
      icon: 'door_sliding',
    },
    {
      label: 'Active Members',
      value: overview?.members?.active_memberships ?? '—',
      sub: `${overview?.members?.total ?? 0} total`,
      subAccent: false,
      footer: `${overview?.members?.expiring_soon ?? 0} expiring soon`,
      icon: 'group',
    },
    {
      label: 'Revenue',
      value: overview ? formatSAR(overview.revenue.last_30d) : '—',
      sub: `${overview?.revenue?.transaction_count ?? 0} payments`,
      subAccent: true,
      footer: overview?.revenue?.range_label || '',
      icon: 'payments',
    },
    {
      label: 'Content',
      value: overview?.content?.active_courses ?? '—',
      sub: `${overview?.content?.pending_approvals ?? 0} pending`,
      subAccent: (overview?.content?.pending_approvals ?? 0) > 0,
      footer: 'Active courses',
      icon: 'school',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="bg-surface-container p-4 rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              {kpi.label}
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">
              {kpi.icon}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-headline-md text-headline-md text-on-surface leading-none">
              {loading ? '...' : kpi.value}
            </span>
            <span
              className={`font-label-md text-[10px] ${
                kpi.subAccent
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant'
              }`}
            >
              {kpi.sub}
            </span>
          </div>

          <span className="font-label-md text-[10px] text-on-surface-variant mt-1">
            {kpi.footer}
          </span>
        </motion.div>
      ))}
    </section>
  );
}