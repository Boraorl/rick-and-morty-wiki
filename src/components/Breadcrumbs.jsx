import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span className="text-slate-600" aria-hidden>/</span> : null}
            {item.to ? (
              <Link to={item.to} className="text-portal-glow hover:underline font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-300 font-medium truncate max-w-[min(100vw-8rem,28rem)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
