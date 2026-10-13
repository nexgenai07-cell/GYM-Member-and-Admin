import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { cmsService } from '../../services/cmsService';

const statusColors = {
  published: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', label: 'Published' },
  draft: { bg: 'bg-primary-container/20', text: 'text-primary', label: 'Draft' },
  scheduled: { bg: 'bg-blue-400/15', text: 'text-blue-400', label: 'Scheduled' },
  archived: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', label: 'Archived' },
};

export default function AdminCMS() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'all') params.status = activeFilter;
      if (search) params.search = search;
      const [a, s] = await Promise.all([
        cmsService.adminArticles(params),
        cmsService.stats(),
      ]);
      setArticles(a);
      setStats(s);
    } catch (e) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const statCards = [
    { label: 'Published Articles', value: stats?.published ?? 0, icon: 'article', accent: false },
    { label: 'Drafts', value: stats?.drafts ?? 0, icon: 'edit_note', accent: true },
    { label: 'Newsletter Subs', value: (stats?.newsletter_subs ?? 0).toLocaleString(), icon: 'mail', accent: true },
    { label: 'Total Views', value: `${Math.round((stats?.total_views ?? 0) / 1000)}K`, icon: 'visibility', accent: false },
  ];

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-2">
          <span className="material-symbols-outlined text-[16px]">article</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest font-bold">
            Content Management
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wider">
          Content CMS
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-lg p-5 shadow-md overflow-hidden ${
              s.accent ? 'bg-primary-container/10 border border-primary-container/30' : 'bg-surface-container'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.accent ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
            </div>
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase block">{s.label}</span>
            <span className={`block font-headline-lg text-headline-lg leading-none mt-1 ${s.accent ? 'text-primary' : 'text-on-surface'}`}>
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-1">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveFilter(t.key)}
              className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeFilter === t.key
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
          />
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">article</span>
          <p className="font-title-md text-title-md text-on-surface mt-3">No articles yet</p>
          <p className="font-body-md text-body-md text-on-surface-variant">Create your first article.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {articles.map((c, i) => {
            const status = statusColors[c.status] || statusColors.draft;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-surface-container rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  {c.cover_image_url ? (
                    <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-container/30 to-secondary-container/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider font-bold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-md text-[10px] uppercase tracking-wider">
                      {c.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="font-title-lg text-title-lg text-on-surface leading-tight">{c.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                      By {c.author_display}
                    </span>
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {c.read_time_minutes} min read
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-high mt-auto">
                    <div className="flex items-center gap-3">
                      {c.status === 'published' && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-[14px]">visibility</span>
                          <span className="font-label-md text-[10px] text-on-surface">
                            {c.views_count.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toast.success(`Opening editor: ${c.title}`)}
                      className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}