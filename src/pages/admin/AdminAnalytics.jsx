// src/pages/admin/AdminAnalytics.jsx
// Insights: membership health, visits, member movement per month, and rule-based
// recommendations that link to the page where you act on them. All from live data.
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/site/SiteUi';
import MonthlyColumns from '../../components/admin/MonthlyColumns';

const TONE = {
  high: 'border-primary-container', medium: 'border-amber-400', low: 'border-[#2a2a2e]',
};
const CHIP = {
  high: 'bg-primary-container/20 text-primary', medium: 'bg-amber-400/15 text-amber-300', low: 'bg-[#1a1a1e] text-on-surface-variant',
};

export default function AdminAnalytics() {
  const { data: k } = useApi(() => adminService.analyticsKPIs(), []);
  const { data: growth, loading: growthLoading } = useApi(() => adminService.analyticsGrowth(), []);
  const { data: insights, loading: insightsLoading } = useApi(() => adminService.aiInsights(), []);
  const months = Array.isArray(growth) ? growth : [];
  const list = Array.isArray(insights) ? insights : [];

  const tiles = [
    ['Active members', k?.active_members, k ? `of ${k.total_members} accounts` : ''],
    ['New members', k?.new_members_30d, 'last 30 days'],
    ['Lapsed', k?.lapsed_90d, 'ended in 90 days, not renewed'],
    ['Visited the gym', k?.visit_rate == null ? '—' : `${k.visit_rate}%`, k ? `${k.active_visitors_30d} active members, last 30 days` : ''],
    ['Visits', k?.visits_30d, 'last 30 days'],
    ['Average visit', k?.avg_visit_minutes == null ? '—' : `${k.avg_visit_minutes} min`, 'checked-out visits'],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title="Insights" subtitle="How the membership is doing and what needs attention — worked out from live data." />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {tiles.map(([label, value, hint]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3">
            <div className="text-[22px] font-bold text-on-surface">{value ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
            {hint && <div className="text-[11px] text-on-surface-variant/70 mt-0.5">{hint}</div>}
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-[18px] uppercase text-on-surface">Needs attention</h2>
          <span className="text-[11px] text-on-surface-variant">{list.length} item{list.length === 1 ? '' : 's'}</span>
        </div>
        {insightsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2].map((i) => <div key={i} className="h-28 bg-[#0e0e0f] rounded-lg animate-pulse" />)}</div>
        ) : list.length === 0 ? (
          <div className="py-10 text-center bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg text-on-surface-variant text-[13px]">
            All clear — nothing needs attention right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((i) => (
              <div key={i.title} className={`bg-[#0e0e0f] border border-[#1a1a1e] border-l-4 ${TONE[i.priority]} rounded-lg p-4 flex gap-3`}>
                <span className="material-symbols-outlined text-primary text-[22px]">{i.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-on-surface font-bold">{i.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${CHIP[i.priority]}`}>{i.priority}</span>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mt-1">{i.description}</p>
                  <Link to={i.path} className="inline-flex items-center gap-1 mt-2 text-[11px] text-primary font-bold uppercase tracking-wider hover:underline">
                    {i.action}<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlyColumns loading={growthLoading} title="New members per month" unit="New members"
          rows={months.map((m) => ({ month: m.month, short: m.short, value: m.new_members }))} empty="No sign-ups in the last 12 months." />
        <MonthlyColumns loading={growthLoading} title="Memberships lapsed per month" unit="Lapsed"
          rows={months.map((m) => ({ month: m.month, short: m.short, value: m.ended }))} empty="No memberships lapsed in the last 12 months." />
      </div>
    </div>
  );
}
