export function parseEpisodeCode(code) {
  const m = String(code).match(/^S(\d+)E(\d+)$/i);
  if (!m) return null;
  return { season: Number.parseInt(m[1], 10), episodeNum: Number.parseInt(m[2], 10) };
}

export function groupEpisodesBySeason(episodes) {
  const map = new Map();
  for (const ep of episodes) {
    const p = parseEpisodeCode(ep.episode);
    if (!p) continue;
    if (!map.has(p.season)) map.set(p.season, []);
    map.get(p.season).push({ ep, episodeNum: p.episodeNum });
  }
  const seasons = [...map.keys()].sort((a, b) => a - b);
  const grouped = new Map();
  for (const s of seasons) {
    const rows = map.get(s);
    rows.sort((a, b) => a.episodeNum - b.episodeNum);
    grouped.set(
      s,
      rows.map((r) => r.ep)
    );
  }
  return grouped;
}
