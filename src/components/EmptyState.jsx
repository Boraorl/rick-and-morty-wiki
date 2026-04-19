export default function EmptyState({ title, hint, action }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center dark:border-portal-border dark:bg-portal-card/40">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-portal-glow/30 bg-portal-glow/10 text-portal-glow">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {hint ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{hint}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
