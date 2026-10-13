import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemberRow from './MemberRow';

export default function MembersTable({ members, selectedIds, onSelect, onSelectAll, onAction }) {
  const allSelected = members.length > 0 && selectedIds.length === members.length;

  if (members.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden">
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-container/10 border-b border-primary-container/30 px-4 py-3 flex items-center justify-between flex-wrap gap-2"
        >
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">
            {selectedIds.length} member{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <BulkAction icon="mail" label="Message" onClick={() => onAction('bulk-message')} />
            <BulkAction icon="pause_circle" label="Freeze" onClick={() => onAction('bulk-freeze')} />
            <BulkAction icon="file_download" label="Export" onClick={() => onAction('bulk-export')} />
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
              <th className="py-3 px-4 w-12">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="peer sr-only"
                  />
                  <span className="w-[18px] h-[18px] rounded-sm border-2 border-surface-container-highest bg-surface-container-low flex items-center justify-center peer-checked:bg-primary-container peer-checked:border-primary-container transition-all">
                    {allSelected && (
                      <span className="material-symbols-outlined text-[14px] text-on-primary-container font-bold">
                        check
                      </span>
                    )}
                  </span>
                </label>
              </th>
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Expires</th>
              <th className="py-3 px-4">Last Visit</th>
              <th className="py-3 px-4 text-right">Lifetime Value</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest/50">
            <AnimatePresence>
              {members.map((m) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  isSelected={selectedIds.includes(m.id)}
                  onSelect={onSelect}
                  onAction={onAction}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BulkAction({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-[10px] uppercase tracking-wider font-bold transition-colors"
      type="button"
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-low rounded-xl p-16 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
          person_search
        </span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide mb-1">
        No Members Found
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
}