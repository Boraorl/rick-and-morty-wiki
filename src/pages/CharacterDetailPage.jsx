import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EpisodeCard from '../components/EpisodeCard.jsx';
import ErrorState from '../components/ErrorState.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { CharacterGridSkeleton } from '../components/ListSkeletons.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchMany, getCharacterById, getCharactersPage } from '../services/api.js';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';

const STATUS_DOT = {
  Alive: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]',
  Dead: 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.55)]',
  unknown: 'bg-slate-400',
};

function locationIdFromUrl(url) {
  return url?.match(/\/location\/(\d+)/)?.[1] || null;
}

export default function CharacterDetailPage() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [related, setRelated] = useState({ sameLocation: [], sameSpecies: [] });
  const [loading, setLoading] = useState(true);
  const [relLoading, setRelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const { push } = useRecentlyViewed();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      setEpisodes([]);
      setRelated({ sameLocation: [], sameSpecies: [] });
      try {
        const c = await getCharacterById(id);
        if (cancelled) return;
        setCharacter(c);
        push(c);
        const eps = await fetchMany(c.episode?.slice(0, 12) ?? []);
        if (cancelled) return;
        setEpisodes(eps);

        setRelLoading(true);
        const tasks = [];

        const locId = locationIdFromUrl(c.location?.url);
        if (locId) {
          tasks.push(
            fetch(c.location.url)
              .then((r) => (r.ok ? r.json() : null))
              .then(async (loc) => {
                const otherUrls = (loc?.residents || [])
                  .filter((u) => !u.endsWith(`/${c.id}`))
                  .slice(0, 6);
                const list = await fetchMany(otherUrls);
                return { sameLocation: list };
              })
              .catch(() => ({ sameLocation: [] }))
          );
        }

        if (c.species) {
          tasks.push(
            getCharactersPage(1, { species: c.species })
              .then((page) => ({
                sameSpecies: (page.results || [])
                  .filter((x) => Number(x.id) !== Number(c.id))
                  .slice(0, 8),
              }))
              .catch(() => ({ sameSpecies: [] }))
          );
        }

        const out = await Promise.all(tasks);
        if (cancelled) return;
        setRelated(out.reduce((acc, x) => ({ ...acc, ...x }), { sameLocation: [], sameSpecies: [] }));
      } catch (e) {
        if (cancelled) return;
        setError(e.message || 'Failed to load character.');
        setCharacter(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRelLoading(false);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id, retryToken, push]);

  const retry = () => setRetryToken((t) => t + 1);

  const totalEpisodes = character?.episode?.length ?? 0;
  const firstSeen = useMemo(() => {
    if (!episodes.length) return null;
    return episodes.reduce((min, ep) => {
      if (!min) return ep;
      return (min.id ?? Infinity) < (ep.id ?? Infinity) ? min : ep;
    }, null);
  }, [episodes]);

  if (loading) return <LoadingState label="Loading character…" />;

  if (error || !character)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={retry} />
        <Link to="/characters" className="mt-6 inline-block text-portal-glow hover:underline">
          ← Back to characters
        </Link>
      </div>
    );

  const { name, status, species, type, gender, origin, location, image, created } = character;
  const locId = locationIdFromUrl(location?.url);
  const originLocId = locationIdFromUrl(origin?.url);

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Characters', to: '/characters' },
          { label: name },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm dark:border-portal-border dark:bg-portal-card/50 dark:shadow-none">
        <div
          className="absolute inset-0 -z-0 opacity-60"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 60% at 30% 30%, rgba(151,206,76,0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(157,78,221,0.15), transparent 60%)`,
          }}
          aria-hidden
        />
        <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-portal-border dark:shadow-portal">
              <img src={image} alt="" className="w-full block" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:border-portal-border dark:bg-portal-dark/60 dark:text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.unknown}`} aria-hidden />
                {status}
              </span>
              <span className="rounded-full border border-portal-glow/30 bg-portal-glow/10 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-portal-glow">
                {species}
              </span>
              {type ? (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:border-portal-border dark:bg-portal-dark/60 dark:text-slate-400">
                  {type}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
              {name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <FavoriteButton character={character} variant="full" />
              <Link
                to="/characters"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-300"
              >
                ← All characters
              </Link>
            </div>

            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              <Stat label="Episodes" value={String(totalEpisodes)} accent />
              <Stat label="Gender" value={gender || '—'} />
              <Stat label="Species" value={species || '—'} />
              <Stat label="Status" value={status || '—'} />
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <InfoCard title="Origin" icon="origin">
          {origin?.name ? (
            originLocId ? (
              <Link to={`/locations/${originLocId}`} className="text-portal-glow hover:underline font-medium">
                {origin.name}
              </Link>
            ) : (
              <span className="text-slate-200 font-medium">{origin.name}</span>
            )
          ) : (
            <span className="text-slate-500">Unknown</span>
          )}
          {origin?.name && origin.name !== 'unknown' ? (
            <p className="mt-1.5 text-xs text-slate-500">Where this character was originally from.</p>
          ) : null}
        </InfoCard>

        <InfoCard title="Last known location" icon="location">
          {location?.name && location.name !== 'unknown' ? (
            locId ? (
              <Link to={`/locations/${locId}`} className="text-portal-glow hover:underline font-medium">
                {location.name}
              </Link>
            ) : (
              <span className="text-slate-200 font-medium">{location.name}</span>
            )
          ) : (
            <span className="text-slate-500">Unknown</span>
          )}
          <p className="mt-1.5 text-xs text-slate-500">Most recent reported location in the API.</p>
        </InfoCard>

        <InfoCard title="Record" icon="record">
          <p className="text-slate-200 font-medium">#{character.id}</p>
          {created ? (
            <p className="mt-1.5 text-xs text-slate-500">
              Indexed {new Date(created).toLocaleDateString()}
            </p>
          ) : null}
        </InfoCard>
      </div>

      {episodes.length ? (
        <section className="mt-12">
          <SectionHeading
            kicker="Appearances"
            title="Episodes featuring this character"
            note={
              totalEpisodes > episodes.length
                ? `Showing ${episodes.length} of ${totalEpisodes}`
                : null
            }
            extra={
              firstSeen ? (
                <Link
                  to={`/episodes/${firstSeen.id}`}
                  className="text-xs text-portal-glow hover:underline"
                >
                  First seen → {firstSeen.episode}
                </Link>
              ) : null
            }
          />
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <li key={ep.id}>
                <EpisodeCard episode={ep} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <SectionHeading
          kicker="Related"
          title="You might also explore"
          note="Discovered via shared species and last known location."
        />

        <div className="mt-5 space-y-8">
          <RelatedRow
            title={`Also at ${location?.name && location.name !== 'unknown' ? location.name : 'this location'}`}
            empty={location?.name && location.name !== 'unknown' ? 'No other residents listed.' : 'Location unknown — no residents to show.'}
            loading={relLoading}
            items={related.sameLocation}
          />
          <RelatedRow
            title={`Other ${species || 'characters'}`}
            empty="Nothing else found in the API for this species."
            loading={relLoading}
            items={related.sameSpecies}
          />
        </div>
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
      <dd className={`mt-1 text-base font-semibold ${accent ? 'text-portal-glow' : 'text-slate-100'} truncate`}>
        {value}
      </dd>
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-portal-border dark:bg-portal-card/60 dark:shadow-none">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-portal-glow/15 text-portal-glow">
          <Icon name={icon} />
        </span>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">{title}</p>
      </div>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}

function Icon({ name }) {
  if (name === 'origin')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
      </svg>
    );
  if (name === 'location')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11l3 3 8-8" />
      <path d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function SectionHeading({ kicker, title, note, extra }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
          {kicker}
        </p>
        <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
      </div>
      {extra ? <div className="sm:text-right">{extra}</div> : null}
    </div>
  );
}

function RelatedRow({ title, items, loading, empty }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      {loading && !items.length ? (
        <div className="mt-3">
          <CharacterGridSkeleton count={4} />
        </div>
      ) : items.length ? (
        <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                to={`/characters/${c.id}`}
                className="group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all dark:border-portal-border dark:bg-portal-card dark:shadow-none"
              >
                <div className="aspect-square overflow-hidden bg-slate-200 dark:bg-portal-border">
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{c.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {c.species || '—'}
                    {c.status ? ` · ${c.status}` : ''}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-slate-500">{empty}</p>
      )}
    </div>
  );
}
