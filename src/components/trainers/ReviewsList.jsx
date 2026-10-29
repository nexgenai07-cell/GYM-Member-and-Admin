import { motion } from 'framer-motion';
import { tl, locale } from '../../i18n';

function initialsOf(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

function Stars({ rating = 0, max = 5 }) {
  const value = Math.max(0, Math.min(max, Number(rating) || 0));
  return (
    <div className="flex text-primary" aria-label={tl('{0} out of 5 stars', { 0: value })} role="img">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-title-md ${i < value ? '' : 'opacity-30'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ReviewsList({ reviews = [] }) {
  const list = Array.isArray(reviews) ? reviews : [];

  if (list.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-space-xl text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40" aria-hidden="true">
          rate_review
        </span>
        <p className="font-title-md text-title-md text-on-surface mt-3">
          {tl('No Reviews Yet')}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          {tl('Be the first to book a session and leave a review.')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
          {tl('Verified Athlete Field Reports')}
        </h2>
        <span className="font-label-md text-label-md text-primary uppercase flex items-center gap-space-2xs">
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">
            verified_user
          </span>
          {tl('100% Verified')}
        </span>
      </div>

      <ul className="flex flex-col gap-space-sm list-none p-0 m-0">
        {list.map((r, i) => {
          const memberName = r.member_name || tl('Athlete');
          return (
            <motion.li
              key={r.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
              className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div
                    className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-lg text-label-lg text-primary shrink-0"
                    aria-hidden="true"
                  >
                    {initialsOf(memberName)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-title-md text-on-surface leading-tight truncate">
                      {memberName}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      {tl('Verified Athlete')}
                    </span>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>

              {r.comment && (
                <p className="font-body-md text-body-md text-on-surface mt-space-2xs whitespace-pre-line">
                  {r.comment}
                </p>
              )}
              <time
                className="font-label-md text-label-md text-on-surface-variant uppercase"
                dateTime={r.created_at}
              >
                {tl('Session Date:')} {new Date(r.created_at).toLocaleDateString(locale)}
              </time>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}