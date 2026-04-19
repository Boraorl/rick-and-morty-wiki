import { Link } from 'react-router-dom';

export default function EpisodeCard({ episode }) {
  const { id, name, episode: code, air_date: airDate, characters } = episode;
  const cast = characters?.length ?? 0;
  return (
    <Link
      to={`/episodes/${id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-portal-glow/50 hover:shadow-portal transition-all dark:border-portal-border dark:bg-portal-card dark:shadow-none"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-portal-glow tracking-wider">{code}</p>
        {cast > 0 ? (
          <span className="text-[10px] font-mono text-slate-500">{cast} chars</span>
        ) : null}
      </div>
      <h2 className="mt-2 font-semibold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-portal-glow transition-colors">
        {name}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{airDate}</p>
    </Link>
  );
}
