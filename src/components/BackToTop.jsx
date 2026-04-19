import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
      className="fixed z-[90] bottom-[max(5rem,calc(env(safe-area-inset-bottom,0px)+5rem))] right-[max(1rem,env(safe-area-inset-right,0px))] h-11 w-11 rounded-full border border-slate-200 bg-white/95 text-portal-glow shadow-md backdrop-blur-md flex items-center justify-center hover:border-portal-glow/60 transition-colors dark:border-portal-border dark:bg-portal-card/90 dark:shadow-portal"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
