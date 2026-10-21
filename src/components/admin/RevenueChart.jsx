// src/components/admin/RevenueChart.jsx
// Money received per month.
import MonthlyColumns from './MonthlyColumns';
import { formatSAR } from '../../utils/money';

export default function RevenueChart({ data = [], loading }) {
  const rows = (Array.isArray(data) ? data : []).map((r) => ({ month: r.month, short: r.short, value: r.revenue }));
  return (
    <MonthlyColumns rows={rows} loading={loading} title="Money received per month" format={formatSAR}
      unit="Received (SAR)" empty="No payments received in this period yet." />
  );
}
