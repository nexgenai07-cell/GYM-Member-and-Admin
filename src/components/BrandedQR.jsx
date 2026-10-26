// src/components/BrandedQR.jsx
// Every QR code in the portal carries the gym's logo in the middle. Error correction "H" keeps
// codes scannable with the centre covered. To change the logo, replace src/assets/qr-logo.svg
// (or point the import below at a PNG); it's inlined so downloads and prints include it.
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/qr-logo.svg?inline';

export default function BrandedQR({ value, size = 200, fgColor = '#000000', bgColor = '#ffffff', ...rest }) {
  const mark = Math.round(size * 0.22);
  return (
    <QRCodeSVG value={value} size={size} level="H" fgColor={fgColor} bgColor={bgColor}
      imageSettings={{ src: logo, width: mark, height: mark, excavate: true }} {...rest} />
  );
}
