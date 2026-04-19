import { NavLink } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites.js';
import ThemeToggle from './ThemeToggle.jsx';

const linkClass = ({ isActive }) =>
  [
    'px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
    isActive
      ? 'bg-portal-glow/15 text-portal-glow shadow-portal'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]',
  ].join(' ');

export default function Navbar() {
  const { count } = useFavorites();
  return (
    <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm dark:border-portal-border/80 dark:bg-portal-card/75 dark:shadow-[0_1px_0_rgba(151,206,76,0.08)]">
      <div className="max-w-6xl mx-auto w-full min-w-0 px-3 min-[400px]:px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <NavLink
          to="/"
          className="group text-base min-[400px]:text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <span className="relative flex h-9 w-9 items-center justify-center shrink-0" aria-hidden>
            <span className="portal-ring absolute inset-0 scale-90 opacity-80 group-hover:scale-100 transition-transform" />
            <span className="relative h-2 w-2 rounded-full bg-portal-glow shadow-portal" />
          </span>
          <span className="flex flex-col leading-tight min-w-0">
            <span className="group-hover:text-portal-glow transition-colors truncate">
              Multiverse Index
            </span>
            <span className="text-[10px] font-normal uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500 font-mono">
              Rick &amp; Morty
            </span>
          </span>
        </NavLink>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 min-w-0 sm:ml-auto">
        <nav className="flex flex-wrap gap-1 min-w-0 -mx-0.5 sm:mx-0" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/characters" className={linkClass}>
            Characters
          </NavLink>
          <NavLink to="/episodes" className={linkClass}>
            Episodes
          </NavLink>
          <NavLink to="/locations" className={linkClass}>
            Locations
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1.05 6.05L12 17.6 6.65 20.25 7.7 14.2 3.3 9.9l6-.9z" />
            </svg>
            Favorites
            {count > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-portal-glow/20 border border-portal-glow/40 px-1.5 text-[10px] font-mono font-semibold text-portal-glow">
                {count}
              </span>
            ) : null}
          </NavLink>
        </nav>
        <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
