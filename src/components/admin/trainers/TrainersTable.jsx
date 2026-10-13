import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { trainers, trainerStatusColors } from '../../../data/adminTrainers';

export default function TrainersTable({ activeFilter, search }) {
  const filtered = trainers.filter((t) => {
    if (activeFilter === 'pending' && t.status !== 'pending') return false;
    if (activeFilter === 'approved' && t.status !== 'approved') return false;
    if (activeFilter === 'top' && t.rating < 4.9) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(s) ||
        t.specialties.some((sp) => sp.toLowerCase().includes(s))
      );
    }
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">
            school
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface uppercase mb-1">
          No Trainers Found
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Try a different filter or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
              <th className="py-3 px-4">Trainer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Courses</th>
              <th className="py-3 px-4 text-right">Students</th>
              <th className="py-3 px-4 text-right">Monthly Earnings</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest/50">
            {filtered.map((t, i) => {
              const status = trainerStatusColors[t.status];
              return (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="hover:bg-surface-container-high/60 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 ${
                          t.isVerified
                            ? 'bg-gradient-to-br from-primary-container to-secondary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.35)]'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t.avatar}
                        {t.isVerified && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                            <span className="material-symbols-outlined text-[10px] font-bold">
                              verified
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title-md text-[13px] text-on-surface truncate">
                          {t.name}
                        </span>
                        <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
                          {t.credentials}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {t.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="font-title-md text-[13px] text-on-surface">
                          {t.rating}
                        </span>
                        <span className="font-label-md text-[10px] text-on-surface-variant">
                          ({t.reviews})
                        </span>
                      </div>
                    ) : (
                      <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                        No reviews
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-title-md text-[13px] text-on-surface">
                      {t.courses}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="font-title-md text-[13px] text-on-surface">
                      {t.students.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="font-title-md text-[13px] text-primary font-bold">
                      ${t.monthlyEarnings.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {t.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => toast.success(`Approved: ${t.name}`)}
                            className="px-2 py-1 rounded bg-emerald-400/15 hover:bg-emerald-400/25 text-emerald-400 font-label-md text-[10px] uppercase tracking-wider font-bold transition-colors"
                            type="button"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => toast.error(`Rejected: ${t.name}`)}
                            className="px-2 py-1 rounded bg-error/15 hover:bg-error/25 text-error font-label-md text-[10px] uppercase tracking-wider font-bold transition-colors"
                            type="button"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
                            title="View"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
                            title="Edit"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}