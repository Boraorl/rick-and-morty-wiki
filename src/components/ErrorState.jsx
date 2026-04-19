export default function ErrorState({ message, onRetry }) {
  return (
    <div
      className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center text-red-200"
      role="alert"
    >
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-red-400/40 bg-red-500/15 text-red-200">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="mt-4 text-base font-semibold text-red-100">Couldn’t load that.</p>
      {message ? <p className="mt-1 text-sm opacity-90 max-w-md mx-auto">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-400/40 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-500/30 transition-colors"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
