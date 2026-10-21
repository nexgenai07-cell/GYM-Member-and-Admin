// src/pages/admin/AdminFacilities.jsx
// The gym's facilities — the same list the public website shows and members add to
// their plan. Price, bookable, capacity, open/busy/closed, and website visibility are
// set here; names, descriptions and photos in Public Website → Facilities & Articles.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { opsService as api } from '../../services/opsService';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';

const TONES = [
  { id: 'ok', label: 'Open', cls: 'bg-emerald-500/15 text-emerald-400' },
  { id: 'busy', label: 'Busy', cls: 'bg-amber-500/15 text-amber-300' },
  { id: 'closed', label: 'Closed', cls: 'bg-rose-500/15 text-rose-300' },
];

export default function AdminFacilities() {
  const [data, setData] = useState({ summary: null, results: [] });
  const [drafts, setDrafts] = useState({});        // id → { monthly_price, capacity }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.facilityPricing();
        if (!alive) return;
        setData(res);
        setDrafts(Object.fromEntries(res.results.map((r) => [r.id, { monthly_price: r.monthly_price, capacity: String(r.capacity) }])));
      } catch (err) { toast.error(errorMessage(err)); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const save = async (row, patch, message = 'Saved') => {
    setSaving(row.id);
    try {
      const updated = await api.updateFacilityPricing(row.id, patch);
      setData((d) => ({ ...d, results: d.results.map((r) => (r.id === row.id ? updated : r)) }));
      setDrafts((dr) => ({ ...dr, [row.id]: { monthly_price: updated.monthly_price, capacity: String(updated.capacity) } }));
      toast.success(`${updated.name}: ${message}`);
    } catch (err) {
      const f = fieldErrors(err);
      toast.error(f.monthly_price || f.capacity || errorMessage(err));
    } finally {
      setSaving(null);
    }
  };

  const s = data.summary;
  const stats = [
    ['Facilities', s?.total ?? '—'],
    ['On the website', s?.on_website ?? '—'],
    ['Bookable add-ons', s?.bookable ?? '—'],
    ['Members with add-ons', s?.members_with_addons ?? '—'],
    ['Add-on revenue (30 days)', s ? `SAR ${Number(s.addon_revenue_30d).toFixed(2)}` : '—'],
  ];

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title="Facilities"
        subtitle="The facilities on the public website, which members can add to their membership. Set each one's monthly add-on price, whether it can be booked, its capacity (used for live gym load), and whether it's open, busy or closed right now."
      >
        <Link to="/admin/site-lists?list=facilities&new=1" className={btn.primary}>+ Add facility</Link>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-4">
            <div className={labelCls}>{label}</div>
            <div className="text-[22px] text-on-surface font-bold mt-1">{value}</div>
          </div>
        ))}
      </div>

      {loading ? <Empty>Loading…</Empty> : !data.results.length ? (
        <Empty>No facilities yet — add your first one with “+ Add facility”.</Empty>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.results.map((r) => {
            const draft = drafts[r.id] || {};
            const dirty = String(draft.monthly_price) !== String(r.monthly_price) || String(draft.capacity) !== String(r.capacity);
            return (
              <div key={r.id} className={`bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-hidden flex flex-col sm:flex-row ${r.is_active ? '' : 'opacity-70'}`}>
                {r.image_url
                  ? <img src={r.image_url} alt="" className="sm:w-44 h-36 sm:h-auto object-cover" />
                  : <div className="sm:w-44 h-36 sm:h-auto bg-[#131316]" />}
                <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-on-surface font-bold truncate">{r.name}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {[r.category, r.location].filter(Boolean).join(' · ')} · {r.active_members} member{r.active_members === 1 ? '' : 's'} with access
                      </div>
                    </div>
                    <button type="button" role="switch" aria-checked={r.is_active} disabled={saving === r.id}
                      onClick={() => save(r, { is_active: !r.is_active }, r.is_active ? 'hidden from the website' : 'shown on the website')}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${r.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'}`}>
                      {r.is_active ? 'On website' : 'Hidden'}
                    </button>
                  </div>

                  <div className="flex gap-1 flex-wrap" role="radiogroup" aria-label={`${r.name} status`}>
                    {TONES.map((t) => (
                      <button key={t.id} type="button" role="radio" aria-checked={r.status_tone === t.id} disabled={saving === r.id}
                        onClick={() => r.status_tone !== t.id && save(r, { status_tone: t.id }, `marked ${t.label.toLowerCase()}`)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${r.status_tone === t.id ? t.cls : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1">
                      <span className={labelCls}>Add-on price / month (SAR)</span>
                      <input className={inputCls} inputMode="decimal" value={draft.monthly_price ?? ''}
                        onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: { ...draft, monthly_price: e.target.value } }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className={labelCls}>Capacity (people)</span>
                      <input className={inputCls} inputMode="numeric" value={draft.capacity ?? ''}
                        onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: { ...draft, capacity: e.target.value.replace(/\D/g, '') } }))} />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-auto">
                    <button type="button" role="switch" aria-checked={r.is_bookable} disabled={saving === r.id}
                      onClick={() => save(r, { is_bookable: !r.is_bookable, monthly_price: draft.monthly_price },
                        r.is_bookable ? 'no longer bookable' : 'bookable as an add-on')}
                      className={`px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider ${r.is_bookable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'}`}>
                      {r.is_bookable ? 'Bookable add-on' : 'Not bookable'}
                    </button>
                    <button type="button" className={btn.primary} disabled={!dirty || saving === r.id}
                      onClick={() => save(r, { monthly_price: draft.monthly_price, capacity: draft.capacity || 0 })}>
                      {saving === r.id ? 'Saving…' : 'Save'}
                    </button>
                    <Link to={`/admin/site-lists?list=facilities&edit=${r.id}`} className={btn.ghost}>Edit details &amp; photo</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
