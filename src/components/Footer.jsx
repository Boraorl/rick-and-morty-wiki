export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200/90 bg-white/60 dark:bg-transparent dark:border-portal-border/80 mt-auto py-8 text-center text-sm text-slate-600 dark:text-slate-500">
      <p className="font-medium text-slate-700 dark:text-slate-400">Multiverse Index</p>
      <p className="mt-2 max-w-md mx-auto leading-relaxed">
        © {year} · Character, episode, and location listings use{' '}
        <a
          href="https://rickandmortyapi.com"
          className="text-portal-glow hover:text-portal-slime transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          The Rick and Morty API
        </a>
        . The in-app guide may add short excerpts from Wikipedia. This site is an independent fan
        project and is not affiliated with the series or its rights holders.
      </p>
    </footer>
  );
}
