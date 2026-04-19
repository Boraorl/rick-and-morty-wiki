import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRickBotReply, inferLang } from '../services/rickBot.js';

function isInternalPath(s) {
  return /^\/(?:characters|episodes|locations)(?:\/\d+)?$/i.test(s);
}

function formatBoldSegments(line) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-portal-glow">
        {chunk}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function RichLine({ line }) {
  const chunks = line.split(/(\/(?:characters|episodes|locations)(?:\/\d+)?)/gi);
  return (
    <span className="block">
      {chunks.map((chunk, i) => {
        if (isInternalPath(chunk)) {
          return (
            <Link
              key={`${chunk}-${i}`}
              to={chunk}
              className="text-portal-glow underline underline-offset-2 hover:text-portal-slime font-medium"
            >
              {chunk}
            </Link>
          );
        }
        return (
          <span key={i}>{formatBoldSegments(chunk)}</span>
        );
      })}
    </span>
  );
}

function MessageBubble({ role, children }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
          isBot
            ? 'bg-slate-50 border border-slate-200 text-slate-800 dark:bg-portal-card dark:border-portal-border dark:text-slate-200'
            : 'bg-portal-glow/15 border border-portal-glow/40 text-slate-900 dark:bg-portal-glow/25 dark:text-white',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}

export default function RickMortyChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [botCtx, setBotCtx] = useState({});
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Ask about characters, episodes, or the show. Listings use the public Rick and Morty API; routes like /characters, /episodes, and /locations are clickable.',
    },
  ]);
  const [busyLang, setBusyLang] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const lang = inferLang(text, botCtx);
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true);
    setBusyLang(lang);
    try {
      const { text: reply, ctx } = await getRickBotReply(text, botCtx);
      setBotCtx(ctx);
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch {
      const errMsg =
        lang === 'tr'
          ? 'API şu an yanıt vermedi — tekrar dene.'
          : 'Couldn’t reach the API — try again.';
      setMessages((m) => [...m, { role: 'bot', text: errMsg }]);
    } finally {
      setBusy(false);
      setBusyLang(null);
    }
  }

  return (
    <div className="fixed z-[100] flex flex-col items-end gap-2 pointer-events-none bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]">
      {open ? (
        <section
          className="pointer-events-auto w-[min(100vw-1.5rem,22rem)] sm:w-[min(100vw-2rem,22rem)] max-h-[min(70vh,28rem)] flex flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-md overflow-hidden dark:border-portal-border dark:bg-portal-dark/95 dark:shadow-portal"
          aria-label="Rick and Morty chat"
        >
          <header className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/90 px-3 py-2 dark:border-portal-border dark:bg-portal-card/80">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-portal-glow animate-pulse"
                aria-hidden
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Guide</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close chat"
            >
              Close
            </button>
          </header>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-[12rem] bg-white/80 dark:bg-transparent"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role}>
                <p className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, li) => (
                    <RichLine key={li} line={line} />
                  ))}
                </p>
              </MessageBubble>
            ))}
            {busy ? (
              <MessageBubble role="bot">
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <span className="h-3 w-3 rounded-full border-2 border-portal-border border-t-portal-glow animate-spin" />
                  {busyLang === 'tr' ? '…' : '…'}
                </span>
              </MessageBubble>
            ) : null}
          </div>
          <div className="border-t border-slate-200 p-2 flex gap-2 bg-slate-50/90 dark:border-portal-border dark:bg-portal-card/50">
            <label htmlFor="rick-bot-input" className="sr-only">
              Message
            </label>
            <input
              id="rick-bot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Character, episode, lore…"
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-portal-glow/40 dark:border-portal-border dark:bg-portal-dark dark:text-white dark:placeholder:text-slate-600"
              disabled={busy}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={send}
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-xl bg-portal-glow/25 border border-portal-glow/50 px-3 py-2 text-sm font-medium text-portal-glow hover:bg-portal-glow/35 disabled:opacity-40 disabled:pointer-events-none"
            >
              Send
            </button>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-12 w-12 min-[380px]:h-14 min-[380px]:w-14 shrink-0 rounded-full border-2 border-portal-glow/50 bg-white text-portal-glow shadow-md motion-safe:hover:scale-105 hover:border-portal-glow transition-transform flex items-center justify-center text-xl min-[380px]:text-2xl dark:border-portal-glow/60 dark:bg-portal-card dark:shadow-portal"
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat'}
        title="Guide"
      >
        <span aria-hidden>💬</span>
      </button>
    </div>
  );
}
