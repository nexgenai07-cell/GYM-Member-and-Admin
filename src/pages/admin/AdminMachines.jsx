// src/pages/admin/AdminMachines.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';

export default function AdminMachines() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [qrModal, setQrModal] = useState(null);

  const { data: machines, loading, refetch } = useApi(
    () => {
      const params = {};
      if (category !== 'all') params.category = category;
      return adminService.machines(params);
    },
    [category]
  );

  const { data: stats } = useApi(() => adminService.machineStats(), []);
  const { data: categories } = useApi(
    () => adminService.machineCategories(),
    []
  );

  const list = Array.isArray(machines) ? machines : [];
  const cats = Array.isArray(categories) ? categories : [];

  const filtered = search
    ? list.filter(
        (m) =>
          m.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.qr_tag_id?.toLowerCase().includes(search.toLowerCase())
      )
    : list;

  const handleRegenerateQR = async (m) => {
    if (!confirm(`Regenerate QR for ${m.name}? Old QR will stop working.`)) return;
    try {
      const res = await adminService.regenerateQR(m.id);
      toast.success(`New QR: ${res.qr_tag_id}`);
      refetch();
    } catch (e) {
      toast.error('Failed to regenerate QR');
    }
  };

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">
            precision_manufacturing
          </span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Machine Fleet Management
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Machines & QR Fleet
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
          Real-time telemetry, QR generation, and utilization tracking.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Total Machines"
          value={stats?.total ?? '—'}
          icon="precision_manufacturing"
        />
        <StatTile
          label="QR Tagged"
          value={stats?.with_qr ?? '—'}
          icon="qr_code_2"
          accent
        />
        <StatTile
          label="Untagged"
          value={stats?.without_qr ?? '—'}
          icon="warning"
        />
        <StatTile
          label="Top Machine"
          value={stats?.top_machine_count ?? 0}
          icon="trending_up"
          accent
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-container-low rounded-xl p-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', ...cats].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                category === c
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or QR tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-surface-container rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            precision_manufacturing
          </span>
          <p className="font-title-md text-title-md text-on-surface mt-3">
            No machines found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <MachineCard
              key={m.id}
              machine={m}
              index={i}
              onViewQR={setQrModal}
              onRegenerate={handleRegenerateQR}
            />
          ))}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrModal && (
          <QRModal machine={qrModal} onClose={() => setQrModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================ */
/* MACHINE CARD                                  */
/* ============================================ */
function MachineCard({ machine, index, onViewQR, onRegenerate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="bg-surface-container rounded-xl p-5 flex flex-col gap-3 shadow-md hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
            {machine.category}
          </span>
          <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
            {machine.name}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
            machine.is_active
              ? 'bg-emerald-400/15 text-emerald-400'
              : 'bg-error/20 text-error'
          }`}
        >
          {machine.is_active ? 'Active' : 'Offline'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-container-lowest rounded-lg p-2">
          <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
            QR Tag
          </span>
          <span className="font-mono text-[11px] text-primary">
            {machine.qr_tag_id || 'Unassigned'}
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-2">
          <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
            Muscle
          </span>
          <span className="font-title-md text-[12px] text-on-surface capitalize">
            {machine.primary_muscle}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-on-surface-variant text-[10px] uppercase tracking-wider pt-2 border-t border-surface-container-high">
        <span>Workout Entries</span>
        <span className="text-primary font-bold">
          {machine.total_workout_entries}
        </span>
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onViewQR(machine)}
          disabled={!machine.qr_tag_id}
          className="flex-1 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
          View QR
        </button>
        <button
          onClick={() => onRegenerate(machine)}
          className="flex-1 py-2 rounded bg-primary-container hover:bg-secondary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          Regenerate
        </button>
      </div>
    </motion.div>
  );
}

/* ============================================ */
/* QR MODAL                                      */
/* ============================================ */
function QRModal({ machine, onClose }) {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const qrPayload = machine.qr_tag_id
    ? `${apiBase}/workouts/machine/${machine.qr_tag_id}/`
    : `${apiBase}/workouts/machine/${machine.id}/`;

  const downloadQR = (format) => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);

      const url = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `${machine.qr_tag_id || 'machine'}-qr.${format}`;
      link.href = url;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden"
      >
        <div className="p-5 border-b border-surface-container-high flex items-center justify-between">
          <div>
            <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
              QR Fleet Tag
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              {machine.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-error/20 flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_rgba(229,25,55,0.15)]">
            <QRCodeSVG
              id="qr-svg"
              value={qrPayload}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="text-center">
            <span className="font-mono text-[12px] text-primary font-bold block">
              {machine.qr_tag_id}
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant mt-1 block">
              {machine.category} · {machine.primary_muscle}
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => downloadQR('png')}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>PNG</span>
            </button>
            <button
              onClick={() => downloadQR('svg')}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>SVG</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print QR Tag</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatTile({ label, value, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
        accent
          ? 'bg-primary-container/10 border border-primary-container/30'
          : 'bg-surface-container'
      }`}
    >
      {accent && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
          accent
            ? 'bg-primary-container/20 text-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">
        {label}
      </span>
      <span
        className={`block font-headline-lg text-headline-lg leading-none mt-1 ${
          accent ? 'text-primary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
    </motion.div>
  );
}