import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';

export default function AdminAnalytics() {
  const [kpis, setKpis] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.analyticsKPIs(),
      adminService.analyticsGrowth(),
      adminService.aiInsights(),
    ])
      .then(([k, g, i]) => {
        setKpis(k);
        setGrowth(g);
        setInsights(i);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">insights</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Intelligence Console
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          AI Business Insights
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Deep analytics and automated recommendations from system data patterns.
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnalyticsStat
          label="Total Members"
          value={kpis?.total_members ?? '—'}
          delta={`+${kpis?.new_members_30d ?? 0} this month`}
          icon="groups"
          accent
        />
        <AnalyticsStat
          label="Avg Session Length"
          value={kpis?.avg_session_minutes ? `${kpis.avg_session_minutes}m` : '—'}
          delta="Per workout"
          icon="timer"
        />
        <AnalyticsStat
          label="Retention Rate"
          value={kpis?.retention_rate ? `${kpis.retention_rate}%` : '—'}
          delta="Active memberships"
          icon="trending_up"
          accent
        />
        <AnalyticsStat
          label="30-Day New Members"
          value={kpis?.new_members_30d ?? '—'}
          delta="Rolling 30d"
          icon="person_add"
        />
      </div>

      {/* Growth chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-container p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              Membership Growth
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              Monthly New Members
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="h-48 bg-surface-container-low rounded animate-pulse" />
        ) : growth.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">
              show_chart
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Not enough data yet
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {growth.map((g, i) => {
              const max = Math.max(...growth.map((x) => x.new_members));
              const height = max > 0 ? (g.new_members / max) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full bg-primary-container rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    style={{ minHeight: '4px' }}
                  />
                  <span className="font-label-md text-[9px] text-on-surface-variant uppercase">
                    {g.month.split(' ')[0]}
                  </span>
                  <span className="font-title-md text-title-md text-primary">
                    {g.new_members}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
              Automated Recommendations
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              AI Insights
            </h2>
          </div>
          <span className="px-3 py-1 rounded bg-primary-container/20 text-primary font-label-md text-[10px] uppercase tracking-wider font-bold">
            {insights.length} Active
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-surface-container rounded animate-pulse" />
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              check_circle
            </span>
            <p className="font-title-md text-title-md text-on-surface mt-3">
              All Clear
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No urgent insights right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`bg-surface-container p-5 rounded-xl shadow-md border-l-4 ${
                  insight.priority === 'high'
                    ? 'border-primary-container'
                    : insight.priority === 'medium'
                    ? 'border-yellow-400'
                    : 'border-surface-bright'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary">
                    {insight.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-title-lg text-title-lg text-on-surface">
                        {insight.title}
                      </h3>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          insight.priority === 'high'
                            ? 'bg-primary-container/20 text-primary'
                            : insight.priority === 'medium'
                            ? 'bg-yellow-400/15 text-yellow-400'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      {insight.description}
                    </p>
                    <button
                      className="mt-3 flex items-center gap-1 font-label-md text-[10px] text-primary uppercase tracking-wider font-bold hover:underline"
                      type="button"
                    >
                      {insight.action}
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function AnalyticsStat({ label, value, delta, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
        accent ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className="relative w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accent ? 'rgba(229, 25, 55, 0.2)' : '#2a2a2b' }}>
        <span className={`material-symbols-outlined text-[20px] ${accent ? 'text-primary' : 'text-on-surface-variant'}`}>
          {icon}
        </span>
      </div>
      <span className="relative font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider block">
        {label}
      </span>
      <span className={`relative block font-headline-md text-headline-md leading-none mt-1 ${accent ? 'text-primary' : 'text-on-surface'}`}>
        {value}
      </span>
      <span className="relative font-label-md text-[10px] text-on-surface-variant mt-1 block">
        {delta}
      </span>
    </motion.div>
  );
}