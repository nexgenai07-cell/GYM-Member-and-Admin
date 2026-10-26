// src/utils/money.js — all member payments are in Saudi riyals.
import { isAr } from '../i18n';

const fmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 49.5 → "SAR 49.50"; negative amounts keep their sign ("-SAR 10.00"). */
export function formatSAR(value) {
  const n = Number(value || 0);
  return isAr ? `${n < 0 ? '-' : ''}${fmt.format(Math.abs(n))} ر.س` : `${n < 0 ? '-' : ''}SAR ${fmt.format(Math.abs(n))}`;
}
