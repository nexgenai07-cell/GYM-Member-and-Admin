// src/pages/admin/AdminRegistrations.jsx
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const STATUS_FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'payment_confirmed', label: 'Paid' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
];

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    payment_confirmed: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    expired: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
  };
  const label = status.replace('_', ' ').toUpperCase();
  return (
    <span
      className={`inline-block px-2 py-1 rounded border text-[10px] font-bold tracking-wider ${
        map[status] || map.expired
      }`}
    >
      {label}
    </span>
  );
};

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        adminService.registrations({ status: statusFilter, search }),
        adminService.registrationStats(),
      ]);
      setRegistrations(listRes.results || []);
      setStats(statsRes);
    } catch (err) {
      toast.error(err.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search]);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      const res = await adminService.approveRegistration(id);
      toast.success(
        `Approved. Pass: ${res.membership?.pass_id || 'created'}`
      );
      await load();
    } catch (err) {
      toast.error(err.message || 'Approval failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection?') ?? '';
    setBusyId(id);
    try {
      await adminService.rejectRegistration(id, reason);
      toast.success('Registration rejected');
      await load();
    } catch (err) {
      toast.error(err.message || 'Rejection failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleBulkApproveToday = async () => {
    if (!window.confirm("Approve all PAID/PENDING registrations submitted today?")) return;
    setBulkBusy(true);
    try {
      const res = await adminService.bulkApproveRegistrations({ onlyToday: true });
      toast.success(
        `Approved ${res.approved_count}. Failed: ${res.failed_count}`
      );
      await load();
    } catch (err) {
      toast.error(err.message || 'Bulk approve failed');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkApproveAll = async () => {
    if (
      !window.confirm(
        "Approve ALL pending + paid registrations (not just today)? This will create user accounts."
      )
    )
      return;
    setBulkBusy(true);
    try {
      const res = await adminService.bulkApproveRegistrations({});
      toast.success(
        `Approved ${res.approved_count}. Failed: ${res.failed_count}`
      );
      await load();
    } catch (err) {
      toast.error(err.message || 'Bulk approve failed');
    } finally {
      setBulkBusy(false);
    }
  };

  const totalPending = useMemo(
    () => (stats?.pending || 0) + (stats?.paid || 0),
    [stats]
  );

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-headline-lg text-[28px] text-on-surface uppercase tracking-wider mb-1">
          Registrations
        </h1>
        <p className="font-body-sm text-on-surface-variant text-[13px]">
          Approve public-site signups. On approval, a User + Membership is
          created automatically.
        </p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Pending', value: stats.pending, accent: 'text-amber-400' },
            { label: 'Paid', value: stats.paid, accent: 'text-sky-400' },
            { label: 'Approved', value: stats.approved, accent: 'text-emerald-400' },
            { label: 'Rejected', value: stats.rejected, accent: 'text-rose-400' },
            { label: 'Today Total', value: stats.today_total, accent: 'text-on-surface' },
            { label: 'Today Pending', value: stats.today_pending, accent: 'text-amber-400' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3"
            >
              <div className={`text-[22px] font-bold ${s.accent}`}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                statusFilter === f.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search acama / name / email / phone"
          className="bg-[#131316] border border-[#1a1a1e] rounded px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container outline-none w-full md:w-72"
        />

        <button
          onClick={handleBulkApproveToday}
          disabled={bulkBusy || totalPending === 0}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[11px] font-bold uppercase tracking-wider"
        >
          Approve Today
        </button>

        <button
          onClick={handleBulkApproveAll}
          disabled={bulkBusy || totalPending === 0}
          className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-[11px] font-bold uppercase tracking-wider"
        >
          Approve All
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-on-surface-variant text-[13px]">
          Loading…
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg text-on-surface-variant text-[13px]">
          No registrations match this filter.
        </div>
      ) : (
        <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1e] text-left text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Acama</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => {
                  const actionable =
                    r.status === 'pending' || r.status === 'payment_confirmed';
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[#1a1a1e] last:border-0 hover:bg-[#131316]"
                    >
                      <td className="px-4 py-3">
                        {r.photo_url ? (
                          <img
                            src={r.photo_url}
                            alt={r.full_name}
                            className="w-10 h-10 rounded object-cover border border-[#1a1a1e]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1a1a1e] flex items-center justify-center text-[10px] text-on-surface-variant">
                            —
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono text-on-surface">
                        {r.acama_number}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-on-surface">
                        {r.full_name}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-on-surface-variant">
                        {r.email}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-on-surface-variant">
                        {r.phone}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-on-surface">
                        {r.plan_name} · {r.duration_months} mo
                      </td>
                      <td className="px-4 py-3 text-[12px] text-on-surface">
                        ${r.payment_amount}
                      </td>
                      <td className="px-4 py-3 text-[11px] uppercase tracking-wider">
                        <span
                          className={
                            r.payment_status === 'paid'
                              ? 'text-emerald-400'
                              : r.payment_status === 'failed'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }
                        >
                          {r.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {actionable ? (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              disabled={busyId === r.id}
                              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-bold uppercase tracking-wider mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              disabled={busyId === r.id}
                              className="px-3 py-1.5 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white text-[10px] font-bold uppercase tracking-wider"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-on-surface-variant">
                            {r.created_user_email || '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}