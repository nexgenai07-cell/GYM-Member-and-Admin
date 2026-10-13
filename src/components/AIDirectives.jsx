import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EASE = [0.22, 1, 0.36, 1];

const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 24 },
  },
};

function DirectiveCard({ tag, tagClass, icon, title, body, footer, cta, delay = 0, onClick }) {
  return (
    <motion.div
      variants={cardV}
      whileHover={{ y: -5 }}
      className="group relative bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-shadow"
    >
      <motion.span
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary-container/60 to-transparent origin-center"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: delay + 0.3, ease: EASE }}
      />

      <div className="flex flex-col gap-space-xs relative z-10">
        <div className="flex items-center justify-between">
          <span className={`px-space-xs py-space-2xs font-label-md text-label-md rounded uppercase tracking-wider font-bold ${tagClass}`}>
            {tag}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-body-lg">
            {icon}
          </span>
        </div>
        <h4 className="font-title-lg text-title-lg text-on-surface tracking-wide uppercase mt-1">
          {title}
        </h4>
        <p className="font-body-md text-body-md text-on-surface-variant">{body}</p>
      </div>

      <div className="pt-space-md flex items-center justify-between relative z-10">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
          {footer}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="group/btn px-space-md py-space-2xs bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-md text-label-md uppercase tracking-wider rounded transition-colors flex items-center gap-1"
          type="button"
        >
          {cta}
          <span className="material-symbols-outlined text-body-md transition-transform duration-200 group-hover/btn:translate-x-0.5">
            arrow_forward
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AIDirectives({ directives = [] }) {
  const safeDirectives = Array.isArray(directives) ? directives : [];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={gridV}
      className="lg:col-span-8 flex flex-col gap-space-md"
    >
      <motion.div variants={cardV} className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <motion.span
            className="material-symbols-outlined text-primary text-title-md"
            animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            auto_awesome
          </motion.span>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider m-0">
            Adaptive AI Directives
          </h3>
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
          Curated for You
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {safeDirectives.slice(0, 2).map((d, i) => (
          <DirectiveCard
            key={i}
            delay={i * 0.1}
            tag={d.tag}
            tagClass={
              d.tag_color === 'accent'
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.3)]'
                : 'bg-surface-container-high text-primary'
            }
            icon={d.icon}
            title={d.title}
            body={d.body}
            footer={d.footer}
            cta={d.cta}
            onClick={() => toast.success(`Opening: ${d.title}`)}
          />
        ))}
      </div>
    </motion.div>
  );
}