import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { LocationGridSkeleton } from '../components/ListSkeletons.jsx';
import LocationCard from '../components/LocationCard.jsx';
import { getAllLocations } from '../services/api.js';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await getAllLocations();
      setLocations(all);
    } catch (e) {
      setError(e.message || 'Failed to load locations.');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const types = useMemo(() => {
    const set = new Set(locations.map((l) => l.type).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [locations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      if (typeFilter && l.type !== typeFilter) return false;
      if (!q) return true;
      const dim = (l.dimension || '').toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        dim.includes(q)
      );
    });
  }, [locations, query, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-portal-glow/80">
          Multiverse atlas
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Locations
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
          All locations are loaded once, then filtered in the browser: search by name or dimension,
          narrow by type, or scan the grid.
        </p>
      </header>

      {!loading && !error && locations.length ? (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="loc-search" className="block text-xs font-medium text-slate-500 mb-1.5">
              Search
            </label>
            <input
              id="loc-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, type, dimension…"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-portal-glow/40 dark:border-portal-border dark:bg-portal-card dark:text-white dark:placeholder:text-slate-600"
              autoComplete="off"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor="loc-type" className="block text-xs font-medium text-slate-500 mb-1.5">
              Type
            </label>
            <select
              id="loc-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-portal-glow/40 dark:border-portal-border dark:bg-portal-card dark:text-white"
            >
              <option value="">All types ({types.length})</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500 sm:ml-auto sm:pb-2">
            Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{' '}
            <span className="text-slate-300 font-medium">{locations.length}</span>
          </p>
        </div>
      ) : null}

      {loading ? <LocationGridSkeleton /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error && filtered.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((loc) => (
            <li key={loc.id}>
              <LocationCard location={loc} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && !error && locations.length && !filtered.length ? (
        <EmptyState
          title="No locations match"
          hint="Try a different search term or pick another type from the dropdown."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setTypeFilter('');
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
            >
              Clear filters
            </button>
          }
        />
      ) : null}
    </div>
  );
}
