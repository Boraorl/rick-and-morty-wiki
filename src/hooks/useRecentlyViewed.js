import { useCallback, useEffect, useState } from 'react';

const KEY = 'mvi:recent-characters:v1';
const EVT = 'mvi:recent:changed';
const MAX = 12;

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState(() => readStore());

  useEffect(() => {
    const sync = () => setItems(readStore());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const push = useCallback((character) => {
    if (!character?.id) return;
    const cur = readStore().filter((it) => Number(it.id) !== Number(character.id));
    const next = [
      {
        id: character.id,
        name: character.name,
        image: character.image,
        species: character.species,
        viewedAt: Date.now(),
      },
      ...cur,
    ].slice(0, MAX);
    writeStore(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    writeStore([]);
    setItems([]);
  }, []);

  return { items, push, clear };
}
