import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { attendanceService } from '../../services/attendanceService';
import { tl } from '../../i18n';

const levelColors = [
  'bg-surface-container-low',
  'bg-surface-container-high',
  'bg-outline-variant',
  'bg-primary-container',
  'bg-primary',
];

const days = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function YearHeatmap() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, loading } = useApi(
    () => attendanceService.heatmap(year),
    [year]
  );

  const weeks = Array.isArray(data?.weeks) ? data.weeks : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg bg-surface-container p-space-lg shadow-md flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
        <div>
          <span className="font-label-md text-label-md uppercase text-primary tracking-wider font-bold">
            {tl("Discipline Mapping")}
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase">
            {tl("Full Year Attendance Heatmap")}
          </h2>
        </div>
        <div className="flex items-center gap-space-xs">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant">
            {tl("Filter:")}
          </span>
          <button
            onClick={() => setYear(currentYear)}
            className={`px-space-xs py-0.5 rounded font-label-md text-label-md uppercase font-bold ${
              year === currentYear
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            {currentYear}{' '}{tl("(YTD)")}
          </button>
          <button
            onClick={() => setYear(currentYear - 1)}
            className={`px-space-xs py-0.5 rounded font-label-md text-label-md uppercase ${
              year === currentYear - 1
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            {currentYear - 1}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-32 bg-surface-container-low rounded animate-pulse" />
      ) : (
        <div className="overflow-x-auto pb-space-xs">
          <div className="min-w-[700px] flex flex-col gap-1.5">
            <div className="flex text-on-surface-variant font-label-md text-label-md pl-8 justify-between pr-2">
              {months.map((m) => <span key={m}>{m}</span>)}
            </div>

            <div className="flex gap-1.5 items-start">
              <div className="flex flex-col gap-1 text-on-surface-variant font-label-md text-label-md pr-2 pt-1 select-none">
                {days.map((d, i) => (
                  <span key={i} className="h-[10px] leading-[10px]">{d}</span>
                ))}
              </div>

              <div className="flex gap-1 flex-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day, dIdx) => (
                      <motion.div
                        key={dIdx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15, delay: (wIdx * 7 + dIdx) * 0.001 }}
                        className={`w-[10px] h-[10px] rounded-sm ${levelColors[day.level]} hover:ring-2 hover:ring-primary-container transition-all cursor-pointer ${
                          !day.is_future && wIdx >= 48 ? 'animate-pulse' : ''
                        }`}
                        title={tl("{0} — {1} check-in(s)", { 0: day.date, 1: day.count })}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md mt-space-md">
        <span>{tl("Year:")}{' '}{year}</span>
        <div className="flex items-center gap-1.5">
          <span>{tl("Less")}</span>
          {levelColors.map((c, i) => (
            <span key={i} className={`w-3 h-3 rounded-sm ${c} inline-block`} />
          ))}
          <span>{tl("More")}</span>
        </div>
      </div>
    </motion.div>
  );
}