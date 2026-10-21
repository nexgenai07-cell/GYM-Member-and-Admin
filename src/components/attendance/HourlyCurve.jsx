import { motion } from 'framer-motion';

export default function HourlyCurve({ hourly }) {
  if (!hourly) {
    return (
      <div className="rounded-lg bg-surface-container p-space-lg shadow-md">
        <div className="h-64 bg-surface-container-low rounded animate-pulse" />
      </div>
    );
  }

  const memberBuckets = Array.isArray(hourly.member) ? hourly.member : [];
  const campusBuckets = Array.isArray(hourly.campus) ? hourly.campus : [];
  const peakHour = hourly.peak_hour;
  const quiet = hourly.quiet_hour;
  const pad = (h) => `${String(h).padStart(2, '0')}:00`;

  const maxCampus = Math.max(1, ...campusBuckets.map((b) => b.count));
  const maxMember = Math.max(1, ...memberBuckets.map((b) => b.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg bg-surface-container p-space-lg shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase text-primary tracking-wider font-bold">
            Your timing
          </span>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-md text-label-md uppercase">
            Last 90 days
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase mt-1">
          Your visits vs gym load
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Bars: when you check in. Line: when everyone checks in.
        </p>
      </div>

      <div className="relative py-space-sm">
        <svg className="w-full h-36 overflow-visible" viewBox="0 0 320 150" preserveAspectRatio="none">
          {/* Grid */}
          {[30, 75, 120].map((y) => (
            <line key={y} stroke="#2a2a2b" strokeDasharray="3 3" x1="0" x2="320" y1={y} y2={y} />
          ))}

          {/* Campus curve */}
          <path
            d={campusBuckets
              .map((b, i) => {
                const x = (i / 23) * 320;
                const y = 140 - (b.count / maxCampus) * 120;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#5d3f3e"
            strokeWidth="2"
          />

          {/* Member bars */}
          {memberBuckets.map((b, i) => {
            const x = (i / 23) * 300 + 10;
            const h = (b.count / maxMember) * 100;
            const isPeak = b.hour === peakHour;
            return (
              <rect
                key={i}
                fill={isPeak ? '#e51937' : b.count > 0 ? '#5d3f3e' : '#2a2a2b'}
                height={Math.max(4, h)}
                rx="2"
                width="8"
                x={x}
                y={130 - h}
              />
            );
          })}

          {/* Peak marker */}
          {peakHour != null && (
            <>
              <circle cx={(peakHour / 23) * 300 + 14} cy={30} fill="#fffcff" r="4" />
              <line stroke="#fffcff" strokeWidth="1.5" x1={(peakHour / 23) * 300 + 14} x2={(peakHour / 23) * 300 + 14} y1={30} y2={15} />
            </>
          )}
        </svg>

        <div className="flex justify-between text-on-surface-variant font-label-md text-label-md pt-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span className="text-primary font-bold">{peakHour != null ? `${pad(peakHour)} (you)` : '18:00'}</span>
          <span>23:00</span>
        </div>
      </div>

      <div className="p-space-sm rounded bg-surface-container-high flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-primary-container text-[20px]">
          lightbulb
        </span>
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-on-surface leading-tight">
            {quiet != null ? 'Quietest time' : 'Not enough data yet'}
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant text-[12px]">
            {quiet != null
              ? `The gym is quietest around ${pad(quiet)}${peakHour != null ? `; you usually arrive around ${pad(peakHour)}` : ''}.`
              : 'This fills in as members check in over the coming days.'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}