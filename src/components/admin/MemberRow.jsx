import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tierColors, statusColors } from '../../data/adminMembers';

export default function MemberRow({ member, isSelected, onSelect, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  const tier = tierColors[member.tier] || tierColors.Basic;
  const status = statusColors[member.status] || statusColors.active;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={`group transition-colors ${
        isSelected
          ? 'bg-primary-container/10'
          : 'hover:bg-surface-container-high/60'
      }`}
    >
      {/* Checkbox */}
      <td className="py-3 px-4 w-12">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(member.id)}
            className="peer sr-only"
          />
          <span className="w-[18px] h-[18px] rounded-sm border-2 border-surface-container-highest bg-surface-container-low flex items-center justify-center peer-checked:bg-primary-container peer-checked:border-primary-container transition-all">
            {isSelected && (
              <span className="material-symbols-outlined text-[14px] text-on-primary-container font-bold">
                check
              </span>
            )}
          </span>
        </label>
      </td>

      {/* Member */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[13px] ${
                member.isVip
                  ? 'bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.4)]'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {member.avatar}
            </div>
            {member.isVip && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined text-[10px] font-bold">
                  star
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-title-md text-on-surface truncate">
                {member.name}
              </span>
              {member.isVip && (
                <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-[9px] uppercase tracking-wider font-bold">
                  VIP
                </span>
              )}
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant text-[12px] truncate">
              {member.email}
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
              ID: #{member.id}
            </span>
          </div>
        </div>
      </td>

      {/* Tier */}
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${tier.badge}`}
        >
          {member.tier}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${member.status === 'active' ? 'animate-pulse' : ''}`} />
          {status.label}
        </span>
      </td>

      {/* Expires */}
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-on-surface text-[13px]">
            {member.expires}
          </span>
          <span
            className={`font-label-md text-[10px] uppercase tracking-wider ${
              member.daysLeft <= 14 ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            {member.daysLeft <= 14 ? `⚠️ ${member.daysLeft} days left` : `${member.daysLeft} days`}
          </span>
        </div>
      </td>

      {/* Last Visit */}
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-body-md text-body-md text-on-surface text-[12px]">
            {member.lastVisit}
          </span>
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            {member.checkIns} check-ins
          </span>
        </div>
      </td>

      {/* Lifetime Value */}
      <td className="py-3 px-4 text-right">
        <span className="font-title-md text-title-md text-primary font-bold">
          ${member.lifetimeValue.toLocaleString()}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right relative">
        <div className="flex items-center gap-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAction('view', member)}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
            title="View profile"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            onClick={() => onAction('edit', member)}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
            title="Edit"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
              title="More"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                more_vert
              </span>
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg shadow-2xl z-50 overflow-hidden"
                  >
                    <MenuAction
                      icon="mail"
                      label="Send Message"
                      onClick={() => {
                        onAction('message', member);
                        setShowMenu(false);
                      }}
                    />
                    <MenuAction
                      icon="pause_circle"
                      label="Freeze Membership"
                      onClick={() => {
                        onAction('freeze', member);
                        setShowMenu(false);
                      }}
                    />
                    <MenuAction
                      icon="refresh"
                      label="Renew Membership"
                      onClick={() => {
                        onAction('renew', member);
                        setShowMenu(false);
                      }}
                    />
                    <div className="border-t border-[#1a1a1e]" />
                    <MenuAction
                      icon="delete"
                      label="Delete Member"
                      onClick={() => {
                        onAction('delete', member);
                        setShowMenu(false);
                      }}
                      danger
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

function MenuAction({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left font-body-md text-body-md transition-colors ${
        danger
          ? 'text-error hover:bg-error/10'
          : 'text-on-surface hover:bg-surface-container-high'
      }`}
      type="button"
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      <span className="text-[13px]">{label}</span>
    </button>
  );
}