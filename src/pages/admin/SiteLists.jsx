// src/pages/admin/SiteLists.jsx
// Admin-managed lists on the public website (facilities, articles, …).
// The form is generated from each list's schema served by the backend.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { siteContentService as api } from '../../services/siteContentService';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { BilingualField, Drawer, Empty, ImageUploader, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { tl, locale } from '../../i18n';

const emptyValue = (fd) => (fd.i18n ? { en: '', ar: '' } : '');

export default function SiteLists() {
  const [schemas, setSchemas] = useState([]);
  const [active, setActive] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);          // item, or {} for a new one
  const [busy, setBusy] = useState(false);

  const schema = useMemo(() => schemas.find((s) => s.name === active), [schemas, active]);
  // Deep links from other admin pages: ?list=facilities&edit=<id> | &new=1
  const [params, setParams] = useSearchParams();
  const [deepLink, setDeepLink] = useState(() => ({
    list: params.get('list'), edit: Number(params.get('edit')) || null, isNew: !!params.get('new'),
  }));

  useEffect(() => {
    (async () => {
      try {
        const data = await api.collections();
        setSchemas(data);
        const wanted = deepLink.list;
        setActive((a) => a || (data.some((s) => s.name === wanted) ? wanted : data[0]?.name) || null);
      } catch (err) {
        toast.error(errorMessage(err));
      }
    })();
  }, [deepLink.list]);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    if (!active) return undefined;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.items(active);
        if (!alive) return;
        setItems(data);
        if (deepLink.list === active && (deepLink.edit || deepLink.isNew)) {
          const target = deepLink.edit ? data.find((i) => i.id === deepLink.edit) : null;
          if (target) setEditing(target);
          else if (deepLink.isNew) setEditing({});
          setDeepLink({ list: null });
          setParams({}, { replace: true });
        }
      } catch (err) { toast.error(errorMessage(err)); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [active, version, deepLink, setParams]);

  const replace = (saved) => setItems((all) => {
    const exists = all.some((i) => i.id === saved.id);
    return exists ? all.map((i) => (i.id === saved.id ? saved : i)) : [...all, saved];
  });

  const toggle = async (item) => {
    try {
      replace(await api.updateItem(active, item.id, { is_active: !item.is_active }));
      toast.success(item.is_active ? 'Hidden from the website' : 'Shown on the website');
    } catch (err) { toast.error(errorMessage(err)); }
  };

  const move = async (index, delta) => {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(index + delta, 0, moved);
    setItems(next);
    setBusy(true);
    try { setItems(await api.reorder(active, next.map((i) => i.id))); }
    catch (err) { toast.error(errorMessage(err)); load(); }
    finally { setBusy(false); }
  };

  const remove = async (item) => {
    const title = item.data?.title?.en || `#${item.id}`;
    if (!window.confirm(tl("Delete \"{0}\" permanently? To take it off the website temporarily, hide it instead.", { 0: title }))) return;
    try {
      await api.deleteItem(active, item.id);
      setItems((all) => all.filter((i) => i.id !== item.id));
      toast.success(tl("Deleted"));
    } catch (err) { toast.error(errorMessage(err)); }
  };

  const choiceField = schema?.fields.find((fd) => fd.type === 'choice' && fd.required);

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title={tl("Website Lists")}
        subtitle={tl("Facilities and Insights articles shown on the public website. Hidden items stay here but disappear from the site.")}
      >
        {schema && <button type="button" className={btn.primary} onClick={() => setEditing({})}>{tl("+ Add")}{' '}{schema.label.replace(/s$/, '').toLowerCase()}</button>}
      </PageHeader>

      <div className="flex gap-1 mb-5" role="tablist">
        {schemas.map((s) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={active === s.name}
            onClick={() => setActive(s.name)}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
              active === s.name ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {s.label} <span className="opacity-60">({s.name === active ? items.length : s.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Empty>{tl("Loading…")}</Empty>
      ) : !items.length ? (
        <Empty>{tl("Nothing here yet.")}</Empty>
      ) : (
        <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1e] text-left text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3">{tl("Order")}</th>
                {schema?.has_image && <th className="px-4 py-3">{tl("Image")}</th>}
                <th className="px-4 py-3">{tl("Title")}</th>
                {choiceField && <th className="px-4 py-3">{choiceField.label.replace(/ \(.*\)/, '')}</th>}
                <th className="px-4 py-3">{tl("On website")}</th>
                <th className="px-4 py-3 text-right">{tl("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={`border-b border-[#1a1a1e] last:border-0 ${item.is_active ? '' : 'opacity-50'}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button type="button" aria-label={tl("Move up")} className="px-1 text-on-surface-variant disabled:opacity-20" disabled={busy || i === 0} onClick={() => move(i, -1)}>
                      <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                    </button>
                    <button type="button" aria-label={tl("Move down")} className="px-1 text-on-surface-variant disabled:opacity-20" disabled={busy || i === items.length - 1} onClick={() => move(i, 1)}>
                      <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                    </button>
                  </td>
                  {schema?.has_image && (
                    <td className="px-4 py-3">
                      {item.image_url
                        ? <img src={item.image_url} alt="" className="w-16 h-10 rounded object-cover border border-[#1a1a1e]" loading="lazy" />
                        : <div className="w-16 h-10 rounded bg-[#1a1a1e]" />}
                    </td>
                  )}
                  <td className="px-4 py-3 text-[13px] text-on-surface max-w-md">
                    <div className="truncate">{item.data?.title?.en || '—'}</div>
                    <div className="truncate text-[12px] text-on-surface-variant" dir="rtl" lang="ar">{item.data?.title?.ar}</div>
                  </td>
                  {choiceField && <td className="px-4 py-3 text-[12px] text-on-surface-variant">{item.data?.[choiceField.name] || '—'}</td>}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#1a1a1e] text-on-surface-variant'
                      }`}
                    >
                      {item.is_active ? tl("Visible") : tl("Hidden")}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button type="button" className={`${btn.ghost} mr-2`} onClick={() => setEditing(item)}>{tl("Edit")}</button>
                    <button type="button" className={btn.danger} onClick={() => remove(item)}>{tl("Delete")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {schema && editing && (
        <ItemEditor
          key={editing.id || 'new'}
          schema={schema}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => { replace(saved); setEditing(saved); }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ form */
function ItemEditor({ schema, item, onClose, onSaved }) {
  const isNew = !item.id;
  const [data, setData] = useState(() => Object.fromEntries(
    schema.fields.map((fd) => [fd.name, item.data?.[fd.name] ?? emptyValue(fd)]),
  ));
  const [slug, setSlug] = useState(item.slug || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (name) => (value) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = { data };
      if (!isNew && schema.has_slug && slug !== item.slug) payload.slug = slug;
      const saved = isNew
        ? await api.createItem(schema.name, payload)
        : await api.updateItem(schema.name, item.id, payload);
      onSaved(saved);
      toast.success(isNew ? 'Added — you can upload an image now' : 'Saved');
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, tl("Please fix the highlighted fields.")));
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file) => {
    try { onSaved(await api.uploadItemImage(schema.name, item.id, file)); toast.success(tl("Image updated")); }
    catch (err) { toast.error(errorMessage(err)); throw err; }
  };
  const resetImage = async () => {
    try { onSaved(await api.resetItemImage(schema.name, item.id)); toast.success(tl("Image reset")); }
    catch (err) { toast.error(errorMessage(err)); }
  };

  return (
    <Drawer
      open
      title={isNew ? tl("New {0}", { 0: schema.label.replace(/s$/, '').toLowerCase() }) : (item.data?.title?.en || tl("Edit"))}
      subtitle={isNew ? tl("English is required for required fields; Arabic is shown to visitors who switch language.") : tl("Last changed {0}{1}", { 0: new Date(item.updated_at).toLocaleString(locale), 1: item.updated_by_email ? ` by ${item.updated_by_email}` : '' })}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className={btn.ghost} onClick={onClose}>{tl("Close")}</button>
          <button type="button" className={btn.primary} disabled={saving} onClick={save}>
            {saving ? tl("Saving…") : isNew ? tl("Create") : tl("Save changes")}
          </button>
        </>
      )}
    >
      {schema.has_image && (
        isNew ? (
          <p className="text-[12px] text-on-surface-variant">{tl("Create the item first, then upload its image here.")}</p>
        ) : (
          <div className="max-w-md">
            <ImageUploader url={item.image_url} customized={!!item.uploaded_image_url} onUpload={upload} onReset={resetImage} />
          </div>
        )
      )}

      {schema.has_slug && !isNew && (
        <label className="flex flex-col gap-1">
          <span className={labelCls}>{tl("Web address (slug)")}</span>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} />
          <span className="text-[10px] text-on-surface-variant/60">{tl("Changing it breaks links people already shared.")}</span>
          {errors.slug && <span className="text-[11px] text-rose-400">{errors.slug}</span>}
        </label>
      )}

      {schema.fields.map((fd) => (
        <Field key={fd.name} fd={fd} value={data[fd.name]} onChange={set(fd.name)} error={errors[fd.name]} />
      ))}
    </Drawer>
  );
}

function Field({ fd, value, onChange, error }) {
  if (fd.i18n) {
    return (
      <BilingualField
        label={fd.label}
        value={value}
        onChange={onChange}
        multiline={fd.type === 'textarea'}
        rows={fd.name === 'body' ? 12 : 4}
        required={fd.required}
        error={error}
      />
    );
  }
  const common = { className: `${inputCls} ${error ? 'border-rose-500' : ''}`, value: value ?? '' };
  let control;
  if (fd.type === 'choice') {
    control = (
      <select {...common} onChange={(e) => onChange(e.target.value)}>
        {!fd.required && <option value="">—</option>}
        {fd.required && !value && <option value="">{tl("Choose…")}</option>}
        {fd.choices.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    );
  } else if (fd.type === 'int') {
    control = <input {...common} type="number" min="0" onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
  } else if (fd.type === 'date') {
    control = <input {...common} type="date" onChange={(e) => onChange(e.target.value)} />;
  } else if (fd.type === 'textarea') {
    control = <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />;
  } else {
    control = <input {...common} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <label className="flex flex-col gap-1">
      <span className={labelCls}>{fd.label}{fd.required && <span className="text-primary"> *</span>}</span>
      {control}
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </label>
  );
}
