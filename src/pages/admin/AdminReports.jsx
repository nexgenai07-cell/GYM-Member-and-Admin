// src/pages/admin/AdminReports.jsx
// CSV reports from live data for a date range (gym time). Each generated report is kept, so a
// later download matches what was generated; CSV opens in Excel and Google Sheets.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { reportsService } from '../../services/reportsService';
import { Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { GYM_TZ } from '../../utils/gymTime';
import { errorMessage } from '../../utils/apiError';
import { tl, locale } from '../../i18n';

// Today in gym time as YYYY-MM-DD (en-CA formats dates that way).
const iso = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: GYM_TZ }).format(d);
const TODAY = iso(new Date());
const shift = (s, days) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
const firstOfMonth = (s) => `${s.slice(0, 8)}01`;
const PRESETS = {
  this_month: ['This month', () => [firstOfMonth(TODAY), TODAY]],
  last_month: ['Last month', () => { const end = shift(firstOfMonth(TODAY), -1); return [firstOfMonth(end), end]; }],
  last_30: ['Last 30 days', () => [shift(TODAY, -29), TODAY]],
  ytd: ['Year to date', () => [`${TODAY.slice(0, 4)}-01-01`, TODAY]],
  custom: ['Custom', null],
};

export default function AdminReports() {
  const [preset, setPreset] = useState('this_month');
  const [range, setRange] = useState(PRESETS.this_month[1]());
  const [busy, setBusy] = useState(null);
  const { data: templates, loading, refetch: refetchTemplates } = useApi(() => reportsService.templates(), []);
  const { data: history, loading: historyLoading, refetch: refetchHistory } = useApi(() => reportsService.history(), []);
  const list = Array.isArray(templates) ? templates : [];
  const past = Array.isArray(history) ? history : [];

  const pick = (key) => {
    setPreset(key);
    if (PRESETS[key][1]) setRange(PRESETS[key][1]());
  };

  const generate = async (t) => {
    setBusy(t.key);
    try {
      const report = await reportsService.generate({ template_key: t.key, start: range[0], end: range[1] });
      toast.success(tl("{0} — {1} rows", { 0: report.name, 1: report.row_count }));
      await reportsService.download(report);
      refetchHistory();
      refetchTemplates();
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not generate the report")));
    } finally {
      setBusy(null);
    }
  };

  const download = async (r) => {
    try {
      await reportsService.download(r);
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not download the report")));
    }
  };

  const remove = async (r) => {
    if (!window.confirm(tl("Delete “{0}”?", { 0: r.name }))) return;
    try {
      await reportsService.deleteReport(r.report_id);
      toast.success(tl("Report deleted"));
      refetchHistory();
    } catch (err) {
      toast.error(errorMessage(err, tl("Could not delete the report")));
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title={tl("Reports")} subtitle={tl("Download real data as CSV (opens in Excel or Google Sheets). Dates are in gym time.")} />

      <section className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-4 flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Period")}</span>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(PRESETS).map(([key, [label]]) => (
              <button key={key} type="button" onClick={() => pick(key)}
                className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  preset === key ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1"><span className={labelCls}>{tl("From")}</span>
          <input type="date" className={inputCls} value={range[0]} max={range[1]}
            onChange={(e) => { setPreset('custom'); setRange([e.target.value, range[1]]); }} /></label>
        <label className="flex flex-col gap-1"><span className={labelCls}>{tl("To")}</span>
          <input type="date" className={inputCls} value={range[1]} min={range[0]} max={TODAY}
            onChange={(e) => { setPreset('custom'); setRange([range[0], e.target.value]); }} /></label>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((t) => (
            <div key={t.key} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">{t.icon}</span>
                <div>
                  <div className="text-on-surface font-bold">{t.title}</div>
                  <p className="text-[12px] text-on-surface-variant">{t.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a1a1e]">
                <span className="text-[11px] text-on-surface-variant">
                  {t.last_generated_at ? tl("Last run {0}", { 0: new Date(t.last_generated_at).toLocaleDateString(locale) }) : tl("Not run yet")}
                </span>
                <button type="button" className={btn.primary} disabled={busy === t.key || !range[0] || !range[1]} onClick={() => generate(t)}>
                  {busy === t.key ? tl("Building…") : tl("Download CSV")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className={labelCls}>{tl("Generated reports")}</h2>
        {historyLoading ? (
          <div className="h-24 bg-[#0e0e0f] rounded-lg animate-pulse" />
        ) : past.length === 0 ? (
          <Empty>{tl("Reports you generate are kept here.")}</Empty>
        ) : (
          <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#1a1a1e] text-left text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <th className="px-4 py-3">{tl("Report")}</th><th className="px-4 py-3">{tl("Rows")}</th><th className="px-4 py-3">{tl("Size")}</th>
                  <th className="px-4 py-3">{tl("Generated")}</th><th className="px-4 py-3 text-right">{tl("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {past.map((r) => (
                  <tr key={r.report_id} className="border-b border-[#1a1a1e] last:border-0">
                    <td className="px-4 py-3"><div className="text-on-surface">{r.name}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{r.report_id}</div></td>
                    <td className="px-4 py-3 text-on-surface-variant">{r.row_count}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{r.size_kb}{' '}{tl("KB")}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                      {new Date(r.generated_at).toLocaleString(locale)}<div className="text-[11px]">{r.generated_by_name}</div></td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button type="button" className={btn.ghost} onClick={() => download(r)}>{tl("Download")}</button>{' '}
                      <button type="button" className={btn.danger} onClick={() => remove(r)}>{tl("Delete")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
