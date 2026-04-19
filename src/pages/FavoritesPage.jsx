import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { useFavorites } from '../hooks/useFavorites.js';

export default function FavoritesPage() {
  const { items, count, clearAll } = useFavorites();

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-portal-glow/80">
            Saved on this device
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Favorites
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Pinned characters, kept locally in your browser. Open a card for the full dossier.
          </p>
        </div>
        {count > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (confirm('Remove all favorites from this device?')) clearAll();
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-red-500/40 hover:text-red-600 transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-300 dark:hover:text-red-200"
          >
            Clear all
          </button>
        ) : null}
      </header>

      {count === 0 ? (
        <EmptyState
          title="No favorites yet"
          hint="Open any character and tap the star icon to pin them here. Favorites stay in your browser only."
          action={
            <Link
              to="/characters"
              className="inline-flex items-center gap-2 rounded-xl bg-portal-glow text-portal-dark px-5 py-2.5 text-sm font-semibold hover:bg-portal-slime transition-colors"
            >
              Browse characters →
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((c) => (
            <li key={c.id} className="min-w-0 relative">
              <FavoriteButton character={c} />
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
                <div className="p-3 sm:p-4">
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">
                    {c.species || '—'}
                    {c.status ? ` · ${c.status}` : ''}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
