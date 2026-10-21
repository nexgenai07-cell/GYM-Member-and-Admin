// src/pages/admin/AdminMachines.jsx
// Machines members can scan. Each machine's QR holds a member-portal link
// (/dashboard/machine-guide?qr=TAG); print it and stick it on the machine.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { Drawer, Empty, PageHeader } from '../../components/site/SiteUi';
import { btn, inputCls, labelCls } from '../../components/site/siteStyles';
import { errorMessage, fieldErrors } from '../../utils/apiError';
import { machineQrLink } from '../../utils/machineQr';

const STATUS = [['', 'All'], ['active', 'Active'], ['offline', 'Offline'], ['untagged', 'No QR']];
const NEW = {
  name: '', category: 'strength', primary_muscle: 'full_body', equipment_type: '', machine_id: '', description: '',
  setup_instructions: '', technique_cues: [], video_url: '', image_url: '', default_rest_seconds: 90,
  recommended_weight_kg: '', target_intensity: '', cadence: '', is_compound: false, is_active: true,
};

export default function AdminMachines() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);
  const [qrFor, setQrFor] = useState(null);

  const { data, loading, refetch } = useApi(
    () => adminService.machines({ q: q || undefined, category: category || undefined, status: status || undefined }),
    [q, category, status]);
  const { data: stats, refetch: refetchStats } = useApi(() => adminService.machineStats(), []);
  const { data: options } = useApi(() => adminService.machineCategories(), []);
  const list = Array.isArray(data) ? data : [];
  const cats = options?.categories || [];
  const saved = () => { refetch(); refetchStats(); };

  const regenerate = async (m) => {
    if (!window.confirm(`Give ${m.name} a new QR code? The printed label stops working — you’ll need to print the new one.`)) return;
    try {
      const row = await adminService.regenerateQR(m.id);
      toast.success(`New code ${row.qr_tag_id}`);
      saved();
      setQrFor(row);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not change the code'));
    }
  };

  const tiles = [
    ['Machines', stats?.total], ['With QR', stats?.with_qr], ['Need a QR', stats?.without_qr], ['Offline', stats?.offline],
    ['Most used (30 days)', stats?.top_machine ? `${stats.top_machine} · ${stats.top_machine_count}` : 'No logs yet'],
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <PageHeader title="Machines & QR" subtitle="Members scan a machine’s QR to open its guide and log their sets.">
        <button type="button" className={btn.primary} onClick={() => setEditing(NEW)}>+ Add machine</button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg px-4 py-3 min-w-0">
            <div className="text-[20px] font-bold text-on-surface truncate" title={typeof value === 'string' ? value : undefined}>{value ?? '—'}</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {STATUS.map(([id, label]) => (
            <button key={id || 'all'} type="button" onClick={() => setStatus(id)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                status === id ? 'bg-primary-container text-on-primary-container' : 'bg-[#131316] text-on-surface-variant hover:text-on-surface'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <select className={`${inputCls} lg:w-44`} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input className={`${inputCls} lg:w-64`} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, QR code, equipment…" aria-label="Search machines" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-[#0e0e0f] rounded-lg animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Empty>{q || category || status ? 'No machines match.' : 'No machines yet — add your first one.'}</Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((m) => (
            <div key={m.id} className={`bg-[#0e0e0f] border border-[#1a1a1e] rounded-lg p-4 flex flex-col gap-3 ${m.is_active ? '' : 'opacity-60'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-primary font-bold">{m.category_label} · {m.muscle_label}</div>
                  <div className="text-on-surface font-bold truncate">{m.name}</div>
                  {m.equipment_type && <div className="text-[11px] text-on-surface-variant truncate">{m.equipment_type}</div>}
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                  m.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                  {m.is_active ? 'Active' : 'Offline'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[12px]">
                <div><div className="text-[9px] uppercase tracking-widest text-on-surface-variant">QR code</div>
                  <div className="font-mono text-primary truncate">{m.qr_tag_id || 'None'}</div></div>
                <div><div className="text-[9px] uppercase tracking-widest text-on-surface-variant">Sets, 30 days</div>
                  <div className="text-on-surface font-bold">{m.entries_30d ?? 0}</div></div>
                <div><div className="text-[9px] uppercase tracking-widest text-on-surface-variant">All time</div>
                  <div className="text-on-surface font-bold">{m.total_workout_entries}</div></div>
              </div>
              <div className="flex gap-2 mt-auto pt-3 border-t border-[#1a1a1e]">
                <button type="button" className={`${btn.ghost} flex-1`} onClick={() => setEditing(m)}>Edit</button>
                {m.qr_tag_id
                  ? <button type="button" className={`${btn.ghost} flex-1`} onClick={() => setQrFor(m)}>QR label</button>
                  : <button type="button" className={`${btn.primary} flex-1`} onClick={() => regenerate(m)}>Create QR</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <MachineEditor machine={editing} options={options} onClose={() => setEditing(null)}
        onSaved={(row, isNew) => { saved(); if (isNew) setQrFor(row); }} />}
      {qrFor && <QrLabel machine={qrFor} onClose={() => setQrFor(null)} onRegenerate={() => regenerate(qrFor)} />}
    </div>
  );
}

function Field({ label, error, hint, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
      {hint && <span className="text-[11px] text-on-surface-variant">{hint}</span>}
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
    </label>
  );
}

function MachineEditor({ machine, options, onClose, onSaved }) {
  const isNew = !machine.id;
  const [f, setF] = useState(() => ({ ...machine, technique_cues: (machine.technique_cues || []).join('\n'),
    recommended_weight_kg: machine.recommended_weight_kg ?? '' }));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async () => {
    setBusy(true);
    setErrors({});
    const body = { ...f, technique_cues: f.technique_cues };
    delete body.id; delete body.qr_tag_id; delete body.total_workout_entries; delete body.entries_30d;
    delete body.category_label; delete body.muscle_label;
    try {
      const row = isNew ? await adminService.createMachine(body) : await adminService.updateMachine(machine.id, body);
      toast.success(isNew ? `${row.name} added — print its QR label` : 'Machine saved');
      onSaved(row, isNew);
      onClose();
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err, 'Could not save the machine'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer open title={isNew ? 'Add machine' : machine.name} onClose={onClose}
      subtitle={isNew ? 'It gets a QR code as soon as it’s saved.' : `QR ${machine.qr_tag_id || 'not created yet'}`}
      footer={<>
        <button type="button" className={btn.ghost} onClick={onClose}>Cancel</button>
        <button type="button" className={btn.primary} disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Name" error={errors.name} className="md:col-span-2"><input className={inputCls} value={f.name} onChange={set('name')} placeholder="Leg Press" /></Field>
        <Field label="Category" error={errors.category}>
          <select className={inputCls} value={f.category} onChange={set('category')}>
            {(options?.categories || []).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select></Field>
        <Field label="Main muscle group" error={errors.primary_muscle}>
          <select className={inputCls} value={f.primary_muscle} onChange={set('primary_muscle')}>
            {(options?.muscles || []).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select></Field>
        <Field label="Equipment" error={errors.equipment_type}><input className={inputCls} value={f.equipment_type} onChange={set('equipment_type')} placeholder="Plate-loaded, 45° sled" /></Field>
        <Field label="Floor number / asset ID" error={errors.machine_id}><input className={inputCls} value={f.machine_id} onChange={set('machine_id')} placeholder="ST-07" /></Field>
        <Field label="What it’s for" error={errors.description} className="md:col-span-2">
          <textarea className={inputCls} rows={3} value={f.description} onChange={set('description')} /></Field>
        <Field label="Setup" error={errors.setup_instructions} className="md:col-span-2">
          <textarea className={inputCls} rows={3} value={f.setup_instructions} onChange={set('setup_instructions')} placeholder="Seat height so knees are at 90°…" /></Field>
        <Field label="Technique cues (one per line)" error={errors.technique_cues} className="md:col-span-2">
          <textarea className={inputCls} rows={4} value={f.technique_cues} onChange={set('technique_cues')} /></Field>
        <Field label="Rest between sets (seconds)" error={errors.default_rest_seconds}>
          <input className={inputCls} type="number" min="0" max="900" value={f.default_rest_seconds} onChange={set('default_rest_seconds')} /></Field>
        <Field label="Starting weight (kg, optional)" error={errors.recommended_weight_kg}>
          <input className={inputCls} inputMode="decimal" value={f.recommended_weight_kg} onChange={set('recommended_weight_kg')} /></Field>
        <Field label="Target intensity" error={errors.target_intensity}><input className={inputCls} value={f.target_intensity} onChange={set('target_intensity')} placeholder="RPE 8" /></Field>
        <Field label="Tempo" error={errors.cadence}><input className={inputCls} value={f.cadence} onChange={set('cadence')} placeholder="3-0-1-0" /></Field>
        <Field label="Video link" error={errors.video_url}><input className={inputCls} value={f.video_url} onChange={set('video_url')} placeholder="https://…" /></Field>
        <Field label="Image link" error={errors.image_url}><input className={inputCls} value={f.image_url} onChange={set('image_url')} placeholder="https://…" /></Field>
      </div>
      <div className="flex flex-col gap-2 text-[13px] text-on-surface">
        <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={!!f.is_compound} onChange={set('is_compound')} />Compound movement</label>
        <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={!!f.is_active} onChange={set('is_active')} />
          <span>In service<span className="block text-[11px] text-on-surface-variant">When off, scanning its QR says the machine is unavailable.</span></span></label>
      </div>
    </Drawer>
  );
}

function QrLabel({ machine, onClose, onRegenerate }) {
  const link = machineQrLink(machine.qr_tag_id);

  const svgMarkup = () => new XMLSerializer().serializeToString(document.getElementById('machine-qr'));

  const download = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 64, 64, 896, 896);
      const a = document.createElement('a');
      a.download = `${machine.qr_tag_id}.png`;
      a.href = c.toDataURL('image/png');
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgMarkup())))}`;
  };

  const print = () => {
    const w = window.open('', '_blank', 'width=480,height=640');
    if (!w) { toast.error('Allow pop-ups to print the label'); return; }
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(machine.qr_tag_id)}</title>
      <style>body{font-family:system-ui,sans-serif;text-align:center;margin:24px}svg{width:70mm;height:70mm}
      h1{font-size:20px;margin:12px 0 4px}p{margin:2px 0;color:#444;font-size:12px}</style></head>
      <body>${svgMarkup()}<h1>${esc(machine.name)}</h1><p>Scan with your phone or the Smart Gym app</p>
      <p><b>${esc(machine.qr_tag_id)}</b></p></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true"
      aria-label={`QR label for ${machine.name}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm bg-[#0e0e0f] border border-[#1a1a1e] rounded-xl p-5 flex flex-col items-center gap-4">
        <div className="w-full flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-primary font-bold">QR label</div>
            <div className="text-on-surface font-bold">{machine.name}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded bg-[#131316] text-on-surface-variant grid place-items-center">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="bg-white rounded-lg p-4">
          <QRCodeSVG id="machine-qr" value={link} size={200} level="M" bgColor="#ffffff" fgColor="#000000" />
        </div>
        <div className="text-center">
          <div className="font-mono text-primary font-bold">{machine.qr_tag_id}</div>
          <div className="text-[11px] text-on-surface-variant break-all mt-1">{link}</div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <button type="button" className={btn.primary} onClick={print}>Print label</button>
          <button type="button" className={btn.ghost} onClick={download}>Download PNG</button>
        </div>
        <button type="button" className="text-[11px] text-on-surface-variant underline" onClick={onRegenerate}>
          Label lost or copied? Issue a new code
        </button>
      </div>
    </div>
  );
}
