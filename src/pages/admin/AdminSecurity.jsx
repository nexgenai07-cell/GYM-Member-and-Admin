// src/pages/admin/AdminSecurity.jsx — the signed-in admin's own 2-step verification.
import { PageHeader } from '../../components/site/SiteUi';
import SecuritySettings from '../../components/SecuritySettings';
import { tl } from '../../i18n';

export default function AdminSecurity() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 max-w-3xl">
      <PageHeader title={tl('2-step verification')}
        subtitle={tl('Admin accounts always use 2-step verification. Switch how you get codes or make new backup codes here.')} />
      <SecuritySettings />
    </div>
  );
}
