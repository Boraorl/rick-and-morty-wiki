import { useCallback, useEffect, useState } from 'react';

const KEY = 'mvi:favorites:v1';
const EVT = 'mvi:favorites:changed';

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
    /* quota / privacy mode — silently ignore */
  }
}

export function useFavorites() {
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

  const isFavorite = useCallback(
    (id) => items.some((it) => Number(it.id) === Number(id)),
    [items]
  );

  const toggle = useCallback((character) => {
    if (!character?.id) return;
    const list = readStore();
    const exists = list.some((it) => Number(it.id) === Number(character.id));
    const next = exists
      ? list.filter((it) => Number(it.id) !== Number(character.id))
      : [
          {
            id: character.id,
            name: character.name,
            image: character.image,
            status: character.status,
            species: character.species,
            addedAt: Date.now(),
          },
          ...list,
        ];
    writeStore(next);
    setItems(next);
  }, []);

  const remove = useCallback((id) => {
    const next = readStore().filter((it) => Number(it.id) !== Number(id));
    writeStore(next);
    setItems(next);
  }, []);

  const clearAll = useCallback(() => {
    writeStore([]);
    setItems([]);
  }, []);

  return { items, count: items.length, isFavorite, toggle, remove, clearAll };
}
