import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE = 'Multiverse Index';

function titleForPath(pathname) {
  if (pathname === '/') return `Home · ${BASE}`;
  if (pathname === '/characters') return `Characters · ${BASE}`;
  if (pathname.startsWith('/characters/')) return `Character · ${BASE}`;
  if (pathname === '/episodes') return `Episodes · ${BASE}`;
  if (pathname.startsWith('/episodes/')) return `Episode · ${BASE}`;
  if (pathname === '/locations') return `Locations · ${BASE}`;
  if (pathname.startsWith('/locations/')) return `Location · ${BASE}`;
  if (pathname === '/favorites') return `Favorites · ${BASE}`;
  return `${BASE}`;
}

export default function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleForPath(pathname);
  }, [pathname]);

  return null;
}
