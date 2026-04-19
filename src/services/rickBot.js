import { getCharactersPage, getEpisodeById } from './api.js';
import {
  buildWikiSearchQueryFromUserText,
  wikipediaExtractByTitle,
  wikipediaRickMortySearch,
} from './wikipedia.js';

const MSGS = {
  en: {
    refusal:
      "I only answer *Rick & Morty* topics — characters, episodes, locations, and show trivia.",
    welcome:
      'Ask about the show, characters, or episodes. Replies use the public Rick and Morty API; some answers add a short Wikipedia excerpt.',
    empty: 'Type a question.',
    charNotFound:
      'No API hit for **{name}** — try the searchable list on /characters.',
    charLookupNote:
      '(Treated as a character name — try asking about the show.)',
    typeLabel: 'Type',
    lastLocation: 'Last known location',
    unknownLoc: 'Unknown',
    wikiCard: 'Open the wiki card',
    epApiNote: "That's straight from the API — see the cast at",
  },
  tr: {
    refusal:
      'Sadece *Rick & Morty* (karakter, bölüm, mekan, dizi) sorularına cevap veriyorum.',
    welcome:
      'Dizi, karakter veya bölümler hakkında sorabilirsin. Yanıtlar herkese açık Rick and Morty API’sine dayanır; bazen kısa Vikipedi özeti eklenir.',
    empty: 'Bir şey yaz.',
    charNotFound:
      'API’de **{name}** yok — yazım için /characters sayfasındaki aramayı dene.',
    charLookupNote:
      '(Bunu karakter adı sandım — soruyu diziyle ilişkilendirmeyi dene.)',
    typeLabel: 'Tür',
    lastLocation: 'Son bilinen konum',
    unknownLoc: 'Bilinmiyor',
    wikiCard: 'Wiki sayfası',
    epAired: 'Yayın',
    epApiNote: 'Veri doğrudan API’den — kadro için:',
  },
};

const RM_TERMS =
  /\b(rick|morty|smith|summer|beth|jerry|adult swim|schwif|portal|meeseeks|plutonium|citadel|birdperson|squanch|cromulon|pickle|nimbus|evil\s*morty|jessica|dimension|multiverse|interdimensional|gazorpazorp|unity|snowball|snuffles|gromflomite|anatomy park|purge|crombopulos|michael|krombopulos|blips|wubba|lugubrious|cronenberg|tiny\s*rick|phoenix\s*person|space\s*beth|infinite\s*curve|story\s*train|gotron|decoys|fart|cloud)\b/i;

const RM_TERMS_TR =
  /\b(rick|morty|dizi|bölüm|karakter|evren|boyut|portal|komedi|animasyon|multiverse)\b/i;

const GREETING = /^(hi|hello|hey|yo|sup|merhaba|selam|sa\b|günaydın|iyi\s*günler)\b/i;

const FOLLOW_UP =
  /^(yes|yeah|yep|nah|ok|okay|sure|more|go on|continue|why|how|really|cool|lol|haha|nice|devam|evet|tamam|peki|hmm|interesting|tell me more|anlat|devam et|başka)\b/i;

const FOLLOW_UP_MORE =
  /^(more|tell me more|go on|continue|devam|anlat|başka|ekstra|longer|detay|details?)\b/i;

const STRONG_OFF_TOPIC =
  /\b(weather|bitcoin|ethereum|stock\s*market|recipe|cook\b|football|soccer|nba|politics|election|homework|calculus|derivative|python|java|react\s*native|sql|doctor|legal advice|therapy|hava|bitcoin|borsa|yemek tarifi|futbol|basketbol|siyaset|seçim|ödev|kalkülüs|türev|integral|doktor|avukat|terapi)\b/i;

const EPISODE_HINT = /\b(episode|bölüm|chapter)\s*#?\s*(\d+)\b/i;

