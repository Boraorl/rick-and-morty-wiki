export function CharacterGridSkeleton({ count = 8 }) {
  return (
    <ul
      className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-xl border border-slate-200 bg-slate-100 overflow-hidden animate-pulse dark:border-portal-border dark:bg-portal-card"
        >
          <div className="aspect-square bg-slate-800/60 min-h-[120px]" />
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-4 bg-slate-700/70 rounded-md w-4/5 max-w-full" />
            <div className="h-3 bg-slate-800/80 rounded-md w-1/2 max-w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LocationGridSkeleton({ count = 9 }) {
  return (
    <ul
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-xl border border-slate-200 bg-slate-100 p-5 animate-pulse min-h-[140px] dark:border-portal-border dark:bg-portal-card"
        >
          <div className="h-5 bg-slate-700/70 rounded-md w-3/4 max-w-full" />
          <div className="mt-3 h-3 bg-slate-800/80 rounded-md w-1/2 max-w-full" />
          <div className="mt-2 h-3 bg-slate-800/60 rounded-md w-full max-w-full" />
        </li>
      ))}
    </ul>
  );
}

export function SeasonGridSkeleton({ count = 6 }) {
  return (
    <ul
      className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl border border-slate-200 bg-white/80 p-3 animate-pulse dark:border-portal-border dark:bg-portal-card/50"
        >
          <div className="aspect-[3/2] rounded-xl bg-slate-800/60 w-full max-w-full" />
          <div className="mt-4 mx-auto h-5 bg-slate-700/70 rounded-md w-24" />
          <div className="mt-2 mx-auto h-3 bg-slate-800/80 rounded-md w-16" />
        </li>
      ))}
    </ul>
  );
}
