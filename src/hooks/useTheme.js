import { useCallback, useEffect, useState } from 'react';

const KEY = 'mvi:theme';
const EVT = 'mvi:theme-changed';

function readMode() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyMode(mode) {
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  try {
    localStorage.setItem(KEY, mode);
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* private mode / quota */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#050608' : '#f1f5f9');
}

export function useTheme() {
  const [mode, setMode] = useState(readMode);

  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  useEffect(() => {
    const sync = () => setMode(readMode());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  return { mode, setMode, toggle };
}
