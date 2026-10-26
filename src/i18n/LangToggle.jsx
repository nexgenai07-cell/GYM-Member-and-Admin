// src/i18n/LangToggle.jsx — EN / ع switch used in the member and admin headers and on sign-in pages.
import { lang, setLang } from './index';

export default function LangToggle({ className = '' }) {
  return (
    <button type="button" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      className={`h-9 min-w-9 px-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-[12px] font-bold ${className}`}>
      {lang === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
