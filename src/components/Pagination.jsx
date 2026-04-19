export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null;

  const go = (next) => {
    if (disabled) return;
    const p = Math.min(Math.max(1, next), totalPages);
    if (p !== page) onPageChange(p);
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2 py-2"
    >
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => go(page - 1)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-portal-glow/40 hover:text-portal-glow transition-colors disabled:opacity-40 disabled:pointer-events-none dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
      >
        <span aria-hidden>←</span> Previous
      </button>
      <span
        className="rounded-lg border border-portal-glow/30 bg-portal-glow/10 px-3 py-2 text-xs font-mono text-portal-glow tracking-wider"
        aria-current="page"
      >
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => go(page + 1)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-portal-glow/40 hover:text-portal-glow transition-colors disabled:opacity-40 disabled:pointer-events-none dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
      >
        Next <span aria-hidden>→</span>
      </button>
    </nav>
  );
}
