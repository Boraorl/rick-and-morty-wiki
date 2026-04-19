import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';

const statusDot = {
  Alive: 'bg-emerald-400',
  Dead: 'bg-red-400',
  unknown: 'bg-slate-400',
};

export default function CharacterCard({ character }) {
  const { id, name, status, species, image } = character;
  return (
    <div className="relative">
      <FavoriteButton character={character} />
      <Link
        to={`/characters/${id}`}
        className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all dark:border-portal-border dark:bg-portal-card dark:shadow-none"
      >
        <div className="aspect-square overflow-hidden bg-slate-200 dark:bg-portal-border relative">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">{name}</h2>
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot[status] ?? statusDot.unknown}`}
              title={status}
              aria-label={`Status: ${status}`}
            />
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{species}</p>
        </div>
      </Link>
    </div>
  );
}
