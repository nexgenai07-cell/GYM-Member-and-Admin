import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('PRO15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-surface-container-lowest px-space-xl py-space-xs relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/20 via-transparent to-primary-container/10 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-space-xs relative z-10">
        <div className="flex items-center gap-space-sm flex-wrap justify-center md:justify-start">
          <span className="flex h-2 w-2 rounded-full bg-primary-container animate-ping" />
          <span className="font-label-lg text-label-lg uppercase tracking-widest text-primary">
            Pro Member Perk
          </span>
          <span className="text-on-surface-variant font-body-md">|</span>
          <p className="font-title-md text-title-md text-on-surface tracking-wide">
            15% OFF ALL TITAN LAB PROTOCOLS
          </p>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="flex items-center bg-surface-container-high px-space-sm py-space-2xs rounded">
            <span className="font-label-md text-label-md text-outline mr-space-xs uppercase">
              Code:
            </span>
            <code className="font-label-lg text-label-lg text-primary-container font-extrabold tracking-widest select-all">
              PRO15
            </code>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyCode}
            className="font-label-md text-label-md uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
            type="button"
          >
            {copied ? 'APPLIED' : 'COPY CODE'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}