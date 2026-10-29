import { useState } from 'react';
import { motion } from 'framer-motion';
import { tl } from '../../i18n';

const CLAMP_CHARS = 420;

export default function PhilosophyCard({ bio, title }) {
  const [expanded, setExpanded] = useState(false);
  if (!bio) return null;

  const isLong = bio.length > CLAMP_CHARS;
  const shown = expanded || !isLong ? bio : `${bio.slice(0, CLAMP_CHARS).trimEnd()}…`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
          {title || tl('Coaching Philosophy')}
        </h2>
      </div>

      <p className="font-body-md text-body-md leading-relaxed text-on-surface whitespace-pre-line">
        {shown}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="self-start text-primary font-label-md text-label-md uppercase tracking-wider hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded"
        >
          {expanded ? tl('Show less') : tl('Read more')}
        </button>
      )}
    </motion.div>
  );
}