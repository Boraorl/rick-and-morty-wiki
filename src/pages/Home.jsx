import { Link } from 'react-router-dom';
import RecentlyViewedRail from '../components/RecentlyViewedRail.jsx';
import { useFavorites } from '../hooks/useFavorites.js';

const sections = [
  {
    to: '/characters',
    title: 'Characters',
    description:
      'Search by name, filter by status, species, gender, and origin — open detail dossiers backed by the API.',
    accent: 'from-emerald-500/15 via-transparent to-purple-900/10',
    tag: 'Residents',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
  {
    to: '/episodes',
    title: 'Episodes',
    description:
      'Browse by season with visual posters, then jump into every installment, its air date, and full guest list.',
    accent: 'from-cyan-500/12 via-transparent to-portal-glow/5',
    tag: 'Timeline',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" />
      </svg>
    ),
  },
  {
    to: '/locations',
    title: 'Locations',
    description:
      'Dimensions, planets, and weird venues with resident rosters wherever the API exposes them.',
    accent: 'from-violet-500/15 via-transparent to-fuchsia-900/10',
    tag: 'Places',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
];

const stats = [
  { label: 'Characters', value: '826+' },
  { label: 'Episodes', value: '51' },
  { label: 'Locations', value: '126+' },
];

export default function Home() {
  const { count: favCount } = useFavorites();

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-6 py-8 sm:py-12 md:py-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/75 shadow-sm backdrop-blur-sm dark:border-portal-border dark:bg-portal-card/40 dark:shadow-none">
        <PortalArt />

        <div className="relative grid gap-10 px-5 py-10 sm:px-10 sm:py-14 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="min-w-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-portal-glow/30 bg-portal-glow/10 px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-portal-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-portal-glow shadow-portal" aria-hidden />
              Multiverse Index · Unofficial guide
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl md:text-[3.4rem] lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05]">
              Navigate the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-portal-glow via-emerald-300 to-cyan-300 text-glow">
                infinite curve
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              A polished, responsive companion to the show — every character, episode, and dimension
              pulled live from the public Rick and Morty API.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/characters"
                className="inline-flex items-center gap-2 rounded-xl bg-portal-glow text-portal-dark px-5 py-2.5 text-sm font-semibold shadow-portal hover:bg-portal-slime transition-colors"
              >
                Explore characters
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/episodes"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-portal-glow/50 hover:text-portal-glow transition-colors dark:border-portal-border dark:bg-portal-card/80 dark:text-slate-200"
              >
                Browse episodes
              </Link>
              {favCount > 0 ? (
                <Link
                  to="/favorites"
                  className="inline-flex items-center gap-2 rounded-xl border border-portal-glow/35 bg-portal-glow/10 px-4 py-2.5 text-sm font-medium text-portal-glow hover:bg-portal-glow/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1.05 6.05L12 17.6 6.65 20.25 7.7 14.2 3.3 9.9l6-.9z" />
                  </svg>
                  {favCount} favorite{favCount === 1 ? '' : 's'}
                </Link>
              ) : null}
            </div>

            <dl className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-5 max-w-md">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-3 sm:px-4 sm:py-4 dark:border-portal-border dark:bg-portal-dark/50"
                >
                  <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-lg sm:text-xl font-semibold text-portal-glow">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="relative hidden lg:flex h-[320px] xl:h-[360px] items-center justify-center"
            aria-hidden
          >
            <PortalDisc />
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-14">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-portal-glow/80">
          Sections
        </p>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Where do you want to go?
        </h2>

        <ul className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-3">
          {sections.map(({ to, title, description, accent, tag, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`group card-rm block h-full bg-gradient-to-br ${accent} p-6 md:p-7 border-portal-border/90`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-md border border-portal-glow/25 bg-portal-glow/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-portal-slime">
                    {tag}
                  </span>
                  <span className="text-portal-glow/80 group-hover:text-portal-glow transition-colors">
                    {icon}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-portal-glow">
                  Enter
                  <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <RecentlyViewedRail />
    </div>
  );
}

function PortalArt() {
  return (
    <>
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(151,206,76,0.45), rgba(151,206,76,0) 65%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(157,78,221,0.35), rgba(157,78,221,0) 70%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(151,206,76,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(151,206,76,0.45) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
        }}
        aria-hidden
      />
    </>
  );
}

function PortalDisc() {
  return (
    <div className="relative h-72 w-72 xl:h-80 xl:w-80">
      <div className="absolute inset-0 rounded-full motion-safe:animate-portal-spin opacity-90 hero-portal" />
      <div className="absolute inset-3 rounded-full bg-white/85 backdrop-blur-sm dark:bg-portal-dark/80" />
      <div className="absolute inset-6 rounded-full motion-safe:animate-portal-spin-rev opacity-60 hero-portal" />
      <div className="absolute inset-12 rounded-full bg-slate-100 dark:bg-portal-dark" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center">
          <div className="font-mono text-[10px] tracking-[0.35em] text-portal-glow/80 uppercase">
            Wubba Lubba
          </div>
          <div className="mt-1 font-mono text-xl font-bold text-portal-glow text-glow">
            DUB DUB
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 rounded-full border border-portal-glow/15" />
      <div className="absolute -inset-10 rounded-full border border-portal-glow/8" />
    </div>
  );
}
