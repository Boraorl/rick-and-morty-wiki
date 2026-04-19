const BASE = 'https://rickandmortyapi.com/api';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export function getCharactersPage(
  page = 1,
  { name = '', status = '', species = '', gender = '' } = {}
) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (name.trim()) params.set('name', name.trim());
  if (status) params.set('status', status);
  if (species.trim()) params.set('species', species.trim());
  if (gender) params.set('gender', gender);
  return request(`/character?${params.toString()}`);
}

export function getCharacterById(id) {
  return request(`/character/${id}`);
}

export function getEpisodesPage(page = 1) {
  return request(`/episode?page=${page}`);
}

export async function getAllEpisodes() {
  const first = await getEpisodesPage(1);
  const pages = first.info?.pages ?? 1;
  const all = [...(first.results ?? [])];
  const fetches = [];
  for (let p = 2; p <= pages; p += 1) {
    fetches.push(getEpisodesPage(p));
  }
  const rest = await Promise.all(fetches);
  for (const json of rest) {
    all.push(...(json.results ?? []));
  }
  return all;
}

export function getEpisodeById(id) {
  return request(`/episode/${id}`);
}

export function getLocationsPage(page = 1) {
  return request(`/location?page=${page}`);
}

export async function getAllLocations() {
  const first = await getLocationsPage(1);
  const pages = first.info?.pages ?? 1;
  const all = [...(first.results ?? [])];
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => getLocationsPage(i + 2))
  );
  for (const json of rest) {
    all.push(...(json.results ?? []));
  }
  return all;
}

export function getLocationById(id) {
  return request(`/location/${id}`);
}

export async function fetchMany(urls) {
  if (!urls?.length) return [];
  const results = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    })
  );
  return results.filter(Boolean);
}
