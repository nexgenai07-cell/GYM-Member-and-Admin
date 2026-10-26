// src/pages/admin/SiteContent.jsx
// Every text (English + Arabic) and image slot of the public website.
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentService as api } from '../../services/siteContentService';
import { errorMessage } from '../../utils/apiError';
import { BilingualField, Empty, ImageUploader, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { tl } from '../../i18n';
import { describeKey, groupBySection } from './siteTextLabels';

const SEARCH_LIMIT = 150;   // only applies when listing every page at once

// Website pages in the side nav, grouped the way an editor thinks about them.
const PAGE_GROUPS = [
  ['Pages', ['home', 'fac', 'svc', 'ins', 'art', 'ct']],
  ['Join & payment', ['en', 'cam', 'pay']],
  ['Shared parts', ['meta', 'nav', 'foot', 'tab', 'boot', 'nf']],
];
const PAGE_ICONS = {
  home: 'home', fac: 'apartment', svc: 'fitness_center', ins: 'article', art: 'description', ct: 'mail',
  en: 'how_to_reg', cam: 'photo_camera', pay: 'payments', meta: 'travel_explore', nav: 'menu',
  foot: 'bottom_navigation', tab: 'phone_iphone', boot: 'hourglass_top', nf: 'help',
};

export default function SiteContent() {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState('home');
  const [tab, setTab] = useState('texts');

  const [pagesVersion, setPagesVersion] = useState(0);
  const loadPages = useCallback(() => setPagesVersion((v) => v + 1), []);   // refresh the edit counts
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api.pages();
        if (alive) setPages(data);
      } catch (err) { toast.error(errorMessage(err)); }
    })();
    return () => { alive = false; };
  }, [pagesVersion]);

  const groups = useMemo(() => {
    const known = new Set(PAGE_GROUPS.flatMap(([, codes]) => codes));
    const byCode = Object.fromEntries(pages.map((p) => [p.page, p]));
    const out = PAGE_GROUPS.map(([name, codes]) => [name, codes.map((c) => byCode[c]).filter(Boolean)]);
    const rest = pages.filter((p) => !known.has(p.page));
    if (rest.length) out.push(['Other', rest]);
    return out.filter(([, list]) => list.length);
  }, [pages]);
  const current = pages.find((p) => p.page === page);

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title={tl("Site Content")}
        subtitle={tl("Every text and image on the public website. Changes go live within about a minute; anything can be reset to the original.")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6 items-start">
        <nav aria-label={tl("Website pages")} className="lg:sticky lg:top-4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-2">
          {groups.map(([name, list]) => (
            <div key={name} className="flex lg:flex-col gap-0.5 shrink-0">
              <span className="hidden lg:block px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-bold">{tl(name)}</span>
              {list.map((p) => {
                const edited = p.texts_customized + p.images_customized;
                const active = page === p.page;
                return (
                  <button
                    key={p.page}
                    type="button"
                    onClick={() => setPage(p.page)}
                    aria-current={active ? 'page' : undefined}
                    className={`text-start px-2 py-1.5 rounded text-[13px] whitespace-nowrap flex items-center gap-2 transition-colors ${
                      active ? 'bg-primary-container/15 text-on-surface ring-1 ring-primary-container/60' : 'text-on-surface-variant hover:text-on-surface hover:bg-[#131316]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${active ? 'text-primary' : ''}`}>{PAGE_ICONS[p.page] || 'web'}</span>
                    <span className="flex-1 truncate">{p.label}</span>
                    {edited > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" title={tl("{0} edited", { 0: edited })} />
                    )}
                    <span className="text-[10px] text-on-surface-variant/70 tabular-nums">{p.texts + p.images}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-on-surface text-[20px] font-bold leading-tight">{current?.label || page}</h2>
              {current && (
                <p className="text-[12px] text-on-surface-variant">
                  {tl("{0} texts · {1} images", { 0: current.texts, 1: current.images })}
                  {current.texts_customized + current.images_customized > 0
                    && ` · ${tl("{0} edited", { 0: current.texts_customized + current.images_customized })}`}
                </p>
              )}
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e]" role="tablist">
              {[['texts', 'Texts', 'notes'], ['images', 'Images', 'image']].map(([t, label, icon]) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-bold ${
                    tab === t ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{icon}</span>{tl(label)}
                </button>
              ))}
            </div>
          </div>
          {tab === 'texts'
            ? <TextsPanel page={page} onChanged={loadPages} />
            : <ImagesPanel page={page} onChanged={loadPages} />}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ texts */
function TextsPanel({ page, onChanged }) {
  const [rows, setRows] = useState([]);
  const [edits, setEdits] = useState({});          // key -> {en, ar} not yet saved
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [allPages, setAllPages] = useState(false);
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [busyKey, setBusyKey] = useState(null);
  const [closed, setClosed] = useState({});         // section name -> collapsed

  const dirtyKeys = Object.keys(edits);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { customized: onlyEdited ? 'true' : undefined };
        if (!allPages) params.page = page;
        setRows(await api.texts(params));
      } catch (err) {
        toast.error(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [page, allPages, onlyEdited]);

  // Don't lose unsaved edits on refresh / tab close.
  useEffect(() => {
    if (!dirtyKeys.length) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirtyKeys.length]);

  const valueOf = (row) => edits[row.key] || { en: row.en, ar: row.ar };

  const change = (row, value) => {
    setEdits((all) => {
      const next = { ...all };
      if (value.en === row.en && value.ar === row.ar) delete next[row.key];
      else next[row.key] = value;
      return next;
    });
  };

  const applyRow = (saved) => {
    setRows((all) => all.map((r) => (r.key === saved.key ? saved : r)));
    setEdits((all) => { const next = { ...all }; delete next[saved.key]; return next; });
  };

  const saveAll = async () => {
    setBusyKey('*');
    let ok = 0;
    for (const key of dirtyKeys) {
      try { applyRow(await api.updateText(key, edits[key])); ok += 1; } catch (err) { toast.error(`${describeKey(key).label}: ${errorMessage(err)}`); }
    }
    setBusyKey(null);
    onChanged();
    if (ok) toast.success(tl("Saved {0} text{1}", { 0: ok, 1: ok === 1 ? '' : 's' }));
  };

  const discard = () => {
    if (window.confirm(tl("Throw away {0} unsaved change(s)?", { 0: dirtyKeys.length }))) setEdits({});
  };

  const reset = async (row) => {
    if (!window.confirm(tl("Reset \"{0}\" to the original English and Arabic text?", { 0: describeKey(row.key).label }))) return;
    setBusyKey(row.key);
    try {
      applyRow(await api.resetText(row.key));
      onChanged();
      toast.success(tl("Reset to original"));
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyKey(null);
    }
  };

  // Search over the internal key, both languages and the readable labels shown here.
  const matched = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const d = describeKey(r.key);
      return `${r.key} ${r.en} ${r.ar} ${d.section} ${d.label}`.toLowerCase().includes(needle);
    });
  }, [rows, q]);
  const limit = allPages ? SEARCH_LIMIT : Infinity;
  const shown = useMemo(() => matched.slice(0, limit), [matched, limit]);
  const groups = useMemo(() => groupBySection(shown, allPages), [shown, allPages]);
  const anchor = (name) => `sec-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  const searching = !!q.trim();
  const allClosed = groups.length > 0 && groups.every(([name]) => closed[name]);
  const toggleAll = () => setClosed(allClosed ? {} : Object.fromEntries(groups.map(([name]) => [name, true])));

  const chip = (on) => `flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition-colors ${
    on ? 'border-primary-container bg-primary-container/15 text-on-surface' : 'border-[#1a1a1e] text-on-surface-variant hover:text-on-surface'}`;

  return (
    <div className="flex flex-col gap-3 pb-20">
      <div className="sticky top-0 z-10 -mx-1 px-1 py-2 bg-background/95 backdrop-blur flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute start-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">search</span>
          <input
            type="search"
            className={`${inputCls} ps-9`}
            placeholder={tl("Search by section, label or text (English or Arabic)")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={tl("Search texts")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={chip(allPages)} aria-pressed={allPages} onClick={() => setAllPages((v) => !v)}>
            <span className="material-symbols-outlined text-[16px]">select_all</span>{tl("All pages")}
          </button>
          <button type="button" className={chip(onlyEdited)} aria-pressed={onlyEdited} onClick={() => setOnlyEdited((v) => !v)}>
            <span className="material-symbols-outlined text-[16px]">edit_note</span>{tl("Edited only")}
          </button>
          {groups.length > 1 && (
            <>
              <select className={`${inputCls} !w-auto max-w-[220px] !py-1.5`} value="" aria-label={tl("Jump to section")}
                onChange={(e) => {
                  const name = groups.find(([n]) => anchor(n) === e.target.value)?.[0];
                  if (name) setClosed((c) => ({ ...c, [name]: false }));
                  setTimeout(() => document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
                }}>
                <option value="">{tl("Jump to section…")}</option>
                {groups.map(([name, list]) => <option key={name} value={anchor(name)}>{tl(name)} ({list.length})</option>)}
              </select>
              <button type="button" className="text-[12px] whitespace-nowrap text-on-surface-variant hover:text-on-surface underline-offset-2 hover:underline" onClick={toggleAll}>
                {allClosed ? tl("Expand all") : tl("Collapse all")}
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] animate-pulse" />)}
        </div>
      ) : matched.length === 0 ? (
        <Empty>{onlyEdited ? tl("Nothing on this page has been edited yet.") : tl("No texts match.")}</Empty>
      ) : (
        <>
          {matched.length > limit && (
            <p className="text-[11px] text-on-surface-variant">
              {tl("Showing the first {0} of {1} — narrow the search to see the rest.", { 0: SEARCH_LIMIT, 1: matched.length })}
            </p>
          )}
          {groups.map(([name, list]) => {
            const isOpen = searching || !closed[name];
            const edited = list.filter((r) => r.is_customized).length;
            const unsaved = list.filter((r) => edits[r.key]).length;
            return (
              <section key={name} id={anchor(name)} className="scroll-mt-20 rounded-lg bg-[#0e0e0f] border border-[#1a1a1e] overflow-hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setClosed((c) => ({ ...c, [name]: !c[name] }))}
                  className="w-full flex items-center gap-2 px-4 py-3 text-start hover:bg-[#131316]"
                >
                  <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${isOpen ? '' : '-rotate-90 rtl:rotate-90'}`}>expand_more</span>
                  <h3 className="text-[14px] font-bold text-on-surface flex-1">{tl(name)}</h3>
                  {unsaved > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-bold">{tl("{0} unsaved", { 0: unsaved })}</span>}
                  {edited > 0 && <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold">{tl("{0} edited", { 0: edited })}</span>}
                  <span className="text-[11px] text-on-surface-variant tabular-nums">{list.length}</span>
                </button>
                {isOpen && (
                  <div className="divide-y divide-[#1a1a1e] border-t border-[#1a1a1e]">
                    {list.map((row) => (
                      <TextRow key={row.key} row={row} value={valueOf(row)} dirty={!!edits[row.key]}
                        busy={busyKey === row.key} onChange={(v) => change(row, v)} onReset={() => reset(row)} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}

      {dirtyKeys.length > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
          <div role="status" className="pointer-events-auto flex items-center gap-3 rounded-xl bg-[#18181b] border border-primary-container/50 shadow-2xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[13px] text-on-surface">
              {tl("{0} unsaved change(s)", { 0: dirtyKeys.length })}
            </span>
            <button type="button" className={btn.ghost} disabled={busyKey === '*'} onClick={discard}>{tl("Discard")}</button>
            <button type="button" className={btn.primary} disabled={busyKey === '*'} onClick={saveAll}>
              {busyKey === '*' ? tl("Saving…") : tl("Save all")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TextRow({ row, value, dirty, busy, onChange, onReset }) {
  const long = Math.max(row.default_en.length, row.en.length, value.en.length) > 70;
  const field = `${inputCls} ${dirty ? '!border-amber-400/60' : ''}`;
  const Tag = long ? 'textarea' : 'input';
  return (
    <div className={`grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-4 gap-y-2 px-4 py-3 ${dirty ? 'bg-amber-400/[0.03]' : ''}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold text-on-surface">{row._label}</span>
          {row.is_customized && !dirty && <span className="px-1.5 rounded bg-primary-container/20 text-primary text-[9px] font-bold uppercase tracking-wider">{tl("Edited")}</span>}
          {dirty && <span className="px-1.5 rounded bg-amber-400/15 text-amber-300 text-[9px] font-bold uppercase tracking-wider">{tl("Unsaved")}</span>}
        </div>
        <code className="block text-[10px] text-on-surface-variant/50 truncate" title={tl("Internal key")}>{row.key}</code>
        {row.is_customized && (
          <button type="button" disabled={busy} onClick={onReset}
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary disabled:opacity-40">
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>{tl("Reset to original")}
          </button>
        )}
      </div>
      <div className="min-w-0 flex flex-col gap-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="relative block">
            <span className="sr-only">{tl("English")}</span>
            <span className="absolute top-1.5 end-2 text-[9px] font-bold text-on-surface-variant/50 pointer-events-none">EN</span>
            <Tag className={`${field} pe-8`} rows={long ? 3 : undefined} value={value.en} dir="ltr"
              onChange={(e) => onChange({ ...value, en: e.target.value })} />
          </label>
          <label className="relative block">
            <span className="sr-only">{tl("Arabic")}</span>
            <span className="absolute top-1.5 start-2 text-[9px] font-bold text-on-surface-variant/50 pointer-events-none">AR</span>
            <Tag className={`${field} text-right ps-8`} rows={long ? 3 : undefined} value={value.ar} dir="rtl" lang="ar"
              onChange={(e) => onChange({ ...value, ar: e.target.value })} />
          </label>
        </div>
        {row.is_customized && (
          <details className="text-[11px] text-on-surface-variant">
            <summary className="cursor-pointer select-none w-fit hover:text-on-surface">{tl("Show original text")}</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 rounded bg-[#131316] p-2">
              <p className="whitespace-pre-wrap">{row.default_en}</p>
              <p className="whitespace-pre-wrap text-right" dir="rtl" lang="ar">{row.default_ar}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- images */
function ImagesPanel({ page, onChanged }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.images({ page });
        if (alive) setRows(data);
      } catch (err) {
        toast.error(errorMessage(err));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page]);

  const replace = (saved) => setRows((all) => all.map((r) => (r.key === saved.key ? saved : r)));

  if (loading) return <Empty>{tl("Loading…")}</Empty>;
  if (!rows.length) return <Empty>{tl("This page has no images of its own. Facility and article images are edited under Lists.")}</Empty>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rows.map((img) => (
        <ImageSlot key={img.key} img={img} onSaved={(s) => { replace(s); onChanged(); }} />
      ))}
    </div>
  );
}

function ImageSlot({ img, onSaved }) {
  const [alt, setAlt] = useState({ en: img.alt_en, ar: img.alt_ar });
  const [saving, setSaving] = useState(false);
  const altDirty = alt.en !== img.alt_en || alt.ar !== img.alt_ar;

  const upload = async (file) => {
    try {
      onSaved(await api.uploadImage(img.key, file));
      toast.success(tl("Image updated"));
    } catch (err) {
      toast.error(errorMessage(err));
      throw err;
    }
  };
  const reset = async () => {
    if (!window.confirm(tl("Remove the uploaded image and go back to the original?"))) return;
    try {
      onSaved(await api.resetImage(img.key));
      toast.success(tl("Back to the original image"));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };
  const saveAlt = async () => {
    setSaving(true);
    try {
      onSaved(await api.updateImageAlt(img.key, { alt_en: alt.en, alt_ar: alt.ar }));
      toast.success(tl("Description saved"));
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-4 flex flex-col gap-3">
      <div>
        <div className="text-[13px] text-on-surface font-bold">{img.label}</div>
        <code className="text-[10px] text-on-surface-variant">{img.key}</code>
      </div>
      <ImageUploader url={img.url} customized={img.is_customized} onUpload={upload} onReset={reset} label={tl("Image")} />
      <BilingualField label={tl("Description for screen readers")} value={alt} onChange={setAlt} />
      <div>
        <button type="button" className={btn.ghost} disabled={!altDirty || saving} onClick={saveAlt}>
          {saving ? tl("Saving…") : tl("Save description")}
        </button>
      </div>
      <span className={`${labelCls} normal-case tracking-normal font-normal`}>
        {img.updated_by_email ? tl("Last changed by {0}", { 0: img.updated_by_email }) : tl("Never changed")}
      </span>
    </div>
  );
}
