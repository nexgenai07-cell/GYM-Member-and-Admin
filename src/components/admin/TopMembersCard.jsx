// src/components/admin/TopMembersCard.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

// Keyed by tier_id when available; falls back to label for legacy data.
const TIER_COLORS = {
  black_elite: 'bg-gradient-to-r from-[#2a2a2e] to-[#3a3a3e] text-on-surface',
  pro: 'bg-primary-container/20 text-primary',
  basic: 'bg-surface-container-high text-on-surface-variant',
};
const TIER_COLORS_BY_LABEL = {
  'Black Elite': TIER_COLORS.black_elite,
  Pro: TIER_COLORS.pro,
  Basic: TIER_COLORS.basic,
};

export default function TopMembersCard({ data, loading }) {
  const reduce = useReducedMotion();
  const members = data?.members || [];
  const totalLtv = data?.total_ltv || 0;

  if (loading) {
    return <div className="h-96 bg-surface-container rounded-xl animate-pulse" aria-busy="true" />;
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? false : { opacity: 1, y: 0 }}
      className="bg-surface-container p-6 rounded-xl shadow-md flex flex-col gap-4 h-full"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            {tl('Top Contributors')}
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            {tl('Highest LTV Members')}
          </h2>
        </div>
        <span className="material-symbols-outlined text-primary text-[24px]" aria-hidden="true">
          workspace_premium
        </span>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant text-[13px]" role="status">
          {tl('No member data yet')}
        </div>
      ) : (
        <ol className="flex flex-col gap-2 list-none p-0 m-0">
          {members.map((m, i) => {
            const tierClass =
              TIER_COLORS[m.tier_id] || TIER_COLORS_BY_LABEL[m.tier] || TIER_COLORS.basic;
            return (
              <motion.li
                key={m.id}
                initial={reduce ? false : { opacity: 0, x: -10 }}
                animate={reduce ? false : { opacity: 1, x: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.1 + i * 0.08 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  i === 0
                    ? 'bg-primary-container/10 border border-primary-container/30'
                    : 'bg-surface-container-lowest hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 tabular-nums ${
                      i === 0
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                    aria-hidden="true"
                  >
                    {m.rank}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-[13px] text-on-surface truncate">
                      {m.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${tierClass}`}
                      >
                        {m.tier}
                      </span>
                      <span className="font-label-md text-[9px] text-on-surface-variant/60 uppercase tracking-wider tabular-nums">
                        #{m.id}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`font-title-md text-title-md whitespace-nowrap tabular-nums ${
                    i === 0 ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {formatSAR(m.ltv)}
                </span>
              </motion.li>
            );
          })}
        </ol>
      )}

      <div className="mt-auto pt-4 border-t border-surface-container-high">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            {tl('Top {0} paid in total', { 0: members.length })}
          </span>
          <span className="font-headline-md text-headline-md text-primary tabular-nums">
            {formatSAR(totalLtv)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}