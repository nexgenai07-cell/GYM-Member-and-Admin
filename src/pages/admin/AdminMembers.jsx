// src/pages/admin/AdminMembers.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';

const PAGE_SIZE = 10;

export default function AdminMembers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);

  const {
    data: rawMembers,
    loading,
    refetch: refetchMembers,
  } = useApi(
    () => {
      const params = { page };
      if (search) params.search = search;
      if (role !== 'all') params.role = role;
      return adminService.members(params);
    },
    [page, role],
    { showError: true }
  );

  const { data: stats } = useApi(() => adminService.memberStats(), []);

  const members = rawMembers?.results || rawMembers || [];
  const total = rawMembers?.count || members.length;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetchMembers();
  };

  const handleAction = async (action, member) => {
    if (action === 'delete') {
      if (!confirm(`Deactivate ${member.full_name || member.email}?`)) return;
    }
    try {
      await adminService.memberAction(member.id, action);
      toast.success(`Action "${action}" applied to ${member.full_name || member.email}`);
      refetchMembers();
    } catch (e) {
      toast.error(e?.response?.data?.detail || `Failed to ${action}`);
    }
  };

  const handleBulkAction = async (action, memberIds) => {
    if (memberIds.length === 0) {
      toast.error('No members selected');
      return;
    }
    try {
      const res = await adminService.bulkMemberAction(action, memberIds);
      toast.success(res.detail || `Bulk ${action} done`);
      refetchMembers();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Bulk action failed');
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
              Member Roster Management
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider mt-1">
            Members Directory
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Full member ledger with real-time status, role, and account telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container-high">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            Live Sync Active
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Total Members"
          value={stats?.total ?? total}
          icon="groups"
        />
        <StatTile
          label="Active"
          value={stats?.active ?? '—'}
          icon="how_to_reg"
          accent={false}
        />
        <StatTile
          label="Verified"
          value={stats?.verified ?? '—'}
          icon="check_circle"
          accent
        />
        <StatTile
          label="Expiring Soon"
          value={stats?.expiring_soon ?? '—'}
          icon="schedule"
          accent
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-container-low rounded-xl p-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'member', 'trainer', 'nutritionist', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
              className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                role === r
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-surface-container rounded animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            person_search
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            No members found
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/50">
                {members.map((m, i) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    index={i}
                    onAction={handleAction}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-surface-container-lowest flex items-center justify-between">
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
              Page {page} · {total} members
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-[11px] font-bold uppercase disabled:opacity-30"
                type="button"
              >
                Prev
              </button>
              <span className="px-3 py-1 rounded bg-primary-container text-on-primary-container text-[11px] font-bold">
                {page}
              </span>
              <button
                disabled={members.length < PAGE_SIZE}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-[11px] font-bold uppercase disabled:opacity-30"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================ */
/* MEMBER ROW                                    */
/* ============================================ */
function MemberRow({ member, index, onAction }) {
  const initials = (member.full_name || member.username || member.email || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="hover:bg-surface-container-high/60 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary-container font-bold text-[13px]">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-[13px] text-on-surface truncate">
              {member.full_name || member.username}
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant truncate">
              {member.email}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            member.role === 'admin'
              ? 'bg-primary-container text-on-primary-container'
              : member.role === 'manager'
              ? 'bg-primary-container/20 text-primary'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {member.role}
        </span>
      </td>

      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            member.is_active
              ? 'bg-emerald-400/15 text-emerald-400'
              : 'bg-error/20 text-error'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {member.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>

      <td className="py-3 px-4">
        <span className="font-body-md text-[12px] text-on-surface-variant">
          {member.phone || '—'}
        </span>
      </td>

      <td className="py-3 px-4">
        <span className="font-label-md text-[11px] text-on-surface-variant">
          {new Date(member.created_at).toLocaleDateString()}
        </span>
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn
            icon="visibility"
            label="View"
            onClick={() => onAction('view', member)}
          />
          <ActionBtn
            icon="refresh"
            label="Renew"
            onClick={() => onAction('renew', member)}
          />
          <ActionBtn
            icon="pause_circle"
            label="Freeze"
            onClick={() => onAction('freeze', member)}
          />
          <ActionBtn
            icon="delete"
            label="Delete"
            onClick={() => onAction('delete', member)}
            danger
          />
        </div>
      </td>
    </motion.tr>
  );
}

function ActionBtn({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        danger
          ? 'hover:bg-error/20 text-on-surface-variant hover:text-error'
          : 'hover:bg-surface-container-high text-on-surface-variant hover:text-primary'
      }`}
      type="button"
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
    </button>
  );
}

function StatTile({ label, value, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
        accent
          ? 'bg-primary-container/10 border border-primary-container/30'
          : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div
        className={`relative w-10 h-10 rounded-lg flex items-center justify-center ${
          accent
            ? 'bg-primary-container/20 text-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="relative font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-3 block">
        {label}
      </span>
      <span
        className={`relative block font-headline-lg text-headline-lg leading-none mt-1 ${
          accent ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
    </motion.div>
  );
}