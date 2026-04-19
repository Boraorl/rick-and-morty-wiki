import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { CharacterGridSkeleton } from '../components/ListSkeletons.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchMany, getEpisodeById } from '../services/api.js';

export default function EpisodeDetailPage() {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [castLoading, setCastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setCast([]);
      try {
        const ep = await getEpisodeById(id);
        if (cancelled) return;
        setEpisode(ep);
        setCastLoading(true);
        const chars = await fetchMany(ep.characters?.slice(0, 24) ?? []);
        if (cancelled) return;
        setCast(chars);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || 'Failed to load episode.');
        setEpisode(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setCastLoading(false);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id, retryToken]);

  const retry = () => setRetryToken((t) => t + 1);

  if (loading) return <LoadingState label="Loading episode…" />;
  if (error || !episode)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={retry} />
        <Link to="/episodes" className="mt-6 inline-block text-portal-glow hover:underline">
          ← Back to episodes
        </Link>
      </div>
    );

  const { name, episode: code, air_date: airDate, characters } = episode;
  const totalCast = characters?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Episodes', to: '/episodes' },
          { label: `${code} · ${name}` },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm sm:p-8 dark:border-portal-border dark:bg-portal-card/50 dark:shadow-none">
        <div
          className="absolute inset-0 -z-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 50% 50% at 20% 20%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(151,206,76,0.15), transparent 60%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-portal-glow/35 bg-portal-glow/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-portal-glow">
            {code}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
            {name}
          </h1>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3 max-w-xl">
            <Stat label="Aired" value={airDate || '—'} />
            <Stat label="Cast (API)" value={String(totalCast)} accent />
            <Stat label="Episode #" value={String(episode.id)} />
          </dl>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
          Featured cast
        </p>
        <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Characters in this episode
        </h2>
        {totalCast > cast.length ? (
          <p className="mt-1 text-xs text-slate-500">
            Showing {cast.length} of {totalCast} from the API.
          </p>
        ) : null}

        {castLoading && !cast.length ? (
          <div className="mt-5">
            <CharacterGridSkeleton count={8} />
          </div>
        ) : cast.length ? (
          <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cast.map((c) => (
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
          <EmptyState title="No cast data" hint="The API didn’t return any characters for this episode." />
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-portal-border dark:bg-portal-dark/50">
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
