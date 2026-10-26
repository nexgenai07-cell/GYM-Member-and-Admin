// src/components/SaudiPhoneInput.jsx
// Phone field with a fixed "+966" in front: staff type the rest (5XXXXXXXX). A leading 0 or a
// pasted +966 / 00966 is dropped. onChange gets the full number ("+966551234567") or ''.
const local = (v) => {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('00966')) d = d.slice(5);
  else if (d.startsWith('966')) d = d.slice(3);
  return d.replace(/^0+/, '').slice(0, 9);
};

export default function SaudiPhoneInput({ value, onChange, placeholder = '5X XXX XXXX', ...rest }) {
  return (
    <div dir="ltr"
      className="flex items-center w-full bg-[#131316] border border-[#1a1a1e] rounded focus-within:border-primary-container">
      <span className="pl-3 pr-1 text-[13px] text-on-surface-variant select-none" aria-hidden="true">+966</span>
      <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent px-2 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/40 outline-none"
        value={local(value)} onChange={(e) => { const d = local(e.target.value); onChange(d ? `+966${d}` : ''); }} {...rest} />
    </div>
  );
}
