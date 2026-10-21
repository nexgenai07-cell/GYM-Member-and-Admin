// src/utils/machineQr.js
// A machine's QR holds a member-portal link (/dashboard/machine-guide?qr=TAG) so a phone camera
// opens the guide directly; the in-app scanners pull the tag back out. Older printed codes held
// an API link ending in /machine/TAG/ — those still resolve.

/** The link printed on a machine's QR label. */
export function machineQrLink(tag) {
  return `${window.location.origin}/dashboard/machine-guide?qr=${encodeURIComponent(tag)}`;
}

/** The QR tag inside whatever was scanned or typed (a bare tag, or one of the links above). */
export function machineTagFrom(text) {
  const raw = String(text || '').trim();
  if (!/^https?:\/\//i.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const q = url.searchParams.get('qr');
    if (q) return q.trim();
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.length ? decodeURIComponent(parts[parts.length - 1]) : raw;
  } catch {
    return raw;
  }
}
