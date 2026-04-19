// Optional API still; SVG fallback if missing.
const PALETTES = [
  { a: '#12082a', b: '#97ce4c', c: '#5c1a8a', swirl: '#e8ff9a' },
  { a: '#0a1f2e', b: '#4cc9f0', c: '#4361ee', swirl: '#97ce4c' },
  { a: '#1a0a14', b: '#f72585', c: '#7209b7', swirl: '#fee440' },
  { a: '#0d1b1a', b: '#2dd4bf', c: '#0f766e', swirl: '#97ce4c' },
  { a: '#1c1008', b: '#fb923c', c: '#9a3412', swirl: '#fde047' },
  { a: '#0f172a', b: '#818cf8', c: '#312e81', swirl: '#c4b5fd' },
  { a: '#052e16', b: '#4ade80', c: '#14532d', swirl: '#bbf7d0' },
  { a: '#18181b', b: '#a78bfa', c: '#4c1d95', swirl: '#97ce4c' },
];

export default function SeasonPoster({ season, imageUrl }) {
  const i = (Number(season) - 1 + PALETTES.length * 10) % PALETTES.length;
  const p = PALETTES[i];
  const gid = `season-grad-${season}`;
  const sid = `swirl-${season}`;

  return (
    <div
      className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_0_1px_rgba(151,206,76,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-hidden
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-portal-glow/10" />
          <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-portal-glow/70 bg-black/50 text-lg font-bold text-slate-900 dark:text-white backdrop-blur-sm">
            {season}
          </div>
        </>
      ) : null}

      <svg
        viewBox="0 0 360 240"
        className={`absolute inset-0 h-full w-full transition-opacity ${imageUrl ? 'opacity-0' : 'opacity-100'}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.a} />
            <stop offset="45%" stopColor={p.c} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p.b} stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id={sid} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={p.swirl} stopOpacity="0.45" />
            <stop offset="70%" stopColor={p.b} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height="240" fill={`url(#${gid})`} />
        <ellipse cx="180" cy="108" rx="120" ry="72" fill={`url(#${sid})`} opacity="0.9" />
        <circle
          cx="180"
          cy="108"
          r="52"
          fill="none"
          stroke="#97ce4c"
          strokeWidth="2.5"
          strokeOpacity="0.75"
        />
        <circle cx="180" cy="108" r="38" fill="none" stroke="#97ce4c" strokeWidth="1.2" strokeOpacity="0.35" />
        <text
          x="180"
          y="118"
          textAnchor="middle"
          fill="white"
          fontSize="42"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
        >
          {season}
        </text>
        <text
          x="180"
          y="200"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.2em"
        >
          SEASON
        </text>
      </svg>
      {!imageUrl ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      ) : null}
    </div>
  );
}
