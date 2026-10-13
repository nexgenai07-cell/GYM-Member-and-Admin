// src/components/profile/DigitalPass.jsx
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalPass({ user, membership }) {
  const passId = user?.id?.toString().padStart(4, '0') || '0000';
  const tier = membership?.plan?.display_name || 'Member';
  const status = membership?.status || 'active';
  const cardholder = user?.full_name || user?.email || 'Member';

  // ----- REAL QR payload -----
  // Points to the backend verify endpoint we just created.
  // Anyone scanning this QR will hit /api/members/verify/<id>/ and get JSON.
  const apiBase =
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const qrPayload = user?.id
    ? `${apiBase}/members/verify/${user.id}/`
    : `${apiBase}/members/verify/0/`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-lg bg-surface-container p-space-xl flex flex-col justify-between shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-space-md flex-wrap gap-2">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">
              Facility Clearance
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
              Digital Pass & NFC Key
            </h2>
          </div>
          <span className="flex items-center gap-1 font-label-md text-label-md text-primary font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            {status}
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          Scan with any phone camera to verify membership. Staff terminal reads the
          payload and confirms access.
        </p>
      </div>

      <div className="rounded-lg bg-surface-container-lowest p-space-lg shadow-xl relative overflow-hidden my-space-sm">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[24px]">
              contactless
            </span>
            <span className="font-headline-md text-headline-md uppercase tracking-wider text-on-surface">
              Smart Gym Elite
            </span>
          </div>
          <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase">
            {tier}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Cardholder
            </span>
            <span className="font-title-md text-title-md text-on-surface truncate">
              {cardholder}
            </span>
            <span className="font-label-md text-label-md text-primary font-bold mt-1">
              ID: {passId}-TK
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant mt-2">
              Expiry: {membership?.expiry_date || '—'}
            </span>
          </div>

          {/* ⬇️ REAL QR CODE ⬇️ */}
          <div className="p-2 bg-white rounded shadow-md flex items-center justify-center">
            <QRCodeSVG
              value={qrPayload}
              size={96}
              level="M"
              bgColor="#ffffff"
              fgColor="#0a0a0a"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-space-sm mt-space-md">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-space-sm px-space-md rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-space-xs shadow-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            phone_iphone
          </span>
          Add to Apple Wallet
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-space-sm px-space-md rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-space-xs shadow-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">wallet</span>
          Google Wallet
        </motion.button>
      </div>
    </motion.div>
  );
}