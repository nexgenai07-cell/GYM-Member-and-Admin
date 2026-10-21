// src/pages/admin/FacilityPricing.jsx
// Monthly add-on price of each public-site facility. Signup charges price × membership
// months; members adding one later pay price × months remaining.
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { opsService as api } from '../../services/opsService';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls } from '../../components/site/siteStyles';

export default function FacilityPricing() {
  const [rows, setRows] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.facilityPricing();
        if (!alive) return;
        setRows(data);
        setPrices(Object.fromEntries(data.map((r) => [r.id, r.monthly_price])));
      } catch (err) { toast.error(errorMessage(err)); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [version]);

  const save = async (row, patch) => {
    setSaving(row.id);
    try {
      const updated = await api.updateFacilityPricing(row.id, patch);
      setRows((rs) => rs.map((r) => (r.id === row.id ? updated : r)));
      setPrices((p) => ({ ...p, [row.id]: updated.monthly_price }));
      toast.success(`${updated.name} saved`);
    } catch (err) {
      const f = fieldErrors(err);
      toast.error(f.monthly_price || errorMessage(err));
      load();
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title="Facility Pricing"
        subtitle="Monthly add-on price for each facility on the public website. At signup members pay price × membership months; adding one later costs price × months remaining. Price changes apply to new purchases only."
      />

      {loading ? <Empty>Loading…</Empty> : !rows.length ? (
        <Empty>No facilities yet — add them in Public Website → Facilities &amp; Articles.</Empty>
      ) : (
        <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-[#1a1a1e]">
                <th className="p-3">Facility</th>
                <th className="p-3">Price / month (SAR)</th>
                <th className="p-3">Bookable</th>
                <th className="p-3">Members with access</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const dirty = String(prices[r.id]) !== String(r.monthly_price);
                return (
                  <tr key={r.id} className={`border-b border-[#1a1a1e] last:border-0 ${r.is_active ? '' : 'opacity-60'}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {r.image_url
                          ? <img src={r.image_url} alt="" className="w-12 h-9 rounded object-cover" />
                          : <span className="w-12 h-9 rounded bg-[#131316]" />}
                        <div>
                          <div className="text-on-surface font-bold">{r.name}</div>
                          <div className="text-[11px] text-on-surface-variant">{r.category}{!r.is_active && ' · hidden on website'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 w-48">
                      <input
                        className={inputCls}
                        inputMode="decimal"
                        aria-label={`${r.name} monthly price`}
                        value={prices[r.id] ?? ''}
                        onChange={(e) => setPrices((p) => ({ ...p, [r.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter' && dirty) save(r, { monthly_price: prices[r.id] }); }}
                      />
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={r.is_bookable}
                        disabled={saving === r.id}
                        onClick={() => save(r, { is_bookable: !r.is_bookable, monthly_price: prices[r.id] })}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${r.is_bookable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'}`}
                      >
                        {r.is_bookable ? 'Bookable' : 'Not offered'}
                      </button>
                    </td>
                    <td className="p-3 text-on-surface">{r.active_members}</td>
                    <td className="p-3 text-right">
                      <button type="button" className={btn.primary} disabled={!dirty || saving === r.id}
                        onClick={() => save(r, { monthly_price: prices[r.id] })}>
                        {saving === r.id ? 'Saving…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
