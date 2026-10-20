// src/pages/admin/SiteInbox.jsx
// Messages sent through the public website's contact form.
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentService as api } from '../../services/siteContentService';
import { errorMessage } from '../../utils/apiError';
import { Empty, PageHeader } from '../../components/site/SiteUi';
import { btn } from '../../components/site/siteStyles';

const FILTERS = [
  { id: 'new', label: 'New' },
  { id: 'read', label: 'Read' },
  { id: 'archived', label: 'Archived' },
  { id: '', label: 'All' },
];

export default function SiteInbox() {
  const [status, setStatus] = useState('new');
  const [data, setData] = useState({ counts: {}, results: [] });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.messages(status ? { status } : {});
        if (alive) setData(res);
      } catch (err) { toast.error(errorMessage(err)); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [status, version]);

  const setMsgStatus = async (msg, next) => {
    try {
      await api.updateMessage(msg.id, { status: next });
      toast.success(next === 'archived' ? 'Archived' : next === 'read' ? 'Marked as read' : 'Marked as new');
      load();
    } catch (err) { toast.error(errorMessage(err)); }
  };

  // Mark as read in place (no reload), so the message stays open in the "New" tab.
  const openMsg = async (msg) => {
    setOpen(open === msg.id ? null : msg.id);
    if (msg.status !== 'new') return;
    try {
      await api.updateMessage(msg.id, { status: 'read' });
      setData((d) => ({
        counts: { ...d.counts, new: Math.max(0, (d.counts.new || 0) - 1), read: (d.counts.read || 0) + 1 },
        results: d.results.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m)),
      }));
    } catch (err) { toast.error(errorMessage(err)); }
  };

  const remove = async (msg) => {
    if (!window.confirm(`Delete the message from ${msg.name} permanently?`)) return;
    try { await api.deleteMessage(msg.id); toast.success('Deleted'); load(); }
    catch (err) { toast.error(errorMessage(err)); }
  };

  const total = Object.values(data.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="p-8 bg-background min-h-screen">
      <PageHeader title="Website Inbox" subtitle="Messages from the public website's contact form. Opening a message marks it as read." />

      <div className="flex gap-1 mb-5 flex-wrap" role="tablist">
        {FILTERS.map((f) => {
          const n = f.id ? data.counts[f.id] || 0 : total;
          return (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={status === f.id}
              onClick={() => { setStatus(f.id); setOpen(null); }}
              className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                status === f.id ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f.label} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>

      {loading ? <Empty>Loading…</Empty> : !data.results.length ? <Empty>No messages here.</Empty> : (
        <div className="flex flex-col gap-2">
          {data.results.map((m) => (
            <div key={m.id} className={`bg-[#0e0e0f] border rounded-lg ${m.status === 'new' ? 'border-primary-container/50' : 'border-[#1a1a1e]'}`}>
              <button type="button" onClick={() => openMsg(m)} className="w-full text-left px-4 py-3 flex items-center gap-3" aria-expanded={open === m.id}>
                {m.status === 'new' && <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" aria-label="New" />}
                <span className="text-[13px] text-on-surface font-bold truncate">{m.name}</span>
                <span className="text-[12px] text-on-surface-variant truncate hidden md:inline">{m.email}</span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant shrink-0">{[m.topic, m.subtopic].filter(Boolean).join(' / ') || 'General'}</span>
                <span className="flex-1 text-[12px] text-on-surface-variant truncate">{m.message}</span>
                <span className="text-[11px] text-on-surface-variant shrink-0">{new Date(m.created_at).toLocaleString()}</span>
              </button>
              {open === m.id && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#1a1a1e] pt-3">
                  <p className="text-[14px] text-on-surface whitespace-pre-wrap" dir="auto">{m.message}</p>
                  <div className="text-[12px] text-on-surface-variant flex gap-4 flex-wrap">
                    <span>Email: <a className="text-primary hover:underline" href={`mailto:${m.email}`}>{m.email}</a></span>
                    {m.phone && <span>Phone: <a className="text-primary hover:underline" href={`tel:${m.phone}`}>{m.phone}</a></span>}
                    {m.lang && <span>Site language: {m.lang.toUpperCase()}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <a className={btn.primary} href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message to Smart Gym')}`}>Reply by email</a>
                    {m.status !== 'new' && <button type="button" className={btn.ghost} onClick={() => setMsgStatus(m, 'new')}>Mark as new</button>}
                    {m.status !== 'archived' && <button type="button" className={btn.ghost} onClick={() => setMsgStatus(m, 'archived')}>Archive</button>}
                    <button type="button" className={btn.danger} onClick={() => remove(m)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
