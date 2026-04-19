import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="relative mx-auto h-32 w-32" aria-hidden>
        <div className="absolute inset-0 rounded-full motion-safe:animate-portal-spin opacity-80 hero-portal" />
        <div className="absolute inset-3 rounded-full bg-portal-dark" />
        <div className="absolute inset-0 grid place-items-center font-mono text-xl font-bold text-portal-glow text-glow">
          404
        </div>
      </div>
      <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
        Wrong dimension
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Page not found</h1>
      <p className="mt-3 text-slate-400 max-w-md mx-auto leading-relaxed">
        The portal closed before we could load that page. Try one of the entries below.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-xl bg-portal-glow text-portal-dark px-5 py-2.5 text-sm font-semibold hover:bg-portal-slime transition-colors"
        >
          Go home
        </Link>
        <Link
          to="/characters"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
        >
          Browse characters
        </Link>
        <Link
          to="/episodes"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card dark:text-slate-200"
        >
          Browse episodes
        </Link>
      </div>
    </div>
  );
}
