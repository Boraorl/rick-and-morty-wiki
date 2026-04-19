import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigationType, useSearchParams } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Pagination from '../components/Pagination.jsx';
import { CharacterGridSkeleton } from '../components/ListSkeletons.jsx';
import { getCharactersPage } from '../services/api.js';

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' },
];

const SPECIES_OPTIONS = [
  { value: '', label: 'Any species' },
  { value: 'Human', label: 'Human' },
  { value: 'Alien', label: 'Alien' },
  { value: 'Robot', label: 'Robot' },
  { value: 'Cronenberg', label: 'Cronenberg' },
  { value: 'Animal', label: 'Animal' },
  { value: 'Mythological Creature', label: 'Mythological creature' },
  { value: 'Vampire', label: 'Vampire' },
  { value: 'Disease', label: 'Disease' },
  { value: 'Poopybutthole', label: 'Poopybutthole' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Any gender' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'genderless', label: 'Genderless' },
  { value: 'unknown', label: 'Unknown' },
];

const SORT_OPTIONS = [
  { value: '', label: 'API order (default)' },
  { value: 'az', label: 'Name · A → Z' },
  { value: 'za', label: 'Name · Z → A' },
  { value: 'origin', label: 'Origin · A → Z' },
  { value: 'location', label: 'Last location · A → Z' },
];

function readPage(sp) {
  const n = Number.parseInt(sp.get('page') ?? '1', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

const labelFor = (opts, val) => opts.find((o) => o.value === val)?.label ?? val;

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();

  const [page, setPage] = useState(() => readPage(searchParams));
  const [name, setName] = useState(() => searchParams.get('name') || '');
  const [debouncedName, setDebouncedName] = useState(() => searchParams.get('name') || '');
  const [status, setStatus] = useState(() => searchParams.get('status') || '');
  const [species, setSpecies] = useState(() => searchParams.get('species') || '');
  const [gender, setGender] = useState(() => searchParams.get('gender') || '');
  const [sort, setSort] = useState(() => searchParams.get('sort') || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterKeyRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(name), 350);
    return () => clearTimeout(t);
  }, [name]);

  useEffect(() => {
    const key = `${debouncedName}|${status}|${species}|${gender}`;
    if (filterKeyRef.current === null) {
      filterKeyRef.current = key;
      return;
    }
    if (filterKeyRef.current === key) return;
    filterKeyRef.current = key;
    setPage(1);
  }, [debouncedName, status, species, gender]);

  useEffect(() => {
    if (navigationType !== 'POP') return;
    const n = searchParams.get('name') || '';
    setName(n);
    setDebouncedName(n);
    setStatus(searchParams.get('status') || '');
    setSpecies(searchParams.get('species') || '');
    setGender(searchParams.get('gender') || '');
    setSort(searchParams.get('sort') || '');
    setPage(readPage(searchParams));
    filterKeyRef.current = `${n}|${searchParams.get('status') || ''}|${searchParams.get('species') || ''}|${searchParams.get('gender') || ''}`;
  }, [navigationType, searchParams]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedName.trim()) p.set('name', debouncedName.trim());
    if (status) p.set('status', status);
    if (species) p.set('species', species);
    if (gender) p.set('gender', gender);
    if (sort) p.set('sort', sort);
    if (page > 1) p.set('page', String(page));
    const nextStr = p.toString();
    if (nextStr !== searchParams.toString()) {
      setSearchParams(p, { replace: true });
    }
  }, [debouncedName, status, species, gender, sort, page, setSearchParams, searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await getCharactersPage(page, {
        name: debouncedName,
        status,
        species,
        gender,
      });
      setData(json);
    } catch (e) {
      if (e.status === 404) {
        setData({ results: [], info: { pages: 1 } });
      } else {
        setError(e.message || 'Something went wrong.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedName, status, species, gender]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedResults = useMemo(() => {
    const list = data?.results ?? [];
    if (!sort) return list;
    const arr = [...list];
    const cmp = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });
    if (sort === 'az') arr.sort((a, b) => cmp(a.name, b.name));
    if (sort === 'za') arr.sort((a, b) => cmp(b.name, a.name));
    if (sort === 'origin') arr.sort((a, b) => cmp(a.origin?.name || '~', b.origin?.name || '~'));
    if (sort === 'location')
      arr.sort((a, b) => cmp(a.location?.name || '~', b.location?.name || '~'));
    return arr;
  }, [data, sort]);

  const totalResults = data?.info?.count ?? 0;
  const totalPages = data?.info?.pages ?? 1;

  const clearAll = () => {
    setName('');
    setDebouncedName('');
    setStatus('');
    setSpecies('');
    setGender('');
    setSort('');
    setPage(1);
  };

  const activeChips = [];
  if (debouncedName) activeChips.push({ key: 'name', label: `Name: “${debouncedName}”`, clear: () => setName('') });
  if (status) activeChips.push({ key: 'status', label: `Status: ${labelFor(STATUS_OPTIONS, status)}`, clear: () => setStatus('') });
  if (species) activeChips.push({ key: 'species', label: `Species: ${labelFor(SPECIES_OPTIONS, species)}`, clear: () => setSpecies('') });
  if (gender) activeChips.push({ key: 'gender', label: `Gender: ${labelFor(GENDER_OPTIONS, gender)}`, clear: () => setGender('') });
  if (sort) activeChips.push({ key: 'sort', label: `Sort: ${labelFor(SORT_OPTIONS, sort)}`, clear: () => setSort('') });

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 min-[400px]:px-4 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-portal-glow/80">
          Multiverse residents
        </p>
        <h1 className="mt-2 text-2xl min-[400px]:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
          Characters
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Search by name, filter by status, species, gender, or sort by origin and current location.
          Filters sync to the URL so any view is shareable.
        </p>
      </header>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <label htmlFor="char-search" className="block text-xs font-medium text-slate-500 mb-1.5">
            Search by name
          </label>
          <input
            id="char-search"
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rick, Morty, Birdperson…"
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-portal-glow/40 dark:border-portal-border dark:bg-portal-card dark:text-white dark:placeholder:text-slate-600"
            autoComplete="off"
          />
        </div>
        <Select id="char-status" label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        <Select id="char-species" label="Species" value={species} onChange={setSpecies} options={SPECIES_OPTIONS} />
        <Select id="char-gender" label="Gender" value={gender} onChange={setGender} options={GENDER_OPTIONS} />
        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <Select id="char-sort" label="Sort this page" value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3 flex items-end">
          <p className="text-xs text-slate-500">
            {loading
              ? 'Loading…'
              : data?.results?.length
                ? `Showing ${sortedResults.length} of ${totalResults.toLocaleString()} matching characters · page ${page} / ${totalPages}`
                : 'No matches yet.'}
          </p>
        </div>
      </div>

      {(activeChips.length > 0 || sort) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mr-1">
            Active
          </span>
          {activeChips.map((chip) => (
            <span key={chip.key} className="chip">
              {chip.label}
              <button
                type="button"
                onClick={chip.clear}
                aria-label={`Remove ${chip.key} filter`}
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-xs text-slate-400 hover:text-portal-glow transition-colors underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <>
          <p className="sr-only" role="status">
            Loading characters
          </p>
          <CharacterGridSkeleton count={8} />
        </>
      ) : null}

      {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error && data?.results?.length === 0 ? (
        <EmptyState
          title="No characters match your filters"
          hint="Try a different name, clear a filter, or browse the full catalogue."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
              >
                Clear all filters
              </button>
              <Link
                to="/characters"
                className="rounded-xl bg-portal-glow text-portal-dark px-4 py-2 text-sm font-semibold hover:bg-portal-slime transition-colors"
              >
                Reset URL
              </Link>
            </div>
          }
        />
      ) : null}

      {!loading && !error && sortedResults.length ? (
        <>
          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedResults.map((c) => (
              <li key={c.id} className="min-w-0">
                <CharacterCard character={c} />
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={loading}
          />
        </>
      ) : null}
    </div>
  );
}

function Select({ id, label, value, onChange, options }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-portal-glow/40 dark:border-portal-border dark:bg-portal-card dark:text-white"
      >
        {options.map((o) => (
          <option key={o.value || `${id}-any`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
