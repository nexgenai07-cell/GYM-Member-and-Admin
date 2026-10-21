import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CurriculumGrid({ courses = [] }) {
  const navigate = useNavigate();

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-space-xl text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          menu_book
        </span>
        <p className="font-title-md text-title-md text-on-surface mt-3">
          No Published Courses
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          This trainer hasn't published any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
          Courses by this trainer
        </h2>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
          {courses.length} Programs Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {courses.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/dashboard/player/${c.id}`)}
            className="group text-left bg-surface-container-low rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:bg-surface-container transition-colors"
            type="button"
          >
            <div className="relative h-32 w-full overflow-hidden">
              {c.cover_image_url ? (
                <img
                  src={c.cover_image_url}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-container/30 to-secondary-container/20" />
              )}
              <div className="absolute top-2 right-2 bg-surface-container-lowest/90 px-space-xs py-space-2xs rounded font-label-md text-label-md text-primary uppercase">
                {c.duration_weeks} Weeks
              </div>
            </div>

            <div className="p-space-md flex flex-col gap-space-2xs">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
                {c.category}
              </span>
              <h3 className="font-title-lg text-title-lg text-on-surface uppercase leading-tight group-hover:text-primary transition-colors">
                {c.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                {c.subtitle || c.description}
              </p>

              <div className="mt-space-sm flex items-center justify-between pt-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface">
                  ${c.price}
                </span>
                <span className="font-label-md text-label-md text-primary flex items-center gap-space-2xs group-hover:translate-x-1 transition-transform">
                  View Syllabus
                  <span className="material-symbols-outlined text-title-md">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}