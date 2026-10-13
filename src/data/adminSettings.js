export const settingsSections = [
  {
    id: 'general',
    icon: 'settings',
    label: 'General',
    description: 'Brand identity, facility info, contact details',
  },
  {
    id: 'roles',
    icon: 'admin_panel_settings',
    label: 'Roles & Permissions',
    description: 'Access control for staff, trainers, admins',
  },
  {
    id: 'notifications',
    icon: 'notifications',
    label: 'Notifications',
    description: 'Email, SMS, WhatsApp, push notification templates',
  },
  {
    id: 'integrations',
    icon: 'extension',
    label: 'Integrations',
    description: 'Payment gateways, WhatsApp API, biometric scanners',
  },
  {
    id: 'security',
    icon: 'shield',
    label: 'Security',
    description: '2FA, session controls, audit logs, GDPR',
  },
  {
    id: 'billing',
    icon: 'receipt_long',
    label: 'Billing',
    description: 'Invoice templates, tax config, refund policies',
  },
];

export const permissions = [
  { role: 'Super Admin', members: 'Full', trainers: 'Full', finance: 'Full', machines: 'Full', settings: 'Full' },
  { role: 'Branch Manager', members: 'Own Branch', trainers: 'Approve', finance: 'View + Refund', machines: 'Own Branch', settings: 'Limited' },
  { role: 'Head Trainer', members: 'View', trainers: 'Own Content', finance: 'Own Earnings', machines: 'View', settings: '—' },
  { role: 'Trainer', members: 'Assigned Only', trainers: 'Own Content', finance: 'Own Earnings', machines: '—', settings: '—' },
  { role: 'Receptionist', members: 'Basic + Check-in', trainers: '—', finance: 'Process Only', machines: '—', settings: '—' },
  { role: 'Nutritionist', members: 'Assigned Only', trainers: '—', finance: 'Own Earnings', machines: '—', settings: '—' },
];

export const integrationStatus = [
  { name: 'Stripe', icon: 'payments', status: 'connected', detail: 'PCI DSS Level 1', color: 'text-emerald-400' },
  { name: 'WhatsApp Business', icon: 'chat', status: 'connected', detail: 'API v18.2 Active', color: 'text-emerald-400' },
  { name: 'Twilio SMS', icon: 'sms', status: 'connected', detail: 'Global Rate Active', color: 'text-emerald-400' },
  { name: 'Firebase Push', icon: 'notifications_active', status: 'connected', detail: 'FCM v1 Production', color: 'text-emerald-400' },
  { name: 'Apple Health', icon: 'favorite', status: 'connected', detail: 'HealthKit Sync', color: 'text-emerald-400' },
  { name: 'Google Fit', icon: 'fitness_center', status: 'connected', detail: 'Fit API v2', color: 'text-emerald-400' },
  { name: 'AWS S3 Storage', icon: 'cloud', status: 'connected', detail: '2.8TB Used / 10TB', color: 'text-emerald-400' },
  { name: 'SendGrid Email', icon: 'email', status: 'warning', detail: 'Rate limited - review', color: 'text-primary' },
];