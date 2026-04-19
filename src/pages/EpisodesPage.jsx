import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import EpisodeCard from '../components/EpisodeCard.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { SeasonGridSkeleton } from '../components/ListSkeletons.jsx';
import SeasonPoster from '../components/SeasonPoster.jsx';
import { getAllEpisodes, getEpisodeById } from '../services/api.js';
import { groupEpisodesBySeason } from '../utils/episodeSort.js';

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonImages, setSeasonImages] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await getAllEpisodes();
      setEpisodes(all);
    } catch (e) {
      setError(e.message || 'Failed to load episodes.');
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bySeason = useMemo(() => groupEpisodesBySeason(episodes), [episodes]);
  const seasonNumbers = useMemo(() => [...bySeason.keys()], [bySeason]);

  useEffect(() => {
    if (!seasonNumbers.length) return;
    let cancelled = false;
    (async () => {
      const pairs = await Promise.all(
        seasonNumbers.map(async (sn) => {
          const list = bySeason.get(sn);
          if (!list?.length) return [sn, null];
          const epOffset = (sn - 1) % list.length;
          const epMeta = list[epOffset];
          try {
            const ep = await getEpisodeById(epMeta.id);
            const urls = ep.characters || [];
            if (!urls.length) return [sn, null];
            const charOffset = (sn * 19 + epOffset * 5) % urls.length;
            const res = await fetch(urls[charOffset]);
            if (!res.ok) return [sn, null];
            const ch = await res.json();
            return [sn, ch.image || null];
          } catch {
            return [sn, null];
          }
        })
      );
      if (!cancelled) setSeasonImages(Object.fromEntries(pairs));
    })();
    return () => {
      cancelled = true;
    };
  }, [bySeason, seasonNumbers]);

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-8 sm:mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-portal-glow/80">
          Interdimensional cable guide
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          {selectedSeason == null ? 'Episodes by season' : `Season ${selectedSeason}`}
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
          {selectedSeason == null
            ? 'Pick a season to browse every episode in order — codes like S01E01 come straight from the API.'
            : `${bySeason.get(selectedSeason)?.length ?? 0} episodes · open a card for air date and cast.`}
        </p>
      </header>

      {loading ? <SeasonGridSkeleton count={8} /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

      {!loading && !error && selectedSeason == null && seasonNumbers.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seasonNumbers.map((sn) => {
            const count = bySeason.get(sn)?.length ?? 0;
            return (
              <li key={sn}>
                <button
                  type="button"
                  onClick={() => setSelectedSeason(sn)}
                  className="group w-full text-left rounded-2xl border border-slate-200 bg-white/90 p-3 pb-4 shadow-sm transition-all hover:border-portal-glow/45 hover:shadow-portal hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-glow/50 dark:border-portal-border dark:bg-portal-card/50 dark:hover:bg-portal-card"
                >
                  <SeasonPoster season={sn} imageUrl={seasonImages[sn]} />
                  <p className="mt-4 text-center font-semibold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-portal-glow transition-colors">
                    Season {sn}
                  </p>
                  <p className="text-center text-sm text-slate-500 mt-0.5">
                    {count} episode{count === 1 ? '' : 's'}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {!loading && !error && selectedSeason != null ? (
        <div>
          <button
            type="button"
            onClick={() => setSelectedSeason(null)}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-portal-glow hover:bg-slate-50 transition-colors dark:border-portal-border dark:bg-portal-card dark:hover:bg-white/5"
          >
            <span aria-hidden>←</span>
            All seasons
          </button>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(bySeason.get(selectedSeason) ?? []).map((ep) => (
              <li key={ep.id}>
                <EpisodeCard episode={ep} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!loading && !error && !seasonNumbers.length ? (
        <EmptyState title="No episode data" hint="The API didn’t return any episodes — try again in a moment." />
      ) : null}
    </div>
  );
}