const COMMENTARY = {
  en: {
    general: [
      'The show runs on nihilism vs. found-family — that friction is the engine.',
      'Infinite canon means nothing is sacred — fun for writers, chaos for fans.',
    ],
    character: [
      'The Smiths each weaponize selfishness in a different flavor.',
      'Emotional resets are a sitcom trap Rick keeps exploiting.',
    ],
    episode: [
      'Cold opens pack huge world-building into seconds.',
      'Codes like S01E01 anchor which timeline you mean.',
    ],
  },
  tr: {
    general: [
      'Dizi nihilizm ile “bulduğun aile” arasında gidip geliyor.',
      'Sonsuz evrende kanon esnek — yazarlar için özgür, izleyici için kaos.',
    ],
    character: [
      'Smith ailesinde herkes bencilliği farklı yapıyor.',
      'Duygusal sıfırlar sitcom tuzağı; Rick bunu sürüyor.',
    ],
    episode: [
      'Soğuk açılışlar çok kısa sürede dünya kuruyor.',
      'S01E01 gibi kodlar hangi zaman çizgisinde olduğunu netler.',
    ],
  },
};

function L(lang) {
  return MSGS[lang] || MSGS.en;
}

function formatWikiReply(wiki, userLang) {
  const tag =
    userLang === 'tr'
      ? 'Kısa **Vikipedi** özeti; tam liste sitede.'
      : 'Short **Wikipedia** excerpt; full catalogue on this site.';
  const srcLabel = userLang === 'tr' ? 'Kaynak' : 'Source';
  let out = `${wiki.snippet}\n\n${tag} ${srcLabel}: ${wiki.url}`;
  if (wiki.fallbackFromTr && userLang === 'tr') {
    out += ' (TR madde yok — EN Vikipedi.)';
  }
  return out;
}

function siteBrowseFooter(lang) {
  if (lang === 'tr') {
    return '\n\n**Sitede:** /characters · /episodes · /locations';
  }
  return '\n\n**On this site:** /characters · /episodes · /locations';
}

function nameLooksRmToken(nameQuery) {
  return nameQuery && /rick|morty|summer|beth|jerry|smith|bird|squanch|meeseeks/i.test(nameQuery);
}

export function inferLang(text, ctx = {}) {
  const t = text.trim();
  if (!t) return ctx.lastLang || 'en';

  if (/[ığüşöçİĞÜŞÖÇ]/.test(t)) return 'tr';
  if (/^(hi|hello|hey|yo|sup)\b/i.test(t)) return 'en';
  if (/^(merhaba|selam|sa\b|günaydın|iyi\s*günler)\b/i.test(t)) return 'tr';

  const trHits = (
    t.match(
      /\b(ve|bir|bu|şu|için|nedir|kimdir|hakkında|hakkinda|nasıl|neden|bölüm|dizi|karakter|değil|çok|daha|iyi|kötü|güzel|anlat|özet|mi\b|mı\b|mü\b|mu\b|veya|ama|fakat|çünkü|içinde|hakkında|şey|yayın|kadro)\b/gi
    ) || []
  ).length;
  const enHits = (
    t.match(
      /\b(the|and|what|who|why|how|tell|about|episode|character|this|that|with|from|cool|nice|show|season)\b/gi
    ) || []
  ).length;

  if (trHits > enHits) return 'tr';
  if (enHits > trHits) return 'en';

  if (ctx.lastLang && (FOLLOW_UP.test(t) || t.length < 24)) return ctx.lastLang;

  return 'en';
}

function extractCharacterQuery(text) {
  const t = text.trim();
  const patterns = [
    /(?:who\s+is|who'?s|what\s+about|tell\s+me\s+about|about|lookup|search\s+for|find)\s+(?:the\s+)?(.+?)(?:\?|$)/i,
    /(?:kimdir|kim\s+dir|hakkında|hakkinda)\s+(.+?)(?:\?|$)/i,
    /(.+?)\s+kimdir\b/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m?.[1]) {
      const name = m[1].replace(/\b(the|bir|şu|bu)\b/gi, '').trim();
      if (name.length >= 2 && name.length <= 48) return name;
    }
  }
  if (t.length >= 2 && t.length <= 36 && !/\b(what|who|why|how|nedir|kim)\b/i.test(t)) {
    if (/[a-zığüşöçA-ZİĞÜŞÖÇ]/.test(t)) return t.replace(/[?!.]+$/, '').trim();
  }
  return null;
}

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

function translateStatus(status) {
  const m = { Alive: 'Hayatta', Dead: 'Ölü', unknown: 'Bilinmiyor' };
  return m[status] || status;
}

function translateSpecies(species) {
  if (species === 'Human') return 'İnsan';
  return species;
}

