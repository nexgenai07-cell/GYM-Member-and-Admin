// src/pages/admin/SiteContent.jsx
// Every text (English + Arabic) and image slot of the public website.
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentService as api } from '../../services/siteContentService';
import { errorMessage } from '../../utils/apiError';
import { BilingualField, Empty, ImageUploader, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { tl } from '../../i18n';

const SEARCH_LIMIT = 100;

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

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader
        title={tl("Site Content")}
        subtitle={tl("Every text and image on the public website. Changes go live within about a minute; anything can be reset to the original.")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav aria-label={tl("Website pages")} className="flex lg:flex-col gap-1 overflow-x-auto">
          {pages.map((p) => {
            const edited = p.texts_customized + p.images_customized;
            return (
              <button
                key={p.page}
                type="button"
                onClick={() => setPage(p.page)}
                className={`text-left px-3 py-2 rounded text-[12px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center justify-between gap-2 ${
                  page === p.page ? 'bg-primary-container text-on-primary-container' : 'bg-[#0e0e0f] text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[10px] opacity-70 font-normal normal-case">
                  {p.texts + p.images}{edited ? tl(" · {0} edited", { 0: edited }) : ''}
                </span>
              </button>
            );
          })}
        </nav>

        <section>
          <div className="flex gap-1 mb-4" role="tablist">
            {['texts', 'images'].map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  tab === t ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
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

  const dirtyKeys = Object.keys(edits);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { q: q.trim() || undefined, customized: onlyEdited ? 'true' : undefined };
        if (!allPages) params.page = page;
        setRows(await api.texts(params));
      } catch (err) {
        toast.error(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [page, q, allPages, onlyEdited]);

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

  const save = async (row) => {
    setBusyKey(row.key);
    try {
      applyRow(await api.updateText(row.key, valueOf(row)));
      onChanged();
      toast.success(tl("Saved"));
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyKey(null);
    }
  };

  const saveAll = async () => {
    setBusyKey('*');
    let ok = 0;
    for (const key of dirtyKeys) {
      try { applyRow(await api.updateText(key, edits[key])); ok += 1; } catch (err) { toast.error(`${key}: ${errorMessage(err)}`); }
    }
    setBusyKey(null);
    onChanged();
    if (ok) toast.success(tl("Saved {0} text{1}", { 0: ok, 1: ok === 1 ? '' : 's' }));
  };

  const reset = async (row) => {
    if (!window.confirm(tl("Reset \"{0}\" to the original English and Arabic text?", { 0: row.key }))) return;
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

  const shown = useMemo(() => rows.slice(0, SEARCH_LIMIT), [rows]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <input
          className={`${inputCls} md:w-80`}
          placeholder={tl("Search text or key (English or Arabic)")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={tl("Search texts")}
        />
        <label className="flex items-center gap-2 text-[12px] text-on-surface-variant">
          <input type="checkbox" checked={allPages} onChange={(e) => setAllPages(e.target.checked)} />{' '}{tl("All pages")}
        </label>
        <label className="flex items-center gap-2 text-[12px] text-on-surface-variant">
          <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} />{' '}{tl("Edited only")}
        </label>
        <div className="flex-1" />
        <button type="button" className={btn.primary} disabled={!dirtyKeys.length || busyKey === '*'} onClick={saveAll}>
          {busyKey === '*' ? tl("Saving…") : tl("Save all{0}", { 0: dirtyKeys.length ? ` (${dirtyKeys.length})` : '' })}
        </button>
      </div>

      {loading ? (
        <Empty>{tl("Loading…")}</Empty>
      ) : rows.length === 0 ? (
        <Empty>{tl("No texts match.")}</Empty>
      ) : (
        <>
          {rows.length > SEARCH_LIMIT && (
            <p className="text-[11px] text-on-surface-variant">
              {tl("Showing the first")}{' '}{SEARCH_LIMIT} of {rows.length}{' '}{tl("— narrow the search to see the rest.")}
            </p>
          )}
          {shown.map((row) => {
            const dirty = !!edits[row.key];
            const long = Math.max(row.default_en.length, row.en.length) > 80;
            return (
              <div
                key={row.key}
                className={`bg-[#0e0e0f] border rounded-lg p-4 flex flex-col gap-2 ${dirty ? 'border-primary-container/60' : 'border-[#1a1a1e]'}`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-[11px] text-on-surface-variant">{row.key}</code>
                  {row.is_customized && (
                    <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary text-[9px] font-bold uppercase tracking-widest">{tl("Edited")}</span>
                  )}
                  {dirty && <span className="text-[10px] text-amber-400 uppercase tracking-widest">{tl("Unsaved")}</span>}
                  <div className="flex-1" />
                  {row.is_customized && (
                    <button type="button" className={btn.ghost} disabled={busyKey === row.key} onClick={() => reset(row)}>{tl("Reset")}</button>
                  )}
                  <button type="button" className={btn.primary} disabled={!dirty || busyKey === row.key} onClick={() => save(row)}>
                    {busyKey === row.key ? tl("Saving…") : tl("Save")}
                  </button>
                </div>
                <BilingualField label="" value={valueOf(row)} onChange={(v) => change(row, v)} multiline={long} rows={3} />
                {row.is_customized && (
                  <details className="text-[11px] text-on-surface-variant">
                    <summary className="cursor-pointer select-none">{tl("Original text")}</summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                      <p className="whitespace-pre-wrap">{row.default_en}</p>
                      <p className="whitespace-pre-wrap text-right" dir="rtl" lang="ar">{row.default_ar}</p>
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </>
      )}
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
