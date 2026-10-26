// src/components/admin/RevenueChart.jsx
// Money received per month.
import MonthlyColumns from './MonthlyColumns';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

export default function RevenueChart({ data = [], loading }) {
  const rows = (Array.isArray(data) ? data : []).map((r) => ({ month: r.month, short: r.short, value: r.revenue }));
  return (
    <MonthlyColumns rows={rows} loading={loading} title={tl("Money received per month")} format={formatSAR}
      unit={tl("Received (SAR)")} empty={tl("No payments received in this period yet.")} />
  );
}
