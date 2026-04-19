// MediaWiki summaries (browser fetch, origin=*).
const HOST = {
  en: 'https://en.wikipedia.org',
  tr: 'https://tr.wikipedia.org',
};

function apiUrl(lang) {
  return `${HOST[lang] || HOST.en}/w/api.php`;
}

export async function wikipediaRickMortySearch(searchQuery, lang, opts = {}) {
  const exchars = opts.exchars ?? 400;
  const introOnly = opts.introOnly !== false;
  const wikiLang = lang === 'tr' ? 'tr' : 'en';
  const bias = wikiLang === 'tr' ? 'Rick ve Morty' : 'Rick and Morty';
  const raw = searchQuery.trim();
  const hasBias = new RegExp(
    bias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i'
  ).test(raw);
  const q = (hasBias ? raw : `${raw} ${bias}`).replace(/\s+/g, ' ').trim();

  const run = async (L) => {
    const api = apiUrl(L);
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      list: 'search',
      srsearch: q,
      srlimit: '1',
      srnamespace: '0',
    });
    const sRes = await fetch(`${api}?${searchParams}`);
    if (!sRes.ok) return null;
    const sData = await sRes.json();
    const hit = sData.query?.search?.[0];
    if (!hit?.title) return null;

    const exParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      prop: 'extracts',
      explaintext: 'true',
      titles: hit.title,
      exchars: String(exchars),
    });
    if (introOnly) exParams.set('exintro', 'true');

    const eRes = await fetch(`${api}?${exParams}`);
    if (!eRes.ok) return null;
    const eData = await eRes.json();
    const page = Object.values(eData.query?.pages || {})[0];
    const extract = page?.extract?.trim();
    if (!extract) return null;

    const url = `${HOST[L]}/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`;
    return { snippet: extract, title: hit.title, url, lang: L };
  };

  let out = await run(wikiLang);
  if (!out && wikiLang === 'tr') {
    out = await run('en');
    if (out) {
      return { ...out, fallbackFromTr: true };
    }
  }
  return out;
}

export async function wikipediaExtractByTitle(title, lang, exchars = 950) {
  const L = lang === 'tr' ? 'tr' : 'en';
  const api = apiUrl(L);
  const exParams = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'extracts',
    explaintext: 'true',
    exintro: 'false',
    exchars: String(exchars),
    titles: title,
  });
  const eRes = await fetch(`${api}?${exParams}`);
  if (!eRes.ok) return null;
  const eData = await eRes.json();
  const page = Object.values(eData.query?.pages || {})[0];
  const extract = page?.extract?.trim();
  if (!extract) return null;
  const url = `${HOST[L]}/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  return { snippet: extract, title, url, lang: L };
}

export function buildWikiSearchQueryFromUserText(text, lang) {
  let q = text
    .replace(/\b(episode|chapter|bölüm)\s*#?\s*\d+/gi, '')
    .replace(/[?!.,;:]+/g, ' ')
    .trim();

  const stops = new Set(
    'the a an is are was were be been being what who how why which when where tell me about this that these those and or for with from to of in on at by nedir kimdir hakkında hakkinda bir bu şu ve ya da mi mı mu mü çok daha ne için'.split(
      ' '
    )
  );
  const words = q
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stops.has(w.toLowerCase().replace(/['’]/g, '')));

  q = words.join(' ');
  if (q.length < 2) return lang === 'tr' ? 'Rick ve Morty' : 'Rick and Morty';
  return q;
}
