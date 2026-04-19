import { Link } from 'react-router-dom';

export default function LocationCard({ location }) {
  const { id, name, type, dimension, residents } = location;
  const count = residents?.length ?? 0;
  return (
    <Link
      to={`/locations/${id}`}
      className="group relative block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all overflow-hidden dark:border-portal-border dark:bg-portal-card dark:shadow-none"
    >
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'radial-gradient(circle, rgba(151,206,76,0.20), rgba(151,206,76,0) 70%)',
        }}
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-portal-glow transition-colors">
            {name}
          </h2>
          {count > 0 ? (
            <span className="shrink-0 rounded-full border border-portal-glow/30 bg-portal-glow/10 px-2 py-0.5 text-[10px] font-mono text-portal-glow">
              {count} resident{count === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-300">{type || 'Unknown type'}</p>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{dimension || 'Unknown dimension'}</p>
      </div>
    </Link>
  );
}
