// src/pages/admin/SitePlans.jsx
// Membership plans shown on the public site's pricing and signup.
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentService as api } from '../../services/siteContentService';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { BilingualField, Drawer, Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { formatSAR } from '../../utils/money';
import { tl } from '../../i18n';

const NEW_PLAN = {
  name: '', display_name: '', display_name_ar: '', description: '', description_ar: '',
  price_monthly: '', price_annual: '', features: [], features_ar: [], session_limit_minutes: null, is_active: true,
};

export default function SitePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.plans();
        if (alive) setPlans(data);
      } catch (err) { toast.error(errorMessage(err)); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [version]);

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title={tl("Membership Plans")}
        subtitle={tl("Plans and prices on the public website and signup. Price changes apply to new signups only. A plan can be deleted until someone signs up for it; after that, hide it instead.")}
      >
        <button type="button" className={`${btn.primary} inline-flex items-center gap-1`} onClick={() => setEditing(NEW_PLAN)}>
          <span className="material-symbols-outlined text-[16px]">add</span>{tl("Add plan")}
        </button>
      </PageHeader>

      {loading ? <Empty>{tl("Loading…")}</Empty> : !plans.length ? <Empty>{tl("No plans yet.")}</Empty> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((p) => {
            const missingAr = !p.display_name_ar || (p.features.length > 0 && (p.features_ar || []).length < p.features.length);
            return (
              <div key={p.id} className={`bg-[#0e0e0f] border rounded-lg overflow-hidden flex flex-col ${p.is_active ? 'border-[#1a1a1e]' : 'border-dashed border-[#26262b] opacity-70'}`}>
                <div className={`h-1 ${p.is_active ? 'bg-gradient-to-r from-primary-container to-transparent' : 'bg-[#1a1a1e]'}`} />
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[20px] text-on-surface font-bold">{p.display_name}</span>
                        {p.display_name_ar && <span className="text-[14px] text-on-surface-variant" dir="rtl" lang="ar">{p.display_name_ar}</span>}
                      </div>
                      <code className="text-[10px] text-on-surface-variant/60">{p.name}</code>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${p.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[14px]">{p.is_active ? 'visibility' : 'visibility_off'}</span>
                      {p.is_active ? tl("On website") : tl("Hidden")}
                    </span>
                  </div>

                  <div className="flex items-end gap-5">
                    <div>
                      <div className="text-[26px] leading-none font-bold text-on-surface">{formatSAR(p.price_monthly)}</div>
                      <div className="text-[11px] text-on-surface-variant mt-1">{tl("per month")}</div>
                    </div>
                    <div className="pb-0.5">
                      <div className="text-[15px] font-bold text-on-surface-variant">{formatSAR(p.price_annual)}</div>
                      <div className="text-[11px] text-on-surface-variant">{tl("per year")}</div>
                    </div>
                  </div>

                  {p.features.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-[12px] text-on-surface">
                          <span className="material-symbols-outlined text-[15px] text-primary">check</span><span>{f}</span>
                        </li>
                      ))}
                      {p.features.length > 4 && <li className="text-[11px] text-on-surface-variant ps-5">{tl("+{0} more", { 0: p.features.length - 4 })}</li>}
                    </ul>
                  ) : <p className="text-[12px] text-on-surface-variant italic">{tl("No features listed yet.")}</p>}

                  <div className="flex flex-wrap gap-1.5 text-[11px] mt-auto">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1e] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      {p.session_limit_minutes ? tl("{0} min per visit", { 0: p.session_limit_minutes }) : tl("No visit limit")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1e] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
                      {tl(p.registrations === 1 ? "{0} signup" : "{0} signups", { 0: p.registrations })}
                    </span>
                    {missingAr && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300" title={tl("Some Arabic text is missing — the website shows English instead.")}>
                        <span className="material-symbols-outlined text-[13px]">translate</span>{tl("Arabic missing")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-[#1a1a1e] px-5 py-3">
                  <button type="button" className={`${btn.ghost} inline-flex items-center gap-1`} onClick={() => setEditing(p)}>
                    <span className="material-symbols-outlined text-[15px]">edit</span>{tl("Edit plan")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <PlanEditor
          key={editing.id || 'new'}
          plan={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

const lines = (list) => (list || []).join('\n');
const toList = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);

function PlanEditor({ plan, onClose, onSaved }) {
  const isNew = !plan.id;
  const [form, setForm] = useState({
    ...plan,
    featuresText: lines(plan.features),
    featuresArText: lines(plan.features_ar),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (field) => (value) => { setForm((f) => ({ ...f, [field]: value })); setErrors((e) => ({ ...e, [field]: undefined })); };

  const save = async () => {
    setSaving(true);
    setErrors({});
    const payload = {
      name: form.name, display_name: form.display_name, display_name_ar: form.display_name_ar,
      description: form.description, description_ar: form.description_ar,
      price_monthly: form.price_monthly, price_annual: form.price_annual,
      features: toList(form.featuresText), features_ar: toList(form.featuresArText),
      session_limit_minutes: form.session_limit_minutes === '' ? null : form.session_limit_minutes,
      is_active: form.is_active,
    };
    try {
      if (isNew) await api.createPlan(payload);
      else await api.updatePlan(plan.id, payload);
      toast.success(isNew ? 'Plan added' : 'Plan saved');
      onSaved();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl("Please fix the highlighted fields.")));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(tl("Delete the plan “{0}”? This can’t be undone.", { 0: plan.display_name }))) return;
    setSaving(true);
    try {
      await api.deletePlan(plan.id);
      toast.success(tl("Plan deleted"));
      onSaved();
    } catch (e) {
      toast.error(errorMessage(e, tl("Could not delete the plan")), { duration: 7000 });
    } finally {
      setSaving(false);
    }
  };

  const err = (f) => errors[f] && <span className="text-[11px] text-rose-400">{errors[f]}</span>;

  return (
    <Drawer
      open
      title={isNew ? tl("New plan") : plan.display_name}
      onClose={onClose}
      footer={(
        <>
          {!isNew && (
            <button type="button" className={btn.danger} disabled={saving} onClick={remove}
              title={plan.registrations ? tl("Plans with signups can’t be deleted — hide them instead.") : undefined}>
              {tl("Delete")}
            </button>
          )}
          <div className="flex-1" />
          <button type="button" className={btn.ghost} onClick={onClose}>{tl("Cancel")}</button>
          <button type="button" className={btn.primary} disabled={saving} onClick={save}>{saving ? tl("Saving…") : isNew ? tl("Create plan") : tl("Save plan")}</button>
        </>
      )}
    >
      <label className="flex flex-col gap-1">
        <span className={labelCls}>{tl("Plan code")}{' '}<span className="text-primary">*</span></span>
        <input className={inputCls} value={form.name} onChange={(e) => set('name')(e.target.value)} disabled={!isNew} placeholder={tl("e.g. student")} />
        <span className="text-[10px] text-on-surface-variant/60">{isNew ? tl("Short, unique, lowercase — used internally.") : tl("Can't be changed after creation.")}</span>
        {err('name')}
      </label>
      <BilingualField
        label={tl("Plan name")} required
        value={{ en: form.display_name, ar: form.display_name_ar }}
        onChange={(v) => { set('display_name')(v.en); set('display_name_ar')(v.ar); }}
        error={errors.display_name || errors.display_name_ar}
      />
      <BilingualField
        label={tl("Description")} multiline
        value={{ en: form.description, ar: form.description_ar }}
        onChange={(v) => { set('description')(v.en); set('description_ar')(v.ar); }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Monthly price (SAR)")}{' '}<span className="text-primary">*</span></span>
          <input className={inputCls} type="number" min="0" step="0.01" value={form.price_monthly} onChange={(e) => set('price_monthly')(e.target.value)} />
          {err('price_monthly')}
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Yearly price (SAR)")}{' '}<span className="text-primary">*</span></span>
          <input className={inputCls} type="number" min="0" step="0.01" value={form.price_annual} onChange={(e) => set('price_annual')(e.target.value)} />
          {err('price_annual')}
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Max minutes per visit")}</span>
          <input className={inputCls} type="number" min="0" value={form.session_limit_minutes ?? ''} placeholder={tl("Unlimited")} onChange={(e) => set('session_limit_minutes')(e.target.value === '' ? '' : Number(e.target.value))} />
          {err('session_limit_minutes')}
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Features (one per line)")}</span>
          <textarea className={inputCls} rows={6} value={form.featuresText} onChange={(e) => set('featuresText')(e.target.value)} />
          {err('features')}
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelCls}>الميزات (سطر لكل ميزة)</span>
          <textarea className={`${inputCls} text-right`} dir="rtl" lang="ar" rows={6} value={form.featuresArText} onChange={(e) => set('featuresArText')(e.target.value)} />
          {err('features_ar')}
        </label>
      </div>
      <label className="flex items-center gap-2 text-[13px] text-on-surface">
        <input type="checkbox" checked={!!form.is_active} onChange={(e) => set('is_active')(e.target.checked)} />
        {tl("Show this plan on the website and signup")}
      </label>
    </Drawer>
  );
}