async function tryCharacterLookup(rawName, lang) {
  const name = rawName.replace(/^[@#]+/, '').trim();
  if (name.length < 2) return null;
  const loc = L(lang);
  try {
    const data = await getCharactersPage(1, { name });
    const c = data?.results?.[0];
    if (!c) return null;

    const status = lang === 'tr' ? translateStatus(c.status) : c.status;
    const species = lang === 'tr' ? translateSpecies(c.species) : c.species;
    const locationName = c.location?.name ?? loc.unknownLoc;

    const lines =
      lang === 'tr'
        ? [
            `**${c.name}** — ${status}, ${species}.`,
            c.type ? `${loc.typeLabel}: ${c.type}.` : null,
            `${loc.lastLocation}: **${locationName}**.`,
            `${loc.wikiCard}: /characters/${c.id}`,
          ]
        : [
            `**${c.name}** — ${status}, ${species}.`,
            c.type ? `Type: ${c.type}.` : null,
            `${loc.lastLocation}: **${locationName}**.`,
            `${loc.wikiCard}: /characters/${c.id}`,
          ];

    return { text: lines.filter(Boolean).join(' '), topic: 'character', name: c.name, id: c.id };
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function tryEpisodeLookup(idStr, lang) {
  const id = Number.parseInt(idStr, 10);
  if (!Number.isFinite(id) || id < 1) return null;
  const loc = L(lang);
  try {
    const ep = await getEpisodeById(id);
    const tail = `${loc.epApiNote} /episodes/${ep.id}.`;
    const text =
      lang === 'tr'
        ? `**${ep.episode}** — *${ep.name}* (${loc.epAired}: ${ep.air_date}). ${tail}`
        : `**${ep.episode}** — *${ep.name}* (aired ${ep.air_date}). ${tail}`;

    return {
      text,
      topic: 'episode',
      id: ep.id,
    };
  } catch {
    return null;
  }
}

function riffOnTopic(userText, ctx, lang) {
  const seed = hashSeed(userText + (ctx.turn ?? 0));
  if (/pickle|turşu/i.test(userText)) {
    return {
      text:
        lang === 'tr'
          ? 'Pickle Rick: “Her şeyi ciddiye alırsak prestij yaparız” — ve fare mühendisliği hafife alınmamalı.'
          : 'Pickle Rick: commit hard enough and anything reads as prestige — plus underrated rat engineering.',
      topic: 'general',
    };
  }
  if (/meeseeks|misiks/i.test(userText)) {
    return {
      text:
        lang === 'tr'
          ? 'Mr. Meeseeks: görev bitene kadar duramayan yardımcı — tanıdık geliyorsa normal.'
          : 'Mr. Meeseeks: helpers that must finish the task or unravel — relatable in the worst way.',
      topic: 'general',
    };
  }
  if (/portal|boyut|dimension/i.test(userText)) {
    return {
      text:
        lang === 'tr'
          ? 'Portal = sonsuz varyant, sıfır kutsallık; yazarlar için sınırsız alan.'
          : 'Portals = infinite variants and zero sacred canon — maximum writer freedom.',
      topic: 'general',
    };
  }
  const key =
    ctx.activeTopic && COMMENTARY[lang][ctx.activeTopic] ? ctx.activeTopic : 'general';
  const bank = COMMENTARY[lang][key];
  return {
    text: pick(bank, seed),
    topic: key,
  };
}

function followUpReply(ctx, lang) {
  const key = ctx.activeTopic && COMMENTARY[lang][ctx.activeTopic] ? ctx.activeTopic : 'general';
  const bank = COMMENTARY[lang][key];
  const seed = (ctx.turn ?? 0) * 17 + 3;
  return {
    text: pick(bank, seed),
    topic: key,
  };
}

export async function getRickBotReply(message, ctx = {}) {
  const text = message.trim();
  const idleLang = ctx.lastLang === 'tr' ? 'tr' : 'en';
  if (!text) {
    return { text: L(idleLang).empty, ctx: { ...ctx, lastLang: idleLang } };
  }

  const lang = inferLang(text, ctx);
  const nextCtx = { ...ctx, turn: (ctx.turn ?? 0) + 1, lastLang: lang };
  const loc = L(lang);

  if (GREETING.test(text) && text.length < 40) {
    return {
      text: loc.welcome,
      ctx: { ...nextCtx, activeTopic: 'general', lastLang: lang, wikiTitle: null },
    };
  }

  const hasRm = RM_TERMS.test(text) || RM_TERMS_TR.test(text);
  const followUp = FOLLOW_UP.test(text);
  const strongOff = STRONG_OFF_TOPIC.test(text) && !hasRm;

  if (strongOff) {
    return {
      text: `${loc.refusal}${siteBrowseFooter(lang)}`,
      ctx: { ...nextCtx, activeTopic: null, lastLang: lang, wikiTitle: null },
    };
  }

  const epMatch = text.match(EPISODE_HINT);
  if (epMatch) {
    const hit = await tryEpisodeLookup(epMatch[2], lang);
    if (hit) {
      return {
        text: hit.text,
        ctx: {
          ...nextCtx,
          activeTopic: 'episode',
          lastEntity: String(hit.id),
          lastLang: lang,
          wikiTitle: null,
        },
      };
    }
  }

  const nameQuery = extractCharacterQuery(text);
  const tryNameAndWiki = async () => {
    if (!nameQuery || !(hasRm || nameLooksRmToken(nameQuery))) return null;
    const hit = await tryCharacterLookup(nameQuery, lang);
    if (hit) {
      return {
        text: hit.text,
        ctx: {
          ...nextCtx,
          activeTopic: 'character',
          lastEntity: hit.name,
          lastLang: lang,
          wikiTitle: null,
        },
      };
    }
    const wiki = await wikipediaRickMortySearch(nameQuery, lang);
    if (wiki) {
      return {
        text: formatWikiReply(wiki, lang),
        ctx: {
          ...nextCtx,
          activeTopic: 'general',
          lastLang: lang,
          wikiTitle: wiki.title,
          wikiLang: wiki.lang,
        },
      };
    }
    if (hasRm) {
      return {
        text: `${loc.charNotFound.replace('{name}', nameQuery)}${siteBrowseFooter(lang)}`,
        ctx: { ...nextCtx, activeTopic: 'general', lastLang: lang, wikiTitle: null },
      };
    }
    return null;
  };

  const nameBranch = await tryNameAndWiki();
  if (nameBranch) return nameBranch;

  if (ctx.activeTopic && (followUp || (text.length < 28 && !STRONG_OFF_TOPIC.test(text)))) {
    const followLang = inferLang(text, ctx);
    if (ctx.wikiTitle && FOLLOW_UP_MORE.test(text.trim())) {
      const longer = await wikipediaExtractByTitle(
        ctx.wikiTitle,
        ctx.wikiLang || followLang,
        920
      );
      if (longer?.snippet) {
        const cap = 720;
        const sn =
          longer.snippet.length > cap ? `${longer.snippet.slice(0, cap).trimEnd()}…` : longer.snippet;
        const src = followLang === 'tr' ? 'Kaynak' : 'Source';
        return {
          text: `${sn}\n\n${src}: ${longer.url}`,
          ctx: {
            ...nextCtx,
            activeTopic: 'general',
            lastLang: followLang,
            wikiTitle: ctx.wikiTitle,
            wikiLang: longer.lang,
          },
        };
      }
    }
    const r = followUpReply(ctx, followLang);
    return {
      text: r.text,
      ctx: { ...nextCtx, activeTopic: r.topic, lastLang: followLang, wikiTitle: ctx.wikiTitle ?? null },
    };
  }

  if (hasRm) {
    const q = buildWikiSearchQueryFromUserText(text, lang);
    const wiki = await wikipediaRickMortySearch(q, lang);
    if (wiki) {
      return {
        text: formatWikiReply(wiki, lang),
        ctx: {
          ...nextCtx,
          activeTopic: 'general',
          lastLang: lang,
          wikiTitle: wiki.title,
          wikiLang: wiki.lang,
        },
      };
    }
    const r = riffOnTopic(text, ctx, lang);
    return {
      text: `${r.text}${siteBrowseFooter(lang)}`,
      ctx: { ...nextCtx, activeTopic: r.topic, lastLang: lang, wikiTitle: null },
    };
  }

  if (nameQuery && !hasRm) {
    const hit = await tryCharacterLookup(nameQuery, lang);
    if (hit) {
      return {
        text: `${hit.text}\n\n${loc.charLookupNote}`,
        ctx: {
          ...nextCtx,
          activeTopic: 'character',
          lastEntity: hit.name,
          lastLang: lang,
          wikiTitle: null,
        },
      };
    }
  }

  return {
    text: `${loc.refusal}${siteBrowseFooter(lang)}`,
    ctx: { ...nextCtx, activeTopic: null, lastLang: lang, wikiTitle: null },
  };
}
