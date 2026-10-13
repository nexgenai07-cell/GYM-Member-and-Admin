// src/pages/admin/AdminSettings.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';

const SECTIONS = [
  { id: 'general', label: 'General', icon: 'tune', description: 'Brand, locale, region' },
  { id: 'roles', label: 'Roles & Permissions', icon: 'badge', description: 'Access control matrix' },
  { id: 'integrations', label: 'Integrations', icon: 'extension', description: 'Connected services' },
  { id: 'security', label: 'Security', icon: 'shield', description: '2FA, sessions, policies' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', description: 'Channels & alerts' },
  { id: 'billing', label: 'Billing', icon: 'payments', description: 'Invoice & tax settings' },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading } = useApi(() => adminService.settings(), []);

  // Sync server → draft on first load
  useEffect(() => {
    if (data && !draft) {
      setDraft(JSON.parse(JSON.stringify(data)));
    }
  }, [data, draft]);

  const updateSection = (section, patch) => {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(draft);
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
              System Configuration
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
            Admin Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Configure system preferences, roles, integrations, and security policies.
          </p>
        </div>

        <button
          onClick={save}
          disabled={saving || loading || !draft}
          className={`px-5 py-3 rounded-lg font-label-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            saving || loading
              ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              : 'bg-primary-container hover:bg-secondary-container text-on-primary-container shadow-[0_0_16px_rgba(229,25,55,0.35)]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {saving ? 'hourglass_top' : 'save'}
          </span>
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-3 flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeSection === s.id
                  ? 'bg-primary-container/15 border border-primary-container/30'
                  : 'bg-surface-container-low hover:bg-surface-container-high'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[20px] mt-0.5 ${
                  activeSection === s.id ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {s.icon}
              </span>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-title-md text-[13px] ${
                    activeSection === s.id ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {s.label}
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant mt-0.5">
                  {s.description}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          {loading || !draft ? (
            <div className="bg-surface-container rounded-xl p-6 h-96 animate-pulse" />
          ) : (
            <>
              {activeSection === 'general' && (
                <GeneralSettings
                  data={draft.general}
                  onChange={(patch) => updateSection('general', patch)}
                />
              )}
              {activeSection === 'roles' && (
                <RolesSettings data={draft.roles} />
              )}
              {activeSection === 'integrations' && (
                <IntegrationsSettings data={draft.integrations} />
              )}
              {activeSection === 'security' && (
                <SecuritySettings
                  data={draft.security}
                  onChange={(patch) => updateSection('security', patch)}
                />
              )}
              {activeSection === 'notifications' && (
                <NotificationsSettings
                  data={draft.notifications}
                  onChange={(patch) => updateSection('notifications', patch)}
                />
              )}
              {activeSection === 'billing' && (
                <BillingSettings
                  data={draft.billing}
                  onChange={(patch) => updateSection('billing', patch)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================ */
/* SHARED UI                                     */
/* ============================================ */
function SettingsCard({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container rounded-xl p-6 shadow-md flex flex-col gap-4"
    >
      <div>
        <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
          {title}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </motion.div>
  );
}

function SettingsInput({ label, value, type = 'text', onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange && onChange(type === 'number' ? Number(e.target.value) : e.target.value)
        }
        className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
      <div className="flex flex-col min-w-0 pr-4">
        <span className="font-title-md text-[13px] text-on-surface">{label}</span>
        <span className="font-label-md text-[10px] text-on-surface-variant mt-0.5">
          {description}
        </span>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary-container' : 'bg-surface-container-highest'
        }`}
        type="button"
      >
        <span
          className={`block w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================ */
/* GENERAL                                       */
/* ============================================ */
function GeneralSettings({ data, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <SettingsCard
        title="Brand Identity"
        description="Manage your gym's public identity and contact information."
      >
        <SettingsInput
          label="Gym Name"
          value={data.gym_name || ''}
          onChange={(v) => onChange({ gym_name: v })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsInput
            label="Primary Email"
            type="email"
            value={data.primary_email || ''}
            onChange={(v) => onChange({ primary_email: v })}
          />
          <SettingsInput
            label="Support Phone"
            type="tel"
            value={data.support_phone || ''}
            onChange={(v) => onChange({ support_phone: v })}
          />
        </div>
        <SettingsInput
          label="Address"
          value={data.address || ''}
          onChange={(v) => onChange({ address: v })}
        />
      </SettingsCard>

      <SettingsCard
        title="Regional Preferences"
        description="Set language, timezone, and currency."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SettingsInput
            label="Language"
            value={data.language || ''}
            onChange={(v) => onChange({ language: v })}
          />
          <SettingsInput
            label="Timezone"
            value={data.timezone || ''}
            onChange={(v) => onChange({ timezone: v })}
          />
          <SettingsInput
            label="Currency"
            value={data.currency || ''}
            onChange={(v) => onChange({ currency: v })}
          />
        </div>
      </SettingsCard>
    </div>
  );
}

/* ============================================ */
/* ROLES                                         */
/* ============================================ */
function RolesSettings({ data }) {
  const rows = data?.matrix || [];
  return (
    <SettingsCard
      title="Roles & Permissions Matrix"
      description="Define what each role can access and modify."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
              <th className="py-2 px-3 text-left">Role</th>
              <th className="py-2 px-3 text-left">Members</th>
              <th className="py-2 px-3 text-left">Trainers</th>
              <th className="py-2 px-3 text-left">Finance</th>
              <th className="py-2 px-3 text-left">Machines</th>
              <th className="py-2 px-3 text-left">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest/50">
            {rows.map((p) => (
              <tr key={p.role}>
                <td className="py-2 px-3 font-title-md text-[12px] text-on-surface">
                  {p.role}
                </td>
                <td className="py-2 px-3 text-[11px] text-on-surface-variant">{p.members}</td>
                <td className="py-2 px-3 text-[11px] text-on-surface-variant">{p.trainers}</td>
                <td className="py-2 px-3 text-[11px] text-on-surface-variant">{p.finance}</td>
                <td className="py-2 px-3 text-[11px] text-on-surface-variant">{p.machines}</td>
                <td className="py-2 px-3 text-[11px] text-on-surface-variant">{p.settings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsCard>
  );
}

/* ============================================ */
/* INTEGRATIONS                                  */
/* ============================================ */
function IntegrationsSettings({ data }) {
  const services = data?.services || [];
  return (
    <SettingsCard
      title="Connected Services"
      description="Third-party integrations and API credentials."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((i) => (
          <div
            key={i.name}
            className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">{i.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-[13px] text-on-surface">{i.name}</span>
                <span className="font-label-md text-[10px] text-on-surface-variant">
                  {i.detail}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded font-label-md text-[9px] uppercase tracking-wider font-bold ${
                i.status === 'connected'
                  ? 'bg-emerald-400/15 text-emerald-400'
                  : 'bg-primary-container/20 text-primary'
              }`}
            >
              {i.status === 'connected' ? 'Connected' : 'Review'}
            </span>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

/* ============================================ */
/* SECURITY                                      */
/* ============================================ */
function SecuritySettings({ data, onChange }) {
  return (
    <SettingsCard
      title="Security & Authentication"
      description="Configure authentication policies and session controls."
    >
      <Toggle
        label="Enforce 2FA for Admins"
        description="All admin accounts must use two-factor authentication"
        checked={!!data.enforce_2fa_admins}
        onChange={(v) => onChange({ enforce_2fa_admins: v })}
      />
      <Toggle
        label="Enforce 2FA for Staff"
        description="Trainers and staff require OTP verification"
        checked={!!data.enforce_2fa_staff}
        onChange={(v) => onChange({ enforce_2fa_staff: v })}
      />
      <Toggle
        label="Biometric Login"
        description="Allow fingerprint/face ID on the mobile app"
        checked={!!data.biometric_login}
        onChange={(v) => onChange({ biometric_login: v })}
      />
      <Toggle
        label="Session Timeout (30 min)"
        description="Auto-logout inactive sessions after 30 minutes"
        checked={!!data.session_timeout_30min}
        onChange={(v) => onChange({ session_timeout_30min: v })}
      />
      <Toggle
        label="IP Whitelist for Admin"
        description="Restrict admin panel to specific IP ranges"
        checked={!!data.ip_whitelist_admin}
        onChange={(v) => onChange({ ip_whitelist_admin: v })}
      />
      <Toggle
        label="Audit Log Retention"
        description="Retain all system audit logs for 24 months"
        checked={!!data.audit_log_retention}
        onChange={(v) => onChange({ audit_log_retention: v })}
      />
    </SettingsCard>
  );
}

/* ============================================ */
/* NOTIFICATIONS                                 */
/* ============================================ */
function NotificationsSettings({ data, onChange }) {
  return (
    <SettingsCard
      title="Notification Channels"
      description="Enable or disable different types of member notifications."
    >
      <Toggle
        label="Push Notifications"
        description="Send workout reminders, streak alerts, and achievements"
        checked={!!data.push}
        onChange={(v) => onChange({ push: v })}
      />
      <Toggle
        label="Email Notifications"
        description="Send receipts, renewal reminders, and monthly reports"
        checked={!!data.email}
        onChange={(v) => onChange({ email: v })}
      />
      <Toggle
        label="WhatsApp Business"
        description="Enable WhatsApp for confirmations and reminders"
        checked={!!data.whatsapp}
        onChange={(v) => onChange({ whatsapp: v })}
      />
      <Toggle
        label="SMS Alerts"
        description="Critical alerts via SMS (higher cost)"
        checked={!!data.sms}
        onChange={(v) => onChange({ sms: v })}
      />
      <Toggle
        label="Marketing Newsletter"
        description="Include members in promotional campaigns"
        checked={!!data.marketing_newsletter}
        onChange={(v) => onChange({ marketing_newsletter: v })}
      />
    </SettingsCard>
  );
}

/* ============================================ */
/* BILLING                                       */
/* ============================================ */
function BillingSettings({ data, onChange }) {
  return (
    <SettingsCard
      title="Billing & Invoicing"
      description="Configure billing preferences and invoice details."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingsInput
          label="Default Currency"
          value={data.currency || ''}
          onChange={(v) => onChange({ currency: v })}
        />
        <SettingsInput
          label="Tax Rate (%)"
          type="number"
          value={data.tax_rate ?? 0}
          onChange={(v) => onChange({ tax_rate: v })}
        />
        <SettingsInput
          label="Invoice Prefix"
          value={data.invoice_prefix || ''}
          onChange={(v) => onChange({ invoice_prefix: v })}
        />
        <SettingsInput
          label="Payment Terms (days)"
          type="number"
          value={data.payment_terms_days ?? 30}
          onChange={(v) => onChange({ payment_terms_days: v })}
        />
      </div>
      <Toggle
        label="Auto-Charge Renewals"
        description="Automatically charge saved payment methods on renewal date"
        checked={!!data.auto_charge_renewals}
        onChange={(v) => onChange({ auto_charge_renewals: v })}
      />
      <Toggle
        label="Allow Refunds"
        description="Enable refunds for canceled subscriptions"
        checked={!!data.allow_refunds}
        onChange={(v) => onChange({ allow_refunds: v })}
      />
      <Toggle
        label="Invoice PDF Branding"
        description="Include Smart Gym logo on generated invoices"
        checked={!!data.invoice_pdf_branding}
        onChange={(v) => onChange({ invoice_pdf_branding: v })}
      />
    </SettingsCard>
  );
}