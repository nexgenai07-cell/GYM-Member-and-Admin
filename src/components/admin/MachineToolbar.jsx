import { machineFilters } from '../../data/adminMachines';

export default function MachineToolbar({
  activeFilter,
  setActiveFilter,
  search,
  setSearch,
  total,
  onGenerateAllQR,
  onAddMachine,
}) {
  return (
    <div className="flex flex-col gap-4 bg-surface-container-low rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {machineFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${
                activeFilter === f.key
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(229,25,55,0.35)]'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onGenerateAllQR}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high text-on-surface font-label-md text-[11px] uppercase tracking-wider transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Bulk QR Print</span>
          </button>

          <button
            onClick={onAddMachine}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider shadow-[0_0_16px_rgba(229,25,55,0.35)] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Machine</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">
            search
          </span>
          <input
            type="text"
            placeholder="Search by machine name, ID, or QR tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md pl-10 pr-4 py-2.5 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-lowest rounded-lg border border-surface-container-high">
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
            Showing:
          </span>
          <span className="font-title-md text-title-md text-on-surface">{total}</span>
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
            Machines
          </span>
        </div>
      </div>
    </div>
  );
}