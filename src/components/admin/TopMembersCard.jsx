// src/components/admin/TopMembersCard.jsx
import { motion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';
const tierColors = {
  'Black Elite': 'bg-gradient-to-r from-[#2a2a2e] to-[#3a3a3e] text-on-surface',
  'Pro': 'bg-primary-container/20 text-primary',
  'Basic': 'bg-surface-container-high text-on-surface-variant',
};

export default function TopMembersCard({ data, loading }) {
  const members = data?.members || [];
  const totalLtv = data?.total_ltv || 0;

  if (loading) {
    return <div className="h-96 bg-surface-container rounded-xl animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4 h-full"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {tl("Top Contributors")}
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            {tl("Highest LTV Members")}
          </h2>
        </div>
        <span className="material-symbols-outlined text-primary text-[24px]">
          workspace_premium
        </span>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant text-[13px]">
          {tl("No member data yet")}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                i === 0
                  ? 'bg-primary-container/10 border border-primary-container/30'
                  : 'bg-surface-container-lowest hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 ${
                    i === 0
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {m.rank}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md text-[13px] text-on-surface truncate">
                    {m.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${
                        tierColors[m.tier] || tierColors['Basic']
                      }`}
                    >
                      {m.tier}
                    </span>
                    <span className="font-label-md text-[9px] text-on-surface-variant/60 uppercase tracking-wider">
                      #{m.id}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`font-title-md text-title-md whitespace-nowrap ${
                  i === 0 ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {formatSAR(m.ltv)}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-surface-container-high">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            {tl("Top")}{' '}{members.length}{' '}{tl("paid in total")}
          </span>
          <span className="font-headline-md text-headline-md text-primary">
            {formatSAR(totalLtv)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}