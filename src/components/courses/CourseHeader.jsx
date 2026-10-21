import { motion } from 'framer-motion';
import CountUp from '../CountUp';

const EASE = [0.22, 1, 0.36, 1];

const lineUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function CourseHeader({ courseCount = 0, membershipTier }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
    >
      <div className="flex flex-col max-w-2xl">
        <motion.div
          variants={lineUp}
          className="flex items-center gap-space-xs text-primary mb-space-2xs"
        >
          <motion.span
            className="material-symbols-outlined text-title-md"
            style={{ fontVariationSettings: "'FILL' 1" }}
            animate={{ scale: [1, 1.14, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            verified
          </motion.span>
          <span className="font-label-md text-label-md tracking-widest uppercase text-primary">
            Elite Performance Marketplace
          </span>
        </motion.div>
        <motion.h1
          variants={lineUp}
          className="font-headline-lg text-headline-lg uppercase text-on-surface tracking-wider leading-none m-0"
        >
          Trainer Protocols &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-primary-container">
            Course Marketplace
          </span>
        </motion.h1>
        <motion.span
          className="h-[2px] w-40 bg-gradient-to-r from-primary-container to-transparent rounded-full origin-left mt-space-2xs"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        />
        <motion.p variants={lineUp} className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
          Structured periodized training programs published by world-class coaches and
          sports scientists.
        </motion.p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-space-md flex-wrap">
        <motion.div
          variants={lineUp}
          whileHover={{ y: -3 }}
          className="bg-surface-container-low px-space-md py-space-xs rounded-lg flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow"
        >
          <motion.span
            className="material-symbols-outlined text-primary text-title-md"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            sports_score
          </motion.span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant">
              Available Courses
            </span>
            <span className="font-title-md text-title-md text-on-surface leading-tight tabular-nums">
              <CountUp to={courseCount} duration={1.4} delay={0.5} suffix=" Protocols" />
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={lineUp}
          whileHover={{ y: -3 }}
          className="relative bg-surface-container-low px-space-md py-space-xs rounded-lg flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <span className="material-symbols-outlined text-primary-container text-title-md drop-shadow-[0_0_6px_rgba(229,25,55,0.5)]">
            bolt
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md uppercase text-on-surface-variant">
              Membership
            </span>
            <span className="font-title-md text-title-md text-primary leading-tight">
              {membershipTier || 'Member'}
            </span>
          </div>
          <motion.span
            className="absolute top-0 bottom-0 w-6 bg-gradient-to-r from-transparent via-primary-container/10 to-transparent"
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}