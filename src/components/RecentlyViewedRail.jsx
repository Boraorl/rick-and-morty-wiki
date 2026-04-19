import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';

export default function RecentlyViewedRail() {
  const { items, clear } = useRecentlyViewed();
  if (!items.length) return null;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-portal-glow/80">
            Continue exploring
          </p>
          <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Recently viewed
          </h2>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-slate-500 hover:text-portal-glow transition-colors"
        >
          Clear
        </button>
      </div>

      <ul className="mt-5 flex gap-3 overflow-x-auto pb-3 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory">
        {items.map((c) => (
          <li key={c.id} className="snap-start shrink-0 w-[140px] sm:w-[160px]">
            <Link
              to={`/characters/${c.id}`}
              className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all dark:border-portal-border dark:bg-portal-card dark:shadow-none"
            >
              <div className="aspect-square overflow-hidden bg-portal-border">
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="px-3 py-2.5">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{c.species || '—'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
