import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function QRModal({ machine, onClose }) {
  if (!machine) return null;

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
      link.download = `${machine.qrId}.${format}`;
      link.href = url;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-surface-container-high flex items-center justify-between">
            <div>
              <span className="font-label-md text-[10px] text-primary uppercase tracking-widest font-bold">
                QR Fleet Tag
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
                Machine QR Code
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* QR Card */}
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_rgba(229,25,55,0.15)]">
              <QRCodeSVG
                id="qr-svg"
                value={machine.qrId}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div className="text-center">
              <span className="font-title-lg text-title-lg text-on-surface block">
                {machine.name}
              </span>
              <span className="font-label-md text-[11px] text-primary uppercase tracking-widest font-bold mt-1 block">
                {machine.qrId}
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider mt-1 block">
                {machine.sector} · {machine.station}
              </span>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => downloadQR('png')}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
                <span>PNG</span>
              </button>
              <button
                onClick={() => downloadQR('svg')}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
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
    </AnimatePresence>
  );
}