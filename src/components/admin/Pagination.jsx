export default function Pagination({ currentPage, totalPages, onChange, totalItems, pageSize }) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-lg text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">
      <span>
        Showing <span className="text-on-surface font-bold">{start}-{end}</span> of{' '}
        <span className="text-on-surface font-bold">{totalItems}</span> members
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>

        {startPage > 1 && (
          <>
            <PageBtn page={1} active={currentPage === 1} onClick={() => onChange(1)} />
            {startPage > 2 && (
              <span className="px-1 text-on-surface-variant">...</span>
            )}
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} page={p} active={currentPage === p} onClick={() => onChange(p)} />
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-on-surface-variant">...</span>
            )}
            <PageBtn
              page={totalPages}
              active={currentPage === totalPages}
              onClick={() => onChange(totalPages)}
            />
          </>
        )}

        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

function PageBtn({ page, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[12px] transition-all ${
        active
          ? 'bg-primary-container text-on-primary-container shadow-[0_0_8px_rgba(229,25,55,0.4)]'
          : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
      }`}
      type="button"
    >
      {page}
    </button>
  );
}