import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { CharacterGridSkeleton } from '../components/ListSkeletons.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchMany, getLocationById } from '../services/api.js';

export default function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resLoading, setResLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setResidents([]);
      try {
        const loc = await getLocationById(id);
        if (cancelled) return;
        setLocation(loc);
        setResLoading(true);
        const res = await fetchMany(loc.residents?.slice(0, 24) ?? []);
        if (cancelled) return;
        setResidents(res);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || 'Failed to load location.');
        setLocation(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setResLoading(false);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id, retryToken]);

  const retry = () => setRetryToken((t) => t + 1);

  if (loading) return <LoadingState label="Loading location…" />;
  if (error || !location)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={retry} />
        <Link to="/locations" className="mt-6 inline-block text-portal-glow hover:underline">
          ← Back to locations
        </Link>
      </div>
    );

  const { name, type, dimension, residents: resList } = location;
  const totalResidents = resList?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Locations', to: '/locations' },
          { label: name },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-8 dark:border-portal-border dark:bg-portal-card/50 dark:shadow-none">
        <div
          className="absolute inset-0 -z-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 60% at 80% 20%, rgba(157,78,221,0.20), transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(151,206,76,0.15), transparent 60%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
            Multiverse atlas · entry
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
            {name}
          </h1>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3 max-w-2xl">
            <Stat label="Type" value={type || 'Unknown'} />
            <Stat label="Dimension" value={dimension || 'Unknown'} />
            <Stat label="Residents (API)" value={String(totalResidents)} accent />
          </dl>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
          Roster
        </p>
        <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Residents
        </h2>
        {totalResidents > residents.length ? (
          <p className="mt-1 text-xs text-slate-500">
            Showing {residents.length} of {totalResidents} from the API.
          </p>
        ) : null}

        {resLoading && !residents.length ? (
          <div className="mt-5">
            <CharacterGridSkeleton count={8} />
          </div>
        ) : residents.length ? (
          <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {residents.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/characters/${c.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all dark:border-portal-border dark:bg-portal-card dark:shadow-none"
                >
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-portal-glow transition-colors line-clamp-2">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                      {c.species || '—'}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No residents"
            hint="The API didn’t list any residents for this location."
          />
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 min-w-0 dark:border-portal-border dark:bg-portal-dark/50">
      <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-base font-semibold ${accent ? 'text-portal-glow' : 'text-slate-100'} truncate`}
      >
        {value}
      </dd>
    </div>
  );
}
