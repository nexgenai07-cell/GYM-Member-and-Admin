// src/pages/admin/AdminReports.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { reportsService } from '../../services/reportsService';

const formatIcons = {
  PDF: 'picture_as_pdf',
  CSV: 'table_chart',
  XLSX: 'table_view',
};

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('templates');
  const [generating, setGenerating] = useState(null);

  const {
    data: templates,
    loading: templatesLoading,
    refetch: refetchTemplates,
  } = useApi(() => reportsService.templates(), []);

  const {
    data: history,
    loading: historyLoading,
    refetch: refetchHistory,
  } = useApi(() => reportsService.history(), []);

  const templatesList = Array.isArray(templates) ? templates : [];
  const historyList = Array.isArray(history) ? history : [];
  const loading = templatesLoading || historyLoading;

  // ============================================
  // HANDLERS
  // ============================================
  const handleGenerate = async (template) => {
    setGenerating(template.key);
    try {
      const period = new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const report = await reportsService.generate({
        template_key: template.key,
        period,
        format: 'PDF',
      });

      toast.success(`${report.name} generated!`);
      await refetchHistory();
      setActiveTab('history'); // auto-switch so user sees the new report
    } catch (e) {
      const msg = e?.response?.data?.detail || 'Failed to generate report';
      toast.error(msg);
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = async (report) => {
    try {
      const info = await reportsService.download(report.report_id);

      if (info.file_url) {
        // Real file exists — open it
        window.open(info.file_url, '_blank');
        toast.success(`Downloading ${info.name}`);
      } else {
        // No file yet — show helpful message
        toast.success(
          `${info.name} (${info.format}) — ${(info.size_kb / 1024).toFixed(1)} MB`,
          { icon: '📄' }
        );
      }
    } catch (e) {
      toast.error('Failed to download');
    }
  };

  const handleDelete = async (report) => {
    if (!confirm(`Delete "${report.name}"?`)) return;
    try {
      await reportsService.deleteReport(report.report_id);
      toast.success('Report deleted');
      refetchHistory();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">assessment</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Analytics & Reports
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Reports Center
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Generate operational reports on-demand. Exports include PDF, CSV, and Excel formats.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg uppercase tracking-wider transition-all ${
            activeTab === 'templates'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          Templates ({templatesList.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-label-lg text-label-lg uppercase tracking-wider transition-all ${
            activeTab === 'history'
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          History ({historyList.length})
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-surface-container rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : activeTab === 'templates' ? (
        /* ============ TEMPLATES TAB ============ */
        templatesList.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              description
            </span>
            <p className="font-title-md text-title-md text-on-surface mt-3">
              No templates
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Run: <code className="px-2 py-0.5 bg-surface-container rounded">python manage.py seed_reports</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {templatesList.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className={`relative bg-surface-container rounded-xl p-5 shadow-md hover:shadow-xl transition-all flex flex-col gap-3 ${
                  t.is_featured ? 'border border-primary-container/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      t.is_featured
                        ? 'bg-primary-container/20 text-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {t.icon}
                    </span>
                  </div>
                  {t.is_active && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-400 font-label-md text-[10px] uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface">
                    {t.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-high mt-auto">
                  <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {t.frequency}
                  </span>
                  <button
                    onClick={() => handleGenerate(t)}
                    disabled={generating === t.key}
                    className={`flex items-center gap-1 font-label-md text-[10px] uppercase tracking-wider font-bold transition-opacity ${
                      generating === t.key
                        ? 'text-on-surface-variant opacity-50 cursor-not-allowed'
                        : 'text-primary hover:underline'
                    }`}
                    type="button"
                  >
                    {generating === t.key ? 'Generating...' : 'Generate'}
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* ============ HISTORY TAB ============ */
        historyList.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              description
            </span>
            <p className="font-title-md text-title-md text-on-surface mt-3">
              No reports generated yet
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Generate one from the Templates tab.
            </p>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 text-left">Report</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Period</th>
                    <th className="py-3 px-4 text-left">Generated</th>
                    <th className="py-3 px-4 text-left">Format</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest/50">
                  {historyList.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-surface-container-high/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-title-md text-[13px] text-on-surface">
                            {r.name}
                          </span>
                          <span className="font-label-md text-[10px] text-on-surface-variant/60 uppercase">
                            {r.report_id} · by {r.generated_by_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                          {r.report_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-body-md text-body-md text-on-surface text-[13px]">
                          {r.period}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-label-md text-[11px] text-on-surface-variant">
                          {r.time_ago}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            {formatIcons[r.format] || 'description'}
                          </span>
                          <span className="font-label-md text-[11px] text-on-surface-variant font-bold uppercase">
                            {r.format}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownload(r)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              download
                            </span>
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            className="w-8 h-8 rounded-lg hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                            type="button"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}