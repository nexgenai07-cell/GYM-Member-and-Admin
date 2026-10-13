import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { coursesQueue } from '../../../data/adminTrainers';

export default function CoursesQueue() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="font-label-md text-[10px] uppercase tracking-widest text-primary">
            Content Pipeline
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Courses Queue
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-primary-container/20 text-primary font-label-md text-[10px] uppercase tracking-wider font-bold">
            2 Pending
          </span>
          <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
            {coursesQueue.length} Total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coursesQueue.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="bg-surface-container rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${
                    c.status === 'approved'
                      ? 'bg-emerald-400/15 text-emerald-400'
                      : 'bg-primary-container/20 text-primary'
                  }`}
                >
                  {c.status === 'approved' ? 'Live' : 'Pending Review'}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-md text-[10px] uppercase tracking-wider">
                  {c.category}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-bold text-[10px] text-on-surface-variant">
                  {c.trainerAvatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-[10px] text-on-surface uppercase tracking-wider">
                    {c.trainer}
                  </span>
                  <span className="font-label-md text-[9px] text-on-surface-variant/60 uppercase tracking-wider">
                    {c.submittedAt}
                  </span>
                </div>
              </div>

              <h3 className="font-title-lg text-title-lg text-on-surface leading-tight">
                {c.title}
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-surface-container-lowest rounded-lg p-2">
                  <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
                    Duration
                  </span>
                  <span className="font-title-md text-[12px] text-on-surface">
                    {c.duration}
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-lg p-2">
                  <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
                    Price
                  </span>
                  <span className="font-title-md text-[12px] text-primary font-bold">
                    ${c.price}
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-lg p-2">
                  <span className="font-label-md text-[9px] text-on-surface-variant uppercase tracking-wider block">
                    Enrolled
                  </span>
                  <span className="font-title-md text-[12px] text-on-surface">
                    {c.enrolled}
                  </span>
                </div>
              </div>

              {c.status === 'pending' && (
                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => toast.success(`Approved course: ${c.title}`)}
                    className="flex-1 py-2 rounded-lg bg-emerald-400/15 hover:bg-emerald-400/25 text-emerald-400 font-label-md text-[10px] uppercase tracking-wider font-bold transition-colors"
                    type="button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => toast.error(`Rejected course: ${c.title}`)}
                    className="flex-1 py-2 rounded-lg bg-error/15 hover:bg-error/25 text-error font-label-md text-[10px] uppercase tracking-wider font-bold transition-colors"
                    type="button"
                  >
                    Reject
                  </button>
                </div>
              )}

              {c.status === 'approved' && (
                <div className="mt-auto pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-title-md text-[12px] text-on-surface">
                        {c.rating}
                      </span>
                    </div>
                    <button
                      className="font-label-md text-[10px] text-primary uppercase tracking-wider hover:underline font-bold"
                      type="button"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}