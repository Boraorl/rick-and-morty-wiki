export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-10 w-10 rounded-full border-2 border-portal-border border-t-portal-glow animate-spin"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
