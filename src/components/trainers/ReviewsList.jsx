import { motion } from 'framer-motion';

export default function ReviewsList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-space-xl text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          rate_review
        </span>
        <p className="font-title-md text-title-md text-on-surface mt-3">
          No Reviews Yet
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Be the first to book a session and leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
          Verified Athlete Field Reports
        </h2>
        <span className="font-label-md text-label-md text-primary uppercase flex items-center gap-space-2xs">
          <span className="material-symbols-outlined text-title-md">verified_user</span>
          100% Verified
        </span>
      </div>

      <div className="flex flex-col gap-space-sm">
        {reviews.map((r, i) => {
          const memberName = r.member_name || 'Athlete';
          const initials = memberName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
              className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-lg text-label-lg text-primary">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-surface leading-tight">
                      {memberName}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      Verified Athlete
                    </span>
                  </div>
                </div>

                <div className="flex text-primary">
                  {[...Array(r.rating || 5)].map((_, idx) => (
                    <span
                      key={idx}
                      className="material-symbols-outlined text-title-md"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              <p className="font-body-md text-body-md text-on-surface mt-space-2xs">
                {r.comment}
              </p>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                Session Date: {new Date(r.created_at).toLocaleDateString()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}