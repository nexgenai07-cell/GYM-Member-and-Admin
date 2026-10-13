import { motion } from 'framer-motion';

export default function PhilosophyCard({ bio, title }) {
  if (!bio) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
          {title || 'Coaching Philosophy'}
        </h2>
        <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
          Protocol V3.2
        </span>
      </div>

      <p className="font-body-md text-body-md leading-relaxed text-on-surface whitespace-pre-line">
        {bio}
      </p>
    </motion.div>
  );
}