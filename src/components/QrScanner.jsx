// src/components/QrScanner.jsx
// Camera QR reader. Uses the browser's BarcodeDetector where available
// (Chrome / Android) and jsQR everywhere else (iPhone Safari). Also accepts a
// typed code, and works with USB/Bluetooth scanners that "type" into the box.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import jsQR from 'jsqr';

const SCAN_MS = 250;

/**
 * @param {boolean} open
 * @param {string} title
 * @param {string} manualLabel   label for the typed-code field
 * @param {function} onResult    (text) => void — called once per scan
 * @param {function} onClose
 */
export default function QrScanner({ open, title = 'Scan QR code', manualLabel = 'Or type the code', onResult, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let stream = null;
    let timer = null;
    let stopped = false;
    const detector = 'BarcodeDetector' in window ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;

    const finish = (text) => {
      if (stopped || !text) return;
      stopped = true;
      onResult(text.trim());
    };

    const tick = async () => {
      const video = videoRef.current;
      if (stopped || !video || video.readyState < 2) { timer = setTimeout(tick, SCAN_MS); return; }
      try {
        if (detector) {
          const codes = await detector.detect(video);
          if (codes[0]?.rawValue) return finish(codes[0].rawValue);
        } else {
          const canvas = canvasRef.current;
          const w = video.videoWidth;
          const h = video.videoHeight;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(video, 0, 0, w, h);
          const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
          if (code?.data) return finish(code.data);
        }
      } catch { /* a bad frame — keep scanning */ }
      timer = setTimeout(tick, SCAN_MS);
    };

    (async () => {
      setError('');
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setError('Camera needs a secure (https) connection. Type the code instead.');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play().catch(() => {});
        tick();
      } catch (e) {
        setError(e?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in the address bar, or type the code.'
          : 'No camera available. Type the code instead.');
      }
    })();

    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [open, onResult]);

  const submitManual = (e) => {
    e.preventDefault();
    if (manual.trim()) onResult(manual.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl p-5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase">{title}</h3>
              <button type="button" onClick={onClose} aria-label="Close"
                className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {!error ? (
              <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <span className="absolute inset-8 border-2 border-primary-container/70 rounded-lg pointer-events-none" />
              </div>
            ) : (
              <p className="text-on-surface-variant text-[13px]" role="alert">{error}</p>
            )}
            <canvas ref={canvasRef} className="hidden" />

            <form onSubmit={submitManual} className="flex flex-col gap-2">
              <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest" htmlFor="qr-manual">
                {manualLabel}
              </label>
              <div className="flex gap-2">
                <input id="qr-manual" value={manual} onChange={(e) => setManual(e.target.value)} autoComplete="off"
                  className="flex-1 bg-surface-container text-on-surface px-3 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary" />
                <button type="submit" className="px-4 rounded bg-primary-container text-on-primary-container font-bold uppercase text-[11px]">
                  Go
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
