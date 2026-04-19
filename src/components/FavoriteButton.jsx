import { useFavorites } from '../hooks/useFavorites.js';

export default function FavoriteButton({ character, variant = 'overlay', className = '' }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(character?.id);
  const label = active ? 'Remove from favorites' : 'Add to favorites';

  if (variant === 'overlay') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(character);
        }}
        aria-pressed={active}
        aria-label={label}
        title={label}
        className={[
          'absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full',
          'border backdrop-blur-md transition-all duration-200',
          active
            ? 'bg-portal-glow/25 border-portal-glow text-portal-glow shadow-portal'
            : 'bg-white/90 border-slate-200 text-slate-600 hover:border-portal-glow/60 hover:text-portal-glow dark:bg-black/55 dark:border-white/10 dark:text-slate-200',
          className,
        ].join(' ')}
      >
        <Star filled={active} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(character)}
      aria-pressed={active}
      className={[
        'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-portal-glow/20 border-portal-glow/60 text-portal-glow'
          : 'bg-white border-slate-200 text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow dark:bg-portal-card dark:border-portal-border dark:text-slate-200',
        className,
      ].join(' ')}
    >
      <Star filled={active} />
      {active ? 'In favorites' : 'Add to favorites'}
    </button>
  );
}

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      className="transition-transform"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1.05 6.05L12 17.6 6.65 20.25 7.7 14.2 3.3 9.9l6-.9z" />
    </svg>
  );
}
